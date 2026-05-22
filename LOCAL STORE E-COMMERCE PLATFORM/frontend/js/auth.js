// Simple token helpers (JWT stored in localStorage)

const TOKEN_KEY = "ls_token";
const USER_KEY = "ls_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuth({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function requireAuth() {
  if (!isLoggedIn()) {
    // Very beginner-friendly protection on frontend
    window.location.href = "/login.html";
  }
}

