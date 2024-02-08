import React, { useCallback } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
import { useGroupsDragAndDrop } from '../hooks/useGroupsDragAndDrop';

// TODO drag&drop on mobile is a bit crap
export default function EditorScreen() {
  const groupIds = useAllEditorGroups();

  const [onDragStart, onDragEnd] = useGroupsDragAndDrop();

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={groupIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid mb-6 md:grid-cols-2 gap-x-4 gap-y-10">
            {groupIds.map((id) => (
              <PromptCards key={id} groupId={id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
