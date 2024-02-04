import React, { PropsWithChildren } from 'react';

export const CardContent = ({ children }: PropsWithChildren<{}>) => {
  return <div className="p-2">{children}</div>;
};
