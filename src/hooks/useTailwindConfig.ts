import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';
import { useMediaQuery } from './useMediaQuery.js';
import { ItemType, typesafeObjectKeys } from 'utils';

const fullConfig = resolveConfig(tailwindConfig);

export type TailwindColor = ItemType<typeof TAILWIND_COLORS>;

export const TAILWIND_COLORS = [
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const;

export const isTailwindColor = (color: unknown): color is TailwindColor =>
  color != null &&
  typeof color === 'string' &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TAILWIND_COLORS.includes(color as any);

/** Tailwind's 'sky' */
const DEFAULT_ACCENT_COLOR = {
  '50': '#f0f9ff',
  '100': '#e0f2fe',
  '200': '#bae6fd',
  '300': '#7dd3fc',
  '400': '#38bdf8',
  '500': '#0ea5e9',
  '600': '#0284c7',
  '700': '#0369a1',
  '800': '#075985',
  '900': '#0c4a6e',
  '950': '#082f49',
};

export const applyTailwindColorAccent = (name?: TailwindColor) => {
  const colorTable = fullConfig.theme.accentColor[name || ''];
  const colorTableObj =
    colorTable != undefined && typeof colorTable === 'object'
      ? colorTable
      : DEFAULT_ACCENT_COLOR;

  const root = document.documentElement;
  typesafeObjectKeys(DEFAULT_ACCENT_COLOR).forEach((k) => {
    const colorVal = colorTableObj[k];
    const colorValStr =
      typeof colorVal === 'string' ? colorVal : DEFAULT_ACCENT_COLOR[k];
    root.style.setProperty(`--clr_accent_${k}`, colorValStr);
  });
};

export function useTailwindConfig() {
  return fullConfig;
}

type ScreenSize = keyof (typeof fullConfig)['theme']['screens'];

export function useIsTailwindScreenBreakpoint(size: ScreenSize) {
  const screens = fullConfig.theme.screens;
  const sizePx = screens[size];

  return useMediaQuery(`(min-width: ${sizePx})`);
  /*
  const sizesData = Object.entries(screens).map(([twName, sizePx]) => ({
    twName,
    size: parseInt(sizePx),
    matches: window.matchMedia(`(min-width: ${sizePx})`).matches,
  }));
  // sort ascending (smallest is first)
  const sortedSizes = sizesData.sort((a, b) => a.size - b.size);
  // .filter((e) => e.matches)
  
  return screens;
  */
}
