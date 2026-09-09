const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiRequestError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // resposta sem corpo (ex: 204)
  }

  if (!res.ok) {
    const message = body?.error?.message || 'Não foi possível completar a solicitação.';
    throw new ApiRequestError(message, res.status, body?.error?.code, body?.error?.details);
  }

  return body?.data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export { ApiRequestError };
