import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { parsePrompt } from '../parser';
import { useEffectOnce } from './useEffectOnce';
import { tokenizeGpt4 } from 'utils/gpt4Tokenizer';
import { GroupParsingResult } from 'pages/editor/types';
import { useLatest } from '../../_references/hooks/useLatest';

const PARSE_DEBOUNCE_MS = 2000;

export type ParsePromptFn = (newPrompt: string) => void;

export interface ParsedPrompt {
  isParsing: boolean;
  result: GroupParsingResult | undefined;
  parsePromptDebounced: ParsePromptFn;
  parsePromptImmediately: ParsePromptFn;
}

export const parseAndTokenize = (text: string): GroupParsingResult => {
  const [ast, messages] = parsePrompt(text);
  const tokens = tokenizeGpt4(ast);
  return { ast, messages, tokens };
};

export const useParsedPrompt = (): ParsedPrompt => {
  const [isParsing, setIsParsing] = useState(true);
  const [result, setParsingResult] = useState<GroupParsingResult | undefined>(
    undefined
  );

  const parsePromptDebounced = useDebouncedCallback((newPrompt: string) => {
    const result = parseAndTokenize(newPrompt);
    setParsingResult(result);
    setIsParsing(false);
  }, PARSE_DEBOUNCE_MS);

  const parsePromptWrapper = useCallback(
    (newPrompt: string) => {
      setIsParsing(true);
      parsePromptDebounced(newPrompt);
    },
    [parsePromptDebounced]
  );

  const debouncedFnCtrl = useLatest(parsePromptDebounced);
  const parsePromptImmediately = useCallback(
    (text: string) => {
      debouncedFnCtrl?.current?.cancel?.();

      const result = parseAndTokenize(text);
      setParsingResult(result);
      setIsParsing(false);
    },
    [debouncedFnCtrl]
  );

  return {
    isParsing,
    result,
    parsePromptDebounced: parsePromptWrapper,
    parsePromptImmediately,
  };
};

/** One time operation for intial value */
export const useSetInitialPrompt = (p: ParsedPrompt, initialPrompt: string) => {
  useEffectOnce(() => {
    // `setTimeout` is needed as React tries to optimize layouts change.
    // So, when user adds a new group, React waits for parsing to be done
    // before new group is shown to the user. This takes a second or two.
    setTimeout(() => {
      p.parsePromptImmediately(initialPrompt);
    }, 0);
  });
};
