import React from 'react';
import cx from 'classnames';
import LoadingPrompt from '../loaders';
import { GptToken } from 'utils/gpt4Tokenizer';

const COLORS = [
  'bg-red-400',
  'bg-lime-400',
  'bg-amber-400',
  'bg-cyan-400',
  'bg-violet-400',
];

interface Props {
  tokens: GptToken[];
  isLoading: boolean;
}

export function TokensList({ isLoading, tokens }: Props) {
  if (isLoading) {
    return <LoadingPrompt />;
  }

  return (
    <div>
      {tokens.length === 0 ? 'Prompt is empty' : undefined}
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
        `${color} inline-block px-1 mb-1 text-zinc-900 relative hover:bg-white cursor-pointer`,
        `hover:before:content-[attr(gpt4token)] before:absolute before:bottom-full before:left-0 before:bg-white hover:before:p-1`
      )}
      // title={`GPT-4 token: ${token.token}`}
    >
      {token.text}
    </span>
  );
};
