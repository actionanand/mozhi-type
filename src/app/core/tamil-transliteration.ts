/**
 * Tamil transliteration mapping engine.
 * Converts English phonetic input to Unicode Tamil characters.
 *
 * Tamil script structure:
 * - 12 vowels (உயிர்): அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ
 * - 18 consonants (மெய்): க் ங் ச் ஞ் ட் ண் த் ந் ப் ம் ய் ர் ல் வ் ழ் ள் ற் ன்
 * - Vowel signs (உயிர்மெய்) are formed by combining consonant + vowel sign
 * - The pulli (்) marks a pure consonant with no inherent vowel
 */

// Vowel map: standalone vowels used at the start of a word or after another vowel
const VOWELS: [string, string][] = [
  ['au', 'ஔ'],
  ['aa', 'ஆ'],
  ['ai', 'ஐ'],
  ['ee', 'ஈ'],
  ['ii', 'ஈ'],
  ['oo', 'ஊ'],
  ['uu', 'ஊ'],
  ['ou', 'ஓ'],
  ['a', 'அ'],
  ['i', 'இ'],
  ['u', 'உ'],
  ['e', 'எ'],
  ['o', 'ஒ'],
];

// Vowel signs (combining marks) used after consonants
const VOWEL_SIGNS: [string, string][] = [
  ['au', '\u0BCC'], // ௌ
  ['aa', '\u0BBE'], // ா
  ['ai', '\u0BC8'], // ை
  ['ee', '\u0BC0'], // ீ
  ['ii', '\u0BC0'], // ீ
  ['oo', '\u0BC2'], // ூ
  ['uu', '\u0BC2'], // ூ
  ['ou', '\u0BCB'], // ோ
  ['a', ''], // inherent 'a' - no sign needed
  ['i', '\u0BBF'], // ி
  ['u', '\u0BC1'], // ு
  ['e', '\u0BC6'], // ெ
  ['o', '\u0BCA'], // ொ
];

// Consonant map: maps romanized consonant clusters to Tamil base consonants
const CONSONANTS: [string, string][] = [
  ['ngh', 'ங'],
  ['njh', 'ஞ'],
  ['ng', 'ங'],
  ['nj', 'ஞ'],
  ['ch', 'ச'],
  ['sh', 'ஷ'],
  ['th', 'த'],
  ['dh', 'த'],
  ['zh', 'ழ'],
  ['kh', 'க'],
  ['gh', 'க'],
  ['ph', 'ப'],
  ['bh', 'ப'],
  ['nh', 'ந'],
  ['tr', 'ற'],
  ['dr', 'ற'],
  ['k', 'க'],
  ['g', 'க'],
  ['s', 'ச'],
  ['c', 'ச'],
  ['j', 'ஜ'],
  ['t', 'ட'],
  ['d', 'ட'],
  ['n', 'ன'],
  ['p', 'ப'],
  ['b', 'ப'],
  ['m', 'ம'],
  ['y', 'ய'],
  ['r', 'ர'],
  ['l', 'ல'],
  ['v', 'வ'],
  ['w', 'வ'],
  ['h', 'ஹ'],
  ['f', 'ஃப'],
  ['q', 'க'],
  ['x', 'க்ஷ'],
  ['z', 'ழ'],
];

// Special sequences
const SPECIAL: [string, string][] = [
  ['sri', 'ஸ்ரீ'],
  ['shri', 'ஸ்ரீ'],
  ['ksh', 'க்ஷ'],
  ['ksh', 'க்ஷ'],
];

const PULLI = '\u0BCD'; // ்

function matchAt(
  input: string,
  pos: number,
  patterns: [string, string][],
): [string, number] | null {
  const remaining = input.substring(pos).toLowerCase();
  for (const [key, val] of patterns) {
    if (remaining.startsWith(key)) {
      return [val, key.length];
    }
  }
  return null;
}

/**
 * Transliterate a single English word into Tamil Unicode text.
 */
export function transliterateWord(input: string): string {
  if (!input) return '';

  let result = '';
  let pos = 0;
  const len = input.length;

  while (pos < len) {
    const ch = input[pos];

    // Skip non-alpha characters (pass through digits, punctuation)
    if (!/[a-zA-Z]/.test(ch)) {
      result += ch;
      pos++;
      continue;
    }

    // Try special sequences first
    const special = matchAt(input, pos, SPECIAL);
    if (special) {
      result += special[0];
      pos += special[1];
      continue;
    }

    // Try consonant match
    const consonant = matchAt(input, pos, CONSONANTS);
    if (consonant) {
      const [tamilConsonant, consumed] = consonant;
      pos += consumed;

      // Check for a following vowel sign
      const vowelSign = matchAt(input, pos, VOWEL_SIGNS);
      if (vowelSign) {
        result += tamilConsonant + vowelSign[0];
        pos += vowelSign[1];
      } else {
        // Pure consonant - add pulli (but handle 'f' = ஃப specially)
        if (tamilConsonant === 'ஃப') {
          result += tamilConsonant + PULLI;
        } else {
          result += tamilConsonant + PULLI;
        }
      }
      continue;
    }

    // Try standalone vowel
    const vowel = matchAt(input, pos, VOWELS);
    if (vowel) {
      result += vowel[0];
      pos += vowel[1];
      continue;
    }

    // Unknown character - pass through
    result += ch;
    pos++;
  }

  return result;
}

/**
 * Transliterate a full text, handling word boundaries.
 * Non-alphabetic characters pass through unchanged.
 */
export function transliterate(input: string): string {
  // Split into words and non-word segments, transliterate each word
  return input.replace(/[a-zA-Z]+/g, (word) => transliterateWord(word));
}
