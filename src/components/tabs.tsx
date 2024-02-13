import React, { useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { clamp } from 'utils';

export type TabDef<T> = { id: T; label: string; className?: string };

type TabsProps<T> = {
  id: string;
  activeTab: T;
  tabs: TabDef<T>[];
  onTabSwitch: (nextTab: T) => void;
  className?: string;
};

export const Tabs = <T extends string>({
  activeTab,
  id,
  tabs,
  className,
  onTabSwitch,
}: TabsProps<T>): React.ReactElement => {
  const onNextOrPrevTab = useCallback(
    (delta: number) => {
      const currIdx = tabs.findIndex((e) => e.id === activeTab);
      const nextIdx = clamp(currIdx + delta, 0, tabs.length);
      if (currIdx === -1 || nextIdx === currIdx) return;

      onTabSwitch(tabs[nextIdx].id);
    },
    [activeTab, onTabSwitch, tabs]
  );

  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      <ul role="tablist" className="relative flex text-gray-900 capitalize">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Tab
              key={tab.id}
              id={id}
              tab={tab}
              isActive={isActive}
              onTabSwitch={onTabSwitch}
              onNextOrPrevTab={onNextOrPrevTab}
            />
          );
        })}
      </ul>
    </div>
  );
};

type TabProps<T> = {
  id: string;
  isActive: boolean;
  tab: TabDef<T>;
  onTabSwitch: (nextTab: T) => void;
  onNextOrPrevTab: (delta: number) => void;
};

/** Mainly based on: https://inclusive-components.design/tabbed-interfaces/ */
export const Tab = <T extends string>({
  id,
  isActive,
  tab,
  onTabSwitch,
  onNextOrPrevTab,
}: TabProps<T>): React.ReactElement => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const previousIsActiveRef = useRef(isActive);
  const onClick = useCallback(() => onTabSwitch(tab.id), [onTabSwitch, tab.id]);
  const attrs = isActive ? {} : { tabIndex: -1 };

  useEffect(() => {
    if (previousIsActiveRef.current === isActive) return;

    if (isActive) {
      previousIsActiveRef.current = true;
      anchorRef.current?.focus();
    } else {
      previousIsActiveRef.current = false;
    }
  }, [id, isActive]);

  return (
    <motion.li
      layout
      layoutRoot
      role="presentation"
      id={tab.id}
      onClick={onClick}
      className={cx(
        'box-border relative px-4 py-2 group',
        tab.className,
        isActive ? '' : 'cursor-pointer'
      )}
    >
      <a
        ref={anchorRef}
        role="tab"
        aria-selected={isActive}
        tabIndex={0}
        {...attrs}
        onKeyDown={(e) => {
          const isLeft = e.key === 'ArrowLeft';
          const isRight = e.key === 'ArrowRight';
          if (!e.repeat && isActive && (isLeft || isRight)) {
            onNextOrPrevTab(isLeft ? -1 : 1);
          }
        }}
      >
        <span>{tab.label}</span>

        {/* hover. Setting 'border' on <a> messes up active's animation */}
        {!isActive ? (
          <div className="absolute bottom-[-4px] left-0 w-0 group-hover:w-full h-1 bg-sky-300"></div>
        ) : undefined}

        {/* active indicator */}
        {isActive ? (
          <motion.div
            layoutId={id}
            className="absolute left-0 w-full h-1 bottom-[-4px] bg-sky-500"
          ></motion.div>
        ) : undefined}
      </a>
    </motion.li>
  );
};
