// Centralized configuration export
export * from './auth';
export * from './routes';

// Main configuration object
export const config = {
  app: {
    name: 'Operations Backoffice',
    version: '1.0.0',
  },
  auth: {
    roles: require('./auth').ROLES,
    permissions: require('./auth').PERMISSIONS,
    userRoles: require('./auth').USER_ROLES,
  },
  routes: {
    public: require('./routes').PUBLIC_ROUTES,
    protected: require('./routes').ROUTE_CONFIGS,
  },
  navigation: require('./routes').MENU_ITEMS,
  dashboard: {
    quickActions: require('./routes').QUICK_ACTIONS,
  },
} as const;

// Type exports for better TypeScript support
export type AppConfig = typeof config;
export type AuthConfig = typeof config.auth;
export type RouteConfig = typeof config.routes;
