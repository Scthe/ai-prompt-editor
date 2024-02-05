import React, { ChangeEvent, InputHTMLAttributes, useCallback } from 'react';
import cx from 'classnames';

interface Props {
  id: string;
  srLabel: string;
  checked: boolean;
  onChecked: (next: boolean) => void;
}

export const Toggle = ({ id, srLabel, checked, onChecked }: Props) => {
  const onChange = useCallback(
    (e: ChangeEvent) => {
      e.preventDefault();
      onChecked(!checked);
    },
    [checked, onChecked]
  );

  const attrs: Partial<InputHTMLAttributes<unknown>> = {};
  if (checked) {
    attrs.checked = true;
  }

  return (
    <label
      htmlFor={id}
      className="flex items-center cursor-pointer select-none group"
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          onChange={onChange}
          checked={false}
        />
        <div
          className={cx(
            'block h-8 transition-colors rounded-full  w-14 group-hover:bg-sky-400',
            checked ? 'bg-sky-500' : 'bg-gray-500'
          )}
        ></div>
        <div
          className={cx(
            'absolute w-6 h-6 left-1 top-1',
            'bg-white rounded-full transition-transform',
            checked && 'translate-x-full'
          )}
        ></div>
        <span className="sr-only">{srLabel}</span>
      </div>
    </label>
  );
};
