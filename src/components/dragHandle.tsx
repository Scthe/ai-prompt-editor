import React from 'react';
import Icon from '@mdi/react';
import { mdiDrag } from '@mdi/js';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SR_IGNORE_SVG } from './icons';

export interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  dragHandleRef: (element: HTMLElement | null) => void;
  className?: string;
  tooltip?: string;
}

export function DragHandle({
  attributes,
  listeners,
  className,
  tooltip,
  dragHandleRef,
}: DragHandleProps) {
  return (
    <button
      title={tooltip}
      className={`transition-colors hover:text-accent-500 cursor-grab ${className}`}
      {...attributes}
      {...listeners}
      ref={dragHandleRef}
    >
      <Icon path={mdiDrag} size={1} {...SR_IGNORE_SVG} />
      <span className="sr-only" hidden>
        {tooltip}
      </span>
    </button>
  );
}
