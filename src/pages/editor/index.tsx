import React, { useState } from 'react';
import { EditorGroup, ScreenMode } from './types';
import { ScreenModeSwitcher } from './components/screenModeSwitcher';
import { useParsedPrompt } from 'hooks/useParsedPrompt';
import { DetailsCard } from './components/detailsCard';
import { PromptInputCard } from './components/promptInputCard';

const TEST_PROMPT = `vibrant colors,((pastel colors), aaa),<lora:testLora>,last-in-line,
New line,(()),pastel colors, <lora:testLora:2.0>, end token: 0.0`;

export default function EditorPage() {
  const [activeScreen, setActiveScreen] = useState<ScreenMode>('editor');

  const initialPrompt = TEST_PROMPT;
  const { isParsing, parsePrompt, result } = useParsedPrompt(initialPrompt);
  const group: EditorGroup = {
    name: 'Test group',
    isParsing,
    parsedResult:
      !isParsing && result
        ? {
            ast: result[0],
            messages: result[1],
          }
        : undefined,
  };

  return (
    <main className="relative max-w-screen-xl min-h-screen pt-20 pb-8 mx-auto">
      <ScreenModeSwitcher
        activeMode={activeScreen}
        onModeSwitch={setActiveScreen}
      />

      <div className="grid px-2 md:px-4 md:grid-cols-2 gap-x-4 gap-y-6">
        <PromptInputCard
          name={group.name}
          initialPrompt={initialPrompt}
          parsePrompt={parsePrompt}
        />
        <DetailsCard group={group} />
      </div>
    </main>
  );
}
