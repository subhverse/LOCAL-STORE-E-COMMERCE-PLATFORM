import { renderNavbar, wireNavbar } from "./navbar.js";
import { requireAuth } from "./auth.js";
import { apiFetch } from "./api.js";
import { formatMoney, toast } from "./utils.js";

requireAuth();

function mountNavbar() {
  const navMount = document.querySelector("#navMount");
  navMount.innerHTML = renderNavbar("checkout");
  wireNavbar();
}

function renderSummary(cart) {
  if (!cart.items || cart.items.length === 0) {
    return `<div class="empty">Cart is empty. <a class="btn" href="/index.html">Go back</a></div>`;
  }

  const itemsHtml = cart.items
    .map((i) => {
      const p = i.product;
      return `
        <div class="cart-item">
          <img src="${p.imageUrl || "https://via.placeholder.com/300"}" alt="${p.name}" />
          <div>
            <h5>${p.name}</h5>
            <div class="cart-row">
              <div class="muted">${formatMoney(p.price)} × ${i.quantity}</div>
              <div class="muted">${formatMoney(p.price * i.quantity)}</div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="cart-items">${itemsHtml}</div>
    <div class="total">
      <span>Total</span>
      <span>${formatMoney(cart.total)}</span>
    </div>
  `;
}

async function init() {
  mountNavbar();

  const summaryMount = document.querySelector("#summaryMount");
  const cart = await apiFetch("/api/cart").catch(() => ({ items: [], total: 0 }));
  summaryMount.innerHTML = renderSummary(cart);

  const form = document.querySelector("#checkoutForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!cart.items || cart.items.length === 0) {
      toast("Cart is empty");
      return;
    }

    const payload = {
      fullName: document.querySelector("#fullName").value.trim(),
      phone: document.querySelector("#phone").value.trim(),
      address: document.querySelector("#address").value.trim(),
      city: document.querySelector("#city").value.trim(),
      pincode: document.querySelector("#pincode").value.trim()
    };

    try {
      const order = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      toast("Order placed successfully!");
      // Redirect to profile to see orders
      window.location.href = `/profile.html?order=${order._id}`;
    } catch (_) {
      // handled in apiFetch
    }
  });
}

init();

