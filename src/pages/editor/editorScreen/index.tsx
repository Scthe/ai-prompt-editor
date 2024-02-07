import React, { useCallback } from 'react';
import { EditorGroupId } from '../types';
import { useParsedPrompt, useSetInitialPrompt } from 'hooks/useParsedPrompt';
import { DetailsCard } from './detailsCard';
import { PromptInputCard } from './promptInputCard';
import {
  storeCurrentText,
  useAllEditorGroups,
  useEditorGroup,
} from 'pages/editor/editorStore';
import { AddNewGroupBtn } from './addNewGroupBtn';

export default function EditorScreen() {
  const groupIds = useAllEditorGroups();

  return (
    <>
      <div className="grid mb-6 md:grid-cols-2 gap-x-4 gap-y-6">
        {groupIds.map((id) => (
          <PromptCards key={id} groupId={id} />
        ))}
      </div>

      <AddNewGroupBtn />
    </>
  );
}

const PromptCards = ({ groupId }: { groupId: EditorGroupId }) => {
  const group = useEditorGroup(groupId);
  const parsedPrompt = useParsedPrompt();
  useSetInitialPrompt(parsedPrompt, group?.initialPrompt || '');

  const { isParsing, parsePromptDebounced, result } = parsedPrompt;

  const updatePrompt = useCallback(
    (text: string) => {
      storeCurrentText(groupId, text);
      parsePromptDebounced(text);
    },
    [groupId, parsePromptDebounced]
  );

  if (!group) {
    return;
  }

  return (
    <>
      <PromptInputCard group={group} parsePrompt={updatePrompt} />
      <DetailsCard group={group} isParsing={isParsing} data={result} />
    </>
  );
};
