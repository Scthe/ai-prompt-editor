import { describe, expect, test } from '@jest/globals';
import { extractNetworks, PromptExternalNetwork } from './extractNetworks';

describe('extractNetworks', () => {
  test('should noop if no network', () => {
    const prompt = 'aaa(bbb:1.3)ccc[ddd]eee';
    const [newPrompt, networks] = extractNetworks(prompt);

    expect(newPrompt).toBe(prompt);
    expect(networks).toHaveLength(0);
  });

  test('should find both LoRAs', () => {
    const prompt = 'aaa(bbb:1.3)<lora:ll11>[ddd]<lora:ll22:1.3>eee';
    const [newPrompt, networks] = extractNetworks(prompt);

    expect(newPrompt).toBe('aaa(bbb:1.3)[ddd]eee');
    expect(networks).toHaveLength(2);
    expect(networks[0]).toStrictEqual({
      type: 'lora',
      name: 'll11',
      weight: 1.0,
    } as PromptExternalNetwork);
    expect(networks[1]).toStrictEqual({
      type: 'lora',
      name: 'll22',
      weight: 1.3,
    } as PromptExternalNetwork);
  });

  test('should find both hypernetworks', () => {
    const prompt = 'aaa(bbb:1.3)<hypernet:gg11>[ddd]<hypernet:gg22:1.3>eee';
    const [newPrompt, networks] = extractNetworks(prompt);

    expect(newPrompt).toBe('aaa(bbb:1.3)[ddd]eee');
    expect(networks).toHaveLength(2);
    expect(networks[0]).toStrictEqual({
      type: 'hypernetwork',
      name: 'gg11',
      weight: 1.0,
    } as PromptExternalNetwork);
    expect(networks[1]).toStrictEqual({
      type: 'hypernetwork',
      name: 'gg22',
      weight: 1.3,
    } as PromptExternalNetwork);
  });

  test('should find all networks', () => {
    const prompt =
      '<lora:ll11><hypernet:gg11><lora:ll22:1.3><hypernet:gg22:1.3>';
    const [newPrompt, networks] = extractNetworks(prompt);

    expect(newPrompt).toBe('');
    expect(networks).toHaveLength(4);
    expect(networks[0]).toStrictEqual({
      type: 'lora',
      name: 'll11',
      weight: 1.0,
    } as PromptExternalNetwork);
    expect(networks[1]).toStrictEqual({
      type: 'hypernetwork',
      name: 'gg11',
      weight: 1.0,
    } as PromptExternalNetwork);
    expect(networks[2]).toStrictEqual({
      type: 'lora',
      name: 'll22',
      weight: 1.3,
    } as PromptExternalNetwork);
    expect(networks[3]).toStrictEqual({
      type: 'hypernetwork',
      name: 'gg22',
      weight: 1.3,
    } as PromptExternalNetwork);
  });
});
