import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {BackendService} from '../services/backend/backend.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const backendService = inject(BackendService);
  if (backendService.isLoggedIn()) {
    inject(Router).navigate(['/profile'])
    return false;
  } else {
    return true;
  }
};
