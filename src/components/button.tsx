import React from 'react';
import cx from 'classnames';

export type ButtonMode = 'danger' | 'normal';
export type ButtonSize = 'medium';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: ButtonMode;
  size?: ButtonSize;
}

export const Button = ({ className, children, mode, size, ...rest }: Props) => {
  return (
    <button
      type="button"
      className={cx(
        `inline-flex justify-center text-base font-medium rounded-md transition-colors ${className}`,
        mode == 'danger' && 'text-red-500 hover:bg-red-100',
        mode == 'normal' && 'hover:bg-gray-200',
        size === 'medium' && 'px-4 py-2'
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
