import React from 'react';
import { PromptAstGroup, getBracketsString } from '../../parser';
import { astTokenContent, AstNodeRender } from './astNode';

export function AstRenderer({
  astGroup,
  depth = 0,
}: {
  astGroup: PromptAstGroup;
  depth?: number;
}) {
  const isEmpty = astGroup.bracketCount === 0;
  const nextDepth = isEmpty ? depth : depth + astGroup.bracketCount;
  const bracketOpenText = getBracketsString(astGroup, 'open');
  const bracketCloseText = getBracketsString(astGroup, 'close');

  // optimize display for a single child. Cannot move the check cause TS will complain
  if (astGroup.children.length === 1 && astGroup.children[0].type === 'token') {
    const childEl = astTokenContent(astGroup.children[0]);
    return (
      <AstNodeRender depth={depth}>
        {bracketOpenText}
        {childEl}
        {bracketCloseText}
      </AstNodeRender>
    );
  }

  return (
    <>
      {bracketOpenText.length ? (
        <AstNodeRender depth={depth}>{bracketOpenText}</AstNodeRender>
      ) : undefined}

      {astGroup.children.map((childAstNode, idx) => {
        // TODO `key={idx}` is terrible
        const key = idx;
        if (childAstNode.type === 'token') {
          const text = astTokenContent(childAstNode);
          return (
            <AstNodeRender key={key} depth={nextDepth}>
              {text}
            </AstNodeRender>
          );
        } else {
          return (
            <AstRenderer key={key} astGroup={childAstNode} depth={nextDepth} />
          );
        }
      })}

      {bracketCloseText.length ? (
        <AstNodeRender depth={depth}>{bracketCloseText}</AstNodeRender>
      ) : undefined}
    </>
  );
}
