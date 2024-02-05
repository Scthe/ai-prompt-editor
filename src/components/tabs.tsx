import React from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';

export type TabDef<T> = { id: T; label: string };

type TabsProps<T> = {
  id: string;
  activeTab: T;
  tabs: TabDef<T>[];
  onTabSwitch: (nextTab: T) => void;
};

export const Tabs = <T extends string>({
  activeTab,
  id,
  tabs,
  onTabSwitch,
}: TabsProps<T>): React.ReactElement => {
  return (
    <div className="flex flex-wrap justify-center">
      <div className="relative flex text-gray-900 capitalize">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <motion.a
              layout
              layoutRoot
              key={tab.id}
              id={tab.id}
              onClick={() => onTabSwitch(tab.id)}
              className={cx(
                'box-border relative block px-4 py-2 group',
                isActive ? '' : 'cursor-pointer'
              )}
            >
              <span>{tab.label}</span>

              {/* hover. Setting 'border' on <a> messes up active's animation */}
              {!isActive ? (
                <div className="absolute bottom-[-4px] left-0 w-0 group-hover:w-full h-1 bg-sky-300"></div>
              ) : undefined}

              {/* active */}
              {isActive ? (
                <motion.div
                  layoutId={id}
                  className="absolute left-0 w-full h-1 bottom-[-4px] bg-sky-500"
                ></motion.div>
              ) : undefined}
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};
