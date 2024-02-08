import { create } from 'zustand';

import { logger, arrayMove } from 'utils';
import {
  DetailsTab,
  EditorGroup,
  EditorGroupId,
  newGroup,
} from 'pages/editor/types';
import debounce from 'debounce';

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
  {
    ...newGroup(),
    name: 'Test group 2',
  },
  {
    ...newGroup(),
    name: 'Test group 3',
  },
];

interface EditorState {
  groups: EditorGroup[];
  addNewGroup: () => void;
  removeGroup: (id: EditorGroupId) => void;
  setDetailsTab: (id: EditorGroupId, tab: DetailsTab) => void;
  setGroupEnabled: (id: EditorGroupId, isEnabled: boolean) => void;
  setName: (id: EditorGroupId, name: string) => void;
  // dragging:
  draggedGroup: EditorGroupId | undefined;
  setDraggedGroup: (id: EditorGroupId | undefined) => void;
  moveGroup: (id: EditorGroupId, draggedOverId: EditorGroupId) => void;
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
      // dragging:
      draggedGroup: undefined,
      setDraggedGroup: (id: EditorGroupId | undefined) =>
        set({ draggedGroup: id }),
      moveGroup: (id: EditorGroupId, draggedOverId: EditorGroupId) => {
        // console.log('moveGroup', { id, draggedOverId });
        const { groups } = get();
        const oldIdx = groups.findIndex((g) => g.id == id);
        const newIdx = groups.findIndex((g) => g.id == draggedOverId);
        if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
          const newOrder = arrayMove(groups, oldIdx, newIdx);
          set({ groups: newOrder });
        }
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

export const useIsDraggingAnyGroup = () =>
  useEditorGroupsStore((s) => s.draggedGroup !== undefined);

const mapWithChange = (
  groups: EditorGroup[],
  id: EditorGroup['id'],
  cb: (gr: EditorGroup) => EditorGroup
) => {
  return groups.map((g) => (g.id === id ? cb(g) : g));
};

const storeCurrentTextNow = (groupId: EditorGroupId, text: string) => {
  const group = useEditorGroupsStore
    .getState()
    .groups.find((g) => g.id === groupId);
  if (group) {
    group.currentPrompt = text;
  }
};

export const storeCurrentText = debounce(storeCurrentTextNow, 1000);

export const persistCurrentPromptsAsInitial = () => {
  const groups = useEditorGroupsStore.getState().groups;
  groups.forEach((g) => {
    if (g.currentPrompt !== undefined) {
      g.initialPrompt = g.currentPrompt;
    }
  });
};
