import {
  Card,
  CardContent,
  CardContentAnimatedHeight,
  CardToolbar,
  TabDef,
  Tabs,
} from 'components';
import React, { useEffect, useState } from 'react';
import PromptLoader from 'components/loaders';
import { ResultTabDiff } from './resultTabDiff';
import { ResultTabPrompt } from './resultTabPrompt';
import { DiffInputData } from '../types';
import { ResultTabImageModels } from './resultTabImageModels';

export interface ResultCardProps {
  before: DiffInputData;
  after: DiffInputData;
}

export type DiffTab = 'diff' | 'images' | 'before' | 'after';

const TABS: Array<TabDef<DiffTab>> = [
  { id: 'diff', label: 'Difference' },
  { id: 'before', label: 'Prompt before' },
  { id: 'after', label: `Prompt after` },
];
const TAB_IMAGES: TabDef<DiffTab> = { id: 'images', label: 'Models' };

export const ResultCard = (props: ResultCardProps) => {
  const { before, after } = props;
  const isLoading = before.isParsing || after.isParsing;

  const [activeTab, setActiveTab] = useState<DiffTab>('diff');

  const tabs = [...TABS];
  const bothInputsHaveImage =
    before.image !== undefined && after.image !== undefined;
  if (bothInputsHaveImage) {
    tabs.splice(1, 0, TAB_IMAGES);
  }

  useEffect(() => {
    if (activeTab === 'images' && !bothInputsHaveImage) {
      setActiveTab('diff');
    }
  }, [activeTab, bothInputsHaveImage]);

  return (
    <Card shadowDirection="top" className="h-fit" borderTopOnMobile>
      <PromptLoader visible={isLoading} />

      <CardToolbar>
        <Tabs
          id={`diff-tabs`}
          activeTab={activeTab}
          tabs={tabs}
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
    case 'before':
      return <ResultTabPrompt diffTab={props.activeTab} data={props.before} />;
    case 'after':
      return <ResultTabPrompt diffTab={props.activeTab} data={props.after} />;
    case 'images':
      return <ResultTabImageModels before={props.before} after={props.after} />;
    default:
    case 'diff':
      return <ResultTabDiff {...props} />;
  }
};
