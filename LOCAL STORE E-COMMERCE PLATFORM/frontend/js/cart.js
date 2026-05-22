import { apiFetch } from "./api.js";
import { isLoggedIn } from "./auth.js";
import { formatMoney, toast } from "./utils.js";

export async function loadCart() {
  if (!isLoggedIn()) return { items: [], total: 0 };
  return apiFetch("/api/cart");
}

export function renderCart(cartData) {
  const count = cartData.items.reduce((sum, i) => sum + i.quantity, 0);

  const itemsHtml =
    cartData.items.length === 0
      ? `<div class="empty">Your cart is empty. Add something nice 🙂</div>`
      : cartData.items
          .map((item) => {
            const p = item.product;
            return `
            <div class="cart-item">
              <img src="${p.imageUrl || "https://via.placeholder.com/300"}" alt="${p.name}" />
              <div>
                <h5>${p.name}</h5>
                <div class="cart-row">
                  <div class="muted">${formatMoney(p.price)}</div>
                  <button class="btn" data-remove="${p._id}" title="Remove">Remove</button>
                </div>
                <div class="cart-row" style="margin-top:8px">
                  <div class="qty">
                    <button data-dec="${p._id}">-</button>
                    <span>${item.quantity}</span>
                    <button data-inc="${p._id}">+</button>
                  </div>
                  <div class="muted">${formatMoney(p.price * item.quantity)}</div>
                </div>
              </div>
            </div>
          `;
          })
          .join("");

  return `
    <div class="section-title">
      <h3>Cart</h3>
      <span class="tag">${count} items</span>
    </div>
    <div class="cart-items">${itemsHtml}</div>
    <div class="total">
      <span>Total</span>
      <span>${formatMoney(cartData.total)}</span>
    </div>
    <div style="margin-top:12px; display:flex; gap:10px;">
      <a class="btn primary" style="flex:1; text-align:center" href="/checkout.html">Checkout</a>
    </div>
  `;
}

export function wireCart(containerEl, onCartChanged) {
  containerEl.addEventListener("click", async (e) => {
    const inc = e.target.getAttribute("data-inc");
    const dec = e.target.getAttribute("data-dec");
    const rem = e.target.getAttribute("data-remove");

    try {
      if (inc) {
        await changeQty(inc, +1);
        await onCartChanged();
      }
      if (dec) {
        await changeQty(dec, -1);
        await onCartChanged();
      }
      if (rem) {
        await apiFetch(`/api/cart/${rem}`, { method: "DELETE" });
        toast("Removed from cart");
        await onCartChanged();
      }
    } catch (_) {
      // errors already toasted in apiFetch
    }
  });
}

async function changeQty(productId, delta) {
  const cart = await apiFetch("/api/cart");
  const item = cart.items.find((i) => i.product._id === productId);
  if (!item) return;
  const nextQty = item.quantity + delta;
  if (nextQty < 1) return;

  await apiFetch(`/api/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity: nextQty })
  });
}

export async function addProductToCart(productId) {
  if (!isLoggedIn()) {
    toast("Please login to use the cart");
    window.location.href = "/login.html";
    return;
  }

  await apiFetch("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity: 1 })
  });
  toast("Added to cart");
}

