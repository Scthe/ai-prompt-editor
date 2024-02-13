import { larkTokenize } from './tokenize';
import {
  ASTValue,
  PlainASTNode,
  PromptASTNode,
} from 'lib/lark/prompt_grammar.types';
import {
  PromptAstGroup,
  PromptAstNode,
  newAstAlternate,
  newAstGroup,
  newAstScheduled,
  newAstToken,
} from './types';
import { ItemType, assertUnreachable } from 'utils';

export const parse = (text: string) => {
  const startToken = larkTokenize(text);

  const root = newAstGroup(undefined, 'curly_bracket');
  root.children = startToken.children
    .map((tk) => parsePromptNode(text, tk, root))
    .flat();

  return root;
};

const parsePromptNode = (
  originalText: string,
  promptNode: PromptASTNode,
  parent: PromptAstGroup | undefined
): PromptAstNode[] => {
  // console.log(promptNode);
  return promptNode.children.flatMap((e) =>
    parsePromptSubType(originalText, e, parent)
  );
};

const parsePromptSubType = (
  originalText: string,
  node: ItemType<PromptASTNode['children']>,
  parent: PromptAstGroup | undefined
): PromptAstNode[] => {
  switch (node.data) {
    case 'plain': {
      const text = plainNodeText(node);
      return splitIntoValuesByComma(text);
    }

    case 'emphasized': {
      const bracket =
        node.children[0].value === '[' ? 'square_bracket' : 'curly_bracket';
      const grp = newAstGroup(parent, bracket);
      grp.children = parsePromptNode(originalText, node.children[1], grp);

      if (node.children.length === 5) {
        const weightText = getTextIfHasOnePlainChild(node.children[3]);
        if (weightText !== undefined) {
          grp.textWeight = parseFloat(weightText); // TODO handle NaN?
        }
      }
      return [grp];
    }

    case 'scheduled': {
      // console.log(node);
      let from = getAstValueIfHasOnePlainChild(node.children[0]);
      let to: ASTValue | undefined = undefined;
      let changeAtStr: ASTValue | undefined = undefined;

      if (node.children.length === 2) {
        // `[to:0.25]`
        changeAtStr = node.children[1];
        to = from;
        from = undefined;
      } else {
        // `[from:to:0.25]`
        changeAtStr = node.children[2];
        to = getAstValueIfHasOnePlainChild(node.children[1]);
      }

      const result = scheduledNode(originalText, from, to, changeAtStr);
      return result.type === 'token' ? [result] : [result]; // TS has problems
    }

    case 'scheduledremove': {
      const from = getAstValueIfHasOnePlainChild(node.children[0]);
      const changeAtStr = node.children[1];
      const result = scheduledNode(originalText, from, undefined, changeAtStr);
      return result.type === 'token' ? [result] : [result]; // TS has problems
    }

    case 'alternate': {
      const rawValues = node.children.map(getTextIfHasOnePlainChild);
      const values: string[] = rawValues.filter(
        (e) => e != null && e.length > 0
        // TS, we are exactly checking this!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any;

      // Checked by lark that 1+ children exist
      const startPos = getAstValueIfHasOnePlainChild(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.children.at(0) as any
      );
      const endPos = getAstValueIfHasOnePlainChild(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.children.at(-1) as any
      );

      return [
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        newAstAlternate(values, startPos?.start_pos! - 1, endPos?.end_pos! + 1),
      ];
    }

    default:
      assertUnreachable(node);
  }
};

const plainNodeText = (node: PlainASTNode) => node.children[0].value;

/** Do not question this, do not think about this, do not imagine this */
const getTextIfHasOnePlainChild = (node: PromptASTNode) => {
  const child = node.children[0];
  return child.data == 'plain' ? plainNodeText(child) : undefined;
};

/** Do not question this, do not think about this, do not imagine this */
const getAstValueIfHasOnePlainChild = (node: PromptASTNode) => {
  const child = node.children[0];
  return child.data == 'plain' ? child.children[0] : undefined;
};

const splitIntoValuesByComma = (text: string) => {
  return text
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
    .map(newAstToken);
};

const scheduledNode = (
  originalText: string,
  from: ASTValue | undefined,
  to: ASTValue | undefined,
  changeAtStr: ASTValue | undefined
) => {
  // console.log({ from, to, changeAtStr });
  if ((from == undefined && to == undefined) || changeAtStr == undefined) {
    // we need at least one prompt and a changeAtStr
    return newAstToken('');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const startPos = (from !== undefined ? from.start_pos : to?.start_pos!) - 1; // start pos of the AstValue, but we backtrack 1 to '['
  const endPos = originalText.indexOf(']', changeAtStr.end_pos) + 1;

  return newAstScheduled(
    from?.value || '',
    to?.value || '',
    parseFloat(changeAtStr.value),
    startPos,
    endPos
  );
};
