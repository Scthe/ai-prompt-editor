import React from 'react';
import Icon from '@mdi/react';
import { mdiDrag } from '@mdi/js';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  dragHandleRef: (element: HTMLElement | null) => void;
  className?: string;
}

export function DragHandle({
  attributes,
  listeners,
  className,
  dragHandleRef,
}: DragHandleProps) {
  return (
    <button
      className={`transition-colors hover:text-sky-500 cursor-grab ${className}`}
      {...attributes}
      {...listeners}
      ref={dragHandleRef}
    >
      <Icon path={mdiDrag} size={1} />
    </button>
  );
}
