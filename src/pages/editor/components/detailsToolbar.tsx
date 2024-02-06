import { CardToolbar } from 'components';
import React from 'react';
import { DetailsTab } from '../types';
import { PromptDetailsTabs } from 'components/promptDetails/promptDetailsTabs';

export const DetailsToolbar = ({
  groupId,
  tokenCount,
  messagesCount,
  activeTab,
  onTabSwitch,
}: {
  groupId: string;
  tokenCount: number | undefined;
  messagesCount: number | undefined;
  activeTab: DetailsTab;
  onTabSwitch: (nextTab: DetailsTab) => void;
}) => {
  return (
    <CardToolbar>
      <PromptDetailsTabs
        id={`group-${groupId}-details-tabs`}
        tokenCount={tokenCount}
        messagesCount={messagesCount}
        activeTab={activeTab}
        onTabSwitch={onTabSwitch}
      />
    </CardToolbar>
  );
};
