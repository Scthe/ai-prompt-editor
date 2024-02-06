import React from 'react';
import cx from 'classnames';
import { GptToken } from 'utils/gpt4Tokenizer';
import { EmptyContent } from './emptyContent';

const COLORS = [
  'bg-red-400',
  'bg-lime-400',
  'bg-amber-400',
  'bg-cyan-400',
  'bg-violet-400',
];

interface Props {
  tokens: GptToken[];
}

// TODO add 'what is this' help dialog. Add this to all tabs.
export function TokensList({ tokens }: Props) {
  if (tokens.length === 0) {
    return <EmptyContent />;
  }

  return (
    <div>
      {tokens.map((token, idx) => (
        <TokenStr key={idx} idx={idx} token={token} />
      ))}
    </div>
  );
}

const TokenStr = ({ idx, token }: { token: GptToken; idx: number }) => {
  const color = COLORS[idx % COLORS.length];
  const attribs = { gpt4token: token.token };

  return (
    <span
      {...attribs}
      className={cx(
        `${color} inline-block px-1 mb-1 text-zinc-900 relative hover:bg-gray-200 cursor-pointer`,
        `hover:before:content-[attr(gpt4token)] before:absolute before:bottom-full before:left-0 before:bg-gray-200 hover:before:p-1`
      )}
      // title={`GPT-4 token: ${token.token}`}
    >
      {token.text}
    </span>
  );
};
