import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'documents/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'review/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'compare/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];