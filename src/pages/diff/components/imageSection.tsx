import React from 'react';
import cx from 'classnames';
import { PromptImage } from './imageSelector';
import { SectionHeader } from './text';
import { Bold, Title } from './text';
import { formatBytes } from 'utils';
import { PromptInput } from 'components/promptInput';
import { CopyToClipboardBtn } from 'components';

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
    <div className="">
      <Title>Image</Title>
      <p className="mb-6 text-base ">
        Image <Bold quotes>{name}</Bold> with type <Bold quotes>{type}</Bold>,
        and size <Bold>{formatBytes(size, 2)}</Bold>. {sizeStr}
      </p>

      <ImagePrompt
        id="prompt-positive"
        sectionName="Positive Prompt"
        prompt={image.aiParams.positivePrompt}
      />

      <ImagePrompt
        id="prompt-negative"
        sectionName="Negative Prompt"
        prompt={image.aiParams.negativePrompt}
      />

      <SectionHeader>Model settings</SectionHeader>
      <div className="grid grid-cols-2">
        {settingKeys.map((key, idx) => {
          const bgGrey = idx % 2 === 0;
          return (
            <React.Fragment key={key}>
              <div className={cx('px-2 py-1', bgGrey ? 'bg-gray-200' : '')}>
                {key}
              </div>
              <div className={cx('px-2 py-1', bgGrey ? 'bg-gray-200' : '')}>
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

const ImagePrompt = ({
  id,
  prompt,
  sectionName,
}: {
  id: string;
  prompt: string;
  sectionName: string;
}) => {
  return (
    <>
      <SectionHeader actions={<CopyToClipboardBtn id={id} textRef={prompt} />}>
        {sectionName}
      </SectionHeader>
      <PromptInput
        initialPrompt={prompt}
        onPromptChanged={() => undefined}
        className="mb-8"
        withBorder
        disabled
      />
    </>
  );
};
