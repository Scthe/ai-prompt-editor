import { Card, CardContent } from 'components';
import { PromptInput } from 'components/promptInput';
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
  return (
    <Card
      shadowDirection={id === 'before' ? 'left' : 'right'}
      className="h-fit"
      borderTopOnMobile
    >
      <CardContent>
        <Title center>Prompt {id === 'before' ? 'before' : 'after'}</Title>

        <SectionHeader>Read from image</SectionHeader>
        <ImageSelector
          id={id}
          className="mb-8"
          onImageSelected={onImageSelected}
        />

        <SectionHeader>Text prompt</SectionHeader>
        {/* TODO copy to clipboard? usePromptText that works on ref. Easier than intercept `onPromptChanged` all the time */}
        <PromptInput
          // key used to rerender after image resets the `initialPrompt`
          key={initialPrompt}
          initialPrompt={initialPrompt}
          onPromptChanged={prompt.parsePrompt}
          className="mb-4"
          withBorder
        />
      </CardContent>
    </Card>
  );
};
