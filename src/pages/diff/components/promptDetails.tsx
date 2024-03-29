import React, { useState } from 'react';
import { Title } from './text';
import {
  DetailsTab,
  PromptDetailsContent,
  PromptDetailsTabs,
} from 'components/promptDetails';
import { EMPTY_PARSING_RESULT, ParsingResult } from 'parser';
import { DiffTab } from './resultCard';

interface Props {
  diffTab: DiffTab;
  parsingResult: ParsingResult | undefined;
}

export const PromptDetails = ({ diffTab, parsingResult }: Props) => {
  const [tab, setTab] = useState<DetailsTab>('list');

  if (!prompt) return;

  parsingResult = parsingResult || EMPTY_PARSING_RESULT;

  return (
    <div>
      <Title>Text prompt</Title>

      {/* Tabs inside tabs. Sometimes my genius is almost frightening. */}
      <PromptDetailsTabs
        id={`diff-prompt-details-${diffTab}`}
        parsingResult={parsingResult}
        activeTab={tab}
        onTabSwitch={setTab}
        className="mb-8"
      />

      <PromptDetailsContent activeTab={tab} parsingResult={parsingResult} />
    </div>
  );
};
