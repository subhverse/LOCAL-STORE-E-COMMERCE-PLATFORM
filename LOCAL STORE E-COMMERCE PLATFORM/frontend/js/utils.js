export function $(selector) {
  return document.querySelector(selector);
}

export function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

export function formatMoney(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

export function truncate(text, max = 90) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

// Small toast notification (beginner-friendly)
let toastTimer = null;
export function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 2200);
}

export function setTheme(theme) {
  // theme: "dark" or "light"
  if (theme === "light") document.body.classList.add("light");
  else document.body.classList.remove("light");

  localStorage.setItem("theme", theme);
}

export function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  setTheme(saved);
}

