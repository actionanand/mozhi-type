import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

@Component({
  selector: 'app-copy-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'copy-button' },
  styles: `
    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
    button:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }
    .copied {
      color: #059669;
      border-color: #059669;
    }
  `,
  template: `
    <button
      type="button"
      [class.copied]="copied()"
      [attr.aria-label]="copied() ? 'Copied!' : 'Copy ' + label() + ' to clipboard'"
      (click)="copy()"
    >
      {{ copied() ? '✓ Copied!' : '📋 Copy ' + label() }}
    </button>
  `,
})
export class CopyButtonComponent {
  readonly textToCopy = input.required<string>();
  readonly label = input('text');

  protected readonly copied = signal(false);

  copy(): void {
    const text = this.textToCopy();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
