import React, { PropsWithChildren } from 'react';
import cx from 'classnames';
import PageTitle from '../../_references/migration/components/pageTitle';

type Props = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

export function CenteredMain({ className, title, children }: Props) {
  return (
    <main className={cx(`min-h-dvh w-full flex flex-col ${className}`)}>
      {title && <PageTitle title={title} />}
      <div
        className={cx(`h-full w-full grow flex justify-center items-center`)}
      >
        {children}
      </div>
    </main>
  );
}
