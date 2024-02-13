import React, { useEffect, useMemo } from 'react';
import { UsedGroupsCard } from './usedGroupsCard';
import { ResultDetails } from './resultDetails';
import { useParsedPrompt } from 'hooks/useParsedPrompt';
import PromptCard from './promptCard';
import useEditorGroupsStore from '../editorStore';
import { getCurrentPrompt } from '../types';

export default function ResultScreen() {
  const initialPrompt = useMergedResultPromptText();

  const parsedPrompt = useParsedPrompt();
  const { isParsing, parsePromptImmediately, result } = parsedPrompt;

  // This also sets intial value.
  // Less optimal if user would call this every 1ms, but good for now?
  // TODO [LOW] very messy flow how this is initialized
  useEffect(() => {
    parsePromptImmediately(initialPrompt);
  }, [initialPrompt, parsePromptImmediately]);

  return (
    <>
      <div className="grid mb-10 md:grid-cols-2 gap-x-4 gap-y-6">
        <PromptCard
          parsingResult={result}
          isParsing={isParsing}
          initialPrompt={initialPrompt}
        />

        <UsedGroupsCard />
      </div>

      <ResultDetails parsingResult={result} isParsing={isParsing} />
    </>
  );
}

const useMergedResultPromptText = (): string => {
  const enabledGroups = useEditorGroupsStore((s) =>
    s.groups.filter((g) => g.enabled)
  );
  const groupIds = enabledGroups.map((g) => g.id);

  return useMemo(() => {
    const texts = enabledGroups.map(getCurrentPrompt);
    return texts.join(',');

    // prevent fire this to often. React wants to have `enabledGroups`,
    // but this is filtered array, new every time.
    // Though `useMemo` is just a suggestion, so..
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIds]);
};
