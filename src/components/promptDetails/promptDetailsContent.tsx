import React from 'react';
import {
  DetailsTab,
  EMPTY_GROUP_PARSING_RESULT,
  GroupParsingResult,
} from '../../pages/editor/types';
import {
  AstListRenderer,
  AstRenderer,
  ParsingMessages,
  TokensList,
} from 'components/promptDetails';

interface Props {
  activeTab: DetailsTab;
  data: GroupParsingResult | undefined;
}

// TODO <TokensList insertBreak /> to auto add BREAK?
// TODO add optimize feature that removes duplicates? And flattens the prompt?
export const PromptDetailsContent = ({ activeTab, data }: Props) => {
  data = data || EMPTY_GROUP_PARSING_RESULT;

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
