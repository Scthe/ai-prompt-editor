import React from 'react';

export default function PromptLoader() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="absolute w-32 h-32 border-4 border-t-4 border-blue-500 rounded-md animate-spin"></div>
    </div>
  );
}
