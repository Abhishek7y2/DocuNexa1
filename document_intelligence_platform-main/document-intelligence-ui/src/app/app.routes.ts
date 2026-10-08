import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { ROLE_ROUTE_ACCESS } from './core/models/permissions';

export const routes: Routes = [
  /* =========================
     AUTH ROUTES
  ========================= */
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },

  {
    path: 'verify-email',
    loadComponent: () =>
      import('./features/auth/verify-email/verify-email').then(
        (m) => m.VerifyEmail,
      ),
  },

  {
    path: 'forgot-password',
    redirectTo: 'verify-email',
    pathMatch: 'full',
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then(
        (m) => m.ResetPassword,
      ),
  },

  {
    path: 'access-denied',
    loadComponent: () =>
      import('./features/auth/access-denied/access-denied').then(
        (m) => m.AccessDenied,
      ),
  },

  /* =========================
     PROTECTED APPLICATION
  ========================= */
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/dashboard'] },
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'documents',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/documents'] },
        loadComponent: () =>
          import('./features/documents/documents').then((m) => m.Documents),
      },

      {
        path: 'documents/:id',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/documents/:id'] },
        loadComponent: () =>
          import('./features/document-detail/document-detail').then(
            (m) => m.DocumentDetail,
          ),
      },

      {
        path: 'intake',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/intake'] },
        loadComponent: () =>
          import('./features/intake/intake').then((m) => m.Intake),
      },

      {
        path: 'review',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/review'] },
        loadComponent: () =>
          import('./features/review/review').then((m) => m.Review),
      },

      {
        path: 'review/:id',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/review/:id'] },
        loadComponent: () =>
          import('./features/review/review-workbench/review-workbench').then(
            (m) => m.ReviewWorkbench,
          ),
      },

      {
        path: 'compare',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/compare'] },
        loadComponent: () =>
          import('./features/compare/compare-studio').then(
            (m) => m.CompareStudio,
          ),
      },

      {
        path: 'compare/:id',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/compare/:id'] },
        loadComponent: () =>
          import('./features/compare/compare-studio').then(
            (m) => m.CompareStudio,
          ),
      },

      {
        path: 'approvals',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/approvals'] },
        loadComponent: () =>
          import('./features/approvals/approvals').then((m) => m.Approvals),
      },

      {
        path: 'search',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/search'] },
        loadComponent: () =>
          import('./features/search/search').then((m) => m.Search),
      },

      {
        path: 'qa',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/qa'] },
        loadComponent: () =>
          import('./features/qa/qa').then((m) => m.Qa),
      },

      {
        path: 'tasks',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/tasks'] },
        loadComponent: () =>
          import('./features/tasks/tasks').then((m) => m.Tasks),
      },

      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ROLE_ROUTE_ACCESS['/admin'] },
        loadComponent: () =>
          import('./features/admin/admin').then((m) => m.Admin),
      },
    ],
  },

  /* =========================
     FALLBACK
  ========================= */
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];