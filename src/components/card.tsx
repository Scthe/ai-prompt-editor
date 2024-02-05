import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

export const CARD_SHADOW_GRAY = '#6b7280'; // gray-500

export const Card = ({
  shadowDirection,
  shadowColor,
  className,
  borderTopOnMobile,
  children,
}: PropsWithChildren<{
  shadowDirection?: 'left' | 'right';
  shadowColor?: string;
  className?: string;
  borderTopOnMobile?: boolean;
}>) => {
  const shadowSize = 8;
  const style = {
    '--shadow-x':
      shadowDirection === 'left' ? `-${shadowSize}px` : `${shadowSize}px`,
    '--shadow-y': `-${shadowSize}px`,
    '--shadow-col': shadowColor,
  } as React.CSSProperties;
  return (
    <div
      style={style}
      className={cx(
        `relative bg-white w-full rounded-sm ${className}`,
        // shadow md and up
        shadowDirection &&
          `md:shadow-[var(--shadow-x)_var(--shadow-y)_0_0px_var(--shadow-col,theme("colors.sky.500"))]`,
        borderTopOnMobile &&
          `shadow-[0_var(--shadow-y)_0_0px_var(--shadow-col,theme("colors.sky.500"))]`
      )}
    >
      {children}
    </div>
  );
};
