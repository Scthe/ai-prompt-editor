import React, { useMemo } from 'react';
import { safeJsonStringify } from 'utils';

export const Debug = ({ data }: { data: unknown }) => {
  const json = useMemo(() => safeJsonStringify(data, 2), [data]);
  return <pre>{json}</pre>;
};
