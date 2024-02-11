export * from './types';
export * from './string';
export * from './zustand';

declare global {
  const IS_PRODUCTION: boolean;
}

export const isProductionBuild = () => Boolean(IS_PRODUCTION);

/** Clamp `x` to be in range `[minVal,maxVal]` */
export const clamp = (x: number, minVal: number, maxVal: number) => {
  const minimum = Math.min(minVal, maxVal);
  const maximum = Math.max(minVal, maxVal);
  return Math.max(minimum, Math.min(maximum, x));
};

/** times(3) -> [1,2,3] */
export const times = (cnt: number) => [...Array(cnt)].map((_, i) => i);

/** Same as `Object.keys()`, but preserves key type if record used */
export function typesafeObjectKeys<T extends string | number | symbol>(
  obj: Record<T, unknown>
): T[] {
  const result = Object.keys(obj);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result as any;
}

export const unique = <T>(...arr: T[]) => {
  return [...new Set(arr)];
};

export const deepClone = <T>(value: T): T => structuredClone(value);

export const generateId = (): string =>
  Math.random().toString(36).replace(/^0\./, '_');

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Async: Could not copy text: ', err);
  }
  return false;
};

export function safeJsonStringify(data: unknown, space?: number): string {
  const seen: unknown[] = [];

  return JSON.stringify(
    data,
    function (_key, val) {
      if (val != null && typeof val == 'object') {
        if (seen.indexOf(val) >= 0) {
          return '<cyclic>';
        }
        seen.push(val);
      }
      return val;
    },
    space
  );
}

export type SortOrder = 'asc' | 'desc';
export const oppositeSortOrder = (o: SortOrder) =>
  o === 'asc' ? 'desc' : 'asc';

export function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number) {
  toIndex = Math.min(arr.length - 1, toIndex);
  const newArr = [...arr];
  newArr.splice(toIndex, 0, newArr.splice(fromIndex, 1)[0]);
  return newArr;
}

export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

export function partition<T>(
  arr: T[],
  cmp: (e: T, idx: number) => boolean
): [T[], T[]] {
  const resultTrue: T[] = [];
  const resultFalse: T[] = [];

  arr.forEach((e, idx) => {
    const res = cmp(e, idx);
    if (res) {
      resultTrue.push(e);
    } else {
      resultFalse.push(e);
    }
  });

  return [resultTrue, resultFalse];
}
