import React from 'react';
import {
  PromptAstGroup,
  PromptAstNode,
  PromptAstToken,
  astTokenAsRenderable,
  getBracketsString,
  hasNoChildren,
  isRootNode,
} from 'parser';
import { AlternatingRow } from './internal/alternatingRow';
import { EmptyContent } from './internal/emptyContent';
import { TokenTextContent } from './internal/tokenTextContent';
import { assertUnreachable } from 'utils';

export function AstRenderer({
  astGroup,
  depth = 0,
}: {
  astGroup: PromptAstGroup;
  depth?: number;
}) {
  if (isRootNode(astGroup) && hasNoChildren(astGroup)) {
    return <EmptyContent />;
  }

  const isEmpty = astGroup.bracketCount === 0;
  const nextDepth =
    isEmpty || isRootNode(astGroup) ? depth : depth + astGroup.bracketCount;
  const bracketOpenText = getBracketsString(astGroup, 'open');
  const bracketCloseText = getBracketsString(astGroup, 'close');

  // optimize display for a single child. Cannot move the check cause TS will complain
  if (astGroup.children.length === 1 && astGroup.children[0].type === 'token') {
    return (
      <AlternatingRow depth={depth}>
        {bracketOpenText}
        {renderToken(astGroup.children[0])}
        {bracketCloseText}
      </AlternatingRow>
    );
  }

  return (
    <>
      {bracketOpenText.length ? (
        <AlternatingRow depth={depth}>{bracketOpenText}</AlternatingRow>
      ) : undefined}

      {/* TODO `key={idx}` is terrible */}
      {astGroup.children.map((childAstNode, idx) => (
        <AstNodeEl key={idx} nextDepth={nextDepth} node={childAstNode} />
      ))}

      {bracketCloseText.length ? (
        <AlternatingRow depth={depth}>{bracketCloseText}</AlternatingRow>
      ) : undefined}
    </>
  );
}

const AstNodeEl = ({
  node,
  nextDepth,
}: {
  node: PromptAstNode;
  nextDepth: number;
}) => {
  switch (node.type) {
    case 'token': {
      return (
        <AlternatingRow depth={nextDepth}>{renderToken(node)}</AlternatingRow>
      );
    }
    case 'group': {
      return <AstRenderer astGroup={node} depth={nextDepth} />;
    }
    case 'break': {
      return <AlternatingRow depth={nextDepth}>BREAK</AlternatingRow>;
    }
    default:
      assertUnreachable(node);
  }
};

const renderToken = (token: PromptAstToken) => {
  return <TokenTextContent {...astTokenAsRenderable(token)} />;
};
