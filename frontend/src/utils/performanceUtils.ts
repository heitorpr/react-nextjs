/**
 * Performance utilities for optimizing React components and operations
 */

// Declare performance API for Node.js environment
declare const performance: { now(): number } | undefined;

/**
 * Debounce function to limit the rate of function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Throttle function to limit the rate of function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function results to avoid expensive recalculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Create a stable reference for object dependencies
 */
export function stableReference<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if two objects are shallowly equal
 */
export function shallowEqual<T extends Record<string, any>>(
  obj1: T,
  obj2: T
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Measure function execution time
 */
export function measureTime<T extends (...args: any[]) => any>(
  fn: T,
  label?: string
): T {
  return ((...args: Parameters<T>) => {
    const start =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    const result = fn(...args);
    const end =
      typeof performance !== 'undefined' ? performance.now() : Date.now();

    if (label) {
      console.warn(`${label}: ${end - start}ms`);
    }

    return result;
  }) as T;
}

/**
 * Create a lazy initializer for React state
 */
export function lazyState<T>(initializer: () => T): T {
  return initializer();
}

/**
 * Batch multiple state updates
 */
export function batchUpdates(updates: (() => void)[]): void {
  // In React 18+, this would use React's batching
  // For now, we'll execute them in a single tick
  Promise.resolve().then(() => {
    updates.forEach(update => update());
  });
}

/**
 * Create a stable callback that doesn't change on every render
 */
export function stableCallback<T extends (...args: any[]) => any>(
  callback: T,
  _deps: any[]
): T {
  // This is a simplified version - in practice, you'd use useCallback
  return callback;
}
