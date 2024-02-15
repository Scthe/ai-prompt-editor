import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { DiffColumnsSort } from 'pages/diff/types';
import { SortOrder, oppositeSortOrder } from 'utils';
import { mdiTriangle, mdiTriangleDown } from '@mdi/js';
import Icon from '@mdi/react';
import { SORTERS } from 'parser/diff/sort';
import { PromptDiff, PromptDiffEntry, stringifyDiffDelta } from 'parser';
import { TokenTextContent } from './internal/tokenTextContent';
import { useIsTailwindScreenBreakpoint } from 'hooks/useTailwindConfig';

const COLUMN_LABELS: Record<DiffColumnsSort, string> = {
  change: 'Change',
  before: 'Before',
  after: 'After',
  token: 'Token',
};

export function AstDiffTable({ tokenDiffs }: { tokenDiffs: PromptDiff }) {
  const [sortCol, setSortCol] = useState<DiffColumnsSort>('token');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const isMobileLayout = !useIsTailwindScreenBreakpoint('md');

  const onChangeSort = (col: DiffColumnsSort) => {
    if (col === sortCol) {
      setSortOrder((s) => oppositeSortOrder(s));
    } else {
      setSortCol(col);
      setSortOrder('asc');
    }
  };

  const data = useMemo(() => {
    return tokenDiffs.toSorted((a, b) => {
      const cmp = SORTERS[sortCol](a, b);
      const ordMod = sortOrder === 'asc' ? 1 : -1;
      return cmp * ordMod;
    });
  }, [sortCol, sortOrder, tokenDiffs]);

  return (
    <table
      className="w-full text-left whitespace-no-wrap table-fixed"
      tabIndex={0}
    >
      <caption id="diff-table-caption" className="sr-only">
        Comparison between before and after prompts
      </caption>
      <thead>
        <tr
          className={cx(
            'text-center bg-zinc-100 text-zinc-800',
            isMobileLayout && 'hidden'
          )}
        >
          <DiffHeader
            col="change"
            small
            className="py-2"
            activeSortCol={sortCol}
            activeSortOrder={sortOrder}
            onClick={onChangeSort}
          />
          <DiffHeader
            col="before"
            small
            activeSortCol={sortCol}
            activeSortOrder={sortOrder}
            onClick={onChangeSort}
          />
          <DiffHeader
            col="after"
            small
            activeSortCol={sortCol}
            activeSortOrder={sortOrder}
            onClick={onChangeSort}
          />
          <DiffHeader
            col="token"
            className="px-4 text-left"
            activeSortCol={sortCol}
            activeSortOrder={sortOrder}
            onClick={onChangeSort}
          />
        </tr>
      </thead>
      <tbody>
        {data.map((tokenDiff) => (
          <DiffRow
            key={`${tokenDiff.type}-${tokenDiff.name}`}
            tokenDiff={tokenDiff}
            isMobileLayout={isMobileLayout}
          />
        ))}
      </tbody>
    </table>
  );
}

const DiffHeader = (props: {
  col: DiffColumnsSort;
  activeSortCol: DiffColumnsSort;
  activeSortOrder: SortOrder;
  small?: boolean;
  className?: string;
  onClick: (col: DiffColumnsSort) => void;
}) => {
  const text = COLUMN_LABELS[props.col];
  const isActive = props.activeSortCol === props.col;
  const isAsc = props.activeSortOrder === 'asc';

  return (
    <th
      onClick={() => props.onClick(props.col)}
      className={cx(
        props.className,
        'group cursor-pointer transition-colors hover:text-accent-400',
        props.small && 'w-28',
        isActive && 'text-accent-500'
      )}
    >
      <span className="">{text}</span>
      {isActive ? (
        <Icon
          className="inline-block ml-1 translate-y-[-2px]"
          path={isAsc ? mdiTriangle : mdiTriangleDown}
          size={0.5}
        />
      ) : undefined}
    </th>
  );
};

const DiffRow = ({
  tokenDiff,
  isMobileLayout,
}: {
  tokenDiff: PromptDiffEntry;
  isMobileLayout: boolean;
}) => {
  return (
    <tr
      className={cx(
        'alternateRow hover:bg-interactive-light/50 hover:dark:bg-interactive-dark/20',
        isMobileLayout && 'flex flex-col p-2'
      )}
    >
      <td
        className={cx(
          'py-1 font-mono',
          isMobileLayout ? 'block' : 'text-center'
        )}
      >
        <MobileLabel isMobileLayout={isMobileLayout} col="change" />
        <TokenDelta tokenDiff={tokenDiff} />
      </td>
      <td className={cx('font-mono', isMobileLayout ? 'block' : 'text-center')}>
        <MobileLabel isMobileLayout={isMobileLayout} col="before" />
        <WeightValue value={tokenDiff.weightA} otherValue={tokenDiff.weightB} />
      </td>
      <td className={cx('font-mono', isMobileLayout ? 'block' : 'text-center')}>
        <MobileLabel isMobileLayout={isMobileLayout} col="after" />
        <WeightValue value={tokenDiff.weightB} otherValue={tokenDiff.weightA} />
      </td>
      <th className={isMobileLayout ? 'order-[-1]' : 'px-4'} scope="row">
        <MobileLabel isMobileLayout={isMobileLayout} col="token" />
        <TokenTextContent
          name={tokenDiff.name}
          type={tokenDiff.type}
          weight={tokenDiff.weightA || 1}
          hideWeights
        />
      </th>
    </tr>
  );
};

const MobileLabel = ({
  col,
  isMobileLayout,
}: {
  col: DiffColumnsSort;
  isMobileLayout: boolean;
}) => {
  const text = COLUMN_LABELS[col];
  return isMobileLayout ? (
    <span className="inline-block mr-2">{text}:</span>
  ) : undefined;
};

const WeightValue = ({
  value,
  otherValue,
}: {
  value: number | undefined;
  otherValue: number | undefined;
}) => {
  const txt = value?.toFixed(2) || '-';
  const isSmaller = value === undefined || (otherValue && otherValue > value);
  return <span className={cx(isSmaller ? '' : 'text-sky-500')}>{txt}</span>;
};

function TokenDelta({ tokenDiff }: { tokenDiff: PromptDiffEntry }) {
  const delta = stringifyDiffDelta(tokenDiff);

  if (delta === 'added') {
    return <span className="text-green-500">Added</span>;
  }
  if (delta === 'removed') {
    return <span className="text-red-500">Removed</span>;
  }
  if (delta === '-') {
    return '-';
  }

  // show number
  const sign = delta > 0 ? '+' : ''; // negative val. already has own sign
  return (
    <span
      className={cx(delta > 0 && 'text-green-500', delta < 0 && 'text-red-500')}
    >
      {sign}
      {delta === 0.0 ? '-' : delta.toFixed(2)}
    </span>
  );
}
