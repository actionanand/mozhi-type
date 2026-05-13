/**
 * Tamil transliteration mapping engine.
 * Converts English phonetic input to Unicode Tamil characters.
 *
 * Case-sensitive mappings:
 * - Uppercase differentiates retroflex/special consonants:
 *   N -> ண, T -> ட, L -> ள, R -> ற
 * - Lowercase defaults:
 *   n -> ன, t -> ட, l -> ல, r -> ர
 *
 * Tamil script structure:
 * - 12 vowels (உயிர்): அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ
 * - 18 consonants (மெய்): க் ங் ச் ஞ் ட் ண் த் ந் ப் ம் ய் ர் ல் வ் ழ் ள் ற் ன்
 * - Grantha consonants (வடமொழி): ஜ் ஷ் ஸ் ஹ்
 * - ஆய்த எழுத்து: ஃ
 * - Tamil numbers: ௧ ௨ ௩ ௪ ௫ ௬ ௭ ௮ ௯ ௰ ௱ ௲
 */

// Standalone vowels (case-sensitive matching)
const VOWELS: [string, string][] = [
  ['au', 'ஔ'],
  ['Au', 'ஔ'],
  ['aa', 'ஆ'],
  ['AA', 'ஆ'],
  ['ai', 'ஐ'],
  ['Ai', 'ஐ'],
  ['ee', 'ஈ'],
  ['ii', 'ஈ'],
  ['EE', 'ஈ'],
  ['oo', 'ஊ'],
  ['uu', 'ஊ'],
  ['OO', 'ஊ'],
  ['ou', 'ஓ'],
  ['A', 'ஆ'],
  ['I', 'ஈ'],
  ['U', 'ஊ'],
  ['E', 'ஏ'],
  ['O', 'ஓ'],
  ['a', 'அ'],
  ['i', 'இ'],
  ['u', 'உ'],
  ['e', 'எ'],
  ['o', 'ஒ'],
];

// Vowel signs (combining marks) used after consonants
const VOWEL_SIGNS: [string, string][] = [
  ['au', '\u0BCC'], // ௌ
  ['Au', '\u0BCC'],
  ['aa', '\u0BBE'], // ா
  ['AA', '\u0BBE'],
  ['ai', '\u0BC8'], // ை
  ['Ai', '\u0BC8'],
  ['ee', '\u0BC0'], // ீ
  ['ii', '\u0BC0'],
  ['EE', '\u0BC0'],
  ['oo', '\u0BC2'], // ூ
  ['uu', '\u0BC2'],
  ['OO', '\u0BC2'],
  ['ou', '\u0BCB'], // ோ
  ['A', '\u0BBE'], // ா (uppercase A = aa)
  ['I', '\u0BC0'], // ீ
  ['U', '\u0BC2'], // ூ
  ['E', '\u0BC7'], // ே
  ['O', '\u0BCB'], // ோ
  ['a', ''], // inherent 'a' - no sign needed
  ['i', '\u0BBF'], // ி
  ['u', '\u0BC1'], // ு
  ['e', '\u0BC6'], // ெ
  ['o', '\u0BCA'], // ொ
];

