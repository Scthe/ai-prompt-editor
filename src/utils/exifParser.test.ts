import { describe, expect, test } from '@jest/globals';
import { parseAiParams } from './exifParser';

describe('exifParser', () => {
  describe('parseAiParams()', () => {
    const NEGATIVE_PROMPT_START = 'Negative prompt:';

    const POSITIVE = 'masterpiece, top quality,';
    const NEGATIVE = 'EasyNegative, badhandv4, nfixer';
    const SETTINGS =
      'Steps: 30, Sampler: DPM++ 2M Karras, CFG scale: 7, Seed: 4125126831, Size: 1024x1536, Model hash: 4d91c4c217, Model: lyriel_v15, Denoising strength: 0.13';
    const SETTINGS_OBJ = {
      'CFG scale': '7',
      'Denoising strength': '0.13',
      Model: 'lyriel_v15',
      'Model hash': '4d91c4c217',
      Sampler: 'DPM++ 2M Karras',
      Seed: '4125126831',
      Size: '1024x1536',
      Steps: '30',
    };

    test('parses OK text', () => {
      const text = `${POSITIVE}\n${NEGATIVE_PROMPT_START} ${NEGATIVE}\n${SETTINGS}`;
      const result = parseAiParams(text);
      expect(result?.positivePrompt).toEqual(POSITIVE);
      expect(result?.negativePrompt).toEqual(NEGATIVE);
      expect(result?.settings).toEqual(SETTINGS_OBJ);
    });

    test('parses only positive', () => {
      const text = `${POSITIVE}`;
      const result = parseAiParams(text);
      expect(result?.positivePrompt).toEqual(POSITIVE);
      expect(result?.negativePrompt).toEqual('');
      expect(result?.settings).toEqual({});
    });

    test('parses with missing settings', () => {
      const text = `${POSITIVE}\n${NEGATIVE_PROMPT_START} ${NEGATIVE}`;
      const result = parseAiParams(text);
      expect(result?.positivePrompt).toEqual(POSITIVE);
      expect(result?.negativePrompt).toEqual(NEGATIVE);
      expect(result?.settings).toEqual({});
    });

    test('allows nested settings objects', () => {
      const settingsStr = `Steps: 50, Sampler: Euler a, Hires upscaler: 4x-UltraSharp,ADetailer dilate/erode: 4, Lora hashes: "XenoDetailer: e73f1b0f16e6", TI hashes: "ng_deepnegative_v1_75t: 54e7e4826d53, badhandv4: 5e40d722fc3d, verybadimagenegative_v1.3: d70463f87042, easynegative: c74b4e810b03", Version: v1.6.0, Hashes: {"lora:XenoDetailer": "1e34248e31", "model": "8d1fbf59b0"}, ArrTest: ["aa",{c:d}]`;
      const text = `${POSITIVE}\n${NEGATIVE_PROMPT_START} ${NEGATIVE}\n${settingsStr}`;

      const result = parseAiParams(text);

      expect(result?.positivePrompt).toEqual(POSITIVE);
      expect(result?.negativePrompt).toEqual(NEGATIVE);
      expect(result?.settings).toEqual({
        Steps: '50',
        Sampler: 'Euler a',
        'Hires upscaler': '4x-UltraSharp',
        'Lora hashes': '"XenoDetailer: e73f1b0f16e6"',
        'TI hashes':
          '"ng_deepnegative_v1_75t: 54e7e4826d53, badhandv4: 5e40d722fc3d, verybadimagenegative_v1.3: d70463f87042, easynegative: c74b4e810b03"',
        Version: 'v1.6.0',
        Hashes: '{"lora:XenoDetailer": "1e34248e31", "model": "8d1fbf59b0"}',
        'ADetailer dilate/erode': '4',
        ArrTest: '["aa",{c:d}]',
      });
    });

    test('does not crash on invalid settings string', () => {
      // unterminated '[', will return as much as possible before the error
      const settingsStr = `Steps: 50, ArrTest: [aaaa, Sampler: Euler a`;
      const text = `${POSITIVE}\n${NEGATIVE_PROMPT_START} ${NEGATIVE}\n${settingsStr}`;

      const result = parseAiParams(text);

      expect(result?.positivePrompt).toEqual(POSITIVE);
      expect(result?.negativePrompt).toEqual(NEGATIVE);
      expect(result?.settings).toEqual({
        Steps: '50',
      });
    });
  });
});
