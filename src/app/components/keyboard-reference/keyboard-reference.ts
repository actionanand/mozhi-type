import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface CharMapping {
  english: string;
  tamil: string;
}

@Component({
  selector: 'app-keyboard-reference',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'keyboard-reference' },
  styles: `
    :host {
      display: block;
    }
    .toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6366f1;
      background: transparent;
      border: 1px solid #6366f1;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .toggle-btn:hover {
      background: rgba(99, 102, 241, 0.05);
    }
    .toggle-btn:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }
    .reference-panel {
      margin-top: 0.75rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      background: #fafafa;
    }
    h3 {
      margin: 0 0 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }
    .section + .section {
      margin-top: 1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.375rem;
    }
    .char-card {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.5rem;
      font-size: 0.8125rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
    }
    .tamil {
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
      font-weight: 600;
      color: #6366f1;
      font-size: 1rem;
    }
    .arrow {
      color: #9ca3af;
    }
    .english {
      color: #6b7280;
      font-family: monospace;
    }
  `,
  template: `
    <button
      class="toggle-btn"
      type="button"
      [attr.aria-expanded]="expanded()"
      aria-controls="keyboard-ref-panel"
      (click)="expanded.update((v) => !v)"
    >
      {{ expanded() ? '▼' : '▶' }} Keyboard Reference
    </button>

    @if (expanded()) {
      <div
        class="reference-panel"
        id="keyboard-ref-panel"
        role="region"
        aria-label="Keyboard reference"
      >
        <div class="section">
          <h3>Vowels (உயிர்)</h3>
          <div class="grid">
            @for (v of vowels; track v.english) {
              <div class="char-card">
                <span class="tamil">{{ v.tamil }}</span>
                <span class="arrow">←</span>
                <span class="english">{{ v.english }}</span>
              </div>
            }
          </div>
        </div>
        <div class="section">
          <h3>Consonants (மெய்)</h3>
          <div class="grid">
            @for (c of consonants; track c.english) {
              <div class="char-card">
                <span class="tamil">{{ c.tamil }}</span>
                <span class="arrow">←</span>
                <span class="english">{{ c.english }}</span>
              </div>
            }
          </div>
        </div>
        <div class="section">
          <h3>Examples</h3>
          <div class="grid">
            @for (e of examples; track e.english) {
              <div class="char-card">
                <span class="tamil">{{ e.tamil }}</span>
                <span class="arrow">←</span>
                <span class="english">{{ e.english }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class KeyboardReferenceComponent {
  protected readonly expanded = signal(false);

  readonly vowels: CharMapping[] = [
    { english: 'a', tamil: 'அ' },
    { english: 'aa', tamil: 'ஆ' },
    { english: 'i', tamil: 'இ' },
    { english: 'ee', tamil: 'ஈ' },
    { english: 'u', tamil: 'உ' },
    { english: 'oo', tamil: 'ஊ' },
    { english: 'e', tamil: 'எ' },
    { english: 'ai', tamil: 'ஐ' },
    { english: 'o', tamil: 'ஒ' },
    { english: 'ou', tamil: 'ஓ' },
    { english: 'au', tamil: 'ஔ' },
  ];

  readonly consonants: CharMapping[] = [
    { english: 'k', tamil: 'க்' },
    { english: 'ng', tamil: 'ங்' },
    { english: 'ch', tamil: 'ச்' },
    { english: 'nj', tamil: 'ஞ்' },
    { english: 't', tamil: 'ட்' },
    { english: 'th', tamil: 'த்' },
    { english: 'n', tamil: 'ன்' },
    { english: 'p', tamil: 'ப்' },
    { english: 'm', tamil: 'ம்' },
    { english: 'y', tamil: 'ய்' },
    { english: 'r', tamil: 'ர்' },
    { english: 'l', tamil: 'ல்' },
    { english: 'v', tamil: 'வ்' },
    { english: 'zh', tamil: 'ழ்' },
    { english: 'sh', tamil: 'ஷ்' },
    { english: 's', tamil: 'ச்' },
    { english: 'h', tamil: 'ஹ்' },
    { english: 'tr', tamil: 'ற்' },
  ];

  readonly examples: CharMapping[] = [
    { english: 'ka', tamil: 'க' },
    { english: 'ki', tamil: 'கி' },
    { english: 'ku', tamil: 'கு' },
    { english: 'kaa', tamil: 'கா' },
    { english: 'kal', tamil: 'கல்' },
    { english: 'kaal', tamil: 'கால்' },
    { english: 'tamil', tamil: 'தமில்' },
    { english: 'vanakkam', tamil: 'வனக்கம்' },
  ];
}
