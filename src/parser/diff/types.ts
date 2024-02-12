import { RenderablePromptItem, getNetworkText } from 'parser';

export type PromptDiffEntry = Omit<RenderablePromptItem, 'weight'> & {
  weightA?: number;
  weightB?: number;
};

export const getSortName = (t: PromptDiffEntry) => {
  if (t.type === 'lora' || t.type === 'hypernetwork') {
    return getNetworkText(
      {
        name: t.name,
        type: t.type,
        weight: 1.0, // does not matter for sort
      },
      false
    );
  }
  return t.name;
};

export type PromptDiff = PromptDiffEntry[];

export const stringifyDiffDelta = (item: PromptDiffEntry) => {
  const has = (a: PromptDiffEntry['weightA']): a is number => a !== undefined;

  if (!has(item.weightA) && has(item.weightB)) {
    return 'added' as const;
  }
  if (has(item.weightA) && !has(item.weightB)) {
    return 'removed' as const;
  }
  if (has(item.weightA) && has(item.weightB)) {
    return item.weightB - item.weightA;
  }
  // both undefined?
  return '-' as const;
};
