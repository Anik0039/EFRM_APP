import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeuix/themes';
import { MessageService, ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';

const EfrmPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#f2f7fc',
      100: '#dde9f8',
      200: '#b3cdef',
      300: '#78a6e3',
      400: '#3c7fd7',
      500: '#2564b6',
      600: '#1b498a',
      700: '#153866',
      800: '#0f2848',
      900: '#0a1a2f',
      950: '#06101e',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      ripple: true,
      theme: {
        preset: EfrmPreset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    }),
  ],
};
