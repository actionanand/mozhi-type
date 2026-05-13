import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/typing-page/typing-page').then((m) => m.TypingPageComponent),
  },
];
