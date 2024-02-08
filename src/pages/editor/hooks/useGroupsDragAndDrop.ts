import { useCallback } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { EditorGroupId } from '../types';
import useEditorGroupsStore from '../editorStore';

export const useGroupsDragAndDrop = () => {
  const [setDraggedGroup, moveGroup] = useEditorGroupsStore((s) => [
    s.setDraggedGroup,
    s.moveGroup,
  ]);

  const onDragStart = useCallback(
    (e: DragStartEvent) => {
      const id = getDraggedGroupId(e);
      // console.log(`onDragStart(id='${id}')`, e);

      if (id !== undefined) {
        setDraggedGroup(id);
      }
    },
    [setDraggedGroup]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      setDraggedGroup(undefined);
      const id = getDraggedGroupId(e);
      const overId = getDraggedOverGroupId(e);
      // console.log(`onDragEnd(id='${id}', overId='${overId}')`, e);

      if (id !== undefined && overId !== undefined && id !== overId) {
        moveGroup(id, overId);
      }
    },
    [moveGroup, setDraggedGroup]
  );

  return [onDragStart, onDragEnd];
};

export const getDraggedGroupId = (
  e: DragStartEvent | DragEndEvent
): EditorGroupId | undefined =>
  e.active?.id ? String(e.active?.id) : undefined;

export const getDraggedOverGroupId = (
  e: DragEndEvent
): EditorGroupId | undefined => (e.over?.id ? String(e.over?.id) : undefined);
