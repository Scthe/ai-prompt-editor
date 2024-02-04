import React, { PropsWithChildren } from 'react';

export const CardToolbar = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`w-full text-gray-900 bg-slate-200 h-11 ${className}`}>
      {children}
    </div>
  );
};
