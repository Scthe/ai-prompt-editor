import React, { useState } from 'react';
import { DetailsTab, GroupParsingResult } from 'pages/editor/types';
import { Title } from './text';
import { PromptDetailsContent } from 'components/promptDetails/promptDetailsContent';
import { PromptDetailsTabs } from 'components/promptDetails/promptDetailsTabs';

interface Props {
  prompt: GroupParsingResult | undefined;
}

export const PromptDetails = ({ prompt }: Props) => {
  const [tab, setTab] = useState<DetailsTab>('list');

  if (!prompt) return;

  return (
    <div>
      <Title>Text prompt</Title>

      {/* Tabs inside tabs. Sometimes my genius is almost frightening. */}
      <PromptDetailsTabs
        id="diff-prompt-details"
        tokenCount={prompt?.tokens.length}
        messagesCount={prompt?.messages.length}
        activeTab={tab}
        onTabSwitch={setTab}
        className="mb-8"
      />

      <PromptDetailsContent activeTab={tab} data={prompt} />
    </div>
  );
};
