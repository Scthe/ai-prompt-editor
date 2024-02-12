import { describe, expect, test } from '@jest/globals';
import { parsePromptAttention } from './parsePromptAttention';

describe('parsePromptAttention', () => {
  // The following values were debug-printed from webui
  // using some random prompts
  test.each([
    // MY TESTS:
    ['(normal text:1.3)', [['normal text', 1.3]]],

    // OFFICIAL TESTS:
    // https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/cf2772fab0af5573da775e7437e6acdca424f26e/modules/prompt_parser.py#L384
    ['normal text', [['normal text', 1.0]]],
    [
      'an (important) word',
      [
        ['an ', 1.0],
        ['important', 1.1],
        [' word', 1.0],
      ],
    ],
    ['(unbalanced', [['unbalanced', 1.1]]],
    ['\\(literal\\]', [['(literal]', 1.0]]],
    ['(unnecessary)(parens)', [['unnecessaryparens', 1.1]]],
    [
      'a (((house:1.3)) [on] a (hill:0.5), sun, (((sky))).',
      [
        ['a ', 1.0],
        ['house', 1.5730000000000004],
        [' ', 1.1],
        ['on', 1.0],
        [' a ', 1.1],
        ['hill', 0.55],
        [', sun, ', 1.1],
        ['sky', 1.4641000000000006],
        ['.', 1.1],
      ],
    ],
  ])('should parse "%s"', (text, expected) => {
    const result = parsePromptAttention(text);
    // console.log('result', result);
    expect(result).toStrictEqual(expected);
  });
});
