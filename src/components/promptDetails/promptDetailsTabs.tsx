import { TabDef, Tabs } from 'components';
import { DetailsTab } from 'pages/editor/types';
import React from 'react';

export const PromptDetailsTabs = ({
  id,
  tokenCount,
  messagesCount,
  activeTab,
  onTabSwitch,
  className,
}: {
  id: string;
  tokenCount: number | undefined;
  messagesCount: number | undefined;
  activeTab: DetailsTab;
  onTabSwitch: (nextTab: DetailsTab) => void;
  className?: string;
}) => {
  const tokensPill = tokenCount ? ` (${tokenCount})` : '';
  const messagesPill = messagesCount ? ` (${messagesCount})` : '';

  const TABS: Array<TabDef<DetailsTab>> = [
    { id: 'list', label: 'list' },
    { id: 'ast', label: 'ast' },
    { id: 'tokens', label: `tokens${tokensPill}` },
    { id: 'messages', label: `messages${messagesPill}` },
  ];

  return (
    <Tabs
      id={id}
      activeTab={activeTab}
      tabs={TABS}
      onTabSwitch={onTabSwitch}
      className={className}
    />
  );
};
