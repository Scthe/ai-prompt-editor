import { ParsingMessage, PromptAstGroup, PromptExternalNetwork } from 'parser';
import { traverse } from '.';
import { partition, unique } from 'utils';

export const detectDuplicates = (
  root: PromptAstGroup,
  messages: ParsingMessage[]
) => {
  const valueTexts: string[] = [];
  traverse(root, (node) => {
    if (node.type === 'token') {
      valueTexts.push(node.value);
    }
  });

  const duplicates = findDuplicates(valueTexts);
  duplicates.forEach((text) => {
    messages.push({
      level: 'warning',
      text: `Duplicate found: '${text}'`,
    });
  });
};

export const detectDuplicateNetworks = (
  networks: PromptExternalNetwork[],
  messages: ParsingMessage[]
) => {
  const [loras, hypernets] = partition(networks, (n) => n.type === 'lora');

  const loraNames = loras.map((e) => e.name);
  findDuplicates(loraNames).forEach((text) => {
    messages.push({
      level: 'warning',
      text: `Duplicate LoRA found: '${text}'`,
    });
  });

  const hypernetNames = hypernets.map((e) => e.name);
  findDuplicates(hypernetNames).forEach((text) => {
    messages.push({
      level: 'warning',
      text: `Duplicate hypernetwork found: '${text}'`,
    });
  });
};

function findDuplicates(texts: string[]) {
  const seenTokenStrings: string[] = [];
  const duplicates: string[] = [];

  texts.forEach((text) => {
    if (seenTokenStrings.includes(text)) {
      duplicates.push(text);
    } else {
      seenTokenStrings.push(text);
    }
  });

  return unique(...duplicates);
}
