import { TopRightMenu } from 'components';
import { useParsedPrompt } from 'hooks/useParsedPrompt';
import React, { useCallback, useState } from 'react';
import { DiffInputCard } from './components/diffInputCard';
import { PromptImage } from './components/imageSelector';
import { ResultCard } from './components/resultCard';

const INITIAL_BEFORE =
  'masterpiece, ((best quality)), (super prompt: 1.3), <lora:testLora:2.0>';
const INITIAL_AFTER =
  'masterpiece, (best quality), (super prompt: 1.1), <lora:testLora:0.3>';

// TODO add some page <h1> title and explanation what this tool is
// TODO main area has tabs - if uploaded image, can switch to 'All Exif from img A'
// TODO compare settings too? Sampler/Steps/CFG etc.
// TODO both prompts have own color scheme? left-sky, right-pink
// TODO mode to show ones that did not change?
// TODO handle no difference
// TODO swap?
export default function DiffPage() {
  const promptA = useDiffPrompt(INITIAL_BEFORE);
  const promptB = useDiffPrompt(INITIAL_AFTER);

  return (
    <main className="relative max-w-screen-xl min-h-screen px-2 pt-20 pb-8 mx-auto md:px-4">
      <TopRightMenu targetPage="editor" />

      <div className="grid mb-10 md:grid-cols-2 gap-x-4">
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
const useDiffPrompt = (intialPrompt: string) => {
  const [lastResetPrompt, setLastResetPrompt] = useState<string>(intialPrompt);

  const prompt = useParsedPrompt(intialPrompt);
  const { parsePrompt } = prompt;

  const [image, setImage] = useState<PromptImage | undefined>(undefined);
  const onImageSelected = useCallback(
    (file: PromptImage | undefined) => {
      if (file) {
        setLastResetPrompt(file.aiParams.positivePrompt);
        setImage(file);
        parsePrompt(file.aiParams.positivePrompt);
      } else {
        setImage(undefined);
        // leave prompt based on image
      }
    },
    [parsePrompt]
  );

  return {
    lastResetPrompt,
    image,
    onImageSelected,
    ...prompt,
  };
};
