import * as ExifReader from 'exifreader';

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

function parseSettings(text: string): ExifAiParam['settings'] {
  const result: ExifAiParam['settings'] = {};
  const setKV = (k: string, v?: string) => {
    k = k.trim();
    v = v === undefined ? '-' : v.trim();
    if (k.length > 0) {
      result[k] = v;
    }
  };

  text.split(',').forEach((part) => {
    const idxCol = part.indexOf(':');
    if (idxCol === -1) {
      setKV(part);
    } else {
      // split would be easier, but there can be many ':' and it gets messy
      const key = part.substring(0, idxCol);
      const value = part.substring(idxCol + 1);
      setKV(key, value);
    }
  });

  return result;
}
