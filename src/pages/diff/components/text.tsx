import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

export const Title = ({
  children,
  className,
  center,
}: PropsWithChildren<{
  className?: string;
  center?: boolean;
}>) => {
  return (
    <h2
      className={cx(
        'mb-4 text-xl capitalize',
        className,
        center && 'text-center'
      )}
    >
      {children}
    </h2>
  );
};

export const SectionHeader = ({
  children,
  actions,
  className,
}: PropsWithChildren<{
  className?: string;
  actions?: React.ReactNode;
}>) => (
  <div className={cx('mb-2 flex justify-between text-gray-900', className)}>
    <h3>{children}</h3>
    {actions ? <div>{actions}</div> : undefined}
  </div>
);

export const Bold = ({
  children,
  quotes,
  className,
}: PropsWithChildren<{
  className?: string;
  quotes?: boolean;
}>) => {
  const q = quotes ? '"' : '';
  return (
    <span className={cx('font-bold', className)}>
      {q}
      {children}
      {q}
    </span>
  );
};
