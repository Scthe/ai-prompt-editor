import React from 'react';
import { PromptAstToken, getLoraText } from '../../parser';

const AST_LEVEL_OFFSET_PX = 30;

export function AstNodeRender({
  depth = 0,
  children,
}: React.PropsWithChildren<{ depth?: number }>) {
  // console.log(`AstNodeRender(${text})`);
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

export const getAsLoraElement = (token: PromptAstToken) => {
  const textAsLora = getLoraText(token);
  if (textAsLora) {
    return <span className="text-lora">{textAsLora}</span>;
  }
  return undefined;
};

export const astTokenContent = (token: PromptAstToken) => {
  // render if LoRA
  const textAsLora = getAsLoraElement(token);
  if (textAsLora) {
    return textAsLora;
  }

  return (
    <>
      {token.value}
      <span className={'inline-block ml-2 text-indigo-500'}>
        {`| attention: ${token.resolvedWeight.toFixed(2)}`}
      </span>
    </>
  );
};
