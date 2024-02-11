export type PromptAstNode = PromptAstToken | PromptAstBreak | PromptAstGroup;

//////////////
/// Token

export interface PromptAstToken {
  type: 'token';
  /** text of the prompt token. */
  value: string;
  resolvedWeight?: number;
}

export const newAstToken = (value: string): PromptAstToken => ({
  type: 'token',
  value,
});

//////////////
/// BREAK Token

export interface PromptAstBreak {
  type: 'break';
}

export const newAstBreak = (): PromptAstBreak => ({ type: 'break' });

//////////////
/// Group

interface PromptAstGroupCommon {
  type: 'group';
  groupType: 'curly_bracket' | 'square_bracket';
  bracketCount: number;
  children: Array<PromptAstNode>;
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

export const newAstGroup = (
  parent: PromptAstGroup | undefined,
  bracket: PromptAstGroup['groupType']
): PromptAstGroup => ({
  type: 'group',
  groupType: bracket,
  bracketCount: 1,
  children: [],
  parent,
  textWeight: undefined,
});

export const hasNoChildren = (astGroup: PromptAstGroup) =>
  astGroup.children.length === 0;

export const isRootNode = (
  astGroup: PromptAstGroup
): astGroup is PromptAstGroupAstRoot => astGroup.parent === undefined;

export const isNotRootNode = (
  astGroup: PromptAstGroup
): astGroup is PromptAstGroupChild => !isRootNode(astGroup);
