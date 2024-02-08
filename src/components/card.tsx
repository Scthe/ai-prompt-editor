import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

export const CARD_SHADOW_GRAY = '#6b7280'; // gray-500

export const Card = ({
  shadowDirection,
  shadowColor,
  className,
  borderTopOnMobile,
  style,
  wrapperRef,
  children,
}: PropsWithChildren<{
  shadowDirection?: 'left' | 'right' | 'top';
  shadowColor?: string;
  className?: string;
  borderTopOnMobile?: boolean;
  style?: React.CSSProperties;
  wrapperRef?: React.LegacyRef<HTMLDivElement>;
}>) => {
  const shadowSize = 8;
  const shadowX: Record<string, string | undefined> = {
    left: `-${shadowSize}px`,
    right: `${shadowSize}px`,
    top: '0px',
  };

  const combinedStyle = {
    '--shadow-x': shadowX[shadowDirection || ''],
    '--shadow-y': `-${shadowSize}px`,
    '--shadow-col': shadowColor,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      ref={wrapperRef}
      style={combinedStyle}
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
