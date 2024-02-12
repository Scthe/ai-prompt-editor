import { ParsedPrompt } from 'hooks/useParsedPrompt';
import { PromptImage } from './components/imageSelector';

export type PromptId = 'before' | 'after';

export type DiffColumnsSort = 'change' | 'before' | 'after' | 'token';

export type DiffInputData = ParsedPrompt & { image: PromptImage | undefined };
