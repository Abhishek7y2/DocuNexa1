export type UserRole =
  | 'platform-operator'
  | 'organization-admin'
  | 'contributor'
  | 'reviewer'
  | 'approver'
  | 'reader';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatarInitials: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}