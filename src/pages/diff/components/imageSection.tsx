import React from 'react';
import { PromptImage } from './imageSelector';
import { SectionHeader } from './text';
import { Bold, Title } from './text';
import { formatBytes } from 'utils';
import { PromptInput } from 'components/promptInput';

interface Props {
  image?: PromptImage;
}

export const ImageSection = ({ image }: Props) => {
  if (!image) return undefined;

  const { name, type, size, width, height } = image;
  let sizeStr = undefined;
  if (width !== undefined && height !== undefined) {
    sizeStr = (
      <span>
        It has dimensions{' '}
        <Bold>
          {width}x{height} px
        </Bold>
        .
      </span>
    );
  }

  const settings = image.aiParams.settings;
  const settingKeys = Object.keys(settings).sort();

  return (
    <div>
      <Title>Image</Title>
      <p className="mb-6 text-base text-gray-700">
        Image <Bold quotes>{name}</Bold> with type <Bold quotes>{type}</Bold>,
        and size <Bold>{formatBytes(size, 2)}</Bold>. {sizeStr}
      </p>

      {/* TODO copy to clipboard? */}
      <SectionHeader>Positive Prompt</SectionHeader>
      <PromptInput
        initialPrompt={image.aiParams.positivePrompt}
        onPromptChanged={() => undefined}
        className="mb-4"
        withBorder
        disabled
      />

      {/* TODO copy to clipboard? */}
      <SectionHeader>Negative Prompt</SectionHeader>
      <PromptInput
        initialPrompt={image.aiParams.negativePrompt}
        onPromptChanged={() => undefined}
        className="mb-4"
        withBorder
        disabled
      />

      <SectionHeader>Model settings</SectionHeader>
      <div className="grid grid-cols-2">
        {settingKeys.map((key, idx) => {
          const isOddRow = Boolean(idx % 2);
          return (
            <React.Fragment key={key}>
              <div className={isOddRow ? 'bg-gray-200' : ''}>{key}</div>
              <div className={isOddRow ? 'bg-gray-200' : ''}>
                {settings[key]}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* <Debug data={image} /> */}
    </div>
  );
};
