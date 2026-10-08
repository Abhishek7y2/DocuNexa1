import { Role } from './roles';

export const ALL_ROLES: Role[] = [
  'platform_operator',
  'org_admin',
  'contributor',
  'reviewer',
  'approver',
  'auditor',
];

export const TENANT_ROLES: Role[] = [
  'org_admin',
  'contributor',
  'reviewer',
  'approver',
  'auditor',
];

export const ROLE_ROUTE_ACCESS: Record<string, Role[]> = {
  '/dashboard': ALL_ROLES,
  '/documents': TENANT_ROLES,
  '/documents/:id': TENANT_ROLES,
  '/search': TENANT_ROLES,
  '/qa': TENANT_ROLES,
  '/compare': TENANT_ROLES,
  '/compare/:id': TENANT_ROLES,
  '/intake': ['contributor', 'reviewer', 'approver', 'org_admin'],
  '/tasks': ['contributor', 'reviewer', 'approver', 'org_admin'],
  '/review': ['reviewer', 'org_admin'],
  '/review/:id': ['reviewer', 'org_admin'],
  '/approvals': ['approver', 'org_admin'],
  '/admin': ['org_admin', 'platform_operator'],
};

export function hasRoleAccess(userRole: Role | undefined | null, routePath: string): boolean {
  if (!userRole) return false;
  
  // Find matching route pattern
  const matchedRoute = Object.keys(ROLE_ROUTE_ACCESS).find((pattern) => {
    if (pattern === routePath) return true;
    if (pattern.includes(':id')) {
      const regex = new RegExp('^' + pattern.replace(':id', '[^/]+') + '$');
      return regex.test(routePath);
    }
    return false;
  });

  if (!matchedRoute) {
    return true; // Default allow if unspecified
  }

  return ROLE_ROUTE_ACCESS[matchedRoute].includes(userRole);
}
