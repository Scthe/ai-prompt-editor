import React, { CSSProperties, useCallback } from 'react';
import cx from 'classnames';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useEditorGroupsStore from 'pages/editor/editorStore';
import { Card, CardContent, CardToolbar, DragHandle } from 'components';
import { Toggle } from 'components/toggle';
import { EditorGroup } from '../types';
import {
  getDraggedGroupId,
  getDraggedOverGroupId,
} from '../hooks/useGroupsDragAndDrop';

export const UsedGroupsCard = () => {
  const groups = useEditorGroupsStore((s) => s.groups);
  const groupIds = groups.map((g) => g.id);

  const moveGroup = useEditorGroupsStore((s) => s.moveGroup);
  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const id = getDraggedGroupId(e);
      const overId = getDraggedOverGroupId(e);
      // console.log(`onDragEnd(id='${id}', overId='${overId}')`, e);

      if (id !== undefined && overId !== undefined && id !== overId) {
        moveGroup(id, overId);
      }
    },
    [moveGroup]
  );

  return (
    <Card shadowDirection="right" className="h-fit" borderTopOnMobile>
      <CardToolbar childrenPos="apart">
        <div className="grow">
          <h2>Groups</h2>
        </div>
      </CardToolbar>

      <CardContent>
        <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
          <SortableContext
            items={groupIds}
            strategy={verticalListSortingStrategy}
          >
            <ul role="list" className="">
              {groups.map((g) => (
                <GroupRow key={g.id} group={g} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

const GroupRow = ({ group }: { group: EditorGroup }) => {
  const id = group.id;

  const setGroupEnabled = useEditorGroupsStore((s) => s.setGroupEnabled);
  const toggleGroup = useCallback(
    (enabled: boolean) => setGroupEnabled(id, enabled),
    [id, setGroupEnabled]
  );

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef, // used for drag handle
    transform,
    transition,
  } = useSortable({ id });
  const style: CSSProperties = {
    opacity: isDragging ? 0.7 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li
      className={cx('py-1 flex items-center gap-x-2 mb-2')}
      ref={setNodeRef}
      style={style}
    >
      <DragHandle
        attributes={attributes}
        listeners={listeners}
        dragHandleRef={setActivatorNodeRef}
        tooltip="Drag this group to switch the order"
      />
      <Toggle
        checked={group.enabled}
        id={`group-${id}-enabled`}
        onChecked={toggleGroup}
        srLabel="Toggle group on/off"
        className="inline-flex group"
      >
        <span className="inline-block ml-2 group-hover:text-sky-700">
          {group.name}
        </span>
      </Toggle>
    </li>
  );
};
