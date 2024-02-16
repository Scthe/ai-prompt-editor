import React, { useMemo, useState } from 'react';
import {
  ParsingResult,
  RenderablePromptItem,
  RenderablePromptItemSortOrder,
  sortRenderablePromptItem,
  weightedTokenAsRenderable,
} from 'parser';
import { AlternatingRow } from './internal/alternatingRow';
import { TokenTextContent } from './internal/tokenTextContent';
import { EmptyContent } from './internal/emptyContent';
import { ButtonGroup, ButtonInGroupDef } from 'components';
import { partition } from 'utils';

type SortOrder = RenderablePromptItemSortOrder;
const sortNodes = sortRenderablePromptItem;

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

interface Props {
  parsingResult: ParsingResult;
}

export function PromptAsList({ parsingResult }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('prompt');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('pill');

  const { cleanedTokenWeights: cleanupTokenWeights, networks } = parsingResult;

  const nodes = useMemo(() => {
    const tokens: RenderablePromptItem[] = cleanupTokenWeights.map(
      weightedTokenAsRenderable
    );
    sortNodes(tokens, sortOrder);

    const [loras, hypernets] = partition(networks, (e) => e.type === 'lora');
    sortNodes(loras, sortOrder);
    sortNodes(hypernets, sortOrder);

    return [...tokens, ...loras, ...hypernets];
  }, [cleanupTokenWeights, networks, sortOrder]);

  if (nodes.length === 0) {
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

      <ul role="list">
        {nodes.map((token, idx) => (
          <Node key={idx} mode={displayMode} value={token} />
        ))}
      </ul>
    </>
  );
}

const Node = ({
  mode,
  value,
}: {
  mode: DisplayMode;
  value: RenderablePromptItem;
}) => {
  const text = <TokenTextContent {...value} />;

  if (mode === 'list') {
    return <AlternatingRow tag="li">{text}</AlternatingRow>;
  }
  return (
    <li className="inline-block px-1 py-1 my-1 mr-1 font-mono text-sm rounded-md bg-elevated last:mr-0">
      {text}
    </li>
  );
};
