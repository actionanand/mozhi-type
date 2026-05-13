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
    .sub-heading {
      margin-top: 0.75rem;
    }
    .mnemonic {
      margin: 0 0 0.75rem;
      padding: 0.625rem 0.75rem;
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      line-height: 1.6;
      color: #92400e;
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
    }
    .note-box {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      line-height: 1.7;
      color: #0c4a6e;
    }
    .note-box h4 {
      margin: 0 0 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .note-box ul {
      margin: 0.25rem 0;
      padding-left: 1.25rem;
    }
    .note-box li {
      margin-bottom: 0.125rem;
    }
    .note-tamil {
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
      font-weight: 600;
      color: #6366f1;
    }
    .section + .section {
      margin-top: 1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 0.375rem;
    }
    .grid-wide {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
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
          <p class="mnemonic">
            நினைவு சூத்திரம்: "கடலை உருண்டையை நன்கு சமைத்து ருசித்து சாப்பிடு என்று அம்மா கூறினார்"
            — முதல் எழுத்துக்கள்: க(௧) உ(௨) ந(௩) ச(௪) ரு(௫) சா(௬) எ(௭) அ(௮) கூ(௯)
          </p>
          <div class="grid">
            @for (num of tamilNumbers; track num.english) {
              <div class="char-card">
                <span class="tamil">{{ num.tamil }}</span>
                <span class="arrow">←</span>
                <span class="english">{{ num.english }}</span>
              </div>
            }
          </div>
          <div class="note-box">
            <h4>Tamil Number System (தமிழ் எண் முறை)</h4>
            <p>
              Tamil uses a <strong>multiplicative</strong> system with three place markers:
              <span class="note-tamil">௰</span> = 10, <span class="note-tamil">௱</span> = 100,
              <span class="note-tamil">௲</span> = 1000. Place markers multiply to form higher
              powers. There is no Tamil zero — 0 stays as 0.
            </p>
            <ul>
              <li>
                <span class="note-tamil">௰</span> = 10 &nbsp;|&nbsp;
                <span class="note-tamil">௰௧</span> = 11 &nbsp;|&nbsp;
                <span class="note-tamil">௨௰</span> = 20
              </li>
              <li>
                <span class="note-tamil">௱</span> = 100 &nbsp;|&nbsp;
                <span class="note-tamil">௱௨௰௬</span> = 126 &nbsp;|&nbsp;
                <span class="note-tamil">௫௱</span> = 500
              </li>
              <li>
                <span class="note-tamil">௲</span> = 1,000 &nbsp;|&nbsp;
                <span class="note-tamil">௨௲</span> = 2,000 &nbsp;|&nbsp;
                <span class="note-tamil">௨௲௨௰௬</span> = 2,026
              </li>
              <li><span class="note-tamil">௰௲</span> = 10 × 1000 = 10,000</li>
              <li><span class="note-tamil">௱௲</span> = 100 × 1000 = 1,00,000 (lakh)</li>
              <li><span class="note-tamil">௰௱௲</span> = 10 × 100 × 1000 = 10,00,000 (10 lakhs)</li>
              <li><span class="note-tamil">௱௱௲</span> = 100 × 100 × 1000 = 1,00,00,000 (crore)</li>
              <li><span class="note-tamil">௰௱௱௲</span> = 10 × 100 × 100 × 1000 = 10 crore</li>
              <li><span class="note-tamil">௱௱௱௲</span> = 100³ × 1000 = 100 crore</li>
              <li><span class="note-tamil">௲௱௱௲</span> = 1000 × 100² × 1000 = 1,000 crore</li>
              <li><span class="note-tamil">௰௲௱௱௲</span> = 10,000 crore</li>
              <li><span class="note-tamil">௱௲௱௱௲</span> = 1 lakh crore</li>
              <li><span class="note-tamil">௱௱௲௱௱௲</span> = 1 crore crore</li>
            </ul>
            <p>
              <strong>Rule:</strong> Between any two <span class="note-tamil">௲</span> markers,
              exactly two <span class="note-tamil">௱</span> markers appear. Type numbers with or
              without commas — e.g., <code>1,000,000</code> or <code>1000000</code> →
              <span class="note-tamil">௰௱௲</span>
            </p>
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
          <div class="grid-wide">
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
    { english: 'q', tamil: 'ஃ' },
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
