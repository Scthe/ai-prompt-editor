import React, { useCallback, useRef } from 'react';
import { CARD_SHADOW_GRAY, Card, CardContent } from 'components';
import { ParsePromptFn } from 'hooks/useParsedPrompt';
import { PromptInputToolbar } from './promptInputToolbar';
import { PromptInput } from 'components/promptInput';
import { EditorGroup } from '../types';

interface Props {
  group: EditorGroup;
  parsePrompt: ParsePromptFn;
}

export const PromptInputCard = ({ group, parsePrompt }: Props) => {
  const { initialPrompt } = group;
  const currentPromptRef = useRef<string>(initialPrompt);

  const onPromptChanged = useCallback(
    (text: string) => {
      currentPromptRef.current = text;
      parsePrompt(text);
    },
    [parsePrompt]
  );

  return (
    <Card
      shadowDirection="left"
      className="h-fit"
      borderTopOnMobile
      shadowColor={group.enabled ? undefined : CARD_SHADOW_GRAY}
    >
      <PromptInputToolbar group={group} currentPromptRef={currentPromptRef} />
      <CardContent>
        <PromptInput
          initialPrompt={initialPrompt}
          onPromptChanged={onPromptChanged}
        />
      </CardContent>
    </Card>
  );
};
