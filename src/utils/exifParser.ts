import * as ExifReader from 'exifreader';
import Tokenizer from 'utils/tokenizer';

export interface AiImageExif {
  name: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  rawAiParams?: string;
  aiParams?: ExifAiParam;
}

export interface ExifAiParam {
  positivePrompt: string;
  negativePrompt: string;
  settings: Record<string, string>;
}

export async function parseExif(file: File): Promise<AiImageExif> {
  const { name, type, size } = file;
  const tags = await ExifReader.load(file);

  const width = tags['Image Width']?.value;
  const height = tags['Image Height']?.value;
  const rawAiParams = tags['parameters']?.value;

  let aiParams = undefined;
  if (typeof rawAiParams === 'string' && rawAiParams.length > 0) {
    aiParams = parseAiParams(rawAiParams);
  }

  return {
    name,
    type,
    size,
    width,
    height,
    rawAiParams,
    aiParams,
  };
}

/** Exported for unit tests. Crappy, but better than not testing */
export function parseAiParams(params: string): ExifAiParam | undefined {
  let settings: ExifAiParam['settings'] = {};
  const settingsStart = params.indexOf('Steps:');
  if (settingsStart !== -1) {
    const settingsStr = params.substring(settingsStart);
    settings = parseSettings(settingsStr);
    params = params.substring(0, settingsStart);
  }

  const [positivePrompt, negativePrompt] = params.split('Negative prompt:');

  return {
    positivePrompt: positivePrompt?.trim() || '',
    negativePrompt: negativePrompt?.trim() || '',
    settings,
  };
}

export function parseSettings(text: string) {
  const GRAMMAR = {
    STRING: /^["](.*?)["]/,
    STRING_SINGLE: /^['](.*?)[']/,
    CURLY_OBJ: /^[{](.*?)[}]/,
    SQUARE_OBJ: /^[[](.*?)[\]]/,
    COMMA: /^,\s*/,
    COLON: /^:\s*/,
    WORD: /^[^"'{}:,[\]]+/,
  };
  const result: ExifAiParam['settings'] = {};
  let key: string | undefined = undefined;

  const setValue = (v: string) => {
    if (key) {
      result[key] = v.trim();
      key = undefined;
      return true;
    }
    return false;
  };

  const tokenizer = new Tokenizer(text, GRAMMAR);
  try {
    while (tokenizer.hasMoreTokens()) {
      const token = tokenizer.getNextToken();
      if (!token) break;

      switch (token.type) {
        case 'STRING':
        case 'STRING_SINGLE':
        case 'SQUARE_OBJ':
        case 'CURLY_OBJ': {
          const v = token.value;
          setValue(v);
          break;
        }
        case 'WORD': {
          const v = token.value.trim();
          if (!setValue(v)) {
            key = v;
          }
          break;
        }
        case 'COMMA': {
          key = undefined;
          break;
        }
        case 'COLON':
      }
    }
  } catch (e) {
    console.error('Exif settings parse error:', e);
  }

  return result;
}
