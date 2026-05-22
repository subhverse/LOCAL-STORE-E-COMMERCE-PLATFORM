import { renderNavbar, wireNavbar } from "./navbar.js";
import { apiFetch } from "./api.js";
import { setAuth, isLoggedIn } from "./auth.js";
import { toast } from "./utils.js";

function mountNavbar() {
  const navMount = document.querySelector("#navMount");
  navMount.innerHTML = renderNavbar("login");
  wireNavbar();
}

async function init() {
  mountNavbar();

  if (isLoggedIn()) {
    window.location.href = "/index.html";
    return;
  }

  const form = document.querySelector("#loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      setAuth({
        token: data.token,
        user: { _id: data._id, name: data.name, email: data.email }
      });

      toast("Login successful");
      window.location.href = "/index.html";
    } catch (_) {
      // handled in apiFetch
    }
  });
}

init();

