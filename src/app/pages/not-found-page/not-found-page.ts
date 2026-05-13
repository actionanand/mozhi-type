import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 2rem 1rem;
      text-align: center;
    }
    .code {
      font-size: 6rem;
      font-weight: 700;
      color: #e5e7eb;
      line-height: 1;
      margin: 0;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0.5rem 0;
    }
    p {
      color: #6b7280;
      margin: 0 0 2rem;
    }
    .links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    a {
      display: inline-flex;
      align-items: center;
      padding: 0.625rem 1.25rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: background 0.15s;
    }
    a.primary {
      background: #4f46e5;
      color: #fff;
    }
    a.primary:hover {
      background: #4338ca;
    }
    a.secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #e5e7eb;
    }
    a.secondary:hover {
      background: #e5e7eb;
    }
    a:focus-visible {
      outline: 2px solid #4f46e5;
      outline-offset: 2px;
    }
  `,
  template: `
    <p class="code" aria-hidden="true">404</p>
    <h1>Page not found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <div class="links">
      <a routerLink="/" class="primary">மொழி Type — Typing</a>
      <a routerLink="/converter" class="secondary">Tamil Number Converter</a>
    </div>
  `,
})
export class NotFoundPageComponent {}
