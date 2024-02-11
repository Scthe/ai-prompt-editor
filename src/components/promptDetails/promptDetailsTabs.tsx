import { TabDef, Tabs } from 'components';
import { ParsingResult } from 'parser';
import React from 'react';

export type DetailsTab = 'list' | 'ast' | 'tokens' | 'messages';

export const PromptDetailsTabs = ({
  id,
  parsingResult,
  className,
  activeTab,
  onTabSwitch,
}: {
  id: string;
  parsingResult: ParsingResult;
  className?: string;
  activeTab: DetailsTab;
  onTabSwitch: (nextTab: DetailsTab) => void;
}) => {
  const tokenCount = parsingResult.tokenCount;
  const tokensPill = tokenCount ? ` (${tokenCount})` : '';

  const messagesCount = parsingResult.messages.length;
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
