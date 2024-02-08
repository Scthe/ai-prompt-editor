import { GroupParsingResult } from 'pages/editor/types';
import { parsePrompt } from 'parser';
import { tokenizeGpt4 } from 'utils/gpt4Tokenizer';

onmessage = async (msg) => {
  // console.log('Worker.start', { ...msg, data: msg.data });
  const text: string = msg.data;
  const result = await parseAndTokenize(text);
  // console.log('Worker.willResolve', result);
  postMessage(result);
};

const parseAndTokenize = async (text: string): Promise<GroupParsingResult> => {
  const [ast, messages] = parsePrompt(text);
  const tokens = await tokenizeGpt4(ast);
  return { ast, messages, tokens };
};
