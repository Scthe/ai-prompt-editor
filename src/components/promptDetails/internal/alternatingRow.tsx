import React from 'react';

const AST_LEVEL_OFFSET_PX = 30;

export function AlternatingRow({
  depth = 0,
  children,
}: React.PropsWithChildren<{ depth?: number }>) {
  const style = {
    '--ast-depth': `${depth * AST_LEVEL_OFFSET_PX}px`,
  } as React.CSSProperties;

  return (
    <span
      style={style}
      className={`block font-mono px-1 ml-[var(--ast-depth,0)] alternateRow`}
    >
      {children}
    </span>
  );
}
