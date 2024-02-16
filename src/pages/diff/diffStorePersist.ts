import { s2ms } from 'utils';
import debounce from 'debounce';
import { PromptId } from './types';

const INITIAL_BEFORE =
  'masterpiece, ((best quality)), (super prompt: 1.3), <lora:testLora:2.0> removedOne';
const INITIAL_AFTER =
  'masterpiece, (best quality), (super prompt: 1.1), <lora:testLora:0.3> newOne';

const getLocalStorageKey = (id: PromptId) => `app-diff-state-${id}`;

type DiffPeristedState = Record<PromptId, string>;

export const INITAL_PROMPTS = loadInitialPrompts();

function loadInitialPrompts(): DiffPeristedState {
  const before = loadInitialPrompt('before') || INITIAL_BEFORE;
  const after = loadInitialPrompt('after') || INITIAL_AFTER;

  return { before, after };

  function loadInitialPrompt(id: PromptId) {
    try {
      const key = getLocalStorageKey(id);
      const value = localStorage.getItem(key);
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    } catch (e) {
      console.error(e);
    }
  }
}

const persistPromptInternal = (id: PromptId, text: string) => {
  const key = getLocalStorageKey(id);
  localStorage.setItem(key, text);
};

export const persistDiffState = debounce(persistPromptInternal, s2ms(2));

export const resetDiffState = () => {
  localStorage.removeItem(getLocalStorageKey('before'));
  localStorage.removeItem(getLocalStorageKey('after'));
};
