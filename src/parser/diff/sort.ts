import { cmpAlphabetical } from 'utils';
import { DiffColumnsSort } from '../../pages/diff/types';
import { PromptDiffEntry, getSortName, stringifyDiffDelta } from './types';

export const SORTERS: Record<
  DiffColumnsSort,
  (a: PromptDiffEntry, b: PromptDiffEntry) => number
> = {
  change: (a, b) => {
    const deltaA = stringifyDiffDelta(a);
    const deltaB = stringifyDiffDelta(b);

    if (typeof deltaA === 'number' && typeof deltaB === 'number') {
      // both numbers
      return deltaB - deltaA;
    }
    if (typeof deltaA === 'number') return -1;
    if (typeof deltaB === 'number') return 1;

    // At this point we do not have to consider numbers.
    // Only possible values are ["added" | "removed" | "-"].
    // And "-" is just theoretical.
    const cmpDeltaStr = cmpAlphabetical(deltaA, deltaB);
    return cmpDeltaStr === 0 ? SORTERS.token(a, b) : cmpDeltaStr;
  },
  before: (a, b) => {
    const res = compareValues(a.weightA, b.weightA);
    return res === 0 ? SORTERS.token(a, b) : res;
  },
  after: (a, b) => {
    const res = compareValues(a.weightB, b.weightB);
    return res === 0 ? SORTERS.token(a, b) : res;
  },
  token: (a, b) => {
    const nameA = getSortName(a);
    const nameB = getSortName(b);
    return cmpAlphabetical(nameA, nameB);
  },
};

const compareValues = (a: number | undefined, b: number | undefined) => {
  if (a === b) return 0;
  if (a !== undefined && b !== undefined) {
    return b - a;
  }
  // at this point, one of them (but not both) is undefined
  return a === undefined ? 1 : -1;
};
