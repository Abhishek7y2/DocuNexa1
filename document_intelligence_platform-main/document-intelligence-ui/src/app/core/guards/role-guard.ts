import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/roles';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();

  if (!currentUser) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  // Deactivated users land on access-denied
  if (currentUser.status === 'deactivated') {
    return router.createUrlTree(['/access-denied'], {
      queryParams: { reason: 'deactivated' },
    });
  }

  const allowedRoles = (route.data?.['roles'] as Role[]) || [];

  if (allowedRoles.length === 0 || allowedRoles.includes(currentUser.role)) {
    return true;
  }

  return router.createUrlTree(['/access-denied'], {
    queryParams: { attemptedUrl: state.url },
  });
};
