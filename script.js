// --- Mobile navigation toggle ---
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// --- Product data ---
const PHONE_NUMBER = "2290147271721"; // WhatsApp de la ferme (sans le +)

const products = [
  {
    id: "tomates",
    category: "maraichage",
    categoryLabel: "Maraîchage",
    img: "img/tomate2.jpeg",
    name: "Tomates fraîches",
    price: 1500,
    unit: "kg",
    shortDesc: "Tomates juteuses mûries au soleil, cueillies le matin même.",
    longDesc: "Nos tomates sont cultivées en plein champ. Idéales pour vos sauces, salades et plats mijotés."
  },
  {
    id: "mais",
    category: "agricole",
    categoryLabel: "Cultures",
    img: "img/mais2.jpeg",
    name: "Maïs",
    price: 400,
    unit: "kg",
    shortDesc: "Grains de maïs séchés, récoltés sur nos parcelles.",
    longDesc: "Idéal pour l'alimentation humaine comme pour l'alimentation animale."
  },
  {
    id: "provende",
    category: "provende",
    categoryLabel: "Provende",
    img: "img/provende.png",
    name: "Provende volaille",
    price: 700,
    unit: "kg",
    shortDesc: "Aliment complet formulé pour une croissance saine de la volaille.",
    longDesc: "Disponible en sac de 25 kg ou au détail, selon vos besoins."
  },
  {
    id: "boeufs",
    category: "elevage",
    categoryLabel: "Élevage",
    img: "img/boeuf3.jpeg",
    name: "Bœufs",
    price: 350000,
    unit: "tête",
    shortDesc: "Bovins élevés en pâturage libre, bien portants.",
    longDesc: "Vente à la tête. Pesée et inspection possibles avant achat."
  },
  {
    id: "moutons",
    category: "elevage",
    categoryLabel: "Élevage",
    img: "img/mouton1.jpeg",
    name: "Moutons",
    price: 45000,
    unit: "tête",
    shortDesc: "Moutons robustes, nourris aux fourrages de la ferme.",
    longDesc: "Disponibles toute l'année, idéals pour les fêtes et cérémonies."
  },
  {
    id: "beliers",
    category: "elevage",
    categoryLabel: "Élevage",
    img: "img/mouton3.jpeg",
    name: "Béliers",
    price: 60000,
    unit: "tête",
    shortDesc: "Béliers de belle stature, sélectionnés avec soin.",
    longDesc: "Race locale et croisée disponible selon arrivage."
  },
  {
    id: "poules",
    category: "elevage",
    categoryLabel: "Élevage",
    img: "img/coq1.jpeg",
    name: "Poules",
    price: 4000,
    unit: "pièce",
    shortDesc: "Poules pondeuses et poules de chair, en bonne santé.",
    longDesc: "Vaccinées et suivies par notre équipe d'élevage."
  },
  {
    id: "coqs",
    category: "elevage",
    categoryLabel: "Élevage",
    img: "img/poule5.jpeg",
    name: "Coqs",
    price: 5000,
    unit: "pièce",
    shortDesc: "Coqs Goliath et races locales, élevés en plein air.",
    longDesc: "Parfaits pour le renouvellement de votre basse-cour."
  },
  {
    id: "pintades",
    category: "elevage",
    categoryLabel: "Élevage",
    img: "img/pintade.jpeg",
    name: "Pintades",
    price: 3500,
    unit: "pièce",
    shortDesc: "Pintades élevées en semi-liberté, chair savoureuse.",
    longDesc: "Disponibles vivantes, sur commande."
  },
  {
    id: "canards",
    category: "elevage",
    categoryLabel: "Élevage",
    img: "img/canard.jpeg",
    name: "Canards",
    price: 6000,
    unit: "pièce",
    shortDesc: "Canards bien portants, nourris avec notre provende maison.",
    longDesc: "Vente à l'unité, disponibilité selon la saison."
  }
];

