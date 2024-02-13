import React from 'react';
import useMeasure from 'react-use-measure';
import { motion } from 'framer-motion';
import { ANIMATION_SPEED } from 'animation';

type Props = React.PropsWithChildren<{
  triggerKey: string;
}>;

export const CardContentAnimatedHeight = ({ triggerKey, children }: Props) => {
  const [ref, { height }] = useMeasure();

  return (
    <motion.div animate={{ height: height ? height : 'auto' }}>
      <motion.div
        ref={ref}
        key={triggerKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: ANIMATION_SPEED.fast,
          duration: ANIMATION_SPEED.fast,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
