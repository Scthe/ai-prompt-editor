import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { DiffColumnsSort } from 'pages/diff/types';
import { SortOrder, oppositeSortOrder } from 'utils';
import { SORTERS } from 'parser/diff/sort';
import { PromptDiff, PromptDiffEntry, stringifyDiffDelta } from 'parser';
import { TokenTextContent } from './internal/tokenTextContent';
import { useIsTailwindScreenBreakpoint } from 'hooks/useTailwindConfig';
import {
  Table,
  TableHeaderRow,
  TableMobileLabel,
  TableRow,
  TableSortIcons,
} from 'components';

const COLUMN_LABELS: Record<DiffColumnsSort, string> = {
  change: 'Change',
  before: 'Before',
  after: 'After',
  token: 'Token',
};

// TODO cannot sort on mobile
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
    <Table
      id="diff-table"
      caption="Comparison between before and after prompts"
      className="w-full text-left whitespace-no-wrap table-fixed"
    >
      <TableHeaderRow className={cx('text-center', isMobileLayout && 'hidden')}>
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
      </TableHeaderRow>
      <tbody>
        {data.map((tokenDiff) => (
          <DiffRow
            key={`${tokenDiff.type}-${tokenDiff.name}`}
            tokenDiff={tokenDiff}
            isMobileLayout={isMobileLayout}
          />
        ))}
      </tbody>
    </Table>
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
      <span>{text}</span>
      <TableSortIcons isVisible={isActive} order={props.activeSortOrder} />
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
    <TableRow isMobileLayout={isMobileLayout}>
      <td className={cx('font-mono', isMobileLayout ? 'block' : 'text-center')}>
        <TableMobileLabel
          isMobileLayout={isMobileLayout}
          label={COLUMN_LABELS.change}
        />
        <TokenDelta tokenDiff={tokenDiff} />
      </td>
      <td className={cx('font-mono', isMobileLayout ? 'block' : 'text-center')}>
        <TableMobileLabel
          isMobileLayout={isMobileLayout}
          label={COLUMN_LABELS.before}
        />
        <WeightValue value={tokenDiff.weightA} />
      </td>
      <td className={cx('font-mono', isMobileLayout ? 'block' : 'text-center')}>
        <TableMobileLabel
          isMobileLayout={isMobileLayout}
          label={COLUMN_LABELS.after}
        />
        <WeightValue value={tokenDiff.weightB} />
      </td>
      <th
        className={cx('py-2', isMobileLayout ? 'order-[-1]' : 'px-4')}
        scope="row"
      >
        <TokenTextContent
          name={tokenDiff.name}
          type={tokenDiff.type}
          weight={tokenDiff.weightA || 1}
          hideWeights
        />
      </th>
    </TableRow>
  );
};

const WeightValue = ({ value }: { value: number | undefined }) => {
  const txt = value?.toFixed(2) || '-';
  return <span>{txt}</span>;
};

function TokenDelta({ tokenDiff }: { tokenDiff: PromptDiffEntry }) {
  const delta = stringifyDiffDelta(tokenDiff);

  if (delta === 'added') {
    return <span className="text-green-700 dark:text-green-400">Added</span>;
  }
  if (delta === 'removed') {
    return <span className="text-red-700 dark:text-red-400">Removed</span>;
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
