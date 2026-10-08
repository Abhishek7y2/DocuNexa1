import { Routes } from '@angular/router';

import { Shell } from './layout/shell/shell';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

    /* =========================
       LOGIN
    ========================= */

    {
        path: 'login',

        loadComponent: () =>
            import('./features/auth/login/login').then(
                (m) => m.Login,
            ),
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


    /* =========================
       PROTECTED APPLICATION
    ========================= */

    {
        path: '',

        component: Shell,

        canActivate: [authGuard],

        children: [

            /* Dashboard */

            {
                path: '',

                redirectTo: 'dashboard',

                pathMatch: 'full',
            },


            {
                path: 'dashboard',

                loadComponent: () =>
                    import('./features/dashboard/dashboard').then(
                        (m) => m.Dashboard,
                    ),
            },


            /* Documents */

            {
                path: 'documents',

                loadComponent: () =>
                    import('./features/documents/documents').then(
                        (m) => m.Documents,
                    ),
            },


            /* Document Detail */

            {
                path: 'documents/:id',

                loadComponent: () =>
                    import(
                        './features/document-detail/document-detail'
                    ).then(
                        (m) => m.DocumentDetail,
                    ),
            },

            {
                path: 'intake',

                loadComponent: () =>
                    import('./features/intake/intake').then(
                        (m) => m.Intake,
                    ),
            },

            {
                path: 'review',
                loadComponent: () =>
                    import('./features/review/review').then(
                        (m) => m.Review,
                    ),
            },

            {
                path: 'review/:id',
                loadComponent: () =>
                    import(
                        './features/review/review-workbench/review-workbench'
                    ).then((m) => m.ReviewWorkbench),
            },

            {
                path: 'compare',
                loadComponent: () =>
                    import('./features/compare/compare-studio').then(
                        (m) => m.CompareStudio,
                    ),
            },

            {
                path: 'compare/:id',
                loadComponent: () =>
                    import('./features/compare/compare-studio').then(
                        (m) => m.CompareStudio,
                    ),
            },

            {
                path: 'approvals',
                loadComponent: () =>
                    import('./features/approvals/approvals').then(
                        (m) => m.Approvals,
                    ),
            },

            {
                path: 'search',
                loadComponent: () =>
                    import('./features/search/search').then(
                        (m) => m.Search,
                    ),
            },

            {
                path: 'qa',
                loadComponent: () =>
                    import('./features/qa/qa').then(
                        (m) => m.Qa,
                    ),
            },

            {
                path: 'tasks',
                loadComponent: () =>
                    import('./features/tasks/tasks').then(
                        (m) => m.Tasks,
                    ),
            },

            {
                path: 'admin',
                loadComponent: () =>
                    import('./features/admin/admin').then(
                        (m) => m.Admin,
                    ),
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