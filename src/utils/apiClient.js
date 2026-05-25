const BASE_URL = 'https://bizferbine-backend.onrender.com/api';

async function request(endpoint, options = {}) {
  const headers = { ...options.headers };

  // Automatically attach Content-Type unless the body is FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Automatically attach secure cookies
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // The Global Interceptor: Handle Unauthorized/Expired Sessions
  if (response.status === 401) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
}

export default {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, options) => request(endpoint, { ...options, method: 'POST' }),
  put: (endpoint, options) => request(endpoint, { ...options, method: 'PUT' }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};