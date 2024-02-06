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

export const cmpAlphabetical = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export function formatBytes(bytes: number, decimals = 2) {
  const K_UNIT = 1024;
  const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes == 0) return '0 Byte';

  let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
  i = Math.min(i, SIZES.length - 1);
  const dec = bytes / Math.pow(K_UNIT, i);
  const unit = SIZES[i];
  return `${dec.toFixed(decimals)} ${unit}`;
}
