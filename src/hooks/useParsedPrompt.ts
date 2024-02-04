import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ParsingResult, parsePrompt } from '../parser';
import { useEffectOnce } from './useEffectOnce';

const PARSE_DEBOUNCE_MS = 2000;

export type ParsePromptFn = (newPrompt: string) => void;

interface ParsedPrompt {
  isParsing: boolean;
  result: ParsingResult | undefined;
  parsePrompt: ParsePromptFn;
}

export const useParsedPrompt = (initialPrompt: string): ParsedPrompt => {
  const [isParsing, setIsParsing] = useState(true);
  const [parsingResult, setParsingResult] = useState<ParsingResult | undefined>(
    undefined
  );

  // set initial
  useEffectOnce(() => {
    const result = parsePrompt(initialPrompt);
    setParsingResult(result);
    setIsParsing(false);
  });

  const parseNewPrompt = useDebouncedCallback((newPrompt: string) => {
    const result = parsePrompt(newPrompt);
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
