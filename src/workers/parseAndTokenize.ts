import { tokenizeAndParsePrompt } from 'parser';

onmessage = async (msg) => {
  // console.log('Worker.start', { ...msg, data: msg.data });
  const text: string = msg.data;
  const result = tokenizeAndParsePrompt(text);
  // console.log('Worker.willResolve', result);
  postMessage(result);
};
