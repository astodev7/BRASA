const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiRequestError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
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
    // Resposta sem corpo, como 204 No Content
  }

  if (!res.ok) {
    const message =
      body?.error?.message ||
      `Não foi possível completar a solicitação. (${res.status})`;

    throw new ApiRequestError(
      message,
      res.status,
      body?.error?.code,
      body?.error?.details
    );
  }

  return body?.data;
}

export const api = {
  get: (path) =>
    request(path, {
      method: 'GET',
    }),

  post: (path, data) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (path, data) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: (path, data) =>
    request(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (path) =>
    request(path, {
      method: 'DELETE',
    }),
};

export { ApiRequestError };