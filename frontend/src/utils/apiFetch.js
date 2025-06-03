
/**
 * apiFetch(url, options, onUnauthorized)
 * - Lê JWT do localStorage e injeta em Authorization
 * - Se 401, remove token e chama onUnauthorized()
 */
export default async function apiFetch(url, options = {}, onUnauthorized) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    if (typeof onUnauthorized === 'function') {
      onUnauthorized();
    }
    return res;
  }

  return res;
}

