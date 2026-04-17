const products = [
  {
    id: "hirame",
    nameJa: "ヒラメジャーキー",
    nameEn: "Hirame Sashimi Jerky",
    image: "jobo1.jpg",
    description: "国産ヒラメを丁寧に仕上げた、上品な旨味のプレミアムドッグトリーツ。",
    features: ["国産", "無添加", "高タンパク", "グレインフリー"],
    price: 1280,
  },
  {
    id: "hamo",
    nameJa: "ハモジャーキー",
    nameEn: "Hamo Jerky",
    image: "jobo2.jpg",
    description: "旨味がしっかり感じられるハモを使用した、毎日のご褒美にぴったりのおやつ。",
    features: ["国産", "無添加", "高タンパク", "犬用"],
    price: 1180,
  },
  {
    id: "aji",
    nameJa: "アジ開きジャーキー",
    nameEn: "Aji Hiraki Jerky",
    image: "jobo3.jpg",
    description: "アジの香ばしさを活かした、食いつきのよい国産ジャーキー。",
    features: ["国産", "無添加", "高タンパク", "ご褒美用"],
    price: 1080,
  },
];

const selected = { item: products[0] };
const cart = [];

const formatYen = (value) => `¥${value.toLocaleString("ja-JP")}`;

const featuredImage = document.getElementById("featuredImage");
const featuredJa = document.getElementById("featuredJa");
const featuredEn = document.getElementById("featuredEn");
const featuredDescription = document.getElementById("featuredDescription");
const featuredFeatures = document.getElementById("featuredFeatures");
const featuredPrice = document.getElementById("featuredPrice");
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const drawer = document.getElementById("cartDrawer");

function renderFeatured() {
  const p = selected.item;
  featuredImage.src = p.image;
  featuredImage.alt = p.nameEn;
  featuredJa.textContent = p.nameJa;
  featuredEn.textContent = p.nameEn;
  featuredDescription.textContent = p.description;
  featuredPrice.textContent = formatYen(p.price);
  featuredFeatures.innerHTML = p.features.map((f) => `<li>${f}</li>`).join("");

  document.querySelectorAll(".product-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.id === p.id);
  });
}

function renderProductGrid() {
  productGrid.innerHTML = products
    .map(
      (p) => `
      <article class="product-card card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.nameEn}" />
        <div class="body">
          <p class="kicker">${p.nameJa}</p>
          <h3>${p.nameEn}</h3>
          <p>${p.description}</p>
          <strong>${formatYen(p.price)}</strong>
        </div>
      </article>`
    )
    .join("");

  productGrid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const p = products.find((x) => x.id === card.dataset.id);
      if (!p) return;
      selected.item = p;
      renderFeatured();
      document.getElementById("featuredProduct").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function upsertCart(product, delta = 1) {
  const found = cart.find((item) => item.id === product.id);
  if (!found) {
    if (delta > 0) cart.push({ ...product, qty: delta });
  } else {
    found.qty = Math.max(0, found.qty + delta);
  }

  for (let i = cart.length - 1; i >= 0; i -= 1) {
    if (cart[i].qty <= 0) cart.splice(i, 1);
  }

  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  cartCount.textContent = count;
  cartTotal.textContent = formatYen(total);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>カートは空です。</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.nameEn}" />
        <div>
          <small>${item.nameJa}</small>
          <strong>${item.nameEn}</strong>
          <div>${formatYen(item.price)}</div>
        </div>
        <div class="qty">
          <button data-cart-id="${item.id}" data-delta="-1" aria-label="decrease">−</button>
          <span>${item.qty}</span>
          <button data-cart-id="${item.id}" data-delta="1" aria-label="increase">+</button>
        </div>
      </article>`
    )
    .join("");

  cartItems.querySelectorAll("button[data-cart-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = products.find((p) => p.id === btn.dataset.cartId);
      if (!product) return;
      upsertCart(product, Number(btn.dataset.delta));
    });
  });
}

function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

renderProductGrid();
renderFeatured();
renderCart();

document.getElementById("addFeatured").addEventListener("click", () => {
  upsertCart(selected.item, 1);
  openCart();
});
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);

drawer.addEventListener("click", (event) => {
  if (event.target === drawer) closeCart();
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    document.getElementById("nav").classList.remove("open");
  });
});
