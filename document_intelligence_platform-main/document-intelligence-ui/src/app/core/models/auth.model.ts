import { Role } from './roles';

export type UserRole = Role | 'organization-admin' | 'platform-operator' | 'reader';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
  avatarInitials: string;
  status?: 'active' | 'deactivated';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}