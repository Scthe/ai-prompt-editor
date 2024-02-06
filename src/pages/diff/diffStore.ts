import { create } from 'zustand';
import { logger } from 'utils';
import { GroupParsingResult } from 'pages/editor/types';
import { PromptImage } from './components/imageSelector';
import { parseAndTokenize } from 'hooks/useParsedPrompt';

// TODO this file is unused.
interface DiffInput {
  image?: PromptImage;
  prompt: string;
  result: GroupParsingResult;
}

const INITIAL_BEFORE =
  'masterpiece, ((best quality)), (super prompt: 1.3), <lora:testLora:2.0>';
const INITIAL_AFTER =
  'masterpiece, (best quality), (super prompt: 1.1), <lora:testLora:0.3>';

const INITIAL_STATE: EditorState['data'] = {
  promptBefore: {
    prompt: INITIAL_BEFORE,
    result: parseAndTokenize(INITIAL_BEFORE),
  },
  promptAfter: {
    prompt: INITIAL_AFTER,
    result: parseAndTokenize(INITIAL_AFTER),
  },
};

interface EditorState {
  data: {
    promptBefore: DiffInput;
    promptAfter: DiffInput;
  };
  // addNewGroup: () => void;
  // removeGroup: (id: EditorGroupId) => void;
  // setDetailsTab: (id: EditorGroupId, tab: DetailsTab) => void;
  // setGroupEnabled: (id: EditorGroupId, isEnabled: boolean) => void;
  // setName: (id: EditorGroupId, name: string) => void;
}

const useDiffStore = create<EditorState>(
  logger(
    (set, get) => ({
      data: INITIAL_STATE,
      /*addNewGroup: () => {
        const { groups } = get();
        const newGr = newGroup();
        set({ groups: [...groups, newGr] });
      },*/
      //
    }),
    'useDiffStore'
  )
);

export default useDiffStore;
