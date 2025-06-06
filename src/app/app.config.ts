import {ApplicationConfig} from '@angular/core';
import {provideRouter, withComponentInputBinding, withHashLocation, withViewTransitions} from '@angular/router';
import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    provideAnimationsAsync(),
  ]
};
