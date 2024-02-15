import {
  applyTailwindColorAccent,
  isTailwindColor,
  TailwindColor,
} from './useTailwindConfig';
import { logger } from 'utils/zustand';
import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'app-accent-theme';

const INITIAL_VALUE: TailwindColor = (() => {
  const fromLS = localStorage.getItem(LOCAL_STORAGE_KEY);
  return isTailwindColor(fromLS) ? fromLS : 'sky';
})();

export function loadInitialColorAccent() {
  try {
    applyTailwindColorAccent(INITIAL_VALUE);
  } catch (e) {
    console.error(e);
  }
}

interface ColorAccentStore {
  color: TailwindColor;
  setAccentColor: (col: TailwindColor) => void;
}

export const useColorAccentStore = create<ColorAccentStore>(
  logger(
    (set) => ({
      color: INITIAL_VALUE,
      setAccentColor: (color) => {
        applyTailwindColorAccent(color);
        set({ color });
        localStorage.setItem(LOCAL_STORAGE_KEY, color);
      },
      //
    }),
    'useColorAccentStore'
  )
);
