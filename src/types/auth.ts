export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  roles: Role[];
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// Navigation menu item interface
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  children?: MenuItem[];
}

// Route protection configuration
export interface RouteConfig {
  path: string;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  public?: boolean;
}
