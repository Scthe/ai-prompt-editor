import React, { useState } from 'react';
import cx from 'classnames';
import { DiffInputData } from '../types';
import { EmptyContent } from 'components/promptDetails/internal/emptyContent';
import {
  ButtonInGroupDef,
  ButtonGroup,
  TableMobileLabel,
  TableHeaderRow,
  Table,
  TableRow,
} from 'components';
import { unique } from 'utils';
import { useIsTailwindScreenBreakpoint } from 'hooks/useTailwindConfig';

type ModelsFilter = 'all' | 'only changed' | 'shared';

const COLUMN_LABELS = {
  name: 'Property',
  before: 'Before',
  after: 'After',
};

const FILTER_LABELS: ButtonInGroupDef<ModelsFilter>[] = [
  { id: 'all', label: 'All' },
  { id: 'only changed', label: 'Changed' },
  { id: 'shared', label: 'Shared' },
];

interface ImageModelDiff {
  name: string;
  before: string | undefined;
  after: string | undefined;
}

interface Props {
  before: DiffInputData;
  after: DiffInputData;
}

export const ResultTabImageModels = (props: Props) => {
  const [filter, setFilter] = useState<ModelsFilter>('all');
  const diffs = useImageModelsDiff(filter, props);
  const isMobileLayout = !useIsTailwindScreenBreakpoint('md');

  return (
    <>
      <h2 className="sr-only">Image models data</h2>
      <div className="mt-2 mb-6 font-medium">
        <span>Show:</span>
        <ButtonGroup
          activeItem={filter}
          onSelected={setFilter}
          buttons={FILTER_LABELS}
        />
      </div>

      {diffs.length === 0 ? (
        <EmptyContent text="No matches for current filter" className="mb-6" />
      ) : (
        <Table
          id="image-models-comparison"
          caption="Comparison between image models for before and after images"
          className="w-full text-left whitespace-no-wrap table-fixed"
        >
          <TableHeaderRow
            className={cx('text-center', isMobileLayout && 'hidden')}
          >
            <th className={cx('py-2')}>
              <span>{COLUMN_LABELS.name}</span>
            </th>
            <th className={cx('py-2')}>
              <span>{COLUMN_LABELS.before}</span>
            </th>
            <th className={cx('py-2')}>
              <span>{COLUMN_LABELS.after}</span>
            </th>
          </TableHeaderRow>
          <tbody>
            {diffs.map((diff) => (
              <ImageModelDiffRow
                key={diff.name}
                {...diff}
                isMobileLayout={isMobileLayout}
              />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

function ImageModelDiffRow({
  name,
  before,
  after,
  isMobileLayout,
}: ImageModelDiff & { isMobileLayout: boolean }) {
  const changed = before !== after;
  return (
    <TableRow isMobileLayout={isMobileLayout}>
      <th className={isMobileLayout ? '' : 'px-4 py-2'} scope="row">
        {name || '-'}
      </th>
      <td className={cx('font-mono', isMobileLayout ? 'block' : '')}>
        <TableMobileLabel
          isMobileLayout={isMobileLayout}
          label={COLUMN_LABELS.before}
        />
        <PropValue changed={changed} value={before} />
      </td>
      <td className={cx('font-mono', isMobileLayout ? 'block' : '')}>
        <TableMobileLabel
          isMobileLayout={isMobileLayout}
          label={COLUMN_LABELS.after}
        />
        <PropValue changed={changed} value={after} />
      </td>
    </TableRow>
  );
}

const PropValue = ({
  value,
  changed,
}: {
  value: string | undefined;
  changed: boolean;
}) => {
  const txt = value || '-';
  return (
    <span className={cx(changed && 'text-accent-700 dark:text-accent-400')}>
      {txt}
    </span>
  );
};

function useImageModelsDiff(
  filter: ModelsFilter,
  { before, after }: Props
): ImageModelDiff[] {
  const imageBefore = before.image?.aiParams?.settings;
  const imageAfter = after.image?.aiParams?.settings;
  // just in case. Should not show this tab in first place
  if (imageBefore == null || imageAfter == null) return [];

  const keys = unique(...Object.keys(imageBefore), ...Object.keys(imageAfter));
  const result: ImageModelDiff[] = [];

  keys.forEach((key) => {
    const valBefore: string | undefined = imageBefore[key];
    const valAfter: string | undefined = imageAfter[key];
    const changed = valBefore !== valAfter;

    if (passesFilter(filter, changed)) {
      result.push({
        name: key,
        before: valBefore,
        after: valAfter,
      });
    }
  });

  return result;
}

const passesFilter = (filter: ModelsFilter, changed: boolean) => {
  if (filter === 'all') return true;
  return filter === 'only changed' ? changed : !changed;
};
