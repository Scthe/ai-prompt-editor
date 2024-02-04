import { removeLineBreaks } from 'utils';
import Tokenizer, { TokenizerTokenFromGramma } from './tokenizer';
import {
  ParsingResult,
  ParsingMessage,
  PromptAstGroup,
  newAstToken,
  newAstGroup,
  BREAK_TOKEN,
  isRootNode,
} from './types';
import {
  parseWeight,
  getBracketType,
  getBracketsString,
  parseLora,
} from './utils';
import {
  detectDuplicates,
  detectMissingBracesAtTheEnd,
  detectWeightInSquareBraces,
  foldGroups,
  writeFinalWeights,
} from './optimization';

const PROMPT_GRAMMAR = {
  CURLY_BRACKET_OPEN: /^\(/,
  CURLY_BRACKET_CLOSE: /^\)/,
  SQUARE_BRACKET_OPEN: /^\[/,
  SQUARE_BRACKET_CLOSE: /^\]/,
  COMMA: /^,/,
  // TODO there is the if-then syntax with a:b:c
  COLON: /^:/,
  WORD: /^[\w\s\\.-]+/,
  LORA: /^<.+?>/,
};

/*
TODO handle {prompt}
TODO handle escaped brackets: "\(". Should count as normal brackets
TODO TBH we should first tokenize this into "<=75 gpt4-tokens" parts. And only then tokenize+parse
TODO New flow:
  1. Collect LoRAs and
  2. Use lark with official grama to tokenize
  3. Parse+split into 75-token chunks (both BREAK and manually)
  4. mergeStyles using '{prompt}'

References:
- https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L370 - parser
- https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L15 - grammar (after LoRas were removed). Use with Lark: https://www.lark-parser.org/ide/
- https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/sd_hijack_clip.py#L84 - unlimited prompt (split into 75-token long chunks)
https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/styles.py#L16 - merge styles
*/

type Token = TokenizerTokenFromGramma<typeof PROMPT_GRAMMAR>;

export const parsePrompt = (text: string): ParsingResult => {
  // console.log(`Parsing: '${text}'`);
  const messages: ParsingMessage[] = [];

  const astRoot: PromptAstGroup = {
    type: 'group',
    groupType: 'curly_bracket',
    bracketCount: 0,
    children: [],
    parent: undefined,
    textWeight: 1.0,
  };
  let lastParsedGroup: PromptAstGroup = astRoot;

  // TODO split this based on GPT4 token count. Remember that
  //      `(aaa,BREAK bbb: 1.3)` means that both 'aaa' and 'bbb' get weight 1.3.
  //      We could try to insert BREAK after having AST, but we no longer have
  //      original text.
  const texts = text.split(BREAK_TOKEN);
  texts.forEach((text) => {
    text = removeLineBreaks(text);

    // tokenize
    const tokens = tokenize(text, messages);
    // console.log(`Tokens`, tokens);

    // parse
    lastParsedGroup = parsePromptText(astRoot, messages, tokens);
  });

  // add extra warnings pre optimization
  detectDuplicates(astRoot, messages);
  detectWeightInSquareBraces(astRoot, messages);
  detectMissingBracesAtTheEnd(lastParsedGroup, messages);
  // optimize tree
  foldGroups(astRoot, messages);
  writeFinalWeights(astRoot);

  return [astRoot, messages];
};

