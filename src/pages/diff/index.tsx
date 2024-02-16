import { PageTitle, TopRightMenu } from 'components';
import {
  ParsedPrompt,
  useParsedPrompt,
  useSetInitialPrompt,
} from 'hooks/useParsedPrompt';
import React, { useCallback, useState } from 'react';
import { DiffInputCard } from './components/diffInputCard';
import { PromptImage } from './components/imageSelector';
import { ResultCard } from './components/resultCard';
import { INITAL_PROMPTS, persistDiffState } from './diffStorePersist';
import { PromptId } from './types';

export default function DiffPage() {
  const promptA = useDiffPrompt('before', INITAL_PROMPTS.before);
  const promptB = useDiffPrompt('after', INITAL_PROMPTS.after);

  return (
    <main className="relative max-w-screen-xl min-h-screen px-2 pt-20 pb-8 mx-auto md:px-4">
      <PageTitle title="AI Prompt Diff" />

      <TopRightMenu targetPage="editor" />

      <div className="grid mb-10 md:grid-cols-2 gap-y-10 md:gap-y-0 md:gap-x-4">
        <DiffInputCard
          id="before"
          initialPrompt={promptA.lastResetPrompt}
          prompt={promptA}
          onImageSelected={promptA.onImageSelected}
        />
        <DiffInputCard
          id="after"
          initialPrompt={promptB.lastResetPrompt}
          prompt={promptB}
          onImageSelected={promptB.onImageSelected}
        />
      </div>

      <ResultCard before={promptA} after={promptB} />
    </main>
  );
}

// TODO move to zustand?
const useDiffPrompt = (id: PromptId, intialPrompt: string) => {
  const [lastResetPrompt, setLastResetPrompt] = useState<string>(intialPrompt);

  const parsedPrompt = useParsedPrompt();
  useSetInitialPrompt(parsedPrompt, intialPrompt);

  const parsePromptImmediately: ParsedPrompt['parsePromptImmediately'] =
    useCallback(
      (text) => {
        persistDiffState(id, text);
        parsedPrompt.parsePromptImmediately(text);
      },
      [id, parsedPrompt]
    );

  const parsePromptDebounced: ParsedPrompt['parsePromptDebounced'] =
    useCallback(
      (text) => {
        persistDiffState(id, text);
        parsedPrompt.parsePromptDebounced(text);
      },
      [id, parsedPrompt]
    );

  const [image, setImage] = useState<PromptImage | undefined>(undefined);
  const onImageSelected = useCallback(
    (file: PromptImage | undefined) => {
      if (file) {
        setLastResetPrompt(file.aiParams.positivePrompt);
        setImage(file);
        parsePromptImmediately(file.aiParams.positivePrompt);
      } else {
        setImage(undefined);
        // leave prompt based on image
      }
    },
    [parsePromptImmediately]
  );

  return {
    lastResetPrompt,
    image,
    onImageSelected,
    ...parsedPrompt,
    parsePromptImmediately,
    parsePromptDebounced,
  };
};
