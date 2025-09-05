// Minimal API wrapper
const API_BASE = "https://student-board-backend.onrender.com";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("sb_token");
  const headers = options.headers || {};
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Exposed helpers
const API = {
  login: (body) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => apiFetch("/auth/me"),
  getAnnouncements: (skip = 0, limit = 100) => apiFetch(`/announcements/?skip=${skip}&limit=${limit}`),
  createAnnouncement: (data) => apiFetch("/announcements/", { method: "POST", body: JSON.stringify(data) }),
  updateAnnouncement: (id, data) => apiFetch(`/announcements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiFetch(`/announcements/${id}`, { method: "DELETE" }),

  getEvents: (skip = 0, limit = 100) => apiFetch(`/events/?skip=${skip}&limit=${limit}`),
  createEvent: (data) => apiFetch("/events/", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id, data) => apiFetch(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id) => apiFetch(`/events/${id}`, { method: "DELETE" }),

  getArchive: (skip = 0, limit = 100, archive_type = "") =>
    apiFetch(`/archive/?skip=${skip}&limit=${limit}${archive_type ? `&archive_type=${archive_type}` : ""}`),

  search: (params) => apiFetch("/search/", { method: "POST", body: JSON.stringify(params) }),
};
