import React from 'react';
import cx from 'classnames';
import { PromptAstTokenDiff } from '../../parser';
import { getAsLoraElement } from './astNode';

export function AstDiffTable({
  tokenDiffs,
}: {
  tokenDiffs: PromptAstTokenDiff[];
}) {
  return (
    <table className="w-full text-left whitespace-no-wrap table-fixed ">
      <thead>
        <tr className="text-center bg-zinc-100 text-zinc-800 &_first:bg-red-500">
          <th className="py-2 w-28 ">Prompt A</th>
          <th className="w-28 ">Prompt B</th>
          <th className="px-4 text-left">Token</th>
        </tr>
      </thead>
      <tbody>
        {tokenDiffs.map((tokenDiff) => (
          <DiffRow
            key={`${tokenDiff.token.value}-${tokenDiff.token.isLora}`}
            tokenDiff={tokenDiff}
          />
        ))}
      </tbody>
    </table>
  );
}

const DiffRow = ({ tokenDiff }: { tokenDiff: PromptAstTokenDiff }) => {
  const asLora = getAsLoraElement(tokenDiff.token);
  return (
    <tr
      key={`${tokenDiff.token.value}-${tokenDiff.token.isLora}`}
      className="even:bg-zinc-700"
    >
      <td className="text-center">
        <WeightValue value={tokenDiff.valueA} otherValue={tokenDiff.valueB} />
      </td>
      <td className="text-center">
        <WeightValue value={tokenDiff.valueB} otherValue={tokenDiff.valueA} />
      </td>
      <td className="px-4">{asLora ? asLora : tokenDiff.token.value}</td>
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
  return (
    <span
      className={cx('font-mono', isSmaller ? 'text-red-400' : 'text-green-400')}
    >
      {txt}
    </span>
  );
};