function formatFCFA(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

// --- Render product cards ---
const productGrid = document.getElementById("productGrid");
const PRICES_KEY = "dumaru_prices";
let currentFilter = "tous";

function getPriceOverrides() {
  return JSON.parse(localStorage.getItem(PRICES_KEY) || "{}");
}
function savePriceOverrides(map) {
  localStorage.setItem(PRICES_KEY, JSON.stringify(map));
}
function getEffectiveProducts() {
  const overrides = getPriceOverrides();
  return products.map(p => ({
    ...p,
    price: overrides[p.id] !== undefined ? overrides[p.id] : p.price
  }));
}

function applyProductFilter() {
  if (!productGrid) return;
  productGrid.querySelectorAll(".product-card").forEach(card => {
    const match = currentFilter === "tous" || card.dataset.category === currentFilter;
    card.classList.toggle("hide", !match);
  });
}

function renderProductGrid() {
  if (!productGrid) return;
  const session = getSession();
  const items = getEffectiveProducts();

  productGrid.innerHTML = items.map(p => `
    <article class="product-card" data-category="${p.category}">
      <div class="card-media">
        <img src="${p.img}" alt="${p.name}">
        <span class="badge badge-category">${p.categoryLabel}</span>
        <span class="badge badge-available">Disponible</span>
      </div>
      <div class="card-body">
        <div class="card-head">
          <h3>${p.name}</h3>
          <div class="card-price">
            <div class="price-text">
              <span>${p.price.toLocaleString("fr-FR")}</span>
              <small>FCFA / ${p.unit}</small>
            </div>
            ${session ? `<button type="button" class="price-edit-btn" data-id="${p.id}" aria-label="Modifier le prix">✎</button>` : ""}
          </div>
        </div>
        <p>${p.shortDesc}</p>
        <button type="button" class="card-cta" data-id="${p.id}">
          <span class="cta-icon" aria-hidden="true"></span> Voir & Commander
        </button>
      </div>
    </article>
  `).join("");

  applyProductFilter();
}

// --- Product filter ---
const filterBar = document.getElementById("filterBar");

if (filterBar && productGrid) {
  const buttons = filterBar.querySelectorAll(".filter-btn");

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    applyProductFilter();
  });
}

// --- Order modal ---
const orderModal = document.getElementById("orderModal");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalCategory = document.getElementById("modalCategory");
const modalProductName = document.getElementById("modalProductName");
const modalDesc = document.getElementById("modalDesc");
const modalLongDesc = document.getElementById("modalLongDesc");
const modalPrice = document.getElementById("modalPrice");
const modalUnit = document.getElementById("modalUnit");

const orderNom = document.getElementById("orderNom");
const orderPrenom = document.getElementById("orderPrenom");
const orderTel = document.getElementById("orderTel");
const orderLieu = document.getElementById("orderLieu");

const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const qtyValue = document.getElementById("qtyValue");
const qtyUnitLabel = document.getElementById("qtyUnitLabel");
const qtyTotal = document.getElementById("qtyTotal");

const modeRow = document.getElementById("modeRow");
const livraisonField = document.getElementById("livraisonField");
const pickupInfo = document.getElementById("pickupInfo");

const summaryProduct = document.getElementById("summaryProduct");
const summaryUnitPrice = document.getElementById("summaryUnitPrice");
const summaryQty = document.getElementById("summaryQty");
const summaryTotal = document.getElementById("summaryTotal");

const sendOrderBtn = document.getElementById("sendOrderBtn");
const modalError = document.getElementById("modalError");

let currentProduct = null;
let currentQty = 1;
let currentMode = "livraison";

