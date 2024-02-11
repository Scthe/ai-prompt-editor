import Tokenizer from 'lib/clip-bpe-js/clip-bep-js';
import { WeightedToken, isBreakToken } from './parsePromptAttention';

/**
 * Token for '4' is 19. There is also token 275 for '4</w>'.
 * Clip tokenizer always uses 275, so a pair of encode-decode
 * may change data. This is OK. Webui has same behaviour.
 */
// const removeEndingSpace = (txt: string) => removeSuffix(txt, ' ');

/**
 *  This object contains token ids, weight (multipliers:1.4) and textual inversion embedding info for a chunk of prompt.
 *   If a prompt is short, it is represented by one PromptChunk, otherwise, multiple are necessary.
 *   Each PromptChunk contains an exact amount of tokens - 77, which includes one for start and end token,
 *   so just 75 tokens from prompt.
 */
export interface PromptChunk {
  tokens: number[];
}

const newPromptChunk = (): PromptChunk => ({ tokens: [] });

/**
 * Actual impl:
 * https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/sd_hijack_clip.py#L84
 * Wrapper:
 * https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/sd_hijack_clip.py#L179
 */
export const tokenize = (
  parsed: WeightedToken[],
  CHUNK_LENGTH = 75
): [PromptChunk[], number] => {
  const t = new Tokenizer();
  const COMMA_TOKEN = t.encode(',')[0]; // Ok, I could just hardcode 267

  const chunks: PromptChunk[] = [];
  let chunk = newPromptChunk();
  let tokenCount = 0;
  let lastComma = -1;

  for (const weightedToken of parsed) {
    // console.log('weightedToken', weightedToken);
    if (isBreakToken(weightedToken)) {
      next_chunk();
      continue;
    }

    const [text, _weight] = weightedToken;
    const tokens = t.encode(text);

    let position = 0;
    while (position < tokens.length) {
      const token = tokens[position];

      if (token === COMMA_TOKEN) {
        lastComma = chunk.tokens.length;
      } else if (chunk.tokens.length == CHUNK_LENGTH && lastComma != -1) {
        // this is when we are at the end of alloted 75 tokens for the current chunk,
        // and the current token is not a comma.
        const break_location = lastComma + 1;

        const reloc_tokens = chunk.tokens.slice(break_location); // from last comma till end
        chunk.tokens = chunk.tokens.slice(0, break_location); // from 0 to last comma

        next_chunk();
        chunk.tokens = reloc_tokens;
      }

      if (chunk.tokens.length == CHUNK_LENGTH) {
        next_chunk();
      }

      chunk.tokens.push(token);
      position += 1;
    }
  }

  if (chunk.tokens || !chunks) {
    next_chunk(true);
  }
  return [chunks, tokenCount];

  function next_chunk(isLast = false) {
    // puts current chunk into the list of results and produces the next one - empty;
    // if is_last is true, tokens <end-of-text> tokens at the end won't add to token_count
    if (isLast) {
      tokenCount += chunk.tokens.length; // add as many as actually used
    } else {
      tokenCount += CHUNK_LENGTH; // add full 75
    }

    // in webui we add padding at this point to fill all 75 tokens

    lastComma = -1;
    chunks.push(chunk);
    chunk = newPromptChunk();
  }
};
