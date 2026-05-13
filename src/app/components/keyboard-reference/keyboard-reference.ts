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
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
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
      overflow: visible;
      min-height: 2rem;
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
      (click)="toggleExpanded()"
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
          <h3>Grantha / வடமொழி</h3>
          <div class="grid">
            @for (g of granthaConsonants; track g.english) {
              <div class="char-card">
                <span class="tamil">{{ g.tamil }}</span>
                <span class="arrow">←</span>
                <span class="english">{{ g.english }}</span>
              </div>
            }
          </div>
        </div>
        <div class="section">
          <h3>Tamil Numbers (தமிழ் எண்கள்)</h3>
          <div class="grid">
            @for (num of tamilNumbers; track num.english) {
              <div class="char-card">
                <span class="tamil">{{ num.tamil }}</span>
                <span class="arrow">←</span>
                <span class="english">{{ num.english }}</span>
              </div>
            }
          </div>
        </div>
        <div class="section">
          <h3>Special Symbols (சிறப்பு குறியீடுகள்)</h3>
          <div class="grid">
            @for (sym of specialSymbols; track sym.english) {
              <div class="char-card">
                <span class="tamil">{{ sym.english }}</span>
                <span class="arrow">→</span>
                <span class="english">{{ sym.tamil }}</span>
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

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  readonly vowels: CharMapping[] = [
    { english: 'a', tamil: 'அ' },
    { english: 'aa / A', tamil: 'ஆ' },
    { english: 'i', tamil: 'இ' },
    { english: 'ee / I', tamil: 'ஈ' },
    { english: 'u', tamil: 'உ' },
    { english: 'oo / U', tamil: 'ஊ' },
    { english: 'e', tamil: 'எ' },
    { english: 'E', tamil: 'ஏ' },
    { english: 'ai', tamil: 'ஐ' },
    { english: 'o', tamil: 'ஒ' },
    { english: 'O / ou', tamil: 'ஓ' },
    { english: 'au', tamil: 'ஔ' },
    { english: 'aq', tamil: 'ஃ' },
  ];

  readonly consonants: CharMapping[] = [
    { english: 'k / g', tamil: 'க்' },
    { english: 'ng', tamil: 'ங்' },
    { english: 'ch / s', tamil: 'ச்' },
    { english: 'nj', tamil: 'ஞ்' },
    { english: 't / T', tamil: 'ட்' },
    { english: 'N', tamil: 'ண்' },
    { english: 'th', tamil: 'த்' },
    { english: 'nh', tamil: 'ந்' },
    { english: 'p / b', tamil: 'ப்' },
    { english: 'm', tamil: 'ம்' },
    { english: 'y', tamil: 'ய்' },
    { english: 'r', tamil: 'ர்' },
    { english: 'l', tamil: 'ல்' },
    { english: 'v / w', tamil: 'வ்' },
    { english: 'zh / z', tamil: 'ழ்' },
    { english: 'L', tamil: 'ள்' },
    { english: 'R / tr', tamil: 'ற்' },
    { english: 'n', tamil: 'ன்' },
  ];

  readonly granthaConsonants: CharMapping[] = [
    { english: 'j / J', tamil: 'ஜ்' },
    { english: 'sh', tamil: 'ஷ்' },
    { english: 'S', tamil: 'ஸ்' },
    { english: 'h / H', tamil: 'ஹ்' },
    { english: 'ksh / x', tamil: 'க்ஷ்' },
    { english: 'sri', tamil: 'ஸ்ரீ' },
    { english: 'Sha', tamil: 'ஶ' },
  ];

  readonly tamilNumbers: CharMapping[] = [
    { english: '1', tamil: '௧' },
    { english: '2', tamil: '௨' },
    { english: '3', tamil: '௩' },
    { english: '4', tamil: '௪' },
    { english: '5', tamil: '௫' },
    { english: '6', tamil: '௬' },
    { english: '7', tamil: '௭' },
    { english: '8', tamil: '௮' },
    { english: '9', tamil: '௯' },
  ];

  readonly specialSymbols: CharMapping[] = [
    { english: 'QD', tamil: '௳ நாள்' },
    { english: 'QM', tamil: '௴ மாதம்' },
    { english: 'QY', tamil: '௵ வருடம்' },
    { english: 'QA', tamil: '௸ மேற்படி' },
    { english: 'QR', tamil: '௹ ரூபாய்' },
    { english: 'QN', tamil: '௺ எண்' },
  ];

  readonly examples: CharMapping[] = [
    { english: 'kal', tamil: 'கல்' },
    { english: 'kaal', tamil: 'கால்' },
    { english: 'tamizh', tamil: 'தமிழ்' },
    { english: 'vaNakkam', tamil: 'வணக்கம்' },
    { english: 'nya', tamil: 'ஞ (ny)' },
    { english: 'Na', tamil: 'ண' },
    { english: 'nha', tamil: 'ந' },
    { english: 'pEsu', tamil: 'பேசு' },
    { english: 'da', tamil: 'ட' },
  ];
}
