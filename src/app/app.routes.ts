import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/typing-page/typing-page').then((m) => m.TypingPageComponent),
  },
  {
    path: 'converter',
    loadComponent: () =>
      import('./pages/converter-page/converter-page').then((m) => m.ConverterPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPageComponent),
  },
];
