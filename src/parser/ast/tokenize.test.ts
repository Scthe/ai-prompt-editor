import { describe, expect, test } from '@jest/globals';
import { larkTokenize } from './tokenize';
import { safeJsonStringify } from 'utils';
import { PromptASTNode } from 'lib/lark/prompt_grammar.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = (result: unknown) => {
  // eslint-disable-next-line no-console
  console.log('DEBUG:', safeJsonStringify(result, 2));
};

describe('larkTokenize', () => {
  const expectPlainNode = (promptNode: PromptASTNode, text: string) => {
    expect(promptNode.data).toBe('prompt');
    expect(promptNode.children[0].data).toBe('plain');
    expect(promptNode.children[0].children).toHaveLength(1);
    expect(promptNode.children[0].children[0]).toMatchObject({
      value: text,
    });
  };

  describe('plain', () => {
    test.each([
      ['aaa'], //
      ['aaa!'],
      ['aaa?'],
    ])('should parse "%s"', (prompt) => {
      const result = larkTokenize(prompt);
      // debug(result);
      expect(result.data).toBe('start');
      const promptNode = result.children[0];
      expectPlainNode(promptNode, prompt);
    });
  });

  describe('emphasized', () => {
    test.each([
      ['(123)'], //
      ['[123]'],
    ])('should parse "%s"', (prompt) => {
      const result = larkTokenize(prompt);
      // debug(result);

      expect(result.data).toBe('start');
      const promptNode = result.children[0];
      expect(promptNode.data).toBe('prompt');

      const emphNode = promptNode.children[0];
      expect(emphNode.data).toBe('emphasized');
      expect(emphNode.children).toHaveLength(3);

      // match ['(', '123', ')']
      expect(emphNode.children[0]).toMatchObject({
        value: prompt.at(0), // opening bracket
      });
      expectPlainNode(emphNode.children[1]!, '123');
      expect(emphNode.children[2]).toMatchObject({
        value: prompt.at(-1), // closing bracket
      });
    });

    test('should parse with weight "(aaa:1.3)"', () => {
      const prompt = '(aaa:1.3)';
      const result = larkTokenize(prompt);
      // debug(result);

      expect(result.data).toBe('start');
      const promptNode = result.children[0];
      expect(promptNode.data).toBe('prompt');

      const emphNode = promptNode.children[0];
      expect(emphNode.data).toBe('emphasized');
      expect(emphNode.children).toHaveLength(5);

      // match ['(', 'aaa', ':', '1.3', ')']
      expect(emphNode.children[0]).toMatchObject({
        value: '(',
      });
      expectPlainNode(emphNode.children[1]!, 'aaa');
      expect(emphNode.children[2]).toMatchObject({
        value: ':',
      });
      expectPlainNode(emphNode.children[3]!, '1.3');
      expect(emphNode.children[4]).toMatchObject({
        value: ')',
      });
    });
  });
});
