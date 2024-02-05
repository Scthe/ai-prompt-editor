import React from 'react';
import {
  EMPTY_GROUP_PARSING_RESULT,
  EditorGroup,
  GroupParsingResult,
} from '../types';
import { CARD_SHADOW_GRAY, Card, CardContent } from 'components';
import PromptLoader from 'components/loaders';
import { DetailsToolbar } from './detailsToolbar';
import { DetailsContent } from './detailsContent';
import useEditorGroupsStore from 'store/editorStore';

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
      <DetailsToolbar
        groupId={group.id}
        tokenCount={data?.tokens.length}
        messagesCount={data?.messages.length}
        activeTab={group.tab}
        onTabSwitch={(tab) => setActiveTab(group.id, tab)}
      />
      {isLoading ? <PromptLoader /> : undefined}

      <CardContent>
        <DetailsContent
          activeTab={group.tab}
          data={data || EMPTY_GROUP_PARSING_RESULT}
        />
      </CardContent>
    </Card>
  );
};
