import { cmpAlphabetical } from 'utils';
import { PromptAstGroup, PromptAstToken, newAstGroup } from './ast/types';
import { PromptChunk } from './clipTokenize';
import { PromptExternalNetwork } from './extractNetworks';
import { WeightedToken } from './parsePromptAttention';

export interface ParsingMessage {
  level: 'error' | 'warning';
  text: string;
}

export interface ParsingResult {
  ast: PromptAstGroup;
  /**
   * As seen by webui. Example entries:
   * - 'aaa,bbb,,,c'
   * - ','
   */
  flatWeightedTokenList: WeightedToken[];
  /** Tokens + weights in user-friendly form */
  cleanedTokenWeights: WeightedToken[];
  tokenChunks: PromptChunk[];
  tokenCount: number;
  networks: PromptExternalNetwork[];
  messages: ParsingMessage[];
}

/** Needed on first render, before parsing is complete */
export const EMPTY_PARSING_RESULT: ParsingResult = {
  ast: newAstGroup(undefined, 'curly_bracket'),
  flatWeightedTokenList: [],
  cleanedTokenWeights: [],
  tokenChunks: [],
  tokenCount: 0,
  networks: [],
  messages: [],
};

//////////////////////////////
/// RenderablePromptItem

/** Generic wrapper for most things that can be rendered */
export interface RenderablePromptItem {
  type: PromptExternalNetwork['type'] | 'text';
  name: string;
  weight: number;
}

export const isRenderableNetwork = (
  n: RenderablePromptItem
): n is PromptExternalNetwork => n.type === 'lora' || n.type === 'hypernetwork';

export const astTokenAsRenderable = (
  t: PromptAstToken
): RenderablePromptItem => ({
  type: 'text',
  name: t.value,
  weight: t.resolvedWeight === undefined ? 1 : t.resolvedWeight,
});

export const weightedTokenAsRenderable = (
  e: WeightedToken
): RenderablePromptItem => ({
  name: e[0],
  weight: e[1],
  type: 'text',
});

export const networkAsRenderable = (
  e: PromptExternalNetwork
): RenderablePromptItem => e;

export type RenderablePromptItemSortOrder =
  | 'prompt'
  | 'alphabetical'
  | 'attention';

export function sortRenderablePromptItem(
  nodes: RenderablePromptItem[],
  order: RenderablePromptItemSortOrder
) {
  switch (order) {
    case 'attention': {
      nodes.sort((a, b) => b.weight - a.weight);
      break;
    }
    case 'alphabetical': {
      nodes.sort((a, b) => cmpAlphabetical(a.name, b.name));
      break;
    }
  }
}

export const getAllRenderables = (
  result: ParsingResult
): RenderablePromptItem[] => {
  const tokens: RenderablePromptItem[] = result.flatWeightedTokenList.map(
    weightedTokenAsRenderable
  );
  return [...tokens, ...result.networks];
};
