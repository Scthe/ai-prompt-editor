import React from 'react';

export default function PromptLoader() {
  return (
    <div className="absolute top-0 left-0 z-50 w-full h-full">
      <div className="flex items-center justify-center w-full h-full bg-gray-400/80">
        <div className="absolute w-8 h-8 border-4 border-t-4 border-blue-500 rounded-md animate-spin"></div>
      </div>
    </div>
  );
}
