import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { parsePrompt } from '../parser';
import { useEffectOnce } from './useEffectOnce';
import { tokenizeGpt4 } from 'utils/gpt4Tokenizer';
import { GroupParsingResult } from 'pages/editor/types';

const PARSE_DEBOUNCE_MS = 2000;

export type ParsePromptFn = (newPrompt: string) => void;

export interface ParsedPrompt {
  isParsing: boolean;
  result: GroupParsingResult | undefined;
  parsePrompt: ParsePromptFn;
}

export const parseAndTokenize = (text: string): GroupParsingResult => {
  const [ast, messages] = parsePrompt(text);
  const tokens = tokenizeGpt4(ast);
  return { ast, messages, tokens };
};

export const useParsedPrompt = (initialPrompt: string): ParsedPrompt => {
  const [isParsing, setIsParsing] = useState(true);
  const [parsingResult, setParsingResult] = useState<
    GroupParsingResult | undefined
  >(undefined);

  // set initial
  useEffectOnce(() => {
    // `setTimeout` is needed as React tries to optimize layouts change.
    // So, when user adds a new group, React waits for parsing to be done
    // before new group is shown to the user. This takes a second or two.
    setTimeout(() => {
      const result = parseAndTokenize(initialPrompt);
      setParsingResult(result);
      setIsParsing(false);
    }, 0);
  });

  const parseNewPrompt = useDebouncedCallback((newPrompt: string) => {
    const result = parseAndTokenize(newPrompt);
    setParsingResult(result);
    setIsParsing(false);
  }, PARSE_DEBOUNCE_MS);

  const onPromptChanged = useCallback(
    (newPrompt: string) => {
      setIsParsing(true);
      parseNewPrompt(newPrompt);
    },
    [parseNewPrompt]
  );

  return { isParsing, result: parsingResult, parsePrompt: onPromptChanged };
};
