import { larkTokenize } from './tokenize';
import { PlainASTNode, PromptASTNode } from 'lib/lark/prompt_grammar.types';
import { PromptAstGroup, newAstGroup, newAstToken } from './types';
import { assertUnreachable } from 'utils';

export const parse = (text: string) => {
  const startToken = larkTokenize(text);

  const root = newAstGroup(undefined, 'curly_bracket');
  root.children = startToken.children
    .map((tk) => {
      return parseTokens(tk, root);
    })
    .flat();

  return root;
};

const parseTokens = (
  promptNode: PromptASTNode,
  parent: PromptAstGroup | undefined
) => {
  if (promptNode.children.length !== 1) {
    throw new Error('Encountered PromptASTNode with more then 1 child');
  }
  const node = promptNode.children[0];

  switch (node.data) {
    case 'plain': {
      const text = plainNodeText(node);
      return splitIntoValuesByComma(text);
    }
    case 'emphasized': {
      const bracket =
        node.children[0].value === '[' ? 'square_bracket' : 'curly_bracket';
      const grp = newAstGroup(parent, bracket);
      grp.children = parseTokens(node.children[1], grp);

      if (node.children.length === 5) {
        // do not question this, do not think about this, do not imagine this
        const weightText = node.children[3].children[0].children[0].value;
        grp.textWeight = parseFloat(weightText);
      }
      return [grp];
    }
    default:
      assertUnreachable(node);
  }
};

const plainNodeText = (node: PlainASTNode) => node.children[0].value;

// const plainPromptNodeText = (node: ASTNode<'prompt', Array<PlainASTNode>>) =>
// node.children[0].children[0].value;

const splitIntoValuesByComma = (text: string) => {
  return text
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
    .map(newAstToken);
};
