import axios from 'axios';
import axiosRetry from 'axios-retry';

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const timeout = Number(import.meta.env.VITE_API_TIMEOUT_MS || 20000);
const retries = Number(import.meta.env.VITE_API_RETRIES || 2);

export const api = axios.create({
  baseURL,
  timeout,
  headers: { 'Content-Type': 'application/json' },
});

axiosRetry(api, {
  retries,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.code === 'ECONNABORTED',
});

/* ----------------------------------------------------------------------- */
/* Admin auth token                                                        */
/* ----------------------------------------------------------------------- */
const TOKEN_KEY = 'mrn_admin_token';

export function getAdminToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setAdminToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
}
export function clearAdminToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

// Attach the admin JWT to every request.
api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 (expired/invalid token) clear it and bounce back to the login gate.
// The login request itself is exempt so bad credentials show inline instead.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error?.config?.url || '';
    if (error?.response?.status === 401 && !url.includes('/api/admin/login')) {
      clearAdminToken();
      if (typeof window !== 'undefined') window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const AdminAuth = {
  login: (username, password) =>
    api.post('/api/admin/login', { username, password }).then((r) => r.data),
  me: () => api.get('/api/admin/me').then((r) => r.data),
};

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const Modules = {
  list: () => api.get('/api/modules').then(unwrap),
  get: (id) => api.get(`/api/modules/${id}`).then(unwrap),
  lessons: (id) => api.get(`/api/modules/${id}/lessons`).then(unwrap),
  create: (body) => api.post('/api/modules', body).then(unwrap),
  update: (id, body) => api.put(`/api/modules/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/api/modules/${id}`).then(unwrap),
};

export const Lessons = {
  get: (id) => api.get(`/api/lessons/${id}`).then(unwrap),
  create: (body) => api.post('/api/lessons', body).then(unwrap),
  update: (id, body) => api.put(`/api/lessons/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/api/lessons/${id}`).then(unwrap),
};

export const AppContent = {
  get: () => api.get('/api/app-content').then(unwrap),
  update: (body) => api.put('/api/app-content', body).then(unwrap),
};

export const Legal = {
  get: (key) => api.get(`/api/legal/${key}`).then(unwrap),
  update: (key, body) => api.put(`/api/legal/${key}`, { body }).then(unwrap),
};

export const Categories = {
  list: () => api.get('/api/categories').then(unwrap),
  get: (id) => api.get(`/api/categories/${id}`).then(unwrap),
  modules: (id) => api.get(`/api/categories/${id}/modules`).then(unwrap),
  create: (body) => api.post('/api/categories', body).then(unwrap),
  update: (id, body) => api.put(`/api/categories/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/api/categories/${id}`).then(unwrap),
  addModule: (id, moduleId) =>
    api.post(`/api/categories/${id}/modules`, { module_id: moduleId }).then(unwrap),
  removeModule: (id, moduleId) =>
    api.delete(`/api/categories/${id}/modules/${moduleId}`).then(unwrap),
};

export const Users = {
  list: () => api.get('/api/users').then(unwrap),
  get: (id) => api.get(`/api/users/${id}`).then(unwrap),
  update: (id, body) => api.patch(`/api/users/${id}`, body).then(unwrap),
  remove: (id) => api.delete(`/api/users/${id}`).then(unwrap),
  resetPassword: (id, newPassword) =>
    api.post(`/api/users/${id}/reset-password`, { newPassword }).then(unwrap),
};

export const Notifications = {
  list: () => api.get('/api/notifications').then(unwrap),
  send: (title, body) => api.post('/api/notifications/send', { title, body }).then(unwrap),
  remove: (id) => api.delete(`/api/notifications/${id}`).then(unwrap),
};

export const Reports = {
  list: () => api.get('/api/problem-reports').then(unwrap),
  setStatus: (id, status) => api.patch(`/api/problem-reports/${id}`, { status }).then(unwrap),
};

export const Health = {
  check: () => api.get('/health').then((r) => r.data),
};

export const Uploads = {
  list: () => api.get('/api/uploads').then(unwrap),
  remove: (filename) => api.delete(`/api/uploads/${encodeURIComponent(filename)}`).then(unwrap),
  upload: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/api/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrap);
  },
};

export const apiBaseURL = baseURL;
