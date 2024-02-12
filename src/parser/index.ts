export * from './ast/types';
export type { PromptChunk } from './clipTokenize';
export { hasNoChunks } from './clipTokenize';
export type { PromptExternalNetwork } from './extractNetworks';
export { getNetworkText } from './extractNetworks';
export type { WeightedToken } from './parsePromptAttention';
export { BREAK_TOKEN, isBreakToken } from './parsePromptAttention';
export * from './types';
export * from './diff';

import {
  detectDuplicateNetworks,
  detectDuplicates,
  writeWeights,
} from './ast-utils';
import { foldGroups } from './ast-utils/foldGroups';
import { parse } from './ast/parse';
import { newAstGroup, newAstBreak } from './ast/types';
import { tokenize } from './clipTokenize';
import { extractNetworks } from './extractNetworks';
import {
  WeightedToken,
  isBreakToken,
  parsePromptAttention,
} from './parsePromptAttention';
import { resolveAlternateAndScheduled } from './resolveAlternateAndScheduled';
import { ParsingMessage, ParsingResult } from './types';

export function tokenizeAndParsePrompt(prompt: string): ParsingResult {
  const messages: ParsingMessage[] = [];

  const [promptNoNetworks, networks] = extractNetworks(prompt);

  // create AST to get accurate text representation
  const ast = createAST(promptNoNetworks, messages);

  // text-replace all alternatives and scheduled with final versions
  const cleanedPrompt = resolveAlternateAndScheduled(promptNoNetworks, ast);

  // create 'WeightedToken' array -> Array<[text, weight]>
  const flatWeightedTokenList = parsePromptAttention(cleanedPrompt);

  // clip tokenize each WeightedToken
  const [tokenChunks, tokenCount] = tokenize(flatWeightedTokenList);

  // final fixes and warnings
  const cleanedTokenWeights = cleanTokenWeights(flatWeightedTokenList);
  writeWeights(ast, cleanedTokenWeights, messages);
  detectDuplicates(ast, messages);
  detectDuplicateNetworks(networks, messages);
  foldGroups(ast);

  return {
    ast,
    flatWeightedTokenList,
    cleanedTokenWeights,
    tokenChunks,
    tokenCount,
    networks,
    messages,
  };
}

const createAST = (prompt: string, messages: ParsingMessage[]) => {
  const BREAK_REGEX = /\s*\bBREAK\b\s*/g; // requires space before and after

  // webui does not do this, but if you have an unmatched brace
  // (e.g. '(normal text BREAK (text:1.2)'), it will tokenize it
  // with invalid weight (['BREAK', -1.1]), which may mess up clip
  // hijack steps. If we split now and there is an unmatched brace,
  // AST will fail, which is good.
  const parts = prompt.split(BREAK_REGEX);

  const root = newAstGroup(undefined, 'curly_bracket');
  parts.forEach((part, idx) => {
    if (idx > 0) {
      root.children.push(newAstBreak());
    }

    try {
      const childAST = parse(part);
      root.children.push(...childAST.children);
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Unknown parser error';
      messages.push({ level: 'error', text });
    }
  });

  return root;
};

const cleanTokenWeights = (weights: WeightedToken[]) => {
  const result: WeightedToken[] = [];

  weights.forEach((token) => {
    if (isBreakToken(token)) return;

    const [text, weight] = token;
    const parts = text.split(',');
    parts.forEach((part) => {
      part = part.trim();
      if (part.length) {
        result.push([part, weight]);
      }
    });
  });

  return result;
};
