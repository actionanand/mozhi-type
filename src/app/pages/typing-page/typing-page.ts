import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { TransliterationInputComponent } from '../../components/transliteration-input/transliteration-input';
import { OutputDisplayComponent } from '../../components/output-display/output-display';
import { CopyButtonComponent } from '../../components/copy-button/copy-button';
import { KeyboardReferenceComponent } from '../../components/keyboard-reference/keyboard-reference';
import { TransliterationService } from '../../core/transliteration.service';

@Component({
  selector: 'app-typing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TransliterationInputComponent,
    OutputDisplayComponent,
    CopyButtonComponent,
    KeyboardReferenceComponent,
  ],
  styles: `
    :host {
      display: block;
      max-width: 720px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    header {
      text-align: center;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .subtitle {
      color: #6b7280;
      margin-top: 0.25rem;
      font-size: 0.9375rem;
    }
    .hint {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      background: #eef2ff;
      color: #4f46e5;
      border-radius: 1rem;
      font-size: 0.8125rem;
    }
    .editor-section {
      margin-bottom: 1.5rem;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .clear-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #dc2626;
      background: transparent;
      border: 1px solid #dc2626;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .clear-btn:hover {
      background: rgba(220, 38, 38, 0.05);
    }
    .clear-btn:focus-visible {
      outline: 2px solid #dc2626;
      outline-offset: 2px;
    }
  `,
  template: `
    <header>
      <h1>மொழி Type</h1>
      <p class="subtitle">Tamil Phonetic Typing — Type in English, get Tamil</p>
      <span class="hint">Press <kbd>Space</kbd> or <kbd>Enter</kbd> to convert</span>
      <span class="hint"><kbd>Backspace</kbd> on Tamil → similar letter suggestions</span>
      <span class="hint"
        >Uppercase: <kbd>N</kbd>=ண <kbd>L</kbd>=ள <kbd>R</kbd>=ற <kbd>E</kbd>=ஏ</span
      >
    </header>

    <div class="editor-section">
      <app-transliteration-input
        label="Type in English (Transliteration)"
        placeholder="e.g., vaNakkam ulagam..."
        inputId="main-input"
        [value]="displayText()"
        [preview]="currentWordPreview()"
        [suggestions]="suggestions()"
        [suggestionIndex]="suggestionIndex()"
        (inputChange)="onInput($event)"
        (wordCommit)="onWordCommit($event)"
        (backspaceAtTamil)="onBackspaceAtTamil($event)"
        (suggestionSelected)="onSuggestionSelected($event)"
        (suggestionNavigate)="onSuggestionNavigate($event)"
      />
    </div>

    <div class="editor-section">
      <app-output-display
        label="Tamil Output (தமிழ்)"
        [content]="tamilOutput()"
        placeholder="Tamil text will appear here..."
      />
    </div>

    <div class="actions">
      <app-copy-button [textToCopy]="tamilOutput()" label="Tamil text" />
      <button class="clear-btn" type="button" (click)="clear()" aria-label="Clear all text">
        🗑 Clear
      </button>
    </div>

    <app-keyboard-reference />
  `,
})
export class TypingPageComponent {
  private readonly transliterationService = inject(TransliterationService);
  private readonly inputRef = viewChild.required<TransliterationInputComponent>(
    TransliterationInputComponent,
  );

  protected readonly displayText = signal('');
  protected readonly tamilOutput = signal('');
  protected readonly suggestions = signal<string[]>([]);
  protected readonly suggestionIndex = signal(0);
  private suggestionCursorPos = 0;

  protected readonly currentWordPreview = computed(() => {
    const text = this.displayText();
    const lastSpaceIdx = Math.max(text.lastIndexOf(' '), text.lastIndexOf('\n'));
    const currentWord = text.substring(lastSpaceIdx + 1);
    if (!currentWord || !/[a-zA-Z]/.test(currentWord)) return '';
    return this.transliterationService.transliterateWord(currentWord);
  });

  onInput(value: string): void {
    this.displayText.set(value);
    // Dismiss suggestions on any normal input
    if (this.suggestions().length) {
      this.suggestions.set([]);
    }
  }

  onWordCommit(event: { value: string; cursorPos: number }): void {
    const { value, cursorPos } = event;

    let wordStart = cursorPos - 1;
    while (wordStart >= 0 && value[wordStart] !== ' ' && value[wordStart] !== '\n') {
      wordStart--;
    }
    wordStart++;

    const word = value.substring(wordStart, cursorPos);
    if (!word || !/[a-zA-Z]/.test(word)) return;

    const tamilWord = this.transliterationService.transliterateWord(word);
    const newValue = value.substring(0, wordStart) + tamilWord + value.substring(cursorPos);

    this.displayText.set(newValue);
    const comp = this.inputRef();
    comp.setValue(newValue);
    const newCursorPos = wordStart + tamilWord.length;
    comp.setCursorPosition(newCursorPos);

    this.tamilOutput.set(this.buildTamilOutput(newValue));
  }

  onBackspaceAtTamil(event: { value: string; cursorPos: number }): void {
    const { value, cursorPos } = event;
    // Look at the base consonant before cursor (skip pulli if present)
    let checkPos = cursorPos - 1;
    const charCode = value.charCodeAt(checkPos);

    // If it's a pulli (0BCD), check the char before it
    let baseChar: string;
    if (charCode === 0x0bcd && checkPos > 0) {
      baseChar = value[checkPos - 1];
    } else {
      baseChar = value[checkPos];
    }

    const similar = this.transliterationService.getSimilarChars(baseChar);
    if (similar.length > 0) {
      this.suggestions.set(similar);
      this.suggestionIndex.set(0);
      this.suggestionCursorPos = cursorPos;
    }
  }

  onSuggestionSelected(replacement: string): void {
    const value = this.displayText();
    const pos = this.suggestionCursorPos;

    // Find the base consonant position to replace
    let replaceStart = pos - 1;
    let replaceEnd = pos;
    const charCode = value.charCodeAt(replaceStart);

    if (charCode === 0x0bcd && replaceStart > 0) {
      // pulli + consonant before it
      replaceStart--;
      const newValue =
        value.substring(0, replaceStart) + replacement + '\u0BCD' + value.substring(replaceEnd);
      this.applyReplacement(newValue, replaceStart + 2);
    } else {
      // Just the base consonant (with vowel sign after potentially)
      const newValue = value.substring(0, replaceStart) + replacement + value.substring(replaceEnd);
      this.applyReplacement(newValue, replaceStart + 1);
    }
  }

  onSuggestionNavigate(direction: 'left' | 'right' | 'dismiss'): void {
    if (direction === 'dismiss') {
      this.suggestions.set([]);
      return;
    }
    const len = this.suggestions().length;
    if (len === 0) return;
    const current = this.suggestionIndex();
    if (direction === 'left') {
      this.suggestionIndex.set((current - 1 + len) % len);
    } else {
      this.suggestionIndex.set((current + 1) % len);
    }
  }

  clear(): void {
    this.displayText.set('');
    this.tamilOutput.set('');
    this.suggestions.set([]);
    const comp = this.inputRef();
    comp.setValue('');
    comp.setCursorPosition(0);
  }

  private applyReplacement(newValue: string, newCursorPos: number): void {
    this.displayText.set(newValue);
    this.tamilOutput.set(this.buildTamilOutput(newValue));
    this.suggestions.set([]);
    const comp = this.inputRef();
    comp.setValue(newValue);
    comp.setCursorPosition(newCursorPos);
  }

  private buildTamilOutput(text: string): string {
    return this.transliterationService.transliterate(text);
  }
}
