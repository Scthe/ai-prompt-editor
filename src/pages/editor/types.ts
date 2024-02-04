import { ParsingMessage, PromptAstGroup } from 'parser';

export type ScreenMode = 'editor' | 'result';

export type DetailsTab = 'list' | 'ast' | 'tokens' | 'messages';

export interface GroupParsingResult {
  ast: PromptAstGroup;
  messages: ParsingMessage[];
}

export interface EditorGroup {
  name: string;
  isParsing: boolean;
  parsedResult: GroupParsingResult | undefined;
  // TODO tab: DetailsTab
}
