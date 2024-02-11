import React from 'react';
import { DiffTab } from './resultCard';
import { ImageSection } from './imageSection';
import { PromptDetails } from './promptDetails';
import cx from 'classnames';
import { DiffInputData } from '../types';

interface Props {
  activeTab: DiffTab;
  data: DiffInputData;
}

export const ResultTabPrompt = ({ activeTab, data }: Props) => {
  const { image, result } = data;
  return (
    <div className="max-w-screen-md px-2 pb-10 mx-auto text-gray-700">
      {/* key, cause <Prompt> can be.. resistant to changes */}
      <ImageSection key={activeTab} image={image} />

      {/* spacer if needed */}
      <div className={cx(image && result ? 'mb-16' : '')}></div>

      <PromptDetails parsingResult={result} />
    </div>
  );
};
