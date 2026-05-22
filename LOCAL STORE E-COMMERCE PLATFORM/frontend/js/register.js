import { renderNavbar, wireNavbar } from "./navbar.js";
import { apiFetch } from "./api.js";
import { setAuth, isLoggedIn } from "./auth.js";
import { toast } from "./utils.js";

function mountNavbar() {
  const navMount = document.querySelector("#navMount");
  navMount.innerHTML = renderNavbar("register");
  wireNavbar();
}

async function init() {
  mountNavbar();

  if (isLoggedIn()) {
    window.location.href = "/index.html";
    return;
  }

  const form = document.querySelector("#registerForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      });

      setAuth({
        token: data.token,
        user: { _id: data._id, name: data.name, email: data.email }
      });

      toast("Account created!");
      window.location.href = "/index.html";
    } catch (_) {
      // handled in apiFetch
    }
  });
}

init();

