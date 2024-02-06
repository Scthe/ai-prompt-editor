import React, { useState } from 'react';
import {
  PromptAstGroup,
  PromptAstToken,
  flattenAstTree,
  hasNoChildren,
} from '../../parser';
import { astTokenContent, AstNodeRender } from './astNode';
import { EmptyContent } from './emptyContent';
import { ButtonGroup, ButtonInGroupDef } from 'components';
import { cmpAlphabetical } from 'utils';

type SortOrder = 'prompt' | 'alphabetical' | 'attention';

const SORT_LABELS: ButtonInGroupDef<SortOrder>[] = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'alphabetical', label: 'A-Z' },
  { id: 'attention', label: 'Attention' },
];

// TODO add 'copy to clipboard flattened'
export function AstListRenderer({ astGroup }: { astGroup: PromptAstGroup }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('prompt');

  if (hasNoChildren(astGroup)) {
    return <EmptyContent />;
  }

  const nodes = flattenAstTree(astGroup); // TODO memo
  sortNodes(nodes, sortOrder);

  return (
    <>
      <div className="mt-2 mb-4 font-medium">
        <span>Sort:</span>
        <ButtonGroup
          activeItem={sortOrder}
          onSelected={setSortOrder}
          buttons={SORT_LABELS}
        />
      </div>

      <div>
        {nodes.map((node, idx) => {
          const text = astTokenContent(node);
          return <AstNodeRender key={idx}>{text}</AstNodeRender>;
        })}
      </div>
    </>
  );
}

function sortNodes(nodes: PromptAstToken[], order: SortOrder) {
  switch (order) {
    case 'attention': {
      nodes.sort((a, b) => b.resolvedWeight - a.resolvedWeight);
      break;
    }
    case 'alphabetical': {
      nodes.sort((a, b) => cmpAlphabetical(a.value, b.value));
      break;
    }
  }
}
