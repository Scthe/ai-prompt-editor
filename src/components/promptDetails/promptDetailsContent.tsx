import React from 'react';
import { DetailsTab, GroupParsingResult } from '../../pages/editor/types';
import {
  AstListRenderer,
  AstRenderer,
  ParsingMessages,
  TokensList,
} from 'components/promptDetails';

interface Props {
  activeTab: DetailsTab;
  data: GroupParsingResult;
}

// TODO <TokensList insertBreak /> to auto add BREAK?
// TODO add optimize feature that removes duplicates? And flattens the prompt?
export const PromptDetailsContent = ({ activeTab, data }: Props) => {
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
