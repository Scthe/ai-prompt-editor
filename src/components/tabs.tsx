import React, { useLayoutEffect, useRef } from 'react';
import cx from 'classnames';

export type TabDef<T> = { id: T; label: string };

type TabsProps<T> = {
  activeTab: T;
  tabs: Array<{ id: T; label: string }>;
  onTabSwitch: (nextTab: T) => void;
};

// TODO incorrect indicator position if initial tab is not first
//      Investigate what/when changes using https://github.com/streamich/react-use/blob/master/src/useMeasure.ts
export const Tabs = <T extends string>({
  activeTab,
  tabs,
  onTabSwitch,
}: TabsProps<T>): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const indicatorEl = indicatorRef.current;
    const containerEl = containerRef.current;
    if (!indicatorEl || !containerEl) return;
    const nextActiveChildEl = Array.from(containerEl.children).find(
      (e) => e.id === activeTab
    );

    if (nextActiveChildEl) {
      const buttonRect = nextActiveChildEl.getBoundingClientRect();

      const containerRect = containerEl.getBoundingClientRect();
      const left = buttonRect.left - containerRect.left;
      indicatorEl.style.width = `${buttonRect.width}px`;
      indicatorEl.style.transform = `translateX(${left}px)`;
    }
  }, [activeTab]);

  return (
    <div className="flex flex-wrap justify-center">
      <div
        ref={containerRef}
        className="relative flex text-gray-900 capitalize"
      >
        <div
          ref={indicatorRef}
          className="absolute bottom-0 left-0 w-[40px] h-1 bg-sky-500 transition-[transform,width]"
        ></div>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <a
              key={tab.id}
              id={tab.id}
              onClick={() => onTabSwitch(tab.id)}
              className={cx(
                'block px-4 py-2 hover:border-sky-500/50 border-b-4',
                isActive ? '' : 'cursor-pointer'
              )}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </div>
  );
};
