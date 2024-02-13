import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';
import { useMediaQuery } from './useMediaQuery.js';

const fullConfig = resolveConfig(tailwindConfig);

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
