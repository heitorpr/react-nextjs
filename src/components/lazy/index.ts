import { lazy } from 'react';

// Lazy load main pages
export const LazyDashboard = lazy(() => import('@/app/page'));
export const LazyAdmin = lazy(() => import('@/app/admin/page'));
export const LazyOperations = lazy(() => import('@/app/operations/page'));
export const LazyHello = lazy(() => import('@/app/hello/page'));
export const LazyUnauthorized = lazy(() => import('@/app/unauthorized/page'));
export const LazySignIn = lazy(() => import('@/app/auth/signin/page'));

// Lazy load complex components
export const LazyDataTable = lazy(
  () => import('@/components/ui/Table/DataTable')
);
export const LazyModal = lazy(() => import('@/components/ui/Modal/Modal'));

// Lazy load error boundaries
export const LazyErrorBoundary = lazy(() =>
  import('@/components/errors/UnifiedErrorBoundary').then(module => ({
    default: module.UnifiedErrorBoundary,
  }))
);
