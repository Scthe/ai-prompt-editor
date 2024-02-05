import React from 'react';
import cx from 'classnames';

export type ButtonInGroupDef<T> = { id: T; label: string };

type ButtonGroupProps<T> = {
  activeItem: T;
  buttons: ButtonInGroupDef<T>[];
  onSelected: (nextItem: T) => void;
};

// TODO a11y
export const ButtonGroup = <T extends string>({
  activeItem,
  buttons,
  onSelected,
}: ButtonGroupProps<T>): React.ReactElement => {
  return (
    <div className="inline-flex gap-4 ml-4 text-gray-500" role="group">
      {buttons.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelected(id)}
          className={cx(
            'cursor-pointer transition-colors',
            id === activeItem
              ? 'text-sky-500 pointer-events-none'
              : 'hover:text-sky-400'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};