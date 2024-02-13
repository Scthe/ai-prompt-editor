import React from 'react';
import { DiffTab } from './resultCard';
import { ImageSection } from './imageSection';
import { PromptDetails } from './promptDetails';
import cx from 'classnames';
import { DiffInputData } from '../types';
import { EmptyContent } from 'components/promptDetails/internal/emptyContent';

interface Props {
  diffTab: DiffTab;
  data: DiffInputData;
}

export const ResultTabPrompt = ({ diffTab, data }: Props) => {
  const { image, result } = data;

  if (!image && result?.tokenCount === 0) {
    return <EmptyContent />;
  }

  return (
    <div className="max-w-screen-md px-2 pb-10 mx-auto text-gray-700">
      {/* key, cause <Prompt> can be.. resistant to changes */}
      <ImageSection key={diffTab} image={image} />

      {/* spacer if needed */}
      <div className={cx(image && result ? 'mb-16' : '')}></div>

      <PromptDetails diffTab={diffTab} parsingResult={result} />
    </div>
  );
};
