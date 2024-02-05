import React from 'react';
import { DetailsTab, GroupParsingResult } from '../types';
import {
  AstListRenderer,
  AstRenderer,
  ParsingMessages,
  TokensList,
} from 'components/prompt';

interface Props {
  activeTab: DetailsTab;
  data: GroupParsingResult;
}

export const DetailsContent = ({ activeTab, data }: Props) => {
  switch (activeTab) {
    case 'list':
      return <AstListRenderer astGroup={data.ast} />;
    case 'ast':
      return <AstRenderer astGroup={data.ast} />;
    case 'messages':
      return <ParsingMessages messages={data.messages} />;
    case 'tokens':
      return <TokensList tokens={data.tokens} />;
  }
};
