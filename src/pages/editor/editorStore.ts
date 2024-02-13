import { create } from 'zustand';

import { logger, arrayMove } from 'utils';
import { EditorGroup, EditorGroupId, newGroup } from 'pages/editor/types';
import debounce from 'debounce';
import { DetailsTab } from 'components/promptDetails';

const INITIAL_STATE: EditorGroup[] = [
  {
    ...newGroup(),
    name: 'My super style',
    initialPrompt:
      'masterpiece,best quality, (realistic,photorealistic:1.3),(highly detailed, colorful),[vibrant colors],(soft light),absurdres,',
  },
  {
    ...newGroup(),
    name: 'Subject',
    initialPrompt:
      'landscape,(forest ((castle far away))),ocean,river,tree,cloud,sky,grass',
  },
  {
    ...newGroup(),
    name: 'Environment and misc',
    initialPrompt:
      'night,starry sky,nebula,landscape,horizon,nature,mountain, (Fujifilm XT3), (photorealistic:1.3),beautiful detailed sky',
  },
  {
    ...newGroup(),
    name: 'BREAK preview',
    initialPrompt:
      'flowers, roses,beach, fantasy,moon, smoke, fire, key visual BREAK after break',
  },
  {
    ...newGroup(),
    name: 'Test - alternate, scheduled',
    enabled: false,
    initialPrompt:
      '(111) ([fromA:toA:0.25]) 222, [toB:0.35], 333, [fromC::0.45], 444, [aaaD|bbD], 555, [aaaE|bbE|cE], 666',
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
