export * from './types';
export * from './string';

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
