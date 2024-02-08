import { getEncodingNameForModel, getEncoding } from 'js-tiktoken';
import { PromptAstGroup, flattenAstTree } from 'parser';

export interface GptToken {
  token: number;
  text: string;
}

/**
 * Warning, this function is SLOW!
 * Returns `Promise<>` to force you to handle this. And prevent blocking render thread.
 */
export function tokenizeGpt4(astRoot: PromptAstGroup): Promise<GptToken[]> {
  const astTokens = flattenAstTree(astRoot).filter((t) => !t.isLora);
  const text = astTokens.map((t) => t.value).join(',');
  const tokens = getTokens(text);
  return Promise.resolve(tokens);
}

/**
 * https://github.com/dqbd/tiktoken/blob/main/js/README.md
 * https://simonwillison.net/2023/Jun/8/gpt-tokenizers/
 * Verify: https://platform.openai.com/tokenizer
 * Lookup table: https://incoherency.co.uk/interest/gpt4-token-list.txt
 */
const getTokens = (text: string) => {
  const encName = getEncodingNameForModel('gpt-4');
  const encoder = getEncoding(encName);
  const tokenNumbers = encoder.encode(text);

  return tokenNumbers.map((tokenNum) => ({
    text: encoder.decode([tokenNum]),
    token: tokenNum,
  }));
};
