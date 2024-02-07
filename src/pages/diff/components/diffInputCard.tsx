import { Card, CardContent, CopyToClipboardBtn } from 'components';
import { PromptInput, usePromptTextRef } from 'components/promptInput';
import { ParsedPrompt } from 'hooks/useParsedPrompt';
import React from 'react';
import { PromptId } from '../types';
import { ImageSelector, PromptImage } from './imageSelector';
import { SectionHeader, Title } from './text';

export const DiffInputCard = ({
  initialPrompt,
  prompt,
  id,
  onImageSelected,
}: {
  id: PromptId;
  initialPrompt: string;
  prompt: ParsedPrompt;
  onImageSelected: (file: PromptImage | undefined) => void;
}) => {
  const promptTextRef = usePromptTextRef();

  return (
    <Card
      shadowDirection={id === 'before' ? 'left' : 'right'}
      className="h-fit"
      borderTopOnMobile
    >
      <CardContent className="pb-4">
        <Title center>Prompt {id === 'before' ? 'before' : 'after'}</Title>

        <ImageSelector
          id={id}
          className="mb-8"
          onImageSelected={onImageSelected}
        />

        <SectionHeader
          actions={
            <CopyToClipboardBtn
              id={`diff-input-${id}`}
              textRef={promptTextRef}
            />
          }
        >
          Text prompt
        </SectionHeader>

        <PromptInput
          initialPrompt={initialPrompt}
          onPromptChanged={prompt.parsePromptDebounced}
          textRef={promptTextRef}
        />
      </CardContent>
    </Card>
  );
};
