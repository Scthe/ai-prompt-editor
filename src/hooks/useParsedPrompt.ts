import { useCallback, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useEffectOnce } from './useEffectOnce';
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

export const parseAndTokenize = async (
  text: string
): Promise<GroupParsingResult> => {
  let resolve: (
    value: GroupParsingResult | PromiseLike<GroupParsingResult>
  ) => void;
  let reject: (reason?: unknown) => void;

  const promise = new Promise<GroupParsingResult>((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });

  const worker = new window.Worker('workers/parseAndTokenize.js');
  // console.log('Client.send', [text]);
  worker.postMessage(text);
  worker.onerror = (err) => {
    // console.log('Client.error', err);
    reject(err);
    worker.terminate();
  };
  worker.onmessage = (e) => {
    // console.log('Client.rcv', e);
    resolve(e.data);
    worker.terminate();
  };

  return promise;
};

export const useParsedPrompt = (): ParsedPrompt => {
  const [isParsing, setIsParsing] = useState(true);
  const [result, setParsingResult] = useState<GroupParsingResult | undefined>(
    undefined
  );

  const parsePromptDebounced = useDebouncedCallback(
    async (newPrompt: string) => {
      const result = await parseAndTokenize(newPrompt);
      setParsingResult(result);
      setIsParsing(false);
    },
    PARSE_DEBOUNCE_MS
  );

  const parsePromptWrapper = useCallback(
    (newPrompt: string) => {
      setIsParsing(true);
      parsePromptDebounced(newPrompt);
    },
    [parsePromptDebounced]
  );

  const debouncedFnCtrl = useLatest(parsePromptDebounced);
  const parsePromptImmediately = useCallback(
    async (text: string) => {
      debouncedFnCtrl?.current?.cancel?.();

      const result = await parseAndTokenize(text);
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
    p.parsePromptImmediately(initialPrompt);
  });
};
