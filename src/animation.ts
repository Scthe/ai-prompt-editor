import { DynamicAnimationOptions, EasingDefinition } from 'framer-motion';

export const ANIMATION_SPEED = {
  fast: 0.2,
  medium: 0.5,
};

export const EASE_OUT_CUBIC: EasingDefinition = [0.33, 1, 0.68, 1];

export const FAST_CUBIC: DynamicAnimationOptions = {
  ease: EASE_OUT_CUBIC,
  duration: ANIMATION_SPEED.fast,
};
