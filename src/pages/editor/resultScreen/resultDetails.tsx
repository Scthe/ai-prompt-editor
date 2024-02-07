import React, { useState } from 'react';
import { Card, CardContent, CardToolbar } from 'components';
import PromptLoader from 'components/loaders';
import { PromptDetailsContent } from 'components/promptDetails/promptDetailsContent';
import { PromptDetailsTabs } from 'components/promptDetails/promptDetailsTabs';
import { GroupParsingResult, DetailsTab } from '../types';

interface Props {
  isParsing: boolean;
  data: GroupParsingResult | undefined;
}

export const ResultDetails = ({ data, isParsing }: Props) => {
  const [tab, setTab] = useState<DetailsTab>('list');
  const isLoading = isParsing || !data;

  return (
    <Card shadowDirection="top" className="h-fit" borderTopOnMobile>
      {isLoading ? <PromptLoader /> : undefined}

      <CardToolbar>
        <PromptDetailsTabs
          id="result-details-tabs"
          tokenCount={data?.tokens.length}
          messagesCount={data?.messages.length}
          activeTab={tab}
          onTabSwitch={setTab}
        />
      </CardToolbar>

      <CardContent isAlwaysFullWidth>
        <PromptDetailsContent activeTab={tab} data={data} />
      </CardContent>
    </Card>
  );
};
