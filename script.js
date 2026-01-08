const PRODUCTS =[];

let cart =[];

const money = (n) => "$" + n.toFixed(2);
const getProduct = (id) => PRODUCTS.find(p => p.id === id);
const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
const cartTotal = () =>
cart.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0);

