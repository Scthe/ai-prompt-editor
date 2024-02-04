import React from 'react';
import { PromptAstGroup, flattenAstTree } from '../../parser';
import { astTokenContent, AstNodeRender } from './astNode';

// TODO sort orders: as appear, alphabetical, by weight
export function AstFlattenRenderer({ astGroup }: { astGroup: PromptAstGroup }) {
  const nodes = flattenAstTree(astGroup, 'desc'); // TODO memo

  return nodes.map((node, idx) => {
    const text = astTokenContent(node);
    return <AstNodeRender key={idx}>{text}</AstNodeRender>;
  });
}
