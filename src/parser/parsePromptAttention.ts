import { range } from 'lib/clip-bpe-js/clip-bep-js';
import { removeAt } from 'utils';

export type WeightedToken = [string, number];

export const BREAK_TOKEN: WeightedToken = ['BREAK', -1];
export const isBreakToken = (t: WeightedToken) => t[0] === BREAK_TOKEN[0];

/*** https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L352 */
const ATTENTION_REGEX = new RegExp(
  [
    '\\\\\\(|',
    '\\\\\\)|',
    '\\\\\\[|',
    '\\\\]|',
    '\\\\\\\\|',
    '\\\\|', // ?
    '\\(|', // match '('
    '\\[|', // match '['
    ':\\s*([+-]?[.\\d]+)\\s*\\)|', // match ':1.3)' with a group at '1.3'
    '\\)|', // match ')'
    '\\]|', // match ']'
    // '[^\\()[\\]:]+|', // matches text
    '[^\\\\()\\[\\]:]+|', // matches text
    ':', // stragglers
  ].join(''),
  'g'
);

const BREAK_REGEX = /\s*\bBREAK\b\s*/g; // requires space before and after

/** https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#attentionemphasis */
const CURLY_BRACKET_ATTENTION = 1.1;
/** https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#attentionemphasis */
const SQUARE_BRACKET_ATTENTION = 1 / CURLY_BRACKET_ATTENTION;

/**
 * Parses a string with attention tokens and returns a list of pairs: text and its associated weight.
 *
 * Accepted tokens are:
 * -  `(abc)` - increases attention to abc by a multiplier of 1.1
 * -  `(abc:3.12)` - increases attention to abc by a multiplier of 3.12
 * -  `[abc]` - decreases attention to abc by a multiplier of 1.1
 * -  `\(` - literal character '('
 * -  `\[` - literal character '['
 * -  `\)` - literal character ')'
 * -  `\]` - literal character ']'
 * -  `\\` - literal character '\'
 * -  anything else - just text
 *
 * Copy&paste from: https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L370
 * For JS, we duplicate the number of '\'.
 */
export const parsePromptAttention = (text: string) => {
  let res: Array<WeightedToken> = [];
  const round_brackets: number[] = [];
  const square_brackets: number[] = [];

  function multiply_range(start_position: number, multiplier: number) {
    for (const p of range(start_position, res.length)) {
      res[p][1] *= multiplier;
    }
  }

  const matches = [...text.matchAll(ATTENTION_REGEX)];
  // console.log('matches', matches);

  for (const m of matches) {
    const [text, weight] = m;

    if (text.startsWith('\\')) {
      res.push([text.substring(1), 1.0]);
    } else if (text == '(') {
      round_brackets.push(res.length);
    } else if (text == '[') {
      square_brackets.push(res.length);
    } else if (weight !== undefined && round_brackets.length > 0) {
      multiply_range(round_brackets.pop()!, parseFloat(weight));
    } else if (text == ')' && round_brackets.length > 0) {
      multiply_range(round_brackets.pop()!, CURLY_BRACKET_ATTENTION);
    } else if (text == ']' && square_brackets.length > 0) {
      multiply_range(square_brackets.pop()!, SQUARE_BRACKET_ATTENTION);
    } else {
      const parts = text.split(BREAK_REGEX);
      parts.forEach((part, i) => {
        if (i > 0) {
          res.push(BREAK_TOKEN);
        }
        res.push([part, 1.0]);
      });
    }
  }

  for (const pos of round_brackets) {
    multiply_range(pos, CURLY_BRACKET_ATTENTION);
  }

  for (const pos of square_brackets) {
    multiply_range(pos, SQUARE_BRACKET_ATTENTION);
  }

  if (res.length == 0) {
    res = [['', 1.0]];
  }

  // merge runs of identical weights
  let i = 0;
  while (i + 1 < res.length) {
    if (res[i][1] === res[i + 1][1]) {
      res[i][0] += res[i + 1][0];
      res = removeAt(res, i + 1);
    } else {
      i += 1;
    }
  }

  return res;
};
