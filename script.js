//Filtro de categorias

const filterTabs = document.querySelectorAll(".filter-tab");
const plantCards = document.querySelectorAll(".plant-card");
const noResults = document.getElementById("noResults");

filterTabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    const filter = tab.dataset.filter;

    // Actualiza estilo visual de la pestaña activa
    filterTabs.forEach((t) => {
      t.classList.remove("active", "border-bottom", "border-2", "border-success", "fw-bold");
      t.classList.add("text-secondary");
    });
    tab.classList.add("active", "border-bottom", "border-2", "border-success", "fw-bold");
    tab.classList.remove("text-secondary");

    // Muestra u oculta tarjetas según categoría
    let visibleCount = 0;
    plantCards.forEach((card) => {
      const categories = card.dataset.category.split(" "); //convierte el texto en un array
      const matches = filter === "all" || categories.includes(filter);
      card.classList.toggle("d-none", !matches);
      if (matches) visibleCount++;
    });

    noResults.classList.toggle("d-none", visibleCount > 0);

  });
});

//Carrito de compras
let cart = []; // cada item: { name, price, qty }

const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const clearCartBtn = document.getElementById("clearCartBtn");

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    renderCart();

    // Pequeño feedback visual en el botón
    const originalText = btn.textContent;
    btn.textContent = "Added ✓";
    setTimeout(() => (btn.textContent = originalText), 800);
  });
});

function renderCart() {
  saveCart(); 
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartEmptyMsg.classList.remove("d-none");
  } else {
    cartEmptyMsg.classList.add("d-none");
  }

  let subtotal = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;
    totalItems += item.qty;

    const li = document.createElement("li");
    li.className = "d-flex justify-content-between align-items-center mb-3";
    li.innerHTML = `
      <div>
        <p class="mb-0 fw-semibold">${item.name}</p>
        <small class="text-secondary">$${item.price.toFixed(2)} x ${item.qty}</small>
      </div>
      <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">✕</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartCountEl.textContent = totalItems;

  // Vincula los botones de eliminar (se recrean en cada render)
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      renderCart();
    });
  });
}

//Local storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});

//Newsletter

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMsg = document.getElementById("newsletterMsg");

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // formato de correo valido

  if (emailRegex.test(email)) { //si el correo cumple con el formato
    newsletterMsg.textContent = "Thanks for subscribing! 🌿";
    newsletterMsg.className = "small mt-2 mb-0 text-success fw-semibold";
    newsletterForm.reset();
  } else {
    newsletterMsg.textContent = "Please enter a valid email address.";
    newsletterMsg.className = "small mt-2 mb-0 text-danger fw-semibold";
  }
});

// Intenta recuperar el carrito guardado, si no hay nada, empieza vacío
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart); //se convierte de vuelta a array
}
renderCart();