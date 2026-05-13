import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-suggestion-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'suggestion-popup',
    '[style.display]': 'suggestions().length ? "block" : "none"',
  },
  styles: `
    :host {
      position: absolute;
      z-index: 100;
    }
    .popup {
      display: flex;
      gap: 0.25rem;
      padding: 0.375rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .suggestion-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.5rem;
      height: 2.5rem;
      padding: 0.25rem 0.5rem;
      font-size: 1.25rem;
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;
      color: #111827;
    }
    .suggestion-btn:hover,
    .suggestion-btn.active {
      background: #6366f1;
      color: #fff;
      border-color: #6366f1;
    }
    .suggestion-btn:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }
    .hint {
      font-size: 0.6875rem;
      color: #9ca3af;
      padding: 0.25rem 0.375rem;
      align-self: center;
    }
  `,
  template: `
    @if (suggestions().length) {
      <div class="popup" role="listbox" aria-label="Similar character suggestions">
        @for (s of suggestions(); track s; let i = $index) {
          <button
            type="button"
            class="suggestion-btn"
            [class.active]="i === activeIndex()"
            role="option"
            [attr.aria-selected]="i === activeIndex()"
            (click)="select.emit(s)"
          >
            {{ s }}
          </button>
        }
        <span class="hint">←→ select</span>
      </div>
    }
  `,
})
export class SuggestionPopupComponent {
  readonly suggestions = input<string[]>([]);
  readonly activeIndex = input(0);
  readonly select = output<string>();
}
