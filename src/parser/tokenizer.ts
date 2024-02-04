import { typesafeObjectKeys } from 'utils';

interface Token<TokenType extends string> {
  type: TokenType;
  value: string;
}

type TokenizerGrammar<T extends string> = Record<T, RegExp>;

export type TokenizerTokenFromGramma<T> = T extends Record<infer K, RegExp>
  ? K extends string
    ? Token<K>
    : never
  : never;

/**
 * Based on:
 * - https://inspirnathan.com/posts/153-math-expression-tokenizer-in-javascript/
 * - https://blog.klipse.tech/tags/index.html#compiler
 */
export default class Tokenizer<TokenType extends string> {
  private cursor: number;

  constructor(
    private readonly input: string,
    private readonly tokenizer: TokenizerGrammar<TokenType>
  ) {
    this.cursor = 0;
  }

  hasMoreTokens() {
    return this.cursor < this.input.length;
  }

  private match(regex: RegExp, inputSlice: string) {
    const matched = regex.exec(inputSlice);
    if (matched === null) {
      return null;
    }

    // console.log('matched', regex, matched);
    this.cursor += matched[0].length;
    return matched[0];
  }

  getNextToken(): Token<TokenType> | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const inputSlice = this.input.slice(this.cursor);
    // console.log(`inputSlice: '${inputSlice}'`);

    for (const type of typesafeObjectKeys(this.tokenizer)) {
      const regex = this.tokenizer[type];
      const tokenValue = this.match(regex, inputSlice);

      if (tokenValue === null) {
        continue;
      }

      return {
        type,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: "${inputSlice[0]}"`);
  }

  lastTokenized(sliceCount = 10): string {
    return this.input.slice(this.cursor, this.cursor + sliceCount);
  }
}
