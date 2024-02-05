/* eslint-disable no-console */
import { create } from 'zustand';

import { deepClone, logger } from 'utils';
import {
  DetailsTab,
  EditorGroup,
  EditorGroupId,
  newGroup,
} from 'pages/editor/types';

const INITIAL_STATE: EditorGroup[] = [
  {
    ...newGroup(),
    name: 'Test group 0',
  },
  {
    ...newGroup(),
    name: 'Test group 1',
    tab: 'messages',
  },
];

interface EditorState {
  groups: EditorGroup[];
  addNewGroup: () => void;
  removeGroup: (id: EditorGroupId) => void;
  setDetailsTab: (id: EditorGroupId, tab: DetailsTab) => void;
}

const useEditorGroupsStore = create<EditorState>(
  logger(
    (set, get) => ({
      groups: INITIAL_STATE,
      addNewGroup: () => {
        const { groups } = get();
        const newGr = newGroup();
        set({ groups: [...groups, newGr] });
      },
      removeGroup: (id: EditorGroupId) => {
        const { groups } = get();
        set({ groups: groups.filter((g) => g.id !== id) });
      },
      setDetailsTab: (id: EditorGroupId, tab: DetailsTab) => {
        const { groups } = get();
        set({
          groups: groups.map((g) => {
            if (g.id !== id) {
              return g;
            }
            return { ...g, tab };
          }),
        });
      },
    }),
    'useEditorGroupsStore'
  )
);

export default useEditorGroupsStore;

export const useAllEditorGroups = (): EditorGroupId[] =>
  useEditorGroupsStore((s) => s.groups.map((g) => g.id as EditorGroupId));

export const useEditorGroup = (id: EditorGroupId) =>
  useEditorGroupsStore((s) => s.groups.find((g) => g.id === id));