// Consonant map (case-sensitive for retroflex/special)
const CONSONANTS: [string, string][] = [
  // Multi-char first (longest match)
  ['shri', 'ஸ்ரீ'],
  ['sri', 'ஸ்ரீ'],
  ['ksh', 'க்ஷ'],
  ['ny', 'ஞ'],
  ['ngh', 'ங'],
  ['NGh', 'ங'],
  ['njh', 'ஞ'],
  ['NJh', 'ஞ'],
  ['ng', 'ங'],
  ['NG', 'ங'],
  ['nj', 'ஞ'],
  ['NJ', 'ஞ'],
  ['ch', 'ச'],
  ['Ch', 'ச'],
  ['Sh', 'ஶ'],
  ['sh', 'ஷ'],
  ['th', 'த'],
  ['Th', 'த'],
  ['dh', 'த'],
  ['Dh', 'த'],
  ['zh', 'ழ'],
  ['Zh', 'ழ'],
  ['kh', 'க'],
  ['gh', 'க'],
  ['ph', 'ப'],
  ['bh', 'ப'],
  ['nh', 'ந'],
  ['Nh', 'ந'],
  ['tr', 'ற'],
  ['Tr', 'ற'],
  ['dr', 'ற'],
  // Single-char (case-sensitive)
  ['N', 'ண'],
  ['T', 'ட'],
  ['L', 'ள'],
  ['R', 'ற'],
  ['S', 'ஸ'],
  ['H', 'ஹ'],
  ['J', 'ஜ'],
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

// Tamil numerals
const TAMIL_NUMBERS: Record<string, string> = {
  '0': '0', // Tamil has no zero
  '1': '௧',
  '2': '௨',
  '3': '௩',
  '4': '௪',
  '5': '௫',
  '6': '௬',
  '7': '௭',
  '8': '௮',
  '9': '௯',
};

// Special symbols accessible via Q-prefix shortcuts
const SPECIAL_SYMBOLS: [string, string][] = [
  ['QD', '௳'], // நாள் (day)
  ['QM', '௴'], // மாதம் (month)
  ['QY', '௵'], // வருடம் (year)
  ['QA', '௸'], // மேற்படி (as above)
  ['QR', '௹'], // ரூபாய் (rupee)
  ['QN', '௺'], // எண் (number)
];

const PULLI = '\u0BCD'; // ்

/**
 * Groups of similar Tamil characters that can be cycled through with backspace.
 * Each group contains characters that sound similar or are easily confused.
 */
export const SIMILAR_GROUPS: string[][] = [
  ['ன', 'ந', 'ண'], // na variants
  ['ல', 'ழ', 'ள'], // la variants
  ['ர', 'ற'], // ra variants
  ['ட', 'த'], // ta variants
  ['ச', 'ஸ', 'ஷ', 'ஶ'], // sa/sha variants
  ['ஜ', 'ச'], // ja/cha
];

/**
 * Find similar alternatives for a Tamil character.
 * Merges all groups containing the character.
 * Returns alternatives (excluding the input character itself), or empty array.
 */
export function getSimilarChars(tamilChar: string): string[] {
  const result = new Set<string>();
  for (const group of SIMILAR_GROUPS) {
    if (group.includes(tamilChar)) {
      for (const c of group) {
        if (c !== tamilChar) result.add(c);
      }
    }
  }
  return [...result];
}

function matchAt(
  input: string,
  pos: number,
  patterns: [string, string][],
  caseSensitive: boolean,
): [string, number] | null {
  const remaining = input.substring(pos);
  for (const [key, val] of patterns) {
    const compare = caseSensitive ? remaining : remaining.toLowerCase();
    const target = caseSensitive ? key : key.toLowerCase();
    if (compare.startsWith(target)) {
      // For case-sensitive, verify exact match
      if (caseSensitive && !remaining.startsWith(key)) continue;
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

    // Handle aaydham: standalone 'q' at word boundary or 'H' alone -> ஃ
    // But 'H' before a vowel is handled as ஹ consonant
    if (ch === 'q' && (pos + 1 >= len || !/[a-zA-Z]/.test(input[pos + 1]))) {
      result += 'ஃ';
      pos++;
      continue;
    }

    // Convert digits to Tamil numerals
    if (/[0-9]/.test(ch)) {
      result += TAMIL_NUMBERS[ch] ?? ch;
      pos++;
      continue;
    }

    // Skip non-alpha characters (pass through punctuation)
    if (!/[a-zA-Z]/.test(ch)) {
      result += ch;
      pos++;
      continue;
    }

    // Try special symbol shortcuts (Q-prefix)
    const specialSym = matchAt(input, pos, SPECIAL_SYMBOLS, true);
    if (specialSym) {
      result += specialSym[0];
      pos += specialSym[1];
      continue;
    }

    // Try consonant match (case-sensitive)
    const consonant = matchAt(input, pos, CONSONANTS, true);
    if (consonant) {
      const [tamilConsonant, consumed] = consonant;
      pos += consumed;

      // Special: multi-char results like ஸ்ரீ, க்ஷ - no vowel sign needed
      if (tamilConsonant.length > 1 && tamilConsonant.includes(PULLI)) {
        result += tamilConsonant;
        continue;
      }

      // Check for a following vowel sign (case-sensitive)
      const vowelSign = matchAt(input, pos, VOWEL_SIGNS, true);
      if (vowelSign) {
        result += tamilConsonant + vowelSign[0];
        pos += vowelSign[1];
      } else {
        // Pure consonant - add pulli
        result += tamilConsonant + PULLI;
      }
      continue;
    }

    // Try standalone vowel (case-sensitive)
    const vowel = matchAt(input, pos, VOWELS, true);
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
  return input.replace(/[a-zA-Z0-9]+/g, (word) => transliterateWord(word));
}

/**
 * Convert Arabic numerals to Tamil numerals.
 */
export function toTamilNumbers(input: string): string {
  return input.replace(/[0-9]/g, (d) => TAMIL_NUMBERS[d] ?? d);
}
