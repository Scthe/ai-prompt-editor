import { describe, expect, test } from '@jest/globals';
import Tokenizer from './clip-bpe-js/clip-bep-js';

/*
// If you want to dump whole dict:
import bpeVocabData from 'lib/clip-bpe-js/bpe_simple_vocab_16e6';

const writeTokensToTxt = () => {
  let merges = bpeVocabData.text.split('\n');
  merges = merges.slice(1, 49152 - 256 - 2 + 1);
  const merges2 = merges.map((merge) => merge.split(' '));
  // There was a bug related to the ordering of Python's .values() output. I'm lazy do I've just copy-pasted the Python output:
  let vocab = [
    '!',
    '"',
    '#',
    '$',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    ':',
    ';',
    '<',
    '=',
    '>',
    '?',
    '@',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '[',
    '\\',
    ']',
    '^',
    '_',
    '`',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '{',
    '|',
    '}',
    '~',
    '¡',
    '¢',
    '£',
    '¤',
    '¥',
    '¦',
    '§',
    '¨',
    '©',
    'ª',
    '«',
    '¬',
    '®',
    '¯',
    '°',
    '±',
    '²',
    '³',
    '´',
    'µ',
    '¶',
    '·',
    '¸',
    '¹',
    'º',
    '»',
    '¼',
    '½',
    '¾',
    '¿',
    'À',
    'Á',
    'Â',
    'Ã',
    'Ä',
    'Å',
    'Æ',
    'Ç',
    'È',
    'É',
    'Ê',
    'Ë',
    'Ì',
    'Í',
    'Î',
    'Ï',
    'Ð',
    'Ñ',
    'Ò',
    'Ó',
    'Ô',
    'Õ',
    'Ö',
    '×',
    'Ø',
    'Ù',
    'Ú',
    'Û',
    'Ü',
    'Ý',
    'Þ',
    'ß',
    'à',
    'á',
    'â',
    'ã',
    'ä',
    'å',
    'æ',
    'ç',
    'è',
    'é',
    'ê',
    'ë',
    'ì',
    'í',
    'î',
    'ï',
    'ð',
    'ñ',
    'ò',
    'ó',
    'ô',
    'õ',
    'ö',
    '÷',
    'ø',
    'ù',
    'ú',
    'û',
    'ü',
    'ý',
    'þ',
    'ÿ',
    'Ā',
    'ā',
    'Ă',
    'ă',
    'Ą',
    'ą',
    'Ć',
    'ć',
    'Ĉ',
    'ĉ',
    'Ċ',
    'ċ',
    'Č',
    'č',
    'Ď',
    'ď',
    'Đ',
    'đ',
    'Ē',
    'ē',
    'Ĕ',
    'ĕ',
    'Ė',
    'ė',
    'Ę',
    'ę',
    'Ě',
    'ě',
    'Ĝ',
    'ĝ',
    'Ğ',
    'ğ',
    'Ġ',
    'ġ',
    'Ģ',
    'ģ',
    'Ĥ',
    'ĥ',
    'Ħ',
    'ħ',
    'Ĩ',
    'ĩ',
    'Ī',
    'ī',
    'Ĭ',
    'ĭ',
    'Į',
    'į',
    'İ',
    'ı',
    'Ĳ',
    'ĳ',
    'Ĵ',
    'ĵ',
    'Ķ',
    'ķ',
    'ĸ',
    'Ĺ',
    'ĺ',
    'Ļ',
    'ļ',
    'Ľ',
    'ľ',
    'Ŀ',
    'ŀ',
    'Ł',
    'ł',
    'Ń',
  ];
  vocab = [...vocab, ...vocab.map((v) => v + '</w>')];
  for (let merge of merges2) {
    vocab.push(merge.join(''));
  }
  vocab.push('<|startoftext|>', '<|endoftext|>');
  // console.log(vocab.slice(100));
  const bigText = vocab.map((v, idx) => `${idx}: |${v}|`).join('\n');

  const fs = require('fs');
  fs.writeFile('test.txt', bigText);
};
writeTokensToTxt();
*/

describe('clip-bpe-js', () => {
  // The following values were debug-printed from webui
  // using some random prompts
  test.each([
    ['sharp focus,', [8157, 4353, 267]],
    ['pastel colors', [19457, 5389]],
    ['desaturated colors', [561, 32466, 5389]],
    [',', [267]],
    [
      'outdoor,restaurant,table,sitting on a chair,',
      [6368, 267, 4489, 267, 2175, 267, 4919, 525, 320, 4269, 267],
    ],
    ['drinking coffee', [5778, 2453]],
    [',dessert,french restaurant,', [267, 9753, 267, 3461, 4489, 267]],
  ])('should parse "%s"', (text, expected) => {
    const t = new Tokenizer();
    const result = t.encode(text);
    expect(result).toStrictEqual(expected);
  });
});