function openOrderModal(product) {
  currentProduct = product;
  currentQty = 1;
  currentMode = "livraison";

  modalImg.src = product.img;
  modalImg.alt = product.name;
  modalCategory.textContent = product.categoryLabel;
  modalProductName.textContent = product.name;
  modalDesc.textContent = product.shortDesc;
  modalLongDesc.textContent = product.longDesc;
  modalPrice.innerHTML = `${product.price.toLocaleString("fr-FR")} FCFA <small>/ ${product.unit}</small>`;

  qtyValue.textContent = currentQty;
  qtyUnitLabel.textContent = `${product.unit}(s)`;

  orderNom.value = "";
  orderPrenom.value = "";
  orderTel.value = "";
  orderLieu.value = "";
  modalError.textContent = "";
  [orderNom, orderTel, orderLieu].forEach(f => f.classList.remove("field-error"));

  modeRow.querySelectorAll(".mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === "livraison"));
  livraisonField.hidden = false;
  pickupInfo.hidden = true;

  updateModalTotals();

  orderModal.classList.add("open");
  orderModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  orderModal.classList.remove("open");
  orderModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateModalTotals() {
  if (!currentProduct) return;
  const total = currentProduct.price * currentQty;

  qtyValue.textContent = currentQty;
  qtyTotal.textContent = formatFCFA(total);

  summaryProduct.textContent = currentProduct.name;
  summaryUnitPrice.textContent = `${formatFCFA(currentProduct.price)} / ${currentProduct.unit}`;
  summaryQty.textContent = `${currentQty} ${currentProduct.unit}(s)`;
  summaryTotal.textContent = formatFCFA(total);
}

if (productGrid) {
  productGrid.addEventListener("click", (e) => {
    const orderBtn = e.target.closest(".card-cta");
    if (orderBtn) {
      const product = getEffectiveProducts().find(p => p.id === orderBtn.dataset.id);
      if (product) openOrderModal(product);
      return;
    }

    const priceBtn = e.target.closest(".price-edit-btn");
    if (priceBtn) {
      openPriceModal(priceBtn.dataset.id);
    }
  });
}

if (modalClose) modalClose.addEventListener("click", closeOrderModal);

if (orderModal) {
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) closeOrderModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && orderModal.classList.contains("open")) closeOrderModal();
  });
}

if (qtyMinus) {
  qtyMinus.addEventListener("click", () => {
    if (currentQty > 1) {
      currentQty -= 1;
      updateModalTotals();
    }
  });
}

if (qtyPlus) {
  qtyPlus.addEventListener("click", () => {
    currentQty += 1;
    updateModalTotals();
  });
}

if (modeRow) {
  modeRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");
    if (!btn) return;

    currentMode = btn.dataset.mode;
    modeRow.querySelectorAll(".mode-btn").forEach(b => b.classList.toggle("active", b === btn));

    livraisonField.hidden = currentMode !== "livraison";
    pickupInfo.hidden = currentMode !== "retrait";
  });
}

if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    [orderNom, orderTel, orderLieu].forEach(f => f.classList.remove("field-error"));
    modalError.textContent = "";

    let hasError = false;

    if (!orderNom.value.trim()) {
      orderNom.classList.add("field-error");
      hasError = true;
    }
    if (!orderTel.value.trim()) {
      orderTel.classList.add("field-error");
      hasError = true;
    }
    if (currentMode === "livraison" && !orderLieu.value.trim()) {
      orderLieu.classList.add("field-error");
      hasError = true;
    }

    if (hasError) {
      modalError.textContent = "Merci de compléter les champs obligatoires.";
      return;
    }

    const total = currentProduct.price * currentQty;
    const nomComplet = `${orderNom.value.trim()} ${orderPrenom.value.trim()}`.trim();

    const lignes = [
      "Bonjour Ferme DUMARU 👋",
      "",
      "Je souhaite passer la commande suivante :",
      "",
      `Produit : ${currentProduct.name}`,
      `Quantité : ${currentQty} ${currentProduct.unit}(s)`,
      `Prix unitaire : ${formatFCFA(currentProduct.price)}`,
      `Total : ${formatFCFA(total)}`,
      "",
      `Client : ${nomComplet}`,
      `Téléphone : ${orderTel.value.trim()}`,
      ""
    ];

    if (currentMode === "livraison") {
      lignes.push("Mode de réception : Livraison");
      lignes.push(`Lieu de livraison : ${orderLieu.value.trim()}`);
      lignes.push("(Les frais de livraison seront payés une fois la commande livrée.)");
    } else {
      lignes.push("Mode de réception : Retrait au siège de la ferme (Maréborou, Sirarou, N'Dali)");
    }

    lignes.push("");
    lignes.push("Merci de confirmer la disponibilité.");

    const message = encodeURIComponent(lignes.join("\n"));
    const url = `https://wa.me/${PHONE_NUMBER}?text=${message}`;

    window.open(url, "_blank");
  });
}

// --- Contact form ---
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (formNote) {
      formNote.textContent = "Merci ! Votre message a été envoyé avec succès.";
    }

    this.reset();
  });
}

