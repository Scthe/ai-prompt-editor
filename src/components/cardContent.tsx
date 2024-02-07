import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

export const CardContent = ({
  children,
  className,
  isAlwaysFullWidth,
}: PropsWithChildren<{
  className?: string;
  isAlwaysFullWidth?: boolean;
}>) => {
  return (
    <div
      className={cx(
        `py-2 px-4 ${className}`,
        isAlwaysFullWidth && 'md:pb-6 md:px-6'
      )}
    >
      {children}
    </div>
  );
};
