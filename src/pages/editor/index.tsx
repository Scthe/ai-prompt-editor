import React, { useState } from 'react';
import { EditorGroupId, ScreenMode } from './types';
import { ScreenModeSwitcher } from './components/screenModeSwitcher';
import { useParsedPrompt } from 'hooks/useParsedPrompt';
import { DetailsCard } from './components/detailsCard';
import { PromptInputCard } from './components/promptInputCard';
import { useAllEditorGroups, useEditorGroup } from 'pages/editor/editorStore';
import { AddNewGroupBtn } from './components/addNewGroupBtn';
import { TopRightMenu } from 'components';

export default function EditorPage() {
  const [activeScreen, setActiveScreen] = useState<ScreenMode>('editor');

  const groupIds = useAllEditorGroups();

  return (
    <main className="relative max-w-screen-xl min-h-screen px-2 pt-20 pb-8 mx-auto md:px-4">
      <TopRightMenu targetPage="diff" />

      <ScreenModeSwitcher
        activeMode={activeScreen}
        onModeSwitch={setActiveScreen}
      />

      <div className="grid mb-6 md:grid-cols-2 gap-x-4 gap-y-6">
        {groupIds.map((id) => (
          <PromptCards key={id} groupId={id} />
        ))}
      </div>

      <AddNewGroupBtn />
    </main>
  );
}

const PromptCards = ({ groupId }: { groupId: EditorGroupId }) => {
  const group = useEditorGroup(groupId);
  const { isParsing, parsePrompt, result } = useParsedPrompt(
    group?.initialPrompt || ''
  );

  if (!group) {
    return;
  }

  return (
    <>
      <PromptInputCard group={group} parsePrompt={parsePrompt} />
      <DetailsCard group={group} isParsing={isParsing} data={result} />
    </>
  );
};
