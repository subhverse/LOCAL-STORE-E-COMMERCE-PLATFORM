import { API_BASE_URL } from "./config.js";
import { getToken, clearAuth } from "./auth.js";
import { toast } from "./utils.js";

export async function apiFetch(path, options = {}) {
  const url = API_BASE_URL + path;

  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  // If token expired / invalid, log out on client
  if (res.status === 401) {
    clearAuth();
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.message || "Request failed";
    toast(msg);
    throw new Error(msg);
  }

  return data;
}

