import { create } from 'zustand';

import { logger } from 'utils';
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
    enabled: false,
  },
];

interface EditorState {
  groups: EditorGroup[];
  addNewGroup: () => void;
  removeGroup: (id: EditorGroupId) => void;
  setDetailsTab: (id: EditorGroupId, tab: DetailsTab) => void;
  setGroupEnabled: (id: EditorGroupId, isEnabled: boolean) => void;
  setName: (id: EditorGroupId, name: string) => void;
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
          groups: mapWithChange(groups, id, (g) => ({ ...g, tab })),
        });
      },
      setGroupEnabled: (id: EditorGroupId, enabled: boolean) => {
        const { groups } = get();
        set({
          groups: mapWithChange(groups, id, (g) => ({ ...g, enabled })),
        });
      },
      setName: (id: EditorGroupId, name: string) => {
        const { groups } = get();
        set({
          groups: mapWithChange(groups, id, (g) => ({ ...g, name })),
        });
      },
      //
    }),
    'useEditorGroupsStore'
  )
);

export default useEditorGroupsStore;

export const useAllEditorGroups = (): EditorGroupId[] =>
  useEditorGroupsStore((s) => s.groups.map((g) => g.id as EditorGroupId));

export const useEditorGroup = (id: EditorGroupId) =>
  useEditorGroupsStore((s) => s.groups.find((g) => g.id === id));

const mapWithChange = (
  groups: EditorGroup[],
  id: EditorGroup['id'],
  cb: (gr: EditorGroup) => EditorGroup
) => {
  return groups.map((g) => (g.id === id ? cb(g) : g));
};
