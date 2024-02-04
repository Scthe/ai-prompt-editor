import { CardToolbar } from 'components';
import React from 'react';

export const PromptInputToolbar = ({ name }: { name: string }) => {
  return (
    <CardToolbar className="flex items-center px-2">
      <h2>{name}</h2>
    </CardToolbar>
  );
};
