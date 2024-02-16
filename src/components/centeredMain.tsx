import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

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

function PageTitle({ title }: Props) {
  return (
    <div className="mt-10 mb-10 text-center">
      <h1 className="inline text-4xl text-white">{title}</h1>
    </div>
  );
}
