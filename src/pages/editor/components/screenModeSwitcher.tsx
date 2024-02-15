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
    <div
      className={cx(
        'fixed z-20 text-base -translate-x-1/2 left-1/2',
        'bottom-2 md:bottom-auto md:top-4' // placement
      )}
    >
      <div className="relative grid grid-cols-2 overflow-hidden capitalize border rounded-md shadow-xl w-fit bg-card border-elevated">
        {/* moving background */}
        <div
          className={cx(
            'absolute top-0 left-0 h-full w-1/2 bg-accent-500 pointer-events-none transition-[left]',
            activeMode === 'editor' ? 'left-0' : 'left-1/2'
          )}
        ></div>

        {/* tabs */}
        {modes.map((mode) => (
          <a
            autoFocus={mode === 'editor'}
            tabIndex={0}
            key={mode}
            onClick={(e) => {
              e.preventDefault();
              onModeSwitch(mode);
            }}
            className={cx(
              'block relative z-10 transition-colors basis-0',
              'px-4 sm:px-8 py-2',
              // fix focus cause overflow-hidden on parent
              'first-of-type:rounded-tl-md first-of-type:rounded-bl-md',
              'last:rounded-tr-md last:rounded-br-md',
              'ring-inset',
              // usual active stuff
              mode === activeMode
                ? 'text-white pointer-events-none'
                : 'cursor-pointer hover:bg-interactive '
            )}
          >
            {mode}
          </a>
        ))}
      </div>
    </div>
  );
};
