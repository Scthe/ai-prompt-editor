import React, { useState } from 'react';
import { DetailsTab, EditorGroup } from '../types';
import { Card, CardContent } from 'components';
import PromptLoader from 'components/loaders';
import { DetailsToolbar } from './detailsToolbar';
import { DetailsContent } from './detailsContent';
import { useGpt4Tokens } from 'hooks/useGpt4Tokens';

interface Props {
  group: EditorGroup;
}

// TODO takes promptGroupId that is uuid of the prompt parsing results?
export const DetailsCard = ({ group }: Props) => {
  const { isParsing, parsedResult } = group;
  const tokens = useGpt4Tokens(parsedResult?.ast);

  const [activeTab, setActiveTab] = useState<DetailsTab>('messages');

  return (
    <Card shadowDirection="right">
      <DetailsToolbar
        tokenCount={tokens.length}
        messagesCount={parsedResult?.messages.length}
        activeTab={activeTab}
        onTabSwitch={setActiveTab}
      />
      {isParsing || !parsedResult ? (
        <PromptLoader />
      ) : (
        <CardContent>
          <DetailsContent
            activeTab={activeTab}
            ast={parsedResult.ast}
            messages={parsedResult.messages}
            tokens={tokens}
          />
        </CardContent>
      )}
    </Card>
  );
};
