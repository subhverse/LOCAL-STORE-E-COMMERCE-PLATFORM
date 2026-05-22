import { getUser, isLoggedIn, clearAuth } from "./auth.js";
import { toast, initTheme, setTheme } from "./utils.js";

export function renderNavbar(active = "") {
  initTheme();
  const user = getUser();

  const loginPart = isLoggedIn()
    ? `
      <a class="btn" href="/profile.html">Hi, ${user?.name || "User"}</a>
      <button class="btn danger" id="logoutBtn">Logout</button>
    `
    : `
      <a class="btn" href="/login.html">Login</a>
      <a class="btn primary" href="/register.html">Create Account</a>
    `;

  const themeLabel = document.body.classList.contains("light") ? "Dark" : "Light";

  return `
    <div class="navbar glass">
      <div class="container nav-inner">
        <a class="brand" href="/index.html">
          <div class="logo"></div>
          <div>
            <h1>LOCAL STORE</h1>
            <p>E-commerce Platform</p>
          </div>
        </a>

        <div class="nav-actions">
          <button class="btn" id="themeBtn">${themeLabel} Mode</button>
          <a class="btn" href="/support.html">Support</a>
          ${loginPart}
        </div>
      </div>
    </div>
  `;
}

export function wireNavbar() {
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      toast("Logged out");
      window.location.href = "/index.html";
    });
  }

  const themeBtn = document.querySelector("#themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
      setTheme(nextTheme);
      themeBtn.textContent = nextTheme === "light" ? "Dark Mode" : "Light Mode";
    });
  }
}

