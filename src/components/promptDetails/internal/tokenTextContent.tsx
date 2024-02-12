import React from 'react';
import {
  RenderablePromptItem,
  getNetworkText,
  isRenderableNetwork,
} from 'parser';

export type Props = RenderablePromptItem & {
  hideWeights?: boolean;
  weight: undefined | RenderablePromptItem['weight'];
};

export const TokenTextContent = (props: Props) => {
  const { name, weight, hideWeights } = props;
  const hideWeights2 = hideWeights || weight === undefined;

  if (isRenderableNetwork(props)) {
    return (
      <span className="text-lora">{getNetworkText(props, !hideWeights2)}</span>
    );
  }

  return (
    <>
      {name}
      {hideWeights2 ? undefined : (
        <span className={'inline-block ml-1 text-indigo-500'}>
          {`:${weight.toFixed(2)}`}
        </span>
      )}
    </>
  );
};
