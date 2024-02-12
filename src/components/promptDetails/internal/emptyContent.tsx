import React from 'react';

export const EmptyContent = ({
  text = 'Prompt is empty',
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <p className={`text-center py-2 text-gray-500 ${className}`}>{text}</p>
  );
};
