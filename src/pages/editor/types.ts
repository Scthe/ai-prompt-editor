import { ParsingMessage, PromptAstGroup, newAstGroup } from 'parser';
import { generateId } from 'utils';
import { GptToken } from 'utils/gpt4Tokenizer';

export type ScreenMode = 'editor' | 'result';

export type DetailsTab = 'list' | 'ast' | 'tokens' | 'messages';

export interface GroupParsingResult {
  ast: PromptAstGroup;
  messages: ParsingMessage[];
  tokens: GptToken[];
}

export const EMPTY_GROUP_PARSING_RESULT: GroupParsingResult = {
  ast: newAstGroup(undefined, 'curly_bracket'),
  messages: [],
  tokens: [],
};

export type EditorGroupId = string;

export interface EditorGroup {
  id: EditorGroupId; // Not stored in localstorage
  name: string;
  enabled: boolean;
  initialPrompt: string;
  tab: DetailsTab;
}

export const newGroup = (): EditorGroup => ({
  id: generateId(),
  name: 'New group',
  initialPrompt:
    'masterpiece, ((best quality)), (super prompt: 1.3), <lora:testLora:2.0>',
  tab: 'list',
  enabled: true,
});
