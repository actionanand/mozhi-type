import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-transliteration-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    </div>
  `,
})
export class TransliterationInputComponent {
  readonly label = input('Type in English');
  readonly placeholder = input("Type Tamil in English (e.g., 'vanakkam')...");
  readonly inputId = input('transliteration-input');
  readonly value = input('');
  readonly preview = input('');

  readonly inputChange = output<string>();
  readonly wordCommit = output<{ value: string; cursorPos: number }>();

  readonly textareaRef = viewChild.required<ElementRef<HTMLTextAreaElement>>('textareaRef');

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.inputChange.emit(textarea.value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      const textarea = this.textareaRef().nativeElement;
      this.wordCommit.emit({ value: textarea.value, cursorPos: textarea.selectionStart });
    }
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
