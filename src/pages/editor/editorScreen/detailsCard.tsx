import React from 'react';
import cx from 'classnames';
import { EditorGroup } from '../types';
import { CARD_SHADOW_GRAY, Card, CardContent, CardToolbar } from 'components';
import PromptLoader from 'components/loaders';
import {
  PromptDetailsTabs,
  PromptDetailsContent,
} from 'components/promptDetails';
import useEditorGroupsStore, {
  useIsDraggingAnyGroup,
} from 'pages/editor/editorStore';
import { EMPTY_PARSING_RESULT, ParsingResult } from 'parser';

interface Props {
  isParsing: boolean;
  group: EditorGroup;
  parsingResult: ParsingResult | undefined;
}

export const DetailsCard = ({ group, parsingResult, isParsing }: Props) => {
  const setActiveTab = useEditorGroupsStore((s) => s.setDetailsTab);
  const isLoading = isParsing || !parsingResult;

  parsingResult = parsingResult || EMPTY_PARSING_RESULT;

  const isDragging = useIsDraggingAnyGroup();

  return (
    <Card
      shadowDirection="right"
      shadowColor={group.enabled ? undefined : CARD_SHADOW_GRAY}
      className={cx(isDragging && 'opacity-10')}
    >
      {isLoading ? <PromptLoader /> : undefined}

      <CardToolbar>
        <PromptDetailsTabs
          id={`group-${group.id}-details-tabs`}
          parsingResult={parsingResult}
          activeTab={group.tab}
          onTabSwitch={(tab) => setActiveTab(group.id, tab)}
        />
      </CardToolbar>

      <CardContent>
        <PromptDetailsContent
          activeTab={group.tab}
          parsingResult={parsingResult}
        />
      </CardContent>
    </Card>
  );
};
