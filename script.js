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
  document.getElementById("cartCount").textContent = String(cartCount());
  document.getElementById("cartTotal").textContent = money(cartTotal());

  const body = document.getElementById("cartBody");
  if(cart.length === 0){
    body.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
    return;
  }