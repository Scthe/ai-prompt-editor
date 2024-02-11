import React, { useState } from 'react';
import { Card, CardContent, CardToolbar } from 'components';
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
      {isLoading ? <PromptLoader /> : undefined}

      <CardToolbar>
        <PromptDetailsTabs
          id="result-details-tabs"
          parsingResult={parsingResult}
          activeTab={tab}
          onTabSwitch={setTab}
        />
      </CardToolbar>

      <CardContent isAlwaysFullWidth>
        <PromptDetailsContent activeTab={tab} parsingResult={parsingResult} />
      </CardContent>
    </Card>
  );
};
