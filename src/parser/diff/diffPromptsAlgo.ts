import { ParsingResult } from '../types';
import { PromptDiff } from './types';

////////////////////////////
// Diff algo below:

export const diffPrompts = (
  // TODO implement diff
  promptA: ParsingResult,
  promptB: ParsingResult
): PromptDiff => {
  // TODO tokens, use flattened list
  // TODO networks too
  return [];
};

/** Note: diffing if you have duplicates is hmm.. This case is ignored. */
/*
const diffAstTrees = (
  treeA: PromptAstGroup,
  treeB: PromptAstGroup
): [PromptAstToken[], PromptAstTokenDiff[]] => {
  const allTokenNames: string[] = [];

  const createNameToNodeMap = (tree: PromptAstGroup) => {
    const tokens = flattenAstTree(tree);
    const mmap = new Map<string, PromptAstToken>();
    tokens.forEach((t) => {
      const name = t.isLora
        ? `${LORA_PREFIX}${t.value}${LORA_SUFFIX}`
        : t.value;
      mmap.set(name, t);
      allTokenNames.push(name);
    });
    return mmap;
  };

  const mmapA = createNameToNodeMap(treeA);
  const mmapB = createNameToNodeMap(treeB);
  const uniqueTokenNames = unique(...allTokenNames).sort();

  const changes: PromptAstTokenDiff[] = [];
  const notChanged: PromptAstToken[] = [];

  uniqueTokenNames.forEach((tokenName) => {
    const nodeA = mmapA.get(tokenName);
    const nodeB = mmapB.get(tokenName);
    const diff = diffAstTreeNodes(nodeA, nodeB);
    if (diff) {
      changes.push(diff);
    } else if (nodeA || nodeB) {
      notChanged.push(nodeA || nodeB!);
    }
  });

  return [notChanged, changes];
};

const diffAstTreeNodes = (
  nodeA: PromptAstToken | undefined,
  nodeB: PromptAstToken | undefined
): PromptAstTokenDiff | undefined => {
  const valueA = nodeA?.resolvedWeight;
  const valueB = nodeB?.resolvedWeight;

  const closeEnough =
    valueA !== undefined &&
    valueB !== undefined &&
    Math.abs(valueA - valueB) < 0.001; // usual float compare stuff
  const sameWeights = valueA === valueB || closeEnough;

  if (sameWeights) {
    // would be weird if both were undefined. An error event.
    // Otherwise, weights are same
    return undefined;
  }

  return {
    token: (nodeA || nodeB)!, // we know at least one is not `undefined`
    valueA,
    valueB,
  };
};
*/
