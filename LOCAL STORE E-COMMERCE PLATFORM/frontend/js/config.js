// Central place for API config
// If you serve frontend from backend (recommended), API_BASE_URL becomes "" (same origin).
// If you run frontend on Live Server (e.g., port 5500), it uses http://localhost:5000.

export const API_BASE_URL = window.location.port === "5000" ? "" : "http://localhost:5000";

