import React from 'react';
import cx from 'classnames';
import { EmptyContent } from './internal/emptyContent';
import { ParsingResult, PromptChunk, hasNoChunks } from 'parser';
import { ItemType } from 'utils';

const COLORS = [
  'bg-red-400',
  'bg-lime-400',
  'bg-amber-400',
  'bg-cyan-400',
  'bg-violet-400',
];

interface Props {
  parsingResult: ParsingResult;
  hideBreak?: boolean;
}

// TODO add 'what is this' help dialog. Add this to all tabs.
export function TokensList({ parsingResult, hideBreak }: Props) {
  const { tokenChunks } = parsingResult;

  if (hasNoChunks(tokenChunks)) {
    return <EmptyContent />;
  }

  return (
    <div>
      {tokenChunks.map((chunk, idx) => (
        <Chunk key={idx} idx={idx} chunk={chunk} hideBreak={hideBreak} />
      ))}
    </div>
  );
}

const Chunk = ({
  idx,
  chunk,
  hideBreak,
}: {
  chunk: PromptChunk;
  idx: number;
  hideBreak?: boolean;
}) => {
  return (
    <>
      {!hideBreak && idx > 0 ? (
        <p
          className={cx(
            'my-2 text-center relative',
            'before:absolute before:top-[11px] before:left-0 before:w-full before:border-b before:border-gray-300'
          )}
        >
          <span className="relative px-5 bg-white">BREAK</span>
        </p>
      ) : undefined}
      <ul role="list">
        {chunk.map((token, idx) => (
          <TokenStr key={idx} idx={idx} tokenObj={token} />
        ))}
      </ul>
    </>
  );
};

const TokenStr = ({
  idx,
  tokenObj,
}: {
  tokenObj: ItemType<PromptChunk>;
  idx: number;
}) => {
  const { token, text } = tokenObj;
  const color = COLORS[idx % COLORS.length];
  const attribs = { cliptoken: token };

  return (
    <li
      {...attribs}
      className={cx(
        `${color} inline-block px-1 mb-1 text-zinc-900 relative hover:bg-gray-200 cursor-pointer`,
        `hover:before:content-[attr(cliptoken)] before:absolute before:bottom-full before:left-0 before:bg-gray-200 hover:before:p-1`
      )}
    >
      {text}
    </li>
  );
};
