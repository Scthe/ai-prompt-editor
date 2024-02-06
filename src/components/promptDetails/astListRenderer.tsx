import React, { useMemo, useState } from 'react';
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

type DisplayMode = 'pill' | 'list';

const DISPLAY_MODE_LABELS: ButtonInGroupDef<DisplayMode>[] = [
  { id: 'pill', label: 'Pills' },
  { id: 'list', label: 'List' },
];

// TODO add 'copy to clipboard flattened'
export function AstListRenderer({ astGroup }: { astGroup: PromptAstGroup }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('prompt');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('pill');

  const nodes = useMemo(() => {
    const nodes = flattenAstTree(astGroup);
    sortNodes(nodes, sortOrder);
    return nodes;
  }, [astGroup, sortOrder]);

  if (hasNoChildren(astGroup)) {
    return <EmptyContent />;
  }

  return (
    <>
      <div className="mt-2 mb-2 font-medium">
        <span>Display:</span>
        <ButtonGroup
          activeItem={displayMode}
          onSelected={setDisplayMode}
          buttons={DISPLAY_MODE_LABELS}
        />
      </div>

      <div className="mb-4 font-medium">
        <span>Sort:</span>
        <ButtonGroup
          activeItem={sortOrder}
          onSelected={setSortOrder}
          buttons={SORT_LABELS}
        />
      </div>

      {/* TODO <li> */}
      <div>
        {nodes.map((token, idx) => (
          <Node key={idx} mode={displayMode} token={token} />
        ))}
      </div>
    </>
  );
}

const Node = ({
  mode,
  token,
}: {
  mode: DisplayMode;
  token: PromptAstToken;
}) => {
  const text = astTokenContent(token);
  if (mode === 'list') {
    return <AstNodeRender>{text}</AstNodeRender>;
  }
  return (
    <div className="inline-block px-1 py-1 my-1 mr-1 font-mono text-sm bg-gray-200 rounded-md last:mr-0">
      {text}
    </div>
  );
};

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
