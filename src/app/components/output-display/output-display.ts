import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-output-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'output-display' },
  styles: `
    :host {
      display: block;
    }
    .output-box {
      min-height: 120px;
      padding: 1rem;
      font-size: 1.25rem;
      font-family: 'Noto Sans Tamil', 'Latha', sans-serif;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      background: #f9fafb;
      line-height: 2;
      white-space: pre-wrap;
      word-break: break-word;
      color: #111827;
    }
    .output-box:empty::before {
      content: attr(data-placeholder);
      color: #9ca3af;
    }
    .label-text {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #374151;
      font-size: 0.875rem;
    }
  `,
  template: `
    <span class="label-text">{{ label() }}</span>
    <div
      class="output-box"
      role="region"
      [attr.aria-label]="label()"
      [attr.data-placeholder]="placeholder()"
    >
      {{ content() }}
    </div>
  `,
})
export class OutputDisplayComponent {
  readonly label = input('Tamil Output');
  readonly content = input('');
  readonly placeholder = input('Tamil text will appear here...');
}
