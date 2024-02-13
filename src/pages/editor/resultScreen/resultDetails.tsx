import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardContentAnimatedHeight,
  CardToolbar,
} from 'components';
import PromptLoader from 'components/loaders';
import {
  PromptDetailsTabs,
  PromptDetailsContent,
  DetailsTab,
} from 'components/promptDetails';
import { EMPTY_PARSING_RESULT, ParsingResult } from 'parser';

interface Props {
  isParsing: boolean;
  parsingResult: ParsingResult | undefined;
}

export const ResultDetails = ({ parsingResult, isParsing }: Props) => {
  const [tab, setTab] = useState<DetailsTab>('list');
  const isLoading = isParsing || !parsingResult;

  parsingResult = parsingResult || EMPTY_PARSING_RESULT;

  return (
    <Card shadowDirection="top" className="h-fit" borderTopOnMobile>
      <PromptLoader visible={isLoading} />
      <h2 className="sr-only">Details for the final prompt</h2>

      <CardToolbar>
        <PromptDetailsTabs
          id="result-details-tabs"
          parsingResult={parsingResult}
          activeTab={tab}
          onTabSwitch={setTab}
        />
      </CardToolbar>

      <CardContentAnimatedHeight triggerKey={tab}>
        <CardContent isAlwaysFullWidth>
          <PromptDetailsContent activeTab={tab} parsingResult={parsingResult} />
        </CardContent>
      </CardContentAnimatedHeight>
    </Card>
  );
};
