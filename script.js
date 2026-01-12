const PRODUCTS =[];

let cart =[];

const money = (n) => "$" + n.toFixed(2);
const getProduct = (id) => PRODUCTS.find(p => p.id === id);
const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
const cartTotal = () =>
cart.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0);


function productCard(p){
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

function renderGrids(filterText=""){
  const t = filterText.trim().toLowerCase();
  const list = t
    ? PRODUCTS.filter(p => (p.name + " " + p.desc + " " + p.cat).toLowerCase().includes(t))
    : PRODUCTS;

  const mens = list.filter(p => p.cat === "mens");
  const womens = list.filter(p => p.cat === "womens");

  const featured = [...mens.slice(0,3), ...womens.slice(0,3)];

  document.getElementById("featuredGrid").innerHTML = featured.map(productCard).join("");
  document.getElementById("mensGrid").innerHTML = mens.map(productCard).join("");
  document.getElementById("womensGrid").innerHTML = womens.map(productCard).join("");
  document.getElementById("allProductsGrid").innerHTML = list.map(productCard).join("");
}

function addToCart(id){
  const item = cart.find(i => i.id === id);
  if(item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  renderCart();
}
function incQty(id){
  const item = cart.find(i => i.id === id);
  if(item){ item.qty += 1; renderCart(); }
}
function decQty(id){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty -= 1;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}
function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart(){
  document.getElementById("cartCount").textContent = cartCount();
  document.getElementById("cartTotal").textContent = money(cartTotal());

  const body = document.getElementById("cartBody");
  if(!cart.length){
    body.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    return;
  }

  body.innerHTML = cart.map(i=>{
    const p = getProduct(i.id);
    return `
      <div class="cart-row">
        <div>
          <div class="cart-name">${p.name}</div>
          <div class="cart-meta">${money(p.price)} × ${i.qty}</div>
        </div>
        <button class="remove" data-remove="${p.id}">remove</button>
      </div>
    `;
  }).join("");
}

document.addEventListener("click", e=>{
  const add = e.target.closest("[data-add]");
  if(add) addToCart(+add.dataset.add);

  const rem = e.target.closest("[data-remove]");
  if(rem){
    cart = cart.filter(i=>i.id !== +rem.dataset.remove);
    renderCart();
  }
});

document.getElementById("searchInput")
  .addEventListener("input", e=>renderGrids(e.target.value));

document.getElementById("year").textContent = new Date().getFullYear();
renderGrids();
renderCart();
