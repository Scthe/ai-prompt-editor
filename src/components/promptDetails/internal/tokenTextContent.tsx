import React from 'react';
import {
  RenderablePromptItem,
  getNetworkText,
  isRenderableNetwork,
} from 'parser';

export type Props = RenderablePromptItem & {
  hideWeights?: boolean;
};

export const TokenTextContent = (props: Props) => {
  const { name, weight, hideWeights } = props;

  if (isRenderableNetwork(props)) {
    return (
      <span className="text-lora">{getNetworkText(props, !hideWeights)}</span>
    );
  }

  return (
    <>
      {name}
      {hideWeights ? undefined : (
        <span className={'inline-block ml-1 text-indigo-500'}>
          {`:${weight.toFixed(2)}`}
        </span>
      )}
    </>
  );
};
