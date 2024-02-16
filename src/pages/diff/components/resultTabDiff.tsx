import React, { useEffect, useState } from 'react';
import { AstDiffTable } from 'components/promptDetails';
import { ResultCardProps } from './resultCard';
import { EmptyContent } from 'components/promptDetails/internal/emptyContent';
import { ButtonGroup, ButtonInGroupDef } from 'components';
import { PromptDiffEntry, diffPrompts, stringifyDiffDelta } from 'parser';

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
  { id: 'only changed', label: 'Changed' },
  { id: 'shared', label: 'Shared' },
];

export const ResultTabDiff = (props: ResultCardProps) => {
  const [filter, setFilter] = useState<DffFilter>('all');

  const [notChanged, changed] = useDiffAstTrees(props);
  const shownDiffs = changed.filter((e) => isDiffEntryShown(filter, e));
  const finalShownData = filter === 'shared' ? notChanged : shownDiffs;

  const hasRowsInAllTab = notChanged.length + changed.length > 0;
  const emptyMsg = hasRowsInAllTab
    ? 'No matches for current filter'
    : 'There are no differences';

  return (
    <>
      <h2 className="sr-only">Diff between prompt before and after</h2>
      <div className="mt-2 mb-6 font-medium">
        <span>Show:</span>
        <ButtonGroup
          activeItem={filter}
          onSelected={setFilter}
          buttons={FILTER_LABELS}
        />
      </div>
      {finalShownData.length === 0 ? (
        <EmptyContent text={emptyMsg} className="mb-6" />
      ) : (
        <AstDiffTable tokenDiffs={finalShownData} />
      )}
    </>
  );
};

const useDiffAstTrees = (props: ResultCardProps) => {
  const before = props.before.result;
  const after = props.after.result;

  const [diffs, setDiffs] = useState<PromptDiffEntry[]>([]);
  const [notChanged, setNotChanged] = useState<PromptDiffEntry[]>([]);

  useEffect(() => {
    if (before !== undefined && after !== undefined) {
      const [notChanged, changes] = diffPrompts(before, after);
      setDiffs(changes);
      setNotChanged(notChanged);
    }
  }, [before, after]);

  return [notChanged, diffs];
};

const isDiffEntryShown = (
  filter: DffFilter,
  item: PromptDiffEntry
): boolean => {
  const delta = stringifyDiffDelta(item);

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
