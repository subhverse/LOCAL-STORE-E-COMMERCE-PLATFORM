import { apiFetch } from "./api.js";
import { truncate, formatMoney } from "./utils.js";

export async function fetchProducts({ search = "", category = "All", sort = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "All") params.set("category", category);
  if (sort) params.set("sort", sort);

  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch(`/api/products${qs}`);
}

export async function fetchCategories() {
  return apiFetch("/api/products/categories");
}

export function renderProductCard(p) {
  const inStock = p.countInStock > 0;
  return `
    <div class="card">
      <img src="${p.imageUrl || "https://via.placeholder.com/800x500"}" alt="${p.name}" />
      <div class="card-body">
        <h4>${p.name}</h4>
        <p>${truncate(p.description, 92)}</p>
        <div class="meta">
          <span class="price">${formatMoney(p.price)}</span>
          <span class="tag">${p.category}</span>
        </div>
        <div class="meta">
          <span class="stock ${inStock ? "in" : "out"}">
            ${inStock ? `In stock (${p.countInStock})` : "Out of stock"}
          </span>
          <button class="btn primary" data-add="${p._id}" ${inStock ? "" : "disabled"}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  `;
}

