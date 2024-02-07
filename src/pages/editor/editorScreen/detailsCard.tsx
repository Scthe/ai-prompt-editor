import React from 'react';
import { EditorGroup, GroupParsingResult } from '../types';
import { CARD_SHADOW_GRAY, Card, CardContent, CardToolbar } from 'components';
import PromptLoader from 'components/loaders';
import { PromptDetailsContent } from 'components/promptDetails/promptDetailsContent';
import useEditorGroupsStore from 'pages/editor/editorStore';
import { PromptDetailsTabs } from 'components/promptDetails/promptDetailsTabs';

interface Props {
  isParsing: boolean;
  group: EditorGroup;
  data: GroupParsingResult | undefined;
}

export const DetailsCard = ({ group, data, isParsing }: Props) => {
  const setActiveTab = useEditorGroupsStore((s) => s.setDetailsTab);
  const isLoading = isParsing || !data;

  return (
    <Card
      shadowDirection="right"
      shadowColor={group.enabled ? undefined : CARD_SHADOW_GRAY}
    >
      {isLoading ? <PromptLoader /> : undefined}

      <CardToolbar>
        <PromptDetailsTabs
          id={`group-${group.id}-details-tabs`}
          tokenCount={data?.tokens.length}
          messagesCount={data?.messages.length}
          activeTab={group.tab}
          onTabSwitch={(tab) => setActiveTab(group.id, tab)}
        />
      </CardToolbar>

      <CardContent>
        <PromptDetailsContent activeTab={group.tab} data={data} />
      </CardContent>
    </Card>
  );
};
