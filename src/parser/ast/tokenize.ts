import {
  LarkOptions,
  PromptASTNodeStart,
  UnexpectedCharacters,
  UnexpectedEOF,
  UnexpectedToken,
  isUnexpectedCharactersError,
  isUnexpectedEOFError,
  isUnexpectedTokenError,
} from 'lib/lark/prompt_grammar.types';
import { get_parser } from 'lib/lark/prompt_grammar_lark';
import { duplicateStr } from 'utils';

type LarkParser = ReturnType<typeof get_parser>;

export const larkTokenize = (text: string) => {
  const opts: LarkOptions = {
    parser: 'lalr',
    transformer: {},
  };
  const parser = get_parser(opts);

  try {
    const result: PromptASTNodeStart = parser.parse(text);
    return result;
  } catch (e) {
    throw new Error(parseErrMessage(parser, text, e));
  }
};

function parseErrMessage(
  parser: LarkParser,
  text: string,
  error: unknown
): string {
  if (typeof error === 'string') {
    return `Parser error: ${error}`;
  }

  if (isUnexpectedEOFError(error)) {
    const exp = formatExpected(parser, error);
    return `Parser error: expected a token, but the input ended. ${exp}`;
  }

  if (isUnexpectedCharactersError(error)) {
    const errPos = formatErrorPosition(text, error);
    return `Parser error: the lexer encountered an unexpected string.\n${errPos}`;
  }

  if (isUnexpectedTokenError(error)) {
    const exp = formatExpected(parser, error);
    const errPos = formatErrorPosition(text, error);
    return `Parser error: the parser received an unexpected token. ${exp}Error in:\n${errPos}`;
  }

  if (typeof error === 'object' && error != null) {
    console.error({ ...error });
  }
  return 'Unknown parser error';
}

const formatExpected = (
  parser: LarkParser,
  error: UnexpectedEOF | UnexpectedToken
) => {
  const expArr = [...error.expected].sort();
  const expected = expArr.map((exp) => {
    const maybeName = parser?._terminals_dict?.[exp]?.pattern?.value;
    const maybeNameAsStr = maybeName != null ? `: ${maybeName}` : '';
    return `${exp}${maybeNameAsStr}`;
  });
  return error._format_expected(expected);
};

const formatErrorPosition = (
  text: string,
  error: UnexpectedCharacters | UnexpectedToken,
  span = 10
) => {
  const pos = error.pos_in_stream;
  const start = Math.max(pos - span, 0);
  const end = pos + span;

  let before = text.slice(start, pos);
  before = before.split('\n').at(-1)!;

  const after = text.slice(pos, end).split('\n', 1)[0];

  const ws = duplicateStr(' ', before.length - 1);
  return `${before}${after}\n${ws}^`;
};
