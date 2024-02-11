import { PromptAstGroup } from 'parser';
import { removeAstNode } from '.';

/**
 * - If group has no children, remove it.
 * - If group only has 1 child and it's also a group, just merge them.
 *   Degenerate cases like "((text:1.2):1.3)" can be ignored.
 */
export const foldGroups = (root: PromptAstGroup) => {
  for (let i = 0; i < root.children.length; i++) {
    const childNode = root.children[i];
    if (childNode.type === 'token' || childNode.type === 'break') {
      continue;
    }

    foldGroups(childNode);

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
          root.textWeight *= childNode.textWeight;
        }
      }

      removeAstNode(root, childNode);
      root.children.push(childNode.children[0]);
      root.bracketCount += childNode.bracketCount;
    }
  }
};