// --- Highlight active nav link on scroll ---
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

if (sections.length && navAnchors.length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navAnchors.forEach(a => {
          a.classList.toggle("active-link", a.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(section => navObserver.observe(section));
}

// =========================================================
// --- Comptes utilisateurs & actualités éditables ---
// Stockage local au navigateur (localStorage). Cette gestion
// de comptes est une démonstration côté client : elle convient
// pour une petite équipe interne, mais n'est pas un système de
// sécurité robuste (les mots de passe sont visibles dans le
// code du navigateur). Pour un vrai contrôle d'accès, il faudra
// à terme un petit serveur / une base de données.
// =========================================================

const USERS_KEY = "dumaru_users";
const NEWS_KEY = "dumaru_news";
const SESSION_KEY = "dumaru_session";

function seedIfEmpty() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([
      { id: 1, username: "admin", password: "dumaru2026", role: "admin" }
    ]));
  }

  if (!localStorage.getItem(NEWS_KEY)) {
    localStorage.setItem(NEWS_KEY, JSON.stringify([
      {
        id: 1,
        date: "Juillet 2026",
        title: "Nouvelle récolte d'igname",
        content: "Les différentes variétés d'ignames de la saison, fraîchement récoltées, sont disponibles à la ferme.",
        createdAt: 1
      },
      {
        id: 2,
        date: "2026",
        title: "Nouvelle race d'ovins",
        content: "Nous avons acquis une nouvelle race d'ovins, extrêmement rare, désormais disponible à la ferme. Contactez-nous pour vous en procurer.",
        createdAt: 2
      },
      {
        id: 3,
        date: "2026",
        title: "Promotion sur la provende",
        content: "Nos produits de provenderie sont actuellement en promotion dans tous nos points de vente.",
        createdAt: 3
      }
    ]));
  }
}

seedIfEmpty();

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getNews() {
  return JSON.parse(localStorage.getItem(NEWS_KEY) || "[]");
}
function saveNews(news) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(news));
}
function getSession() {
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return null;
  return getUsers().find(u => u.username === username) || null;
}
function setSession(username) {
  localStorage.setItem(SESSION_KEY, username);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// --- Generic modal open/close helpers ---
function openModal(el) {
  if (!el) return;
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(el) {
  if (!el) return;
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".modal-overlay.open").forEach(overlay => closeModal(overlay));
});

// --- Auth UI ---
const authArea = document.getElementById("authArea");
const loginModal = document.getElementById("loginModal");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginError = document.getElementById("loginError");

