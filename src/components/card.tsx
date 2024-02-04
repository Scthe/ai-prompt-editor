import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

export const Card = ({
  shadowDirection,
  className,
  borderTopOnMobile,
  children,
}: PropsWithChildren<{
  shadowDirection: 'left' | 'right';
  className?: string;
  borderTopOnMobile?: boolean;
}>) => {
  const shadowSize = 8;
  const style = {
    '--shadow-x':
      shadowDirection === 'left' ? `-${shadowSize}px` : `${shadowSize}px`,
    '--shadow-y': `-${shadowSize}px`,
  } as React.CSSProperties;
  return (
    <div
      style={style}
      className={cx(
        `bg-white w-full rounded-sm ${className}`,
        // shadow md+
        `md:shadow-[var(--shadow-x)_var(--shadow-y)_0_0px_theme("colors.sky.500")]`,
        borderTopOnMobile &&
          `shadow-[0_var(--shadow-y)_0_0px_theme("colors.sky.500")]`
      )}
    >
      {children}
    </div>
  );
};
