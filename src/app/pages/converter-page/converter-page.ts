import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { TransliterationService } from '../../core/transliteration.service';
import { CopyButtonComponent } from '../../components/copy-button/copy-button';

/** Format a numeric string with commas in the Indian grouping (e.g. 1000000 → 10,00,000). */
function formatWithCommas(numStr: string): string {
  if (!numStr || numStr === '0') return numStr;
  // Indian grouping: last 3 digits, then groups of 2
  const reversed = numStr.split('').reverse();
  const groups: string[] = [];
  for (let i = 0; i < reversed.length; i++) {
    if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) groups.push(',');
    groups.push(reversed[i]);
  }
  return groups.reverse().join('');
}

@Component({
  selector: 'app-converter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CopyButtonComponent],
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
    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    textarea {
      width: 100%;
      min-height: 100px;
      padding: 0.625rem 0.75rem;
      font-size: 1.375rem;
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
      line-height: 1.6;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      resize: vertical;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    textarea:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    .hint-row {
      margin-top: 0.5rem;
      font-size: 0.8125rem;
      color: #9ca3af;
    }
    .result-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem 1.25rem;
      min-height: 3.5rem;
      display: flex;
      align-items: center;
    }
    .result-number {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.01em;
      word-break: break-all;
    }
    .result-number.empty {
      font-size: 1rem;
      font-weight: 400;
      color: #9ca3af;
    }
    .result-formatted {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.375rem;
    }
    .result-content {
      flex: 1;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 1rem;
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
      transition: background 0.2s;
    }
    .clear-btn:hover {
      background: rgba(220, 38, 38, 0.05);
    }
    .clear-btn:focus-visible {
      outline: 2px solid #dc2626;
      outline-offset: 2px;
    }
    .examples {
      margin-top: 1.5rem;
    }
    .examples h2 {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.75rem;
    }
    .example-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.5rem;
    }
    .example-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.8125rem;
      transition: background 0.15s;
      text-align: left;
    }
    .example-chip:hover {
      background: #eef2ff;
      border-color: #c7d2fe;
    }
    .example-chip:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }
    .example-tamil {
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #4f46e5;
    }
    .example-sep {
      color: #9ca3af;
    }
    .example-arabic {
      color: #374151;
    }
  `,
  template: `
    <header>
      <h1>Tamil → Numbers</h1>
      <p class="subtitle">Paste or type Tamil numerals to convert to Arabic numbers</p>
    </header>

    <div class="card">
      <label for="tamil-input">Tamil Numeral Input (தமிழ் எண்)</label>
      <textarea
        id="tamil-input"
        [value]="tamilInput()"
        (input)="onInput($event)"
        placeholder="Paste Tamil numerals here — e.g. ௱௫௰௬"
        aria-label="Tamil numeral input"
        autocomplete="off"
        spellcheck="false"
      ></textarea>
      <p class="hint-row">
        Tamil digit characters: ௧ ௨ ௩ ௪ ௫ ௬ ௭ ௮ ௯ &nbsp;|&nbsp; Place markers: ௰ (10) ௱ (100) ௲
        (1000)
      </p>
    </div>

    <div class="card">
      <label>Arabic Number Output</label>
      <div class="result-box" aria-live="polite" aria-atomic="true">
        <div class="result-content">
          @if (arabicResult()) {
            <div class="result-number">{{ arabicResult() }}</div>
            @if (formattedResult() !== arabicResult()) {
              <div class="result-formatted">Formatted: {{ formattedResult() }}</div>
            }
          } @else {
            <div class="result-number empty">Result will appear here…</div>
          }
        </div>
      </div>
    </div>

    <div class="actions">
      @if (arabicResult()) {
        <app-copy-button [textToCopy]="arabicResult()" label="number" />
      }
      <button class="clear-btn" type="button" (click)="clear()" aria-label="Clear input">
        🗑 Clear
      </button>
    </div>

    <div class="examples">
      <h2>Try an example</h2>
      <div class="example-grid" role="list">
        @for (ex of examples; track ex.arabic) {
          <button
            class="example-chip"
            type="button"
            role="listitem"
            (click)="loadExample(ex.tamil)"
            [attr.aria-label]="'Load example: ' + ex.tamil + ' equals ' + ex.arabic"
          >
            <span class="example-tamil">{{ ex.tamil }}</span>
            <span class="example-sep">→</span>
            <span class="example-arabic">{{ ex.arabic }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class ConverterPageComponent {
  private readonly svc = inject(TransliterationService);

  protected readonly tamilInput = signal('');

  protected readonly arabicResult = computed(() => {
    const input = this.tamilInput().trim();
    if (!input) return '';
    return this.svc.fromTamilNumeral(input);
  });

  protected readonly formattedResult = computed(() => {
    const r = this.arabicResult();
    if (!r || r === '0') return r;
    return formatWithCommas(r);
  });

  protected readonly examples = [
    { tamil: '௧', arabic: '1' },
    { tamil: '௰', arabic: '10' },
    { tamil: '௱', arabic: '100' },
    { tamil: '௲', arabic: '1,000' },
    { tamil: '௱௫௰௬', arabic: '156' },
    { tamil: '௨௲௨௰௬', arabic: '2,026' },
    { tamil: '௮௲', arabic: '8,000' },
    { tamil: '௰௲', arabic: '10,000' },
    { tamil: '௱௲', arabic: '1,00,000' },
    { tamil: '௰௱௲', arabic: '10,00,000' },
    { tamil: '௱௱௲', arabic: '1,00,00,000' },
    { tamil: '௲௱௱௲', arabic: '10,00,00,00,000' },
  ] as const;

  onInput(event: Event): void {
    this.tamilInput.set((event.target as HTMLTextAreaElement).value);
  }

  loadExample(tamil: string): void {
    this.tamilInput.set(tamil);
  }

  clear(): void {
    this.tamilInput.set('');
  }
}
