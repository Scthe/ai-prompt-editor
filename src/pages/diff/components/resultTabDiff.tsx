import React, { useEffect, useState } from 'react';
import { AstDiffTable } from 'components/promptDetails';
import { PromptAstTokenDiff, diffAstTrees, getAstTokenDiffDelta } from 'parser';
import { ResultCardProps } from './resultCard';
import { EmptyContent } from 'components/promptDetails/emptyContent';
import { ButtonGroup, ButtonInGroupDef } from 'components';

type DffFilter =
  | 'all'
  | 'only added'
  | 'only removed'
  | 'only changed'
  | 'shared';

const FILTER_LABELS: ButtonInGroupDef<DffFilter>[] = [
  { id: 'all', label: 'All' },
  { id: 'only added', label: 'Added' },
  { id: 'only removed', label: 'Removed' },
  { id: 'only changed', label: 'Modified' },
  { id: 'shared', label: 'Shared' },
];

export const ResultTabDiff = (props: ResultCardProps) => {
  const [filter, setFilter] = useState<DffFilter>('all');

  const [notChanged, tokenDiffs] = useDiffAstTrees(props);
  const shownDiffs = tokenDiffs.filter((e) => diffFilterFn(filter, e));
  const data = filter === 'shared' ? notChanged : shownDiffs;

  if (shownDiffs.length === 0) {
    const msg =
      tokenDiffs.length === 0
        ? 'There are no differences'
        : `No matches for current filter`;
    return <EmptyContent text={msg} className="mb-6" />;
  }

  return (
    <>
      <div className="mt-2 mb-6 font-medium">
        <span>Show:</span>
        <ButtonGroup
          activeItem={filter}
          onSelected={setFilter}
          buttons={FILTER_LABELS}
        />
      </div>
      <AstDiffTable tokenDiffs={data} />
    </>
  );
};

const useDiffAstTrees = (props: ResultCardProps) => {
  const astBefore = props.before.result?.ast;
  const astAfter = props.after.result?.ast;

  const [diffs, setDiffs] = useState<PromptAstTokenDiff[]>([]);
  const [notChanged, setNotChanged] = useState<PromptAstTokenDiff[]>([]);

  useEffect(() => {
    if (astBefore && astAfter) {
      const [notChanged, changes] = diffAstTrees(astBefore, astAfter);
      setDiffs(changes);

      // ok, the following is a bit ugly
      const notChangedAsDiffs: PromptAstTokenDiff[] = notChanged.map((n) => ({
        token: n,
        valueA: n.resolvedWeight,
        valueB: n.resolvedWeight,
      }));
      setNotChanged(notChangedAsDiffs);
    }
  }, [astAfter, astBefore]);

  return [notChanged, diffs];
};

const diffFilterFn = (filter: DffFilter, item: PromptAstTokenDiff): boolean => {
  const delta = getAstTokenDiffDelta(item);

  switch (filter) {
    case 'only added':
      return delta === 'added';
    case 'only removed':
      return delta === 'removed';
    case 'only changed':
      return typeof delta === 'number';
    case 'all':
    default:
      return true;
  }
};
