import React from 'react';
import cx from 'classnames';
import { ParsingMessage } from 'parser';
import { EmptyContent } from './internal/emptyContent';

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
  const isErr = msg.level === 'error';
  return (
    <li className="flex py-1 text-sm alternateRow">
      <span
        className={cx(
          'inline-block mr-1 underline uppercase px-2',
          isErr ? 'text-red-500' : 'text-amber-500'
        )}
      >
        [{msg.level}]
      </span>
      <p className="inline-block font-mono whitespace-pre-wrap">{msg.text}</p>
    </li>
  );
};
