import React from 'react';
import cx from 'classnames';
import { ParsingMessage } from '../../parser';
import { EmptyContent } from './emptyContent';

export function ParsingMessages({ messages }: { messages: ParsingMessage[] }) {
  if (messages.length === 0) {
    return <EmptyContent text="Everything seems OK" />;
  }

  return (
    <ul role="list" className={cx()}>
      {messages.map((msg, idx) => (
        <Msg key={idx} msg={msg} />
      ))}
    </ul>
  );
}

const Msg = ({ msg }: { msg: ParsingMessage }) => {
  // 'p-8 text-zinc-900',
  // hasError ? 'bg-red-500' : 'bg-amber-500'
  const isErr = msg.level === 'error';
  return (
    <li className="py-1 alternateRow">
      <span
        className={cx(
          'inline-block mr-1 underline uppercase px-2',
          isErr ? 'text-red-500' : 'text-amber-500'
        )}
      >
        [{msg.level}]
      </span>
      {msg.text}
    </li>
  );
};
