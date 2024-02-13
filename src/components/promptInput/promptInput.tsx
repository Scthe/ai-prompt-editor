import React, { useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import Editor from 'react-simple-code-editor';
import 'prismjs/themes/prism.css';
import { highlight } from 'prismjs';
import './promptInput.css';

/** mostly selected for pretty colors, not semantic */
const PRISMJS_GRAMMAR = {
  keyword: /<.*?>/, // matches LoRA
  number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  ['class-name']: /[[\]()]/, // matches braces
  // it's a comma, it's too small to see anyway..
  // cannot add margin/padding as it disrupts text input
  punctuation: /,/,
  operator: /:/,
};

interface Props {
  initialPrompt: string;
  onPromptChanged: (newPrompt: string) => void;
  className?: string;
  disabled?: boolean;
  withBorder?: boolean;
  textRef?: PromptTextRef;
  labelledById?: string;
  ariaLabel?: string;
}

/**
DOCS: https://github.com/react-simple-code-editor/react-simple-code-editor

ALT:
- https://www.npmjs.com/package/react-prism-editor - not tested
- https://github.com/facebook/lexical - facebookish
- https://github.com/FormidableLabs/use-editable - NOPE, breaks on simplest paste
- https://www.npmjs.com/package/react-contenteditable - lots of tiny quirks e.g. new lines do not work at all

TODO how to indicate focus? Change text color? Add left/right border?
*/
export function PromptInput({
  className,
  initialPrompt,
  onPromptChanged,
  disabled,
  withBorder,
  textRef,
  labelledById,
  ariaLabel,
}: Props) {
  const [code, setCode] = React.useState(initialPrompt);
  // update ref to latest value. It's ref, so will not force rerenders
  if (textRef) {
    textRef.current = code;
  }

  const onValueChange = useCallback(
    (code: string) => {
      setCode(code);
      onPromptChanged(code);
    },
    [onPromptChanged]
  );

  const lastInitialPromptRef = useRef(initialPrompt);
  useEffect(() => {
    if (lastInitialPromptRef.current !== initialPrompt) {
      // console.warn(
      // `PromptInput.initialPrompt has changed! This is OK, but there are only a few valid reasons for this (image upload in diff, groups change in editor result etc.).`
      // );
      lastInitialPromptRef.current = initialPrompt;
      onValueChange(initialPrompt);
    }
  }, [initialPrompt, onValueChange]);

  const attrs = disabled ? { tabIndex: 0 } : undefined; // make focusable in read-only

  const editorRef = useRef<Editor>(null);
  useUpdateAriaLabel(editorRef, labelledById, ariaLabel);

  return (
    <div
      className={cx(
        className,
        withBorder && 'border border-gray-700 rounded-sm'
      )}
    >
      <Editor
        ref={editorRef}
        placeholder="masterpiece,(best quality), ..."
        disabled={disabled}
        value={code}
        onValueChange={onValueChange}
        highlight={(code) => highlight(code, PRISMJS_GRAMMAR, 'js')}
        padding={withBorder ? 10 : 0}
        style={{
          fontFamily: 'monospace',
          fontSize: 14,
        }}
        {...attrs}
      />
    </div>
  );
}

export type PromptTextRef = React.MutableRefObject<string>;

/** Use this to get access to always up to date prompt text  */
export function usePromptTextRef() {
  return useRef<string>('');
}

function useUpdateAriaLabel(
  editorRef: React.RefObject<Editor>,
  labelledById: string | undefined,
  arialabel: string | undefined
) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inputEl = (editorRef.current as any)?._input;
      if (labelledById !== undefined) {
        inputEl.setAttribute('aria-labelledby', labelledById);
      } else if (arialabel !== undefined) {
        inputEl.setAttribute('aria-label', arialabel);
      }
    } catch (_e) {
      /* empty */
    }
  }, [arialabel, editorRef, labelledById]);
}
