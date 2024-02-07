import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

export const CardToolbar = ({
  className,
  childrenPos,
  children,
}: PropsWithChildren<{
  className?: string;
  childrenPos?: 'apart';
}>) => {
  return (
    <div
      className={cx(
        `w-full text-gray-900 bg-slate-200 h-11 px-4 ${className}`,
        childrenPos === 'apart' && 'flex items-center justify-between'
      )}
    >
      {children}
    </div>
  );
};
