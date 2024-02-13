import {
  Card,
  CardContent,
  CardContentAnimatedHeight,
  CardToolbar,
  TabDef,
  Tabs,
} from 'components';
import React, { useState } from 'react';
import PromptLoader from 'components/loaders';
import { ResultTabDiff } from './resultTabDiff';
import { ResultTabPrompt } from './resultTabPrompt';
import { DiffInputData } from '../types';

export interface ResultCardProps {
  before: DiffInputData;
  after: DiffInputData;
}

export type DiffTab = 'diff' | 'before' | 'after';

const TABS: Array<TabDef<DiffTab>> = [
  { id: 'diff', label: 'Difference' },
  { id: 'before', label: 'Prompt before' },
  { id: 'after', label: `Prompt after` },
];

export const ResultCard = (props: ResultCardProps) => {
  const { before, after } = props;
  const isLoading = before.isParsing || after.isParsing;

  const [activeTab, setActiveTab] = useState<DiffTab>('diff');

  return (
    <Card shadowDirection="top" className="h-fit" borderTopOnMobile>
      <PromptLoader visible={isLoading} />
      <h2 className="sr-only">Diff between prompt before and after</h2>

      <CardToolbar>
        <Tabs
          id={`diff-tabs`}
          activeTab={activeTab}
          tabs={TABS}
          onTabSwitch={setActiveTab}
          className="mb-8"
        />
      </CardToolbar>

      <CardContentAnimatedHeight triggerKey={activeTab}>
        <CardContent isAlwaysFullWidth>
          <ResultContent {...props} activeTab={activeTab} />
        </CardContent>
      </CardContentAnimatedHeight>
    </Card>
  );
};

const ResultContent = (props: ResultCardProps & { activeTab: DiffTab }) => {
  switch (props.activeTab) {
    case 'diff':
      return <ResultTabDiff {...props} />;
    case 'before':
      return <ResultTabPrompt diffTab={props.activeTab} data={props.before} />;
    case 'after':
      return <ResultTabPrompt diffTab={props.activeTab} data={props.after} />;
  }
};
