import {
  ParsingMessage,
  PromptAstGroup,
  SQUARE_BRACKET_ATTENTION,
  CURLY_BRACKET_ATTENTION,
  isRootNode,
} from './types';
import { getBracketsString, removeAstNode, traverse } from './utils';

// This file contains not really optimizations per se,
// but more operations that affect whole AST.
// Fns from this file should be called from './parser.ts'

/**
 * - If group has no children, remove it.
 * - If group only has 1 child and it's also a group, just merge them.
 *   Degenerate cases like "((text:1.2):1.3)" can be ignored.
 */
export const foldGroups = (
  root: PromptAstGroup,
  messages: ParsingMessage[]
) => {
  for (let i = 0; i < root.children.length; i++) {
    const childNode = root.children[i];
    if (childNode.type === 'token') {
      continue;
    }

    foldGroups(childNode, messages);

    if (childNode.children.length === 0) {
      // Child node has no children. It is useless.
      /*console.log(`Detected group with no children. Removing.`, {
        root,
        childNode,
      });*/

      removeAstNode(root, childNode);
    } else if (
      root.children.length === 1 &&
      childNode.children.length === 1 &&
      root.groupType === childNode.groupType
    ) {
      // Both nodes have only 1 child. Merge them.
      /*console.log(
        `Detected parent-child groups that only have 1 child. Merging.`,
        { root, childNode }
      );*/

      if (childNode.textWeight !== undefined) {
        if (root.textWeight === undefined) {
          root.textWeight = childNode.textWeight;
        } else {
          const wRoot = `:${root.textWeight.toFixed(2)}`;
          const wChild =
            childNode.textWeight !== undefined
              ? `:${childNode.textWeight.toFixed(2)}`
              : '';
          messages.push({
            level: 'warning',
            text: `Expressions like "((text${wChild})${wRoot})" are probably an error.`,
          });
        }
      }

      removeAstNode(root, childNode);
      root.children.push(childNode.children[0]);
      root.bracketCount += childNode.bracketCount;
    }
  }
};

export const detectMissingBracesAtTheEnd = (
  currentGroup: PromptAstGroup,
  messages: ParsingMessage[]
) => {
  const getMissingClosingBracesAtEnd = (astGroup: PromptAstGroup) => {
    let buffer = '';
    while (!isRootNode(astGroup)) {
      buffer += getBracketsString(astGroup, 'close');
      astGroup = astGroup.parent;
    }
    return buffer;
  };

  const missingBracesAtEnd = getMissingClosingBracesAtEnd(currentGroup);
  if (missingBracesAtEnd.length) {
    messages.push({
      level: 'warning',
      text: `Missing closing braces at the very end of the prompt. While this is allowed, it may be a symptom of an error. Expected: '${missingBracesAtEnd}'. `,
    });
  }
};

/** While read-only, it leaves user to solve it for itself */
export const detectDuplicates = (
  root: PromptAstGroup,
  messages: ParsingMessage[]
) => {
  const tokenStrs: string[] = [];
  const alreadyWarnedAbout: string[] = [];

  traverse(root, (node) => {
    if (node.type === 'token') {
      const text = node.isLora ? `<lora:${node.value}>` : node.value;
      if (tokenStrs.includes(text)) {
        const alreadyWarned = alreadyWarnedAbout.includes(text);
        if (!alreadyWarned) {
          alreadyWarnedAbout.push(text);
          messages.push({
            level: 'warning',
            text: `Duplicate found: '${text}'`,
          });
        }
      } else {
        tokenStrs.push(text);
      }
    }
  });
};

/**
 * It's not correct to have "[text: 1.3]", use "(text: 1.3)" instead
 * While read-only, it leaves user to solve it for itself */
export const detectWeightInSquareBraces = (
  root: PromptAstGroup,
  messages: ParsingMessage[]
) => {
  traverse(root, (node) => {
    if (
      node.type === 'group' &&
      node.groupType === 'square_bracket' &&
      node.textWeight !== undefined
    ) {
      messages.push({
        level: 'warning',
        text: `You cannot provide attention value inside square braces (e.g. "[text:1.3]"). Use curly braces instead e.g. "(text:1.3)".`,
      });
    }
  });
};

/** https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#attentionemphasis */
export const writeFinalWeights = (root: PromptAstGroup, parentWeight = 1.0) => {
  const groupWeight = getAstGroupWeight(root);
  const cumulativeWeight = parentWeight * groupWeight;
  /*console.log('Group', isRootNode(root) ? 'ROOT' : root.groupType, {
    parentWeight,
    groupWeight,
    cumulativeWeight,
    root,
  });*/

  for (let i = 0; i < root.children.length; i++) {
    const childNode = root.children[i];

    if (childNode.type === 'token') {
      if (!childNode.isLora) {
        childNode.resolvedWeight = cumulativeWeight;
        // console.log(`Child '${childNode.value}'.weight=${cumulativeWeight}`);
      }
    } else {
      writeFinalWeights(childNode, cumulativeWeight);
    }
  }
};

/**
 * (a) - 1.1
 * (a:1.2) - 1.2
 * ((a:1.2)) - 1.1 * 1.2
 * (((a))) - 1.1 * 1.1 * 1.1
 */
const getAstGroupWeight = (node: PromptAstGroup) => {
  if (isRootNode(node)) return 1.0;

  const weightByType =
    node.groupType === 'curly_bracket'
      ? CURLY_BRACKET_ATTENTION
      : SQUARE_BRACKET_ATTENTION;
  const weightByTextValue =
    node.groupType === 'curly_bracket' && node.textWeight !== undefined
      ? node.textWeight
      : weightByType;

  const bracketCountWeight =
    node.bracketCount > 1
      ? Math.pow(weightByType, Math.max(1, node.bracketCount - 1))
      : 1;
  return bracketCountWeight * weightByTextValue;
};
