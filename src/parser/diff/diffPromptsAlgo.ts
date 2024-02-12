import { PromptExternalNetwork, WeightedToken } from 'parser';
import { ParsingResult } from '../types';
import { PromptDiff, PromptDiffEntry } from './types';
import { partition, unique } from 'utils';

/**
 * Returns:
 *
 * - `[0]` - tokens/networks that did not change
 * - `[1]` - diffs for changed tokens/networks
 *
 * **Note:** diffing if you have duplicates is hmm.. this case is ignored.
 */
export const diffPrompts = (
  promptA: ParsingResult,
  promptB: ParsingResult
): [PromptDiff, PromptDiff] => {
  const tokensDiff = diffTokens(
    promptA.cleanedTokenWeights,
    promptB.cleanedTokenWeights
  );

  const [lorasA, hypernetsA] = partition(
    promptA.networks,
    (n) => n.type === 'lora'
  );
  const [lorasB, hypernetsB] = partition(
    promptB.networks,
    (n) => n.type === 'lora'
  );

  const lorasDiff = diffNetworks('lora', lorasA, lorasB);
  const hypernetsDiff = diffNetworks('hypernetwork', hypernetsA, hypernetsB);

  return [
    [...tokensDiff[0], ...lorasDiff[0], ...hypernetsDiff[0]],
    [...tokensDiff[1], ...lorasDiff[1], ...hypernetsDiff[1]],
  ];
};

const diffTokens = (tokensA: WeightedToken[], tokensB: WeightedToken[]) => {
  let allTokenNames: string[] = [];

  const createNameToWeightMap = (tokens: WeightedToken[]) => {
    const mmap = new Map<string, number>();
    tokens.forEach((t) => {
      const [name, weight] = t;
      mmap.set(name, weight);
      allTokenNames.push(name);
    });
    return mmap;
  };

  const mmapA = createNameToWeightMap(tokensA);
  const mmapB = createNameToWeightMap(tokensB);
  allTokenNames = unique(...allTokenNames);

  const changed: PromptDiffEntry[] = [];
  const notChanged: PromptDiffEntry[] = [];

  allTokenNames.forEach((name) => {
    const weightA = mmapA.get(name);
    const weightB = mmapB.get(name);
    const entry: PromptDiffEntry = {
      name,
      type: 'text',
      weightA,
      weightB,
    };

    if (isSameWeight(weightA, weightB)) {
      notChanged.push(entry);
    } else {
      changed.push(entry);
    }
  });

  return [notChanged, changed];
};

const diffNetworks = (
  type: PromptDiffEntry['type'],
  netA: PromptExternalNetwork[],
  netB: PromptExternalNetwork[]
) => {
  const tokensA: WeightedToken[] = netA.map((e) => [e.name, e.weight]);
  const tokensB: WeightedToken[] = netB.map((e) => [e.name, e.weight]);
  const [notChanged, changed] = diffTokens(tokensA, tokensB);
  return [
    notChanged.map((e) => ({ ...e, type })),
    changed.map((e) => ({ ...e, type })),
  ];
};

const isSameWeight = (
  weightA: number | undefined,
  weightB: number | undefined
): boolean => {
  const closeEnough =
    weightA !== undefined &&
    weightB !== undefined &&
    Math.abs(weightA - weightB) < 0.001; // usual float compare stuff

  return weightA === weightB || closeEnough;
};
