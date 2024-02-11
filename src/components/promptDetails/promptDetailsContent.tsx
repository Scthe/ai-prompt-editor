import React from 'react';
import {
  PromptAsList,
  AstRenderer,
  ParsingMessages,
  TokensList,
  DetailsTab,
} from 'components/promptDetails';
import { ParsingResult } from 'parser';

interface Props {
  activeTab: DetailsTab;
  parsingResult: ParsingResult;
}

// TODO add optimize feature that removes duplicates? And flattens the prompt?
export const PromptDetailsContent = ({ activeTab, parsingResult }: Props) => {
  switch (activeTab) {
    case 'list':
      return <PromptAsList parsingResult={parsingResult} />;
    case 'ast':
      return <AstRenderer astGroup={parsingResult.ast} />;
    case 'messages':
      return <ParsingMessages messages={parsingResult.messages} />;
    case 'tokens':
      return <TokensList parsingResult={parsingResult} />;
  }
};
