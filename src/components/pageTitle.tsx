import { useTitle } from 'hooks/useTitle';
import React from 'react';

export function PageTitle({ title }: { title: string }) {
  useTitle(title);

  return <h1 className="sr-only">{title}</h1>;
}
