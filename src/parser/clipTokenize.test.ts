import { describe, expect, test } from '@jest/globals';
import { BREAK_TOKEN, WeightedToken } from './parsePromptAttention';
import { duplicateStr } from 'utils';
import { PromptChunk, tokenize } from './clipTokenize';
import Tokenizer from 'lib/clip-bpe-js/clip-bep-js';

describe('tokenize', () => {
  const expectChunksAddUpToOriginalEncoded = (
    chunks: PromptChunk[],
    expText: string
  ) => {
    // console.log('expectChunksAddUpToOriginalEncoded', chunks);
    const t = new Tokenizer();
    const expEncoded = t.encode(expText);
    const chunksEncoded = chunks.flatMap((c) => c.tokens);
    expect(chunksEncoded).toStrictEqual(expEncoded);
  };

  test('random numbers (one token per number)', () => {
    const text = '455218451484';
    const weightedToken: WeightedToken = [text, 1.0];

    const [chunks, tokenCount] = tokenize([weightedToken]);

    expect(chunks).toHaveLength(1); // <75
    expectChunksAddUpToOriginalEncoded(chunks, text);
    expect(tokenCount).toBe(text.length);
  });

  test('"aaaaaaaaaa" (2 token text)', () => {
    const text = [duplicateStr('a', 10)].join('');
    const weightedToken: WeightedToken = [text, 1.0];

    const [chunks, tokenCount] = tokenize([weightedToken]);

    expect(chunks).toHaveLength(1); // <75
    expectChunksAddUpToOriginalEncoded(chunks, text);
    expect(tokenCount).toBe(2); // turns out there is an encoding for 'aaaaaa' and 'aaaa'
  });

  test('Splits 100 random characters into 2 chunks (75 and 25 exactly)', () => {
    // Exact 100 characters. Each character is 1 token too
    const text = duplicateStr('4552184514', 10);
    const weightedToken: WeightedToken = [text, 1.0];

    const [chunks, tokenCount] = tokenize([weightedToken]);
    expect(chunks).toHaveLength(2); // 75 + 25
    expect(chunks[0].tokens).toHaveLength(75);
    expect(chunks[1].tokens).toHaveLength(25);
    expectChunksAddUpToOriginalEncoded(chunks, text);
    expect(tokenCount).toBe(text.length);
  });

  test('Splits on BREAK', () => {
    const [chunks, tokenCount] = tokenize([
      ['aaa', 1.0],
      BREAK_TOKEN,
      ['bbb', 1.3],
    ]);

    expect(chunks).toHaveLength(2);
    expect(chunks[0].tokens).toHaveLength(1);
    expect(chunks[0].tokens[0]).toBe(9583);
    expect(chunks[1].tokens).toHaveLength(1);
    expect(chunks[1].tokens[0]).toBe(33535);
    // expectChunksAddUpToOriginalEncoded(chunks, text);
    expect(tokenCount).toBe(76); // 75 first chunk (with padding) and 1 for 2nd chunk
  });

  test('Splits mid WeightedToken', () => {
    // Chunk 1: 'aaa,aaa,' (4 tokens - full)
    // Chunk 2: 'aaa,aaa,' (4 tokens - full)
    // Chunk 2: 'aaa,aaa' (3 tokens)
    const text = 'aaa,aaa,aaa,aaa,aaa,aaa';
    const [chunks, tokenCount] = tokenize([[text, 1.0]], 4);

    expect(chunks).toHaveLength(3);
    expect(chunks[0].tokens).toHaveLength(4);
    expect(chunks[1].tokens).toHaveLength(4);
    expect(chunks[2].tokens).toHaveLength(3);
    expectChunksAddUpToOriginalEncoded(chunks, text);
    expect(tokenCount).toBe(4 + 4 + 3);
  });

  test('Splits mid WeightedToken on last comma', () => {
    // Chunk 1: 'aaa,' (2 tokens - not full, but still counts as 4 used tokens)
    // Chunk 2: 'aaa aaa aaa aaa' (4 tokens - full)
    // Chunk 2: ',aaa,' (3 tokens)
    const text = 'aaa,aaa aaa aaa aaa,aaa,';
    const [chunks, tokenCount] = tokenize([[text, 1.0]], 4);

    expect(chunks).toHaveLength(3);
    expect(chunks[0].tokens).toHaveLength(2);
    expect(chunks[1].tokens).toHaveLength(4);
    expect(chunks[2].tokens).toHaveLength(3);
    expectChunksAddUpToOriginalEncoded(chunks, text);
    expect(tokenCount).toBe(4 + 4 + 3);
  });
});
