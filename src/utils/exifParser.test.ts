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
  });
});
