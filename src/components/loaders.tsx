import { ANIMATION_SPEED } from 'animation';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface Props {
  visible: boolean;
}

export default function PromptLoader({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="loader-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ANIMATION_SPEED.fast }}
          className="absolute top-0 left-0 z-10 w-full h-full"
        >
          <div className="flex items-center justify-center w-full h-full bg-gray-400/80 dark:bg-zinc-800/80">
            <div className="absolute w-8 h-8 border-4 border-t-4 rounded-md border-accent-500 animate-spin"></div>
          </div>
        </motion.div>
      ) : undefined}
    </AnimatePresence>
  );
}
