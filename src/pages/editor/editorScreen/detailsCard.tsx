import React from 'react';
import cx from 'classnames';
import { EditorGroup } from '../types';
import {
  CARD_SHADOW_GRAY,
  Card,
  CardContent,
  CardContentAnimatedHeight,
  CardToolbar,
} from 'components';
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
  const isDragging = useIsDraggingAnyGroup();

  parsingResult = parsingResult || EMPTY_PARSING_RESULT;

  return (
    <Card
      shadowDirection="right"
      shadowColor={group.enabled ? undefined : CARD_SHADOW_GRAY}
      className={cx(isDragging && 'opacity-10')}
    >
      <PromptLoader visible={isLoading} />
      <h2 className="sr-only">Prompt details for group {group.name}</h2>

      <CardToolbar>
        <PromptDetailsTabs
          id={`group-${group.id}-details-tabs`}
          parsingResult={parsingResult}
          activeTab={group.tab}
          onTabSwitch={(tab) => setActiveTab(group.id, tab)}
        />
      </CardToolbar>

      <CardContentAnimatedHeight triggerKey={group.tab}>
        <CardContent>
          <PromptDetailsContent
            activeTab={group.tab}
            parsingResult={parsingResult}
          />
        </CardContent>
      </CardContentAnimatedHeight>
    </Card>
  );
};
