import React from 'react';
import { CARD_SHADOW_GRAY, Card, CardContent } from 'components';
import { ParsePromptFn } from 'hooks/useParsedPrompt';
import { PromptInputToolbar } from './promptInputToolbar';
import { PromptInput, usePromptTextRef } from 'components/promptInput';
import { EditorGroup } from '../types';

interface Props {
  group: EditorGroup;
  parsePrompt: ParsePromptFn;
}

export const PromptInputCard = ({ group, parsePrompt }: Props) => {
  const { initialPrompt } = group;
  const promptTextRef = usePromptTextRef();

  return (
    <Card
      shadowDirection="left"
      className="h-fit"
      borderTopOnMobile
      shadowColor={group.enabled ? undefined : CARD_SHADOW_GRAY}
    >
      <PromptInputToolbar group={group} promptTextRef={promptTextRef} />
      <CardContent>
        <PromptInput
          initialPrompt={initialPrompt}
          onPromptChanged={parsePrompt}
          textRef={promptTextRef}
        />
      </CardContent>
    </Card>
  );
};
