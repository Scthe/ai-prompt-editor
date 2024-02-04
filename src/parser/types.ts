// TODO does it require space before?
export const BREAK_TOKEN = 'BREAK';

export interface PromptAstToken {
  type: 'token';
  /** text of the prompt token. E.g. "text" in "text: 1.2". */
  value: string;
  /** final weight including braces */
  resolvedWeight: number;
  isLora: boolean;
}

export const newAstToken = (value: string): PromptAstToken => ({
  type: 'token',
  resolvedWeight: 1.0,
  value,
  isLora: false,
});

export const newAstLoraToken = (
  value: string,
  weight: number
): PromptAstToken => ({
  type: 'token',
  resolvedWeight: weight, // TODO do braces affect LoRAs?
  value,
  isLora: true,
});

interface PromptAstGroupCommon {
  type: 'group';
  groupType: 'curly_bracket' | 'square_bracket';
  bracketCount: number;
  children: Array<PromptAstToken | PromptAstGroup>;
  /** weight assigned using `(text: 1.2)` */
  textWeight: number | undefined;
}

type PromptAstGroupChild = PromptAstGroupCommon & {
  parent: PromptAstGroup;
};
type PromptAstGroupAstRoot = PromptAstGroupCommon & {
  parent: undefined;
};
export type PromptAstGroup = PromptAstGroupChild | PromptAstGroupAstRoot;

/** https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#attentionemphasis */
export const CURLY_BRACKET_ATTENTION = 1.1;
/** https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#attentionemphasis */
export const SQUARE_BRACKET_ATTENTION = 1 / CURLY_BRACKET_ATTENTION;

export const newAstGroup = (
  parent: PromptAstGroup,
  bracket: PromptAstGroup['groupType']
): PromptAstGroup => ({
  type: 'group',
  groupType: bracket,
  bracketCount: 1,
  children: [],
  parent,
  textWeight: undefined,
});

export const isRootNode = (
  astGroup: PromptAstGroup
): astGroup is PromptAstGroupAstRoot => astGroup.parent === undefined;

export const isNotRootNode = (
  astGroup: PromptAstGroup
): astGroup is PromptAstGroupChild => !isRootNode(astGroup);

export interface ParsingMessage {
  level: 'error' | 'warning';
  text: string;
}

export type ParsingResult = [PromptAstGroup, ParsingMessage[]];

export type PromptAstNode = PromptAstToken | PromptAstGroup;
