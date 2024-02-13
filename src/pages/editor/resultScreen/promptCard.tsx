import React from 'react';
import { Card, CardContent, CardToolbar, CopyToClipboardBtn } from 'components';
import styles from '../editorScreen/promptInputToolbar.module.css';
import { PromptInput } from 'components/promptInput';
import PromptLoader from 'components/loaders';
import { ParsingResult } from 'parser';

const NOOP = () => undefined;

interface Props {
  isParsing: boolean;
  parsingResult: ParsingResult | undefined;
  initialPrompt: string;
}

export default function PromptCard({
  parsingResult,
  initialPrompt,
  isParsing,
}: Props) {
  const isLoading = isParsing || !parsingResult;

  return (
    <Card shadowDirection="left" className="h-fit" borderTopOnMobile>
      <PromptLoader visible={isLoading} />

      <Toolbar promptTextRef={initialPrompt} />

      <CardContent>
        <PromptInput
          initialPrompt={initialPrompt}
          onPromptChanged={NOOP}
          disabled
        />
      </CardContent>
    </Card>
  );
}

const Toolbar = ({ promptTextRef }: { promptTextRef: string }) => {
  return (
    <CardToolbar childrenPos="apart">
      {/* left side */}
      <div className="grow">
        <h2>Result prompt</h2>
      </div>

      {/* right side */}
      <div className="flex gap-x-4">
        {/* copy btn */}
        <CopyToClipboardBtn
          id="final-result-copy-btn"
          textRef={promptTextRef}
          className={styles.toolbarIcon}
        />
      </div>
    </CardToolbar>
  );
};
