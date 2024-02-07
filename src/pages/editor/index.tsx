import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { ScreenMode } from './types';
import { ScreenModeSwitcher } from './components/screenModeSwitcher';
import { TopRightMenu } from 'components';
import EditorScreen from './editorScreen';
import ResultScreen from './resultScreen';
import { persistCurrentPromptsAsInitial } from './editorStore';

export default function EditorPage() {
  const [activeScreen, setActiveScreen] = useState<ScreenMode>('editor');

  const setActiveScreenWithExtras = useCallback((nextMode: ScreenMode) => {
    setActiveScreen(nextMode);
    persistCurrentPromptsAsInitial();
  }, []);

  return (
    <main
      className={cx(
        'relative max-w-screen-xl min-h-screen mx-auto',
        'px-2 md:px-4 pt-20 pb-12'
      )}
    >
      <TopRightMenu targetPage="diff" />

      <ScreenModeSwitcher
        activeMode={activeScreen}
        onModeSwitch={setActiveScreenWithExtras}
      />

      {activeScreen === 'editor' ? <EditorScreen /> : <ResultScreen />}
    </main>
  );
}
