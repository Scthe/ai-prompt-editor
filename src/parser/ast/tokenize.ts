import { LarkOptions, PromptASTNodeStart } from 'lib/lark/prompt_grammar.types';
import { get_parser } from 'lib/lark/prompt_grammar_lark';

export const larkTokenize = (text: string) => {
  const opts: LarkOptions = {
    parser: 'lalr',
    transformer: {},
  };
  const parser = get_parser(opts);
  const result: PromptASTNodeStart = parser.parse(text);
  return result;
};
