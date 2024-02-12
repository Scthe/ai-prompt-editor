import { traverse } from './ast-utils';
import {
  PromptAstAlternate,
  PromptAstGroup,
  PromptAstScheduled,
  WithTextPosition,
} from './ast/types';

/** Turn positions into texts like. This way, we do not care about position shifts */
interface Replace {
  originalText: string;
  replacement: string;
}

export const resolveAlternateAndScheduled = (
  prompt: string,
  ast: PromptAstGroup,
  currentStep = 0,
  maxSteps = 10
) => {
  const scheduledArr: PromptAstScheduled[] = [];
  const alternateArr: PromptAstAlternate[] = [];

  traverse(ast, (node) => {
    if (node.type === 'scheduled') {
      scheduledArr.push(node);
    }
    if (node.type === 'alternate') {
      alternateArr.push(node);
    }
  });

  const replaceArr: Replace[] = [];

  scheduledArr.forEach((scheduled) => {
    const useTo = isScheduledUsingTo(scheduled, currentStep, maxSteps);
    const replacement = useTo ? scheduled.to : scheduled.from;
    // console.log({ useTo, replacement, currentStep, maxSteps });
    const originalText = getPromptTextRange(prompt, scheduled);
    replaceArr.push({ replacement, originalText });
  });

  alternateArr.forEach((alternate) => {
    const replacement = alternate.values[currentStep % alternate.values.length];
    const originalText = getPromptTextRange(prompt, alternate);
    replaceArr.push({ replacement, originalText });
  });

  // apply replacements
  replaceArr.forEach((replace) => {
    prompt = prompt.replaceAll(replace.originalText, replace.replacement);
  });

  return prompt;
};

const getPromptTextRange = (prompt: string, pos: WithTextPosition): string => {
  return prompt.substring(pos.startPos, pos.endPos);
};

const isScheduledUsingTo = (
  scheduled: PromptAstScheduled,
  currentStep: number,
  maxSteps: number
) => {
  if (scheduled.changeAt >= 1.0) {
    return scheduled.changeAt >= currentStep;
  }

  const scheduledFraction = currentStep / maxSteps;
  return scheduled.changeAt >= scheduledFraction;
};
