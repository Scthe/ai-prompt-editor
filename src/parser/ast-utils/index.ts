export * from './writeWeights';
export * from './detectDuplicates';

import {
  PromptAstAlternate,
  PromptAstGroup,
  PromptAstNode,
  PromptAstScheduled,
  PromptAstToken,
} from 'parser/ast/types';
import { removeAt } from 'utils';

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

export type AstTextNode =
  | PromptAstToken
  | PromptAstScheduled
  | PromptAstAlternate;

export const isAstTextNode = (node: PromptAstNode): node is AstTextNode =>
  node.type === 'token' ||
  node.type === 'scheduled' ||
  node.type === 'alternate';

export const getAllTexts = (token: AstTextNode): string[] => {
  switch (token.type) {
    case 'token':
      return [token.value];
    case 'alternate':
      return token.values;
    case 'scheduled':
      return [token.from, token.to];
  }
};
