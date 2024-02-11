import { describe, expect, test } from '@jest/globals';
import { parse } from './parse';
import { safeJsonStringify } from 'utils';
import { PromptAstGroup, newAstGroup, newAstToken } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = (result: unknown) => {
  // eslint-disable-next-line no-console
  console.log('DEBUG:', safeJsonStringify(result, 2));
};

describe('parser-lark', () => {
  const mockAstGroup = (
    type: PromptAstGroup['groupType'],
    w: number | undefined,
    ...args: PromptAstGroup['children']
  ) => {
    const gr = newAstGroup(undefined, type);
    gr.children = args;
    gr.textWeight = w;
    delete gr.parent; // this will skip comparison
    return gr;
  };

  const curly = (w: number | undefined, ...args: PromptAstGroup['children']) =>
    mockAstGroup('curly_bracket', w, ...args);

  const square = (...args: PromptAstGroup['children']) =>
    mockAstGroup('square_bracket', undefined, ...args);

  const text = newAstToken;

  const wrapInRoot = (...args: PromptAstGroup['children']) =>
    curly(undefined, ...args);

  const expectAst = (result: PromptAstGroup, expected: PromptAstGroup) => {
    expect(result).toMatchObject({
      ...expected,
      // parent: expect.anything(),
      children: expect.anything(),
    });
    expect(result.children).toHaveLength(expected.children.length);

    // compare children one-by-one
    result.children.forEach((chResult, idx) => {
      const chExpected = expected.children[idx];
      expect(chResult.type).toBe(chExpected.type);

      if (chResult.type === 'token' && chExpected.type === 'token') {
        expect(chResult.value).toBe(chExpected.value);
      } else if (chResult.type === 'group' && chExpected.type === 'group') {
        expectAst(chResult, chExpected);
      } else {
        throw new Error(
          `Tried to compare AST node '${chResult.type}' with '${chExpected.type}'`
        );
      }
    });
  };

  test('should parse "aaa,bbb,ccc"', () => {
    const prompt = 'aaa,bbb,ccc';
    const result = parse(prompt);
    // debug(result);

    const expectedAst = [text('aaa'), text('bbb'), text('ccc')];
    expectAst(result, wrapInRoot(...expectedAst));
  });

  test('should parse "aaa(bbb:1.3)ccc"', () => {
    const prompt = 'aaa(bbb:1.3)ccc';
    const result = parse(prompt);
    // debug(result);

    const expectedAst = [text('aaa'), curly(1.3, text('bbb')), text('ccc')];
    expectAst(result, wrapInRoot(...expectedAst));
  });

  test('should parse "aaa[bbb]ccc"', () => {
    const prompt = 'aaa[bbb]ccc';
    const result = parse(prompt);
    // debug(result);

    const expectedAst = [text('aaa'), square(text('bbb')), text('ccc')];
    expectAst(result, wrapInRoot(...expectedAst));
  });

  test('should parse "(((((ddd)))))"', () => {
    const prompt = '(((((ddd)))))';
    const result = parse(prompt);
    // debug(result);

    const expectedAst = curly(
      undefined,
      curly(
        undefined,
        curly(undefined, curly(undefined, curly(undefined, text('ddd'))))
      )
    );
    expectAst(result, wrapInRoot(expectedAst));
  });

  test('should parse "(((((ddd:1.6):1.5):1.4):1.3):1.2)"', () => {
    const prompt = '(((((ddd:1.6):1.5):1.4):1.3):1.2)';
    const result = parse(prompt);
    // debug(result);

    const expectedAst = curly(
      1.2,
      curly(1.3, curly(1.4, curly(1.5, curly(1.6, text('ddd')))))
    );
    expectAst(result, wrapInRoot(expectedAst));
  });

  test('should parse "[[[[[eee]]]]]"', () => {
    const prompt = '[[[[[eee]]]]]';
    const result = parse(prompt);
    // debug(result);

    const expectedAst = square(square(square(square(square(text('eee'))))));
    expectAst(result, wrapInRoot(expectedAst));
  });
});
