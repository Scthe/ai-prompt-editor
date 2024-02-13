import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const promptTextRef = usePromptTextRef();

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef, // used for drag handle
    transform,
    transition,
  } = useSortable({ id: group.id });
  const style: CSSProperties = {
    opacity: isDragging ? 0.7 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Card
      shadowDirection="left"
      className="h-fit"
      borderTopOnMobile
      shadowColor={group.enabled ? undefined : CARD_SHADOW_GRAY}
      wrapperRef={setNodeRef}
      style={style}
    >
      <PromptInputToolbar
        group={group}
        promptTextRef={promptTextRef}
        dragHandleProps={{
          attributes,
          listeners,
          dragHandleRef: setActivatorNodeRef,
        }}
      />
      <CardContent>
        <PromptInput
          initialPrompt={group.initialPrompt}
          onPromptChanged={parsePrompt}
          textRef={promptTextRef}
          ariaLabel={`Prompt for group ${group.name}`}
        />
      </CardContent>
    </Card>
  );
};
