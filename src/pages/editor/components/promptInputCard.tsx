import React from 'react';
import { Card, CardContent } from 'components';
import { ParsePromptFn } from 'hooks/useParsedPrompt';
import { PromptInputToolbar } from './promptInputToolbar';
import { PromptInput } from 'components/prompt';

interface Props {
  name: string;
  initialPrompt: string;
  parsePrompt: ParsePromptFn;
}

export const PromptInputCard = ({
  name,
  initialPrompt,
  parsePrompt,
}: Props) => {
  return (
    <Card shadowDirection="left" className="h-fit" borderTopOnMobile>
      <PromptInputToolbar name={name} />
      <CardContent>
        <PromptInput
          initialPrompt={initialPrompt}
          onPromptChanged={parsePrompt}
        />
      </CardContent>
    </Card>
  );
};
