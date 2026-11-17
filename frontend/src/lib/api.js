const BASE = import.meta.env.VITE_API_URL || '';

export const googleLoginUrl = `${BASE}/api/auth/google`;

// Small fetch wrapper: sends the session cookie and throws Error(message) on non-2xx.
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty or non-JSON response
  }

  if (!res.ok) {
    const err = new Error(data?.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}
