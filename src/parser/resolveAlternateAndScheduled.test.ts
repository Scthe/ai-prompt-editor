import { describe, expect, test } from '@jest/globals';
import { resolveAlternateAndScheduled } from './resolveAlternateAndScheduled';
import { parse } from './ast/parse';

interface TestCase {
  prompt: string;
  expected: string;
  step?: number;
}

describe('resolveAlternateAndScheduled', () => {
  const TEST_CASES: TestCase[] = [
    { prompt: 'aaaa', expected: 'aaaa' },
    // scheduled - fractions
    { prompt: 'aaa[FROM:TO:0.2]bbb', expected: 'aaaFROMbbb' },
    { prompt: 'aaa[FROM:TO:0.6]bbb', expected: 'aaaTObbb' },
    { prompt: 'aaa[TO:0.2]bbb', expected: 'aaabbb' }, // add after
    { prompt: 'aaa[TO:0.6]bbb', expected: 'aaaTObbb' }, // add after
    { prompt: 'aaa[FROM::0.2]bbb', expected: 'aaaFROMbbb' }, // remove after
    { prompt: 'aaa[FROM::0.6]bbb', expected: 'aaabbb' }, // remove after
    // scheduled - steps
    { prompt: 'aaa[FROM:TO:2]bbb', expected: 'aaaFROMbbb' },
    { prompt: 'aaa[FROM:TO:5]bbb', expected: 'aaaTObbb' },
    { prompt: 'aaa[TO:2]bbb', expected: 'aaabbb' }, // add after
    { prompt: 'aaa[TO:5]bbb', expected: 'aaaTObbb' }, // add after
    { prompt: 'aaa[FROM::2]bbb', expected: 'aaaFROMbbb' }, // remove after
    { prompt: 'aaa[FROM::5]bbb', expected: 'aaabbb' }, // remove after
    // alternate
    { prompt: 'aaa[XXX|YYY]bbb', expected: 'aaaXXXbbb', step: 0 },
    { prompt: 'aaa[XXX|YYY]bbb', expected: 'aaaYYYbbb', step: 1 },
    { prompt: 'aaa[XXX|YYY|ZZZ]bbb', expected: 'aaaXXXbbb', step: 6 },
    { prompt: 'aaa[XXX|YYY|ZZZ]bbb', expected: 'aaaYYYbbb', step: 7 },
    { prompt: 'aaa[XXX|YYY|ZZZ]bbb', expected: 'aaaZZZbbb', step: 8 },
  ];

  test.each(TEST_CASES)(
    'should parse "$prompt"',
    ({ prompt, expected, step }) => {
      step = step === undefined ? 5 : step;

      const ast = parse(prompt);
      // console.log(ast);

      const result = resolveAlternateAndScheduled(prompt, ast, step, 10);

      // console.log('result', result);
      expect(result).toStrictEqual(expected);
    }
  );
});
