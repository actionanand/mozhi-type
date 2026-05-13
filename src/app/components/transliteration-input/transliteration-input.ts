import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  ElementRef,
  viewChild,
} from '@angular/core';
import { SuggestionPopupComponent } from '../suggestion-popup/suggestion-popup';

@Component({
  selector: 'app-transliteration-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SuggestionPopupComponent],
  host: { class: 'transliteration-input' },
  styles: `
    :host {
      display: block;
    }
    .input-wrapper {
      position: relative;
    }
    textarea {
      width: 100%;
      min-height: 120px;
      padding: 1rem;
      font-size: 1.125rem;
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
      border: 2px solid #d1d5db;
      border-radius: 0.75rem;
      resize: vertical;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      line-height: 1.8;
      background: #fff;
    }
    textarea:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    textarea::placeholder {
      color: #9ca3af;
    }
    .preview {
      position: absolute;
      bottom: 0.5rem;
      right: 0.75rem;
      font-size: 0.875rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.125rem 0.5rem;
      border-radius: 0.375rem;
      pointer-events: none;
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
    }
    .suggestion-anchor {
      position: absolute;
      bottom: 3rem;
      left: 1rem;
    }
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #374151;
      font-size: 0.875rem;
    }
  `,
  template: `
    <label [attr.for]="inputId()">{{ label() }}</label>
    <div class="input-wrapper">
      <textarea
        #textareaRef
        [id]="inputId()"
        [placeholder]="placeholder()"
        [value]="value()"
        [attr.aria-label]="label()"
        (input)="onInput($event)"
        (keydown)="onKeyDown($event)"
      ></textarea>
      @if (preview()) {
        <span class="preview" aria-hidden="true">{{ preview() }}</span>
      }
      <div class="suggestion-anchor">
        <app-suggestion-popup
          [suggestions]="suggestions()"
          [activeIndex]="suggestionIndex()"
          (select)="onSuggestionSelect($event)"
        />
      </div>
    </div>
  `,
})
export class TransliterationInputComponent {
  readonly label = input('Type in English');
  readonly placeholder = input("Type Tamil in English (e.g., 'vanakkam')...");
  readonly inputId = input('transliteration-input');
  readonly value = input('');
  readonly preview = input('');
  readonly suggestions = input<string[]>([]);
  readonly suggestionIndex = input(0);

  readonly inputChange = output<string>();
  readonly wordCommit = output<{ value: string; cursorPos: number }>();
  readonly backspaceAtTamil = output<{ value: string; cursorPos: number }>();
  readonly suggestionSelected = output<string>();
  readonly suggestionNavigate = output<'left' | 'right' | 'dismiss'>();

  readonly textareaRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('textareaRef');

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.inputChange.emit(textarea.value);
  }

  onKeyDown(event: KeyboardEvent): void {
    const textarea = this.textareaRef().nativeElement;
    const hasSuggestions = this.suggestions().length > 0;

    if (hasSuggestions) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.suggestionNavigate.emit('left');
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.suggestionNavigate.emit('right');
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        const selected = this.suggestions()[this.suggestionIndex()];
        if (selected) this.suggestionSelected.emit(selected);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        this.suggestionNavigate.emit('dismiss');
        return;
      }
    }

    if (event.key === ' ' || event.key === 'Enter') {
      this.wordCommit.emit({ value: textarea.value, cursorPos: textarea.selectionStart });
    }

    if (event.key === 'Backspace') {
      const pos = textarea.selectionStart;
      if (pos > 0 && textarea.selectionStart === textarea.selectionEnd) {
        const charBefore = textarea.value[pos - 1];
        // Check if it's a Tamil character (Unicode range 0B80-0BFF)
        const code = charBefore.charCodeAt(0);
        if (code >= 0x0b80 && code <= 0x0bff) {
          this.backspaceAtTamil.emit({ value: textarea.value, cursorPos: pos });
        }
      }
    }
  }

  onSuggestionSelect(char: string): void {
    this.suggestionSelected.emit(char);
    this.textareaRef().nativeElement.focus();
  }

  setCursorPosition(pos: number): void {
    const textarea = this.textareaRef().nativeElement;
    setTimeout(() => {
      textarea.selectionStart = pos;
      textarea.selectionEnd = pos;
    });
  }

  setValue(val: string): void {
    this.textareaRef().nativeElement.value = val;
  }
}
