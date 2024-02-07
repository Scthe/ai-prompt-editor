import React from 'react';
import { Card, CardContent, CardToolbar, CopyToClipboardBtn } from 'components';
import styles from '../editorScreen/promptInputToolbar.module.css';
import { PromptInput } from 'components/promptInput';
import PromptLoader from 'components/loaders';
import { GroupParsingResult } from '../types';

const NOOP = () => undefined;

interface Props {
  isParsing: boolean;
  data: GroupParsingResult | undefined;
  initialPrompt: string;
}

export default function PromptCard({ data, initialPrompt, isParsing }: Props) {
  const isLoading = isParsing || !data;

  return (
    <Card shadowDirection="left" className="h-fit" borderTopOnMobile>
      {isLoading ? <PromptLoader /> : undefined}

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
