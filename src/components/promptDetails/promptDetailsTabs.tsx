import { TabDef, Tabs } from 'components';
import { ParsingResult } from 'parser';
import React from 'react';

export type DetailsTab = 'list' | 'ast' | 'tokens' | 'messages';

// TODO add 'variants' tab? For alternate/scheduled

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
  const hasError = parsingResult.messages.some((e) => e.level === 'error');

  const TABS: Array<TabDef<DetailsTab>> = [
    { id: 'list', label: 'List' },
    { id: 'ast', label: 'AST' },
    { id: 'tokens', label: `Tokens${tokensPill}` },
    {
      id: 'messages',
      label: `Messages${messagesPill}`,
      className: hasError ? 'text-red-600' : '',
    },
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
