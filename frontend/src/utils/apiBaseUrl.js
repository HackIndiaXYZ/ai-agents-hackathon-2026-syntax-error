/**
 * Resolve API base URL for axios.
 * - On deployed frontend (hm-azure-ten*.vercel.app): always use /api proxy (no CORS).
 * - Otherwise normalize VITE_API_URL so backend URLs always end with /api.
 */
const FRONTEND_HOST_PATTERN = /^hm-azure-ten([\w-]*)?\.vercel\.app$/;

export function normalizeApiBaseUrl(url) {
  if (!url || typeof url !== 'string') return '/api';

  const trimmed = url.trim();
  if (!trimmed) return '/api';

  if (trimmed === '/api' || trimmed.endsWith('/api/')) {
    return trimmed.replace(/\/+$/, '') || '/api';
  }

  if (trimmed.startsWith('/')) {
    const path = trimmed.replace(/\/+$/, '');
    return path.endsWith('/api') ? path : `${path}/api`;
  }

  const withoutTrailing = trimmed.replace(/\/+$/, '');
  return withoutTrailing.endsWith('/api') ? withoutTrailing : `${withoutTrailing}/api`;
}

export function resolveApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return import.meta.env.VITE_API_URL
        ? normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
        : '/api';
    }
    if (FRONTEND_HOST_PATTERN.test(hostname)) {
      return '/api';
    }
  }

  if (import.meta.env.VITE_API_URL) {
    return normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
  }

  return '/api';
}