function renderAuthUI() {
  const session = getSession();

  if (!authArea) return;

  if (!session) {
    authArea.innerHTML = `
      <button type="button" class="icon-btn" id="loginBtn" aria-label="Connexion" title="Connexion">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 21c0-4-3.58-6-8-6s-8 2-8 6"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    `;
    document.getElementById("loginBtn").addEventListener("click", () => {
      loginError.textContent = "";
      loginUser.value = "";
      loginPass.value = "";
      openModal(loginModal);
    });
  } else {
    const roleLabel = session.role === "admin" ? "Admin" : "Éditeur";
    authArea.innerHTML = `
      <div class="user-chip">
        <span>${session.username}</span>
        <span class="role-badge">${roleLabel}</span>
        ${session.role === "admin" ? '<button type="button" id="adminBtn">Comptes</button>' : ""}
        <button type="button" id="logoutBtn">Déconnexion</button>
      </div>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        clearSession();
        renderAuthUI();
        renderNews();
        renderProductGrid();
      });
    }

    const adminBtn = document.getElementById("adminBtn");
    if (adminBtn) {
      adminBtn.addEventListener("click", () => {
        renderUserList();
        openModal(document.getElementById("adminModal"));
      });
    }
  }

  const newsToolbar = document.getElementById("newsToolbar");
  if (newsToolbar) newsToolbar.hidden = !session;
}

document.getElementById("loginClose")?.addEventListener("click", () => closeModal(loginModal));

document.getElementById("loginSubmit")?.addEventListener("click", () => {
  const username = loginUser.value.trim();
  const password = loginPass.value;
  const match = getUsers().find(u => u.username === username && u.password === password);

  if (!match) {
    loginError.textContent = "Identifiant ou mot de passe incorrect.";
    return;
  }

  setSession(match.username);
  closeModal(loginModal);
  renderAuthUI();
  renderNews();
  renderProductGrid();
});

// --- Admin: manage user accounts ---
const adminModal = document.getElementById("adminModal");
const userList = document.getElementById("userList");
const adminError = document.getElementById("adminError");

function renderUserList() {
  const users = getUsers();
  if (!userList) return;

  userList.innerHTML = users.map(u => `
    <div class="user-row">
      <span class="user-row-name">${u.username}</span>
      <span class="user-row-role">${u.role === "admin" ? "Admin" : "Éditeur"}</span>
      <button type="button" data-id="${u.id}" class="del-user-btn">Supprimer</button>
    </div>
  `).join("");

  userList.querySelectorAll(".del-user-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const users2 = getUsers();
      const target = users2.find(u => u.id === id);
      const admins = users2.filter(u => u.role === "admin");

      if (target && target.role === "admin" && admins.length === 1) {
        adminError.textContent = "Impossible de supprimer le dernier compte administrateur.";
        return;
      }

      const session = getSession();
      const updated = users2.filter(u => u.id !== id);
      saveUsers(updated);

      if (session && session.id === id) {
        clearSession();
        renderAuthUI();
        renderNews();
        renderProductGrid();
        closeModal(adminModal);
        return;
      }

      renderUserList();
    });
  });
}

document.getElementById("adminClose")?.addEventListener("click", () => closeModal(adminModal));

document.getElementById("addUserBtn")?.addEventListener("click", () => {
  const nameField = document.getElementById("newUserName");
  const passField = document.getElementById("newUserPass");
  const roleField = document.getElementById("newUserRole");

  const username = nameField.value.trim();
  const password = passField.value.trim();
  const role = roleField.value;

  adminError.textContent = "";

  if (!username || !password) {
    adminError.textContent = "Merci de renseigner un identifiant et un mot de passe.";
    return;
  }

  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    adminError.textContent = "Cet identifiant existe déjà.";
    return;
  }

  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  users.push({ id: nextId, username, password, role });
  saveUsers(users);

  nameField.value = "";
  passField.value = "";
  renderUserList();
});

// --- Editable news carousel ---
const newsTrack = document.getElementById("newsTrack");
const newsPrev = document.getElementById("newsPrev");
const newsNext = document.getElementById("newsNext");
const addNewsBtn = document.getElementById("addNewsBtn");

const newsFormModal = document.getElementById("newsFormModal");
const newsFormTitle = document.getElementById("newsFormTitle");
const newsIdField = document.getElementById("newsId");
const newsDateField = document.getElementById("newsDate");
const newsTitleField = document.getElementById("newsTitleInput");
const newsContentField = document.getElementById("newsContent");
const newsFormError = document.getElementById("newsFormError");

function renderNews() {
  if (!newsTrack) return;
  const session = getSession();
  const news = [...getNews()].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  newsTrack.innerHTML = news.map(n => `
    <article class="news-card">
      <span class="timeline-date">${n.date}</span>
      <h3>${n.title}</h3>
      <p>${n.content}</p>
      ${session ? `
        <div class="news-card-actions">
          <button type="button" class="edit-news-btn" data-id="${n.id}">Modifier</button>
          <button type="button" class="delete-btn delete-news-btn" data-id="${n.id}">Supprimer</button>
        </div>
      ` : ""}
    </article>
  `).join("");

  newsTrack.querySelectorAll(".edit-news-btn").forEach(btn => {
    btn.addEventListener("click", () => openNewsForm(Number(btn.dataset.id)));
  });

  newsTrack.querySelectorAll(".delete-news-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      saveNews(getNews().filter(n => n.id !== id));
      renderNews();
    });
  });
}

function openNewsForm(id) {
  newsFormError.textContent = "";

  if (id) {
    const item = getNews().find(n => n.id === id);
    if (!item) return;
    newsFormTitle.textContent = "Modifier l'actualité";
    newsIdField.value = item.id;
    newsDateField.value = item.date;
    newsTitleField.value = item.title;
    newsContentField.value = item.content;
  } else {
    newsFormTitle.textContent = "Ajouter une actualité";
    newsIdField.value = "";
    newsDateField.value = "";
    newsTitleField.value = "";
    newsContentField.value = "";
  }

  openModal(newsFormModal);
}

if (addNewsBtn) {
  addNewsBtn.addEventListener("click", () => openNewsForm(null));
}

document.getElementById("newsFormClose")?.addEventListener("click", () => closeModal(newsFormModal));

document.getElementById("newsSaveBtn")?.addEventListener("click", () => {
  const date = newsDateField.value.trim();
  const title = newsTitleField.value.trim();
  const content = newsContentField.value.trim();

  if (!date || !title || !content) {
    newsFormError.textContent = "Merci de remplir la date, le titre et le contenu.";
    return;
  }

  const news = getNews();
  const id = newsIdField.value ? Number(newsIdField.value) : null;

  if (id) {
    const item = news.find(n => n.id === id);
    if (item) {
      item.date = date;
      item.title = title;
      item.content = content;
    }
  } else {
    const nextId = news.length ? Math.max(...news.map(n => n.id)) + 1 : 1;
    news.push({ id: nextId, date, title, content, createdAt: Date.now() });
  }

  saveNews(news);
  closeModal(newsFormModal);
  renderNews();
});

if (newsPrev && newsTrack) {
  newsPrev.addEventListener("click", () => {
    newsTrack.scrollBy({ left: -320, behavior: "smooth" });
    restartNewsAuto();
  });
}

if (newsNext && newsTrack) {
  newsNext.addEventListener("click", () => {
    newsTrack.scrollBy({ left: 320, behavior: "smooth" });
    restartNewsAuto();
  });
}

// --- Auto-rotate the news carousel, most recent card first ---
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let newsAutoTimer = null;

function startNewsAuto() {
  if (prefersReducedMotion || !newsTrack) return;
  stopNewsAuto();
  newsAutoTimer = setInterval(() => {
    if (!newsTrack.children.length) return;
    const atEnd = newsTrack.scrollLeft + newsTrack.clientWidth >= newsTrack.scrollWidth - 5;
    if (atEnd) {
      newsTrack.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      newsTrack.scrollBy({ left: 320, behavior: "smooth" });
    }
  }, 4500);
}

function stopNewsAuto() {
  if (newsAutoTimer) clearInterval(newsAutoTimer);
}

function restartNewsAuto() {
  stopNewsAuto();
  startNewsAuto();
}

const newsCarousel = document.querySelector(".news-carousel");
if (newsCarousel) {
  newsCarousel.addEventListener("mouseenter", stopNewsAuto);
  newsCarousel.addEventListener("mouseleave", startNewsAuto);
}

startNewsAuto();

// --- Price editing (admin & admin-created accounts) ---
const priceModal = document.getElementById("priceModal");
const priceProductId = document.getElementById("priceProductId");
const priceModalTitle = document.getElementById("priceModalTitle");
const priceInput = document.getElementById("priceInput");
const priceModalError = document.getElementById("priceModalError");

function openPriceModal(productId) {
  if (!getSession()) return; // sécurité : seule une session valide peut éditer un prix

  const product = getEffectiveProducts().find(p => p.id === productId);
  if (!product) return;

  priceModalError.textContent = "";
  priceProductId.value = product.id;
  priceModalTitle.textContent = `Modifier le prix — ${product.name}`;
  priceInput.value = product.price;

  openModal(priceModal);
}

document.getElementById("priceModalClose")?.addEventListener("click", () => closeModal(priceModal));

document.getElementById("priceSaveBtn")?.addEventListener("click", () => {
  if (!getSession()) {
    closeModal(priceModal);
    return;
  }

  const id = priceProductId.value;
  const value = Number(priceInput.value);

  if (!id || !Number.isFinite(value) || value < 0) {
    priceModalError.textContent = "Merci de saisir un prix valide.";
    return;
  }

  const overrides = getPriceOverrides();
  overrides[id] = value;
  savePriceOverrides(overrides);

  closeModal(priceModal);
  renderProductGrid();
});

// --- Init ---
renderAuthUI();
renderNews();
renderProductGrid();