/** parse into AST */
const parsePromptText = (
  astRoot: PromptAstGroup,
  messages: ParsingMessage[],
  tokens: Token[]
) => {
  let currentGroup: PromptAstGroup = astRoot;

  let currentTokenIdx = 0;
  const peekNextToken = (cnt = 1) => tokens.at(currentTokenIdx + cnt);
  const stopParsing = () => {
    currentTokenIdx = tokens.length + 10;
  };

  while (currentTokenIdx < tokens.length) {
    const token = tokens[currentTokenIdx];

    switch (token.type) {
      case 'WORD': {
        const text = token.value.trim();
        if (text.length > 0) {
          currentGroup.children.push(newAstToken(text));
        }
        currentTokenIdx += 1;
        break;
      }
      case 'LORA': {
        const text = token.value.trim();
        const loraToken = parseLora(text);
        if (loraToken) {
          currentGroup.children.push(loraToken);
        }
        currentTokenIdx += 1;
        break;
      }
      case 'COMMA': {
        currentTokenIdx += 1;
        break;
      }
      case 'COLON': {
        if (isRootNode(currentGroup)) {
          messages.push({
            level: 'warning',
            text: `Missing curly braces when providing attention.`,
          });
          currentTokenIdx += 1;
          break;
        }
        if (currentGroup.groupType === 'square_bracket') {
          messages.push({
            level: 'warning',
            text: `You cannot provide attention value inside square braces (e.g. "[text:1.3]"). Use curly braces instead e.g. "(text:1.3)".`,
          });
          currentTokenIdx += 1;
          break;
        }
        const weightNumberToken = peekNextToken();
        const closingBraceToken = peekNextToken(2);

        if (weightNumberToken?.type !== 'WORD') {
          messages.push({
            level: 'warning',
            text: `Expected number after ':', got ${weightNumberToken?.type}.`,
          });
          currentTokenIdx += 1;
          break;
        }
        if (
          closingBraceToken?.type !== 'CURLY_BRACKET_CLOSE' &&
          closingBraceToken !== undefined // autoclose the braces
        ) {
          messages.push({
            level: 'warning',
            text: `When providing attention (e.g. "(text:1.3)"), the number should be followed by a closing brace. Expected ')', got ${closingBraceToken?.type}.`,
          });
          currentTokenIdx += 1;
          break;
        }

        const weight = parseWeight(weightNumberToken.value);
        if (weight !== undefined) {
          currentGroup.textWeight = weight;
          // always consume both ':' and the number
          currentTokenIdx += 2;
        } else {
          messages.push({
            level: 'warning',
            text: `Invalid attention value ':${weightNumberToken.value}'.`,
          });
          currentTokenIdx += 1;
        }
        break;
      }
      case 'CURLY_BRACKET_OPEN':
      case 'SQUARE_BRACKET_OPEN': {
        const newGroup: PromptAstGroup = newAstGroup(
          currentGroup,
          token.type === 'SQUARE_BRACKET_OPEN'
            ? 'square_bracket'
            : 'curly_bracket'
        );
        currentGroup.children.push(newGroup);
        currentGroup = newGroup;
        currentTokenIdx += 1;
        break;
      }
      case 'CURLY_BRACKET_CLOSE':
      case 'SQUARE_BRACKET_CLOSE': {
        const matchingBraces =
          getBracketType(token.value) === currentGroup.groupType;

        if (!matchingBraces) {
          const expectedBrace = getBracketsString(currentGroup, 'close');
          messages.push({
            level: 'error',
            text: `Mismatched braces: '${token.value}', expected '${expectedBrace}'.`,
          });
          stopParsing();
          break;
        }

        if (isRootNode(currentGroup)) {
          currentGroup.parent;
          messages.push({
            level: 'warning',
            text: `Too many closing braces '${token.value}'. Ignoring this brace.`,
          });
        } else {
          currentGroup = currentGroup.parent;
        }

        currentTokenIdx += 1;
        break;
      }
      default:
        messages.push({
          level: 'error',
          text: `Unrecongnised token: ${JSON.stringify(token)}.`,
        });
        stopParsing();
    }
  }

  return currentGroup;
};

function tokenize(promptText: string, messages: ParsingMessage[]): Token[] {
  const tokens: Token[] = [];
  const tokenizer = new Tokenizer(promptText, PROMPT_GRAMMAR);

  try {
    while (tokenizer.hasMoreTokens()) {
      const token = tokenizer.getNextToken();
      // console.log(token);
      if (token) {
        tokens.push(token);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const orgErrMsg = 'message' in e ? String(e.message) : 'Unknown error';
    const state = tokenizer.lastTokenized();

    messages.push({
      level: 'error',
      text: `Tokenizer returned error '${orgErrMsg}' in '${state}'.`,
    });
  }

  return tokens;
}
