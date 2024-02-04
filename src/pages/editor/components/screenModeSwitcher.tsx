import React from 'react';
import cx from 'classnames';
import { ScreenMode } from '../types';

export const ScreenModeSwitcher = ({
  activeMode,
  onModeSwitch,
}: {
  activeMode: ScreenMode;
  onModeSwitch: (nextMode: ScreenMode) => void;
}) => {
  const modes = ['editor', 'result'] as const;
  return (
    <div className="fixed mb-6 text-base -translate-x-1/2 left-1/2 top-4">
      <div className="relative grid grid-cols-2 overflow-hidden text-gray-900 capitalize rounded-full shadow-xl w-fit bg-zinc-100">
        <div
          className={cx(
            'absolute top-0 left-0 h-full w-1/2 bg-sky-500 pointer-events-none transition-[left]',
            activeMode === 'editor' ? 'left-0' : 'left-1/2'
          )}
        ></div>
        {modes.map((mode) => (
          <a
            key={mode}
            onClick={(e) => {
              e.preventDefault();
              onModeSwitch(mode);
            }}
            className={cx(
              'block px-8 py-2 relative z-10 transition-colors basis-0',
              mode === activeMode
                ? 'text-white pointer-events-none'
                : 'cursor-pointer hover:bg-sky-100 '
            )}
          >
            {mode}
          </a>
        ))}
      </div>
    </div>
  );
};
