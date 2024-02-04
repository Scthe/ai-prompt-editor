import {
  duplicateStr,
  removeAt,
  removePrefix,
  removeSuffix,
  unique,
} from 'utils';
import {
  PromptAstGroup,
  PromptAstNode,
  PromptAstToken,
  newAstLoraToken,
} from './types';

export const getBracketsString = (
  astGroup: PromptAstGroup,
  bracketType: 'open' | 'close'
) => {
  let bracket = '';
  if (astGroup.groupType === 'square_bracket') {
    bracket = bracketType === 'close' ? ']' : '[';
  } else {
    bracket = bracketType === 'close' ? ')' : '(';
  }
  return duplicateStr(bracket, astGroup.bracketCount);
};

export const getLastPromptToken = (
  group: PromptAstGroup
): PromptAstToken | undefined => {
  const lastChild = group.children.at(-1);
  return lastChild?.type === 'token' ? lastChild : undefined;
};

export const parseWeight = (value: string): number | undefined => {
  const NUMBER_REGEX = /[\d\\.]+/;
  const matched = NUMBER_REGEX.exec(value);
  if (matched !== null) {
    return parseFloat(value);
  }
  return undefined;
};

const LORA_PREFIX = '<lora:';
const LORA_SUFFIX = '>';

export const getLoraText = (token: PromptAstToken) => {
  if (token.isLora) {
    return `${LORA_PREFIX}${token.value}:${token.resolvedWeight}${LORA_SUFFIX}`;
  }
  return undefined;
};

export const parseLora = (value: string): PromptAstToken | undefined => {
  let text = value;
  text = removePrefix(text, '<');
  text = removePrefix(text, 'lora:');
  text = removeSuffix(text, '>');

  // "lora_name" -> ["lora_name", undefined]
  // "lora_name:1" -> ["lora_name:1", ":1"]
  const matched = /^.*?(:\s?[\d.].*?)?$/.exec(text);
  if (!matched) {
    return undefined;
  }

  let weightStr: string | undefined = matched[1];
  let weight: number | undefined = undefined;
  if (weightStr) {
    text = removeSuffix(text, weightStr);
    weightStr = removePrefix(weightStr, ':');
    weight = parseWeight(weightStr);
  }

  if (text.length === 0) {
    // TODO add warnings if text is empty
    return undefined;
  }

  return newAstLoraToken(text, weight !== undefined ? weight : 1.0);
};

export const getBracketType = (str: string): PromptAstGroup['groupType'] => {
  if ('()'.includes(str)) return 'curly_bracket';
  if ('[]'.includes(str)) return 'square_bracket';
  throw new Error(`Tried to getBracketType() for '${str}'`);
};

export const removeAstNode = (parent: PromptAstGroup, node: PromptAstNode) => {
  const childIdx = parent.children.findIndex((n) => n === node);
  if (childIdx !== -1) {
    parent.children = removeAt(parent.children, childIdx);
    if (node.type === 'group') {
      node.parent = undefined; // free for gc. TBH not necessary, but just to be 'proper'
    }
  }
};

/** Visit every node in a tree */
export const traverse = (
  root: PromptAstGroup,
  cb: (node: PromptAstNode) => void
) => {
  cb(root);

  for (let i = 0; i < root.children.length; i++) {
    const childNode = root.children[i];

    if (childNode.type === 'group') {
      traverse(childNode, cb); // will check `childNode` as first thing
    } else {
      cb(childNode);
    }
  }
};

export const flattenAstTree = (
  root: PromptAstGroup,
  sort?: 'asc' | 'desc'
): PromptAstToken[] => {
  const result: PromptAstToken[] = [];

  traverse(root, (node) => {
    if (node.type === 'token') {
      result.push(node);
    }
  });

  if (sort) {
    const orderMod = sort === 'asc' ? 1 : -1;
    result.sort((a, b) => orderMod * (a.resolvedWeight - b.resolvedWeight));
  }

  return result;
};

export interface PromptAstTokenDiff {
  token: PromptAstToken;
  valueA?: PromptAstToken['resolvedWeight'];
  valueB?: PromptAstToken['resolvedWeight'];
}

/** Note: diffing if you have duplicates is hmm.. This case is ignored. */
export const diffAstTrees = (treeA: PromptAstGroup, treeB: PromptAstGroup) => {
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

  return uniqueTokenNames.reduce((acc, tokenName) => {
    const nodeA = mmapA.get(tokenName);
    const nodeB = mmapB.get(tokenName);
    const diff = diffAstTreeNodes(nodeA, nodeB);
    if (diff) {
      acc.push(diff);
    }
    return acc;
  }, [] as PromptAstTokenDiff[]);
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

// TODO remember to close all remaining params after each group!
// export const mergeAstTrees = (...astGroups: PromptAstGroup) => ...
