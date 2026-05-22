import { renderNavbar, wireNavbar } from "./navbar.js";
import { requireAuth, getUser } from "./auth.js";
import { apiFetch } from "./api.js";
import { formatMoney, toast } from "./utils.js";

requireAuth();

function mountNavbar() {
  const navMount = document.querySelector("#navMount");
  navMount.innerHTML = renderNavbar("profile");
  wireNavbar();
}

function renderProfile(profile) {
  const fallback = getUser();
  const name = profile?.name || fallback?.name || "User";
  const email = profile?.email || fallback?.email || "-";

  return `
    <div class="card" style="padding:14px; border-radius:16px">
      <div style="display:flex; justify-content:space-between; gap:10px; align-items:center; flex-wrap:wrap">
        <div>
          <div style="font-weight:900; font-size:16px">${name}</div>
          <div class="muted">${email}</div>
          <div class="muted" style="margin-top:6px">Member since: ${new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</div>
        </div>
        <a class="btn" href="/index.html">Continue shopping</a>
      </div>
    </div>
  `;
}

function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    return `<div class="empty">No orders yet. Place your first order from the checkout page.</div>`;
  }

  return `
    <div class="cart-items">
      ${orders
        .map((o) => {
          return `
          <div class="cart-item">
            <div style="grid-column: 1 / -1">
              <div class="cart-row">
                <div>
                  <div style="font-weight:900">Order #${o._id.slice(-6).toUpperCase()}</div>
                  <div class="muted">${new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <span class="tag">${o.status}</span>
              </div>
              <div class="cart-row" style="margin-top:10px">
                <div class="muted">${o.items.length} item(s)</div>
                <div style="font-weight:900">${formatMoney(o.totalPrice)}</div>
              </div>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

async function init() {
  mountNavbar();

  const profileMount = document.querySelector("#profileMount");
  const ordersMount = document.querySelector("#ordersMount");

  const profile = await apiFetch("/api/users/me").catch(() => null);
  profileMount.innerHTML = renderProfile(profile);

  const orders = await apiFetch("/api/orders/my").catch(() => []);
  ordersMount.innerHTML = renderOrders(orders);

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("order");
  if (orderId) toast("You can see your new order below");
}

init();

