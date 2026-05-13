import { Injectable } from '@angular/core';
import { transliterate, transliterateWord } from './tamil-transliteration';

@Injectable({ providedIn: 'root' })
export class TransliterationService {
  transliterateWord(input: string): string {
    return transliterateWord(input);
  }

  transliterate(input: string): string {
    return transliterate(input);
  }
}
