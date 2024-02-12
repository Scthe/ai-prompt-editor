/* eslint-disable prefer-const */
import htmlEntities from '../deno_html_entities/html5-entities';
import bpeVocabData from './bpe_simple_vocab_16e6';
// import ftfy from "https://deno.land/x/ftfy_pyodide@v0.1.1/mod.js";

function ord(c: string) {
  return c.charCodeAt(0);
}
export function range(start: number, stop?: number, step = 1) {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  const result = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}

function bytesToUnicode() {
  let bs = [
    ...range(ord('!'), ord('~') + 1),
    ...range(ord('¡'), ord('¬') + 1),
    ...range(ord('®'), ord('ÿ') + 1),
  ];
  let cs = bs.slice(0);
  let n = 0;
  for (let b of range(2 ** 8)) {
    if (!bs.includes(b)) {
      bs.push(b);
      cs.push(2 ** 8 + n);
      n += 1;
    }
  }
  const strs = cs.map((n) => String.fromCharCode(n));
  return Object.fromEntries(bs.map((v, i) => [v, strs[i]]));
}

/**
 * Example input: ['typings', ]
 * Example output: ['ty', 'yp', 'pi', 'in', 'ng', 'gs']
 *
 * @param word - actually [string, string]
 */
function getPairs(word: string[]) {
  let pairs = [];
  let prevChar = word[0];
  for (let char of word.slice(1)) {
    pairs.push([prevChar, char]);
    prevChar = char;
  }
  return pairs;
}

function basicClean(text: string) {
  // text = ftfy.fix_text(text);
  text = htmlEntities.decode(htmlEntities.decode(text));
  return text.trim();
}

function whitespaceClean(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

export default class Tokenizer {
  private byteEncoder: Record<number, string>;
  private byteDecoder: Record<string, number>;
  private encoder: Record<string, number>;
  private decoder: Record<number, string>;
  private bpeRanks: Record<string, number>;
  private cache: Record<string, string>;
  private pat: RegExp;

  constructor() {
    this.byteEncoder = bytesToUnicode();
    this.byteDecoder = Object.fromEntries(
      Object.entries(this.byteEncoder).map(([k, v]) => [v, k])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
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

    this.encoder = Object.fromEntries(vocab.map((v, i) => [v, i]));
    this.decoder = Object.fromEntries(
      Object.entries(this.encoder).map(([k, v]) => [v, k])
    );
    this.bpeRanks = Object.fromEntries(
      merges2.map((v, i) => [v.join('·😎·'), i])
    ); // ·😎· because js doesn't yet have tuples
    this.cache = {
      '<|startoftext|>': '<|startoftext|>',
      '<|endoftext|>': '<|endoftext|>',
    };
    this.pat =
      /<\|startoftext\|>|<\|endoftext\|>|'s|'t|'re|'ve|'m|'ll|'d|[\p{L}]+|[\p{N}]|[^\s\p{L}\p{N}]+/giu;
  }

  bpe(token: string) {
    if (this.cache[token] !== undefined) {
      return this.cache[token];
    }

    let word = [...token.slice(0, -1), token.slice(-1) + '</w>'];
    let pairs = getPairs(word);
    // console.log(`word=|${word}|  pairs=|${pairs}|`);

    if (pairs.length === 0) {
      return token + '</w>';
    }

    // eslint-disable-next-line no-constant-condition
    while (1) {
      let bigram = null;
      let minRank = Infinity;
      for (let p of pairs) {
        let r = this.bpeRanks[p.join('·😎·')];
        if (r === undefined) continue;
        if (r < minRank) {
          minRank = r;
          bigram = p;
        }
      }

      if (bigram === null) {
        break;
      }

      let [first, second] = bigram;
      let newWord = [];
      let i = 0;
      while (i < word.length) {
        let j = word.indexOf(first, i);

        if (j === -1) {
          newWord.push(...word.slice(i));
          break;
        }

        newWord.push(...word.slice(i, j));
        i = j;

        if (
          word[i] === first &&
          i < word.length - 1 &&
          word[i + 1] === second
        ) {
          newWord.push(first + second);
          i += 2;
        } else {
          newWord.push(word[i]);
          i += 1;
        }
      }
      word = newWord;
      if (word.length === 1) {
        break;
      } else {
        pairs = getPairs(word);
      }
    }
    const word2 = word.join(' ');
    this.cache[token] = word2;
    return word2;
  }

  encode(text: string) {
    let bpeTokens = [];
    text = whitespaceClean(basicClean(text)).toLowerCase();
    for (let token of [...text.matchAll(this.pat)].map((m) => m[0])) {
      // console.log(`token|${token}|`);
      token = [...token].map((b) => this.byteEncoder[b.charCodeAt(0)]).join('');
      // console.log(`token2|${token}|`);
      bpeTokens.push(
        ...this.bpe(token)
          .split(' ')
          .map((bpe_token) => this.encoder[bpe_token])
      );
    }
    return bpeTokens;
  }

  // adds start and end token, and adds padding 0's and ensures it's 77 tokens long
  encodeForCLIP(text: string) {
    let tokens = this.encode(text);
    tokens.unshift(49406); // start token
    tokens = tokens.slice(0, 76);
    tokens.push(49407); // end token
    while (tokens.length < 77) tokens.push(0);
    return tokens;
  }

  decode(tokens: number[]) {
    let text = tokens.map((token) => this.decoder[token]).join('');
    text = [...text]
      .map((c) => this.byteDecoder[c])
      .map((v) => String.fromCharCode(v))
      .join('')
      .replaceAll('</w>', ' ');
    return text;
  }
}
