import React from 'react';
import { DetailsTab, GroupParsingResult } from '../types';
import {
  AstFlattenRenderer,
  AstRenderer,
  ParsingMessages,
  TokensList,
} from 'components/prompt';
import { GptToken } from 'utils/gpt4Tokenizer';

interface Props extends GroupParsingResult {
  tokens: GptToken[];
  activeTab: DetailsTab;
}

export const DetailsContent = ({ activeTab, ast, messages, tokens }: Props) => {
  switch (activeTab) {
    case 'list':
      return <AstFlattenRenderer astGroup={ast} />;
    case 'ast':
      return <AstRenderer astGroup={ast} />;
    case 'messages':
      return <ParsingMessages messages={messages} />;
    case 'tokens':
      return <TokensList isLoading={false} tokens={tokens} />;
  }
};
