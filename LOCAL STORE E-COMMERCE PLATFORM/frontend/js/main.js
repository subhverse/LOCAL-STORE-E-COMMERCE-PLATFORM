import { renderNavbar, wireNavbar } from "./navbar.js";
import { toast } from "./utils.js";
import { fetchProducts, fetchCategories, renderProductCard } from "./products.js";
import { addProductToCart, loadCart, renderCart, wireCart } from "./cart.js";

async function init() {
  // Navbar
  const navMount = document.querySelector("#navMount");
  navMount.innerHTML = renderNavbar("home");
  wireNavbar();

  // Load categories
  const categorySelect = document.querySelector("#categorySelect");
  const categories = await fetchCategories().catch(() => []);
  const options = ["All", ...categories]
    .map((c) => `<option value="${c}">${c}</option>`)
    .join("");
  categorySelect.innerHTML = options;

  // Cart
  const cartEl = document.querySelector("#cartMount");
  async function refreshCart() {
    const cartData = await loadCart().catch(() => ({ items: [], total: 0 }));
    cartEl.innerHTML = renderCart(cartData);
  }
  await refreshCart();
  wireCart(cartEl, refreshCart);

  // Products
  const productsEl = document.querySelector("#productsMount");

  async function refreshProducts() {
    const search = document.querySelector("#searchInput").value.trim();
    const category = document.querySelector("#categorySelect").value;
    const sort = document.querySelector("#sortSelect").value;

    productsEl.innerHTML = `<div class="empty">Loading products...</div>`;
    const products = await fetchProducts({ search, category, sort }).catch(() => []);

    if (products.length === 0) {
      productsEl.innerHTML = `<div class="empty">No products found. Try a different search/filter.</div>`;
      return;
    }

    productsEl.innerHTML = `
      <div class="product-grid">
        ${products.map(renderProductCard).join("")}
      </div>
    `;
  }

  // Initial fetch
  await refreshProducts();

  // UI events
  document.querySelector("#searchBtn").addEventListener("click", refreshProducts);
  document.querySelector("#searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") refreshProducts();
  });
  document.querySelector("#categorySelect").addEventListener("change", refreshProducts);
  document.querySelector("#sortSelect").addEventListener("change", refreshProducts);

  // Add-to-cart (event delegation)
  productsEl.addEventListener("click", async (e) => {
    const productId = e.target.getAttribute("data-add");
    if (!productId) return;
    try {
      await addProductToCart(productId);
      await refreshCart();
    } catch (_) {
      toast("Could not add to cart");
    }
  });
}

init();

