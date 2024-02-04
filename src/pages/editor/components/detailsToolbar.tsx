import { CardToolbar, TabDef, Tabs } from 'components';
import React from 'react';
import { DetailsTab } from '../types';

export const DetailsToolbar = ({
  tokenCount,
  messagesCount,
  activeTab,
  onTabSwitch,
}: {
  tokenCount: number | undefined;
  messagesCount: number | undefined;
  activeTab: DetailsTab;
  onTabSwitch: (nextTab: DetailsTab) => void;
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
    <CardToolbar>
      <Tabs activeTab={activeTab} tabs={TABS} onTabSwitch={onTabSwitch} />
    </CardToolbar>
  );
};
