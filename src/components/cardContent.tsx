import React, { PropsWithChildren } from 'react';

export const CardContent = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};
