import { DetailsTab } from 'components/promptDetails/promptDetailsTabs';
import { generateId } from 'utils';

export type ScreenMode = 'editor' | 'result';

export type EditorGroupId = string;

export interface EditorGroup {
  id: EditorGroupId; // Not stored in localstorage
  name: string;
  enabled: boolean;
  initialPrompt: string;
  tab: DetailsTab;
  /**
   * WARNING: This field is not updated through Zustand!
   * It's updated after each (debounced) keystroke instead
   */
  currentPrompt?: string;
}
export const getCurrentPrompt = (g: EditorGroup | undefined) =>
  g?.currentPrompt || g?.initialPrompt || '';

export const newGroup = (): EditorGroup => ({
  id: generateId(),
  name: 'New group',
  initialPrompt:
    'masterpiece, ((best quality)), (super prompt: 1.3), <lora:testLora:2.0>',
  tab: 'list',
  enabled: true,
});
