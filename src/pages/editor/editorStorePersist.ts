import { s2ms } from 'utils';
import debounce from 'debounce';
import { EditorGroup, newGroup } from './types';

const LOCAL_STORAGE_KEY = 'app-editor-state';

const DEFAULT_INITIAL_VALUE: EditorGroup[] = [
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
      'landscape,(forest ((castle far away))),ocean,river,tree,cloud,sky,grass,<lora:testLora:1.3>,',
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

export const INITIAL_STATE: EditorGroup[] = loadInitialEditorState();

function loadInitialEditorState(): EditorGroup[] {
  try {
    const lsValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    const maybeGroups = deserialize(lsValue);
    return maybeGroups != null && maybeGroups.length > 0
      ? maybeGroups
      : DEFAULT_INITIAL_VALUE;
  } catch (e) {
    console.error(e);
  }

  return DEFAULT_INITIAL_VALUE;

  function deserialize(rawValue: unknown): EditorGroup[] | undefined {
    if (rawValue == null || typeof rawValue !== 'string') {
      return undefined;
    }
    const objArr = JSON.parse(rawValue);
    if (!Array.isArray(objArr)) return undefined;

    return objArr.reduce((acc, obj) => {
      if (obj !== null && typeof obj === 'object') {
        const grp: EditorGroup = {
          ...newGroup(),
          ...obj,
        };
        return [...acc, grp];
      }
      return acc;
    }, [] as EditorGroup[]);
  }
}

const persistEditorStateInternal = (state: EditorGroup[]) => {
  const storedGroups = state.map((gr) => ({
    ...gr,
    initialPrompt: gr.currentPrompt || gr.initialPrompt,
  }));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedGroups));
};

export const persistEditorState = debounce(persistEditorStateInternal, s2ms(2));

export const resetEditorState = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
