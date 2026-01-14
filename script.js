const PRODUCTS = [];

let cart = [];
/* Utility functions */

const money = (n) => "$" + n.toFixed(2);
const getProduct = (id) => PRODUCTS.find(p => p.id === id);
const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
const cartTotal = () => cart.reduce((s, i) => {
  const p = getProduct(i.id);
  return s + (p.price * i.qty);
}, 0);

/* Product card template */
function productCard(p) {
  return `
        <article class="card">
          <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy" />
          <div class="card-body">
            <div class="meta">
              <span class="chip">${p.cat.toUpperCase()}</span>
              <span class="chip">★ ${p.rating}</span>
              <span class="chip">In Stock</span>
            </div>
            <h3>${p.name}</h3>
            <p>${p.desc}</p>
            <div class="price-row">
              <div class="price">${money(p.price)}</div>
              <button class="add" data-add="${p.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `;
}

/* Render product grids */

function renderGrids(filterText = "") {
  const t = filterText.trim().toLowerCase();
  const list = t
    ? PRODUCTS.filter(p => (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(t))
    : PRODUCTS;

  const mens = list.filter(p => p.cat === "mens");
  const womens = list.filter(p => p.cat === "womens");

  const featured = [...mens.slice(0, 3), ...womens.slice(0, 3)];

  document.getElementById("featuredGrid").innerHTML = featured.map(productCard).join("");
  document.getElementById("mensGrid").innerHTML = mens.map(productCard).join("");
  document.getElementById("womensGrid").innerHTML = womens.map(productCard).join("");
  document.getElementById("allProductsGrid").innerHTML = list.map(productCard).join("");
}

/* Cart handling */
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  renderCart();
}
function incQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) { item.qty += 1; renderCart(); }
}
function decQty(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty -= 1;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}
function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}
/* Render cart */

function renderCart() {
  document.getElementById("cartCount").textContent = String(cartCount());
  document.getElementById("cartTotal").textContent = money(cartTotal());

  const body = document.getElementById("cartBody");
  if (cart.length === 0) {
    body.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    return;
  }

  /* Render cart items */
  body.innerHTML = cart.map(item => {
    const p = getProduct(item.id);
    const line = p.price * item.qty;
    return `
          <div class="cart-row">
            <div>
              <div class="cart-name">${p.name}</div>
              <div class="cart-meta">${money(p.price)} each • Line ${money(line)}</div>
            </div>
            <div class="cart-actions">
              <div class="qty">
                <button data-dec="${p.id}" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
              </div>
              <button class="remove" data-remove="${p.id}">remove</button>
            </div>
          </div>
        `;
  }).join("");
}

/* Cart drawer */

const overlay = document.getElementById("overlay");
const drawer = document.getElementById("drawer");

function openCart() {
  overlay.classList.add("open");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  overlay.classList.remove("open");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

/* Routing */
const pages = {
  home: document.getElementById("pageHome"),
  mens: document.getElementById("pageMens"),
  womens: document.getElementById("pageWomens"),
  products: document.getElementById("pageProducts"),
  contact: document.getElementById("pageContact"),
};

function showPage(key) {
  Object.values(pages).forEach(p => p.classList.remove("active"));
  (pages[key] || pages.home).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function route() {
  const hash = (location.hash || "#home").replace("#", "").toLowerCase();
  const key = pages[hash] ? hash : "home";
  showPage(key);
}
window.addEventListener("hashchange", route);


/* Event delegation */
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) return addToCart(Number(addBtn.getAttribute("data-add")));

  const incBtn = e.target.closest("[data-inc]");
  if (incBtn) return incQty(Number(incBtn.getAttribute("data-inc")));

  const decBtn = e.target.closest("[data-dec]");
  if (decBtn) return decQty(Number(decBtn.getAttribute("data-dec")));

  const remBtn = e.target.closest("[data-remove]");
  if (remBtn) return removeItem(Number(remBtn.getAttribute("data-remove")));
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  renderGrids(e.target.value);
});

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message sent (demo). Connect this form to a real service later.");
  e.target.reset();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Your cart is empty.");
  alert("Checkout (demo). Connect to a real checkout later.");
  closeCart();
});

/* Theme handling */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const SUN_ICON = `
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="M4.93 4.93l1.41 1.41"></path>
      <path d="M17.66 17.66l1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="M4.93 19.07l1.41-1.41"></path>
      <path d="M17.66 6.34l1.41-1.41"></path>
    `;
const MOON_ICON = `
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 1 0 9.8 9.8z"></path>
    `;
/* Theme handling */

function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  themeIcon.innerHTML = (mode === "dark") ? MOON_ICON : SUN_ICON;
  localStorage.setItem("stopshop_theme", mode);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
});

function initTheme() {
  const saved = localStorage.getItem("stopshop_theme");
  if (saved === "dark" || saved === "light") return setTheme(saved);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}
/* Initialize app */

document.getElementById("year").textContent = new Date().getFullYear();
initTheme();
renderGrids();
renderCart();
route();
