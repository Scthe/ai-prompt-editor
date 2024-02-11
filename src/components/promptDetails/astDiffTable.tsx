import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { DiffColumnsSort } from 'pages/diff/types';
import { SortOrder, oppositeSortOrder } from 'utils';
import { mdiTriangle, mdiTriangleDown } from '@mdi/js';
import Icon from '@mdi/react';
import { SORTERS } from 'parser/diff/sort';
import { PromptDiff, PromptDiffEntry, stringifyDiffDelta } from 'parser';
import { TokenTextContent } from './internal/tokenTextContent';

export function AstDiffTable({ tokenDiffs }: { tokenDiffs: PromptDiff }) {
  const [sortCol, setSortCol] = useState<DiffColumnsSort>('token');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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
    <table className="w-full text-left whitespace-no-wrap table-fixed ">
      <thead>
        <tr className="text-center bg-zinc-100 text-zinc-800">
          <DiffHeader
            text="Change"
            col="change"
            small
            className="py-2"
            activeSortCol={sortCol}
            activeSortOrder={sortOrder}
            onClick={onChangeSort}
          />
          <DiffHeader
            text="Before"
            col="before"
            small
            activeSortCol={sortCol}
            activeSortOrder={sortOrder}
            onClick={onChangeSort}
          />
          <DiffHeader
            text="After"
            col="after"
            small
            activeSortCol={sortCol}
            activeSortOrder={sortOrder}
            onClick={onChangeSort}
          />
          <DiffHeader
            text="Token"
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
          />
        ))}
      </tbody>
    </table>
  );
}

// TODO a11y
const DiffHeader = (props: {
  text: string;
  col: DiffColumnsSort;
  activeSortCol: DiffColumnsSort;
  activeSortOrder: SortOrder;
  small?: boolean;
  className?: string;
  onClick: (col: DiffColumnsSort) => void;
}) => {
  const isActive = props.activeSortCol === props.col;
  const isAsc = props.activeSortOrder === 'asc';

  return (
    <th
      onClick={() => props.onClick(props.col)}
      className={cx(
        props.className,
        'group cursor-pointer transition-colors hover:text-sky-400',
        props.small && 'w-28',
        isActive && 'text-sky-500'
      )}
    >
      <span className="">{props.text}</span>
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

const DiffRow = ({ tokenDiff }: { tokenDiff: PromptDiffEntry }) => {
  return (
    <tr className="alternateRow hover:bg-sky-100">
      <td className="py-1 font-mono text-center">
        <TokenDelta tokenDiff={tokenDiff} />
      </td>
      <td className="font-mono text-center">
        <WeightValue value={tokenDiff.weightA} otherValue={tokenDiff.weightB} />
      </td>
      <td className="font-mono text-center">
        <WeightValue value={tokenDiff.weightB} otherValue={tokenDiff.weightA} />
      </td>
      <td className="px-4">
        <TokenTextContent
          name={tokenDiff.name}
          type={tokenDiff.type}
          weight={tokenDiff.weightA || 1}
          hideWeights
        />
      </td>
    </tr>
  );
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
