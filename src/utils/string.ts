import { times } from 'utils';

export const removeLineBreaks = (str: string) =>
  str.replace(/(\r\n|\n|\r)/gm, '');

export const removePrefix = (str: string, prefix: string) =>
  str.startsWith(prefix) ? str.substring(prefix.length) : str;

export const removeSuffix = (str: string, suffix: string) =>
  str.endsWith(suffix) ? str.substring(0, str.length - suffix.length) : str;

export const removeAt = <T>(arr: T[], idx: number) => {
  return arr.toSpliced(idx, 1);
};

export const duplicateStr = (str: string, cnt: number) => {
  return times(cnt)
    .map((_a) => str)
    .join('');
};
