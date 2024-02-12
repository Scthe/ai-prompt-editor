export type PromptExternalNetwork = {
  type: 'lora' | 'hypernetwork';
  name: string;
  weight: number;
};

export const getNetworkText = (
  token: PromptExternalNetwork,
  showWeights = true
) => {
  const w = showWeights ? `:${token.weight}` : '';

  if (token.type === 'hypernetwork') {
    return `<hypernet:${token.name}${w}>`;
  }
  return `<lora:${token.name}${w}>`;
};

const NETWORK_REGEX = /<(lora|hypernet):.*?>/g;

/** Extract LoRAs and hypernetworks */
export const extractNetworks = (
  prompt: string
): [string, PromptExternalNetwork[]] => {
  const matches = [...prompt.matchAll(NETWORK_REGEX)];

  const networks = matches.map(([text]) => {
    prompt = prompt.replaceAll(text, '');
    return parseNetwork(text);
  });

  return [prompt, networks];
};

const parseNetwork = (text: string): PromptExternalNetwork => {
  const nameStart = text.indexOf(':');
  const nameEnd = text.lastIndexOf(':');

  const hasWeight = nameEnd !== nameStart;
  const name = hasWeight
    ? text.substring(nameStart + 1, nameEnd)
    : text.substring(nameStart + 1, text.length - 1);

  let weight = 1.0;
  if (hasWeight) {
    const weightStr = text.substring(nameEnd + 1, text.length - 1);
    weight = parseFloat(weightStr);
  }

  return {
    name,
    weight,
    type: text.startsWith('<hypernet:') ? 'hypernetwork' : 'lora',
  };
};
