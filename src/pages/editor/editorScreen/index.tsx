import React, { useCallback, useRef } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EditorGroup, EditorGroupId } from '../types';
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
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import { ANIMATION_SPEED } from 'animation';

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
          <div className="grid mb-6 md:grid-cols-2 gap-x-4 gap-y-2 md:gap-y-10">
            <AnimatePresence initial={false} mode="sync">
              {groupIds.map((id) => (
                <PromptCards key={id} groupId={id} />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      <AddNewGroupBtn />
    </>
  );
}

const PromptCards = ({ groupId }: { groupId: EditorGroupId }) => {
  const group = useEditorGroup(groupId);
  const groupBeforeDeleteRef = useRef<EditorGroup | undefined>(group);
  if (group !== undefined) {
    groupBeforeDeleteRef.current = group;
  }

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

  const shownGroup = group || groupBeforeDeleteRef.current;
  if (shownGroup == undefined) {
    return;
  }

  return (
    <>
      <motion.div {...animatePromptCard('left')}>
        <PromptInputCard group={shownGroup} parsePrompt={updatePrompt} />
      </motion.div>

      <motion.div {...animatePromptCard('right')} className="mb-10 md:mb-0">
        <DetailsCard
          group={shownGroup}
          isParsing={isParsing}
          parsingResult={result}
        />
      </motion.div>
    </>
  );
};

const animatePromptCard = (dir: 'left' | 'right'): AnimationProps => {
  const x = (dir === 'left' ? -1 : 1) * 100;
  return {
    initial: { x, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x, opacity: 0.0 },
    transition: { duration: ANIMATION_SPEED.medium },
  };
};
