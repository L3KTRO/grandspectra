import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {BackendService} from '../services/backend/backend.service';

export const authGuard: CanActivateFn = () => {
  const backendService = inject(BackendService);
  if (backendService.isLoggedIn()) {
    return true;
  } else {
    inject(Router).navigate(['/login'])
    return false;
  }
};
