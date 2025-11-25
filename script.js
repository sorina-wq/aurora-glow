const products = [
    { id: 1, name: "Colier Glow Moon & Stars", price: 279, category: "colier", 
      img: "https://i.pinimg.com/1200x/32/da/43/32da432c5a97709e4f1fdb15cb0891ce.jpg" },
    { id: 2, name: "Cercei Cristal Roz Quartz", price: 229, category: "cercei", 
      img: "https://i.pinimg.com/1200x/66/95/0f/66950f6a048f0f27646c45428951b0fd.jpg" },
    { id: 3, name: "Brățară Perle Glow", price: 199, category: "bratara", 
      img: "https://i.pinimg.com/1200x/69/81/09/698109886d71f256f0c39ac40e572297.jpg" },
    { id: 4, name: "Inel Glow Butterfly", price: 149, category: "inel", 
      img: "https://i.pinimg.com/1200x/32/55/15/325515ee3c200ebb3cacbbf8bf0aa392.jpg" },
    { id: 5, name: "Set Layering Silver Glow", price: 399, category: "colier", 
      img: "https://i.pinimg.com/1200x/61/d6/66/61d66627cea6eda4f23b0290fba7639b.jpg" },
    { id: 6, name: "Cercei Chandelier Glow", price: 489, category: "cercei", 
      img: "https://i.pinimg.com/1200x/a5/13/bc/a513bcf4090ab56314a6458c512318e7.jpg" },
    { id: 7, name: "Colier Personalizat Glow", price: 259, category: "colier", 
      img: "https://i.pinimg.com/1200x/7b/86/5e/7b865e40bb269d9813dd1519b52cc15a.jpg" },
    { id: 8, name: "Brățară Tennis Glow", price: 459, category: "bratara", 
      img: "https://i.pinimg.com/1200x/87/72/f1/8772f1ddff116e5f5c9a4955bf5b74e6.jpg" }
];

let cart = JSON.parse(localStorage.getItem('auroraCart')) || [];
let favorites = JSON.parse(localStorage.getItem('auroraFavs')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function goTo(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    if (section === 'shop') renderProducts();
    renderAll();
}

function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('#theme-btn i');
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    }
}
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.replace('dark-mode', 'light-mode');
    document.querySelector('#theme-btn i').classList.replace('fa-moon', 'fa-sun');
}

function toggleAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function switchToRegister() {
    document.getElementById('modal-title').textContent = "Înregistrare";
    document.getElementById('auth-btn').textContent = "Creează cont";
    document.getElementById('auth-btn').onclick = register;
    document.querySelector('#auth-modal p').innerHTML = 'Ai deja cont? <a href="#" onclick="switchToLogin()">Log In</a>';
}
function switchToLogin() {
    document.getElementById('modal-title').textContent = "Log In";
    document.getElementById('auth-btn').textContent = "Intră în cont";
    document.getElementById('auth-btn').onclick = login;
    document.querySelector('#auth-modal p').innerHTML = 'Nu ai cont? <a href="#" onclick="switchToRegister()">Înregistrează-te</a>';
}

function register() {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    if (!email || !pass) return alert("Completează toate câmpurile!");
    let users = JSON.parse(localStorage.getItem('auroraUsers') || '{}');
    if (users[email]) return alert("Există deja acest email!");
    users[email] = pass;
    localStorage.setItem('auroraUsers', JSON.stringify(users));
    alert("Cont creat cu succes! Te poți loga acum.");
    switchToLogin();
}

function login() {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('auroraUsers') || '{}');
    if (users[email] && users[email] === pass) {
        currentUser = email;
        localStorage.setItem('currentUser', JSON.stringify(email));
        updateAuthLink();
        toggleAuthModal();
        alert(`Bine ai revenit, ${email.split('@')[0]}!`);
    } else {
        alert("Email sau parolă greșită!");
    }
}

function logout() {
    if (confirm("Sigur vrei să te deconectezi?")) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthLink();
    }
}

function updateAuthLink() {
    const link = document.getElementById('auth-link');
    if (currentUser) {
        link.innerHTML = `<i class="fas fa-user"></i> ${currentUser.split('@')[0]}`;
        link.onclick = logout;
    } else {
        link.innerHTML = `<i class="fas fa-user"></i> Log In`;
        link.onclick = toggleAuthModal;
    }
}

function createProductHTML(p) {
    const isFav = favorites.some(f => f.id === p.id);
    const item = cart.find(c => c.id === p.id);
    const qty = item ? item.qty : 0;

    return `
        <div class="product">
            <div class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${p.id})"></div>
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display:none; padding:20px; color:#ff9aed;">Imagine indisponibilă - ${p.name}</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price} RON</div>
                ${qty > 0 ? `
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQty(${p.id}, -1)">−</button>
                        <span style="font-weight:bold; color:#ff9aed;">${qty}</span>
                        <button class="quantity-btn" onclick="changeQty(${p.id}, 1)">+</button>
                    </div>
                ` : `<button class="add-to-cart" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Adaugă în coș</button>`}
            </div>
        </div>
    `;
}

function renderProducts() {
    let list = [...products];
    const term = document.getElementById('search-input')?.value.toLowerCase() || '';
    const sort = document.getElementById('sort-price')?.value || 'default';
    const cat = document.getElementById('filter-category')?.value || 'all';

    if (term) list = list.filter(p => p.name.toLowerCase().includes(term));
    if (cat !== 'all') list = list.filter(p => p.category === cat);
    if (sort === 'low') list.sort((a,b) => a.price - b.price);
    if (sort === 'high') list.sort((a,b) => b.price - a.price);

    document.getElementById('products-grid').innerHTML = 
        list.length ? list.map(createProductHTML).join('') : 
        '<p style="text-align:center;color:#ccc;margin:60px 0;font-size:1.2rem;">Nimic găsit... Încearcă altă căutare!</p>';
}

function renderFavorites() {
    const term = document.getElementById('search-fav')?.value.toLowerCase() || '';
    let list = favorites.filter(p => p.name.toLowerCase().includes(term));
    document.getElementById('favorites-grid').innerHTML = 
        list.length ? list.map(createProductHTML).join('') : 
        '<p style="text-align:center;color:#ccc;margin:60px 0;font-size:1.2rem;">Nimic în favorite încă... Adaugă din catalog!</p>';
    document.getElementById('fav-count').textContent = favorites.length;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!cart.length) {
        container.innerHTML = '<p style="text-align:center;color:#ccc;margin:60px 0;font-size:1.2rem;">Coșul este gol... Adaugă ceva din catalog!</p>';
        document.getElementById('total-price').textContent = '0';
        document.getElementById('cart-count').textContent = '0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, i) => {
        total += item.price * item.qty;
        return `<div class="cart-item">
            <div style="flex:1;"><strong>${item.name}</strong><br><small>${item.price} RON × ${item.qty}</small></div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button class="quantity-btn" onclick="changeQty(${item.id}, -1)">−</button>
                <span style="font-weight:bold;">${item.qty}</span>
                <button class="quantity-btn" onclick="changeQty(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${i})" style="background:#ff6b6b; color:white; padding:8px 12px; border:none; border-radius:50px; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');

    document.getElementById('total-price').textContent = total.toFixed(0);
    document.getElementById('cart-count').textContent = cart.reduce((s,c) => s + c.qty, 0);
}

function renderAll() {
    renderFavorites();
    renderCart();
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    const existing = cart.find(x => x.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...p, qty: 1 });
    saveCart();
    renderAll();
    alert('Adăugat în coș! ✨');
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
    saveCart();
    renderAll();
}

function removeFromCart(i) {
    if (confirm('Sigur ștergi acest produs?')) {
        cart.splice(i, 1);
        saveCart();
        renderAll();
    }
}

function toggleFavorite(id) {
    const p = products.find(x => x.id === id);
    const idx = favorites.findIndex(f => f.id === id);
    if (idx === -1) {
        favorites.push(p);
        alert('Adăugat la favorite! ❤️');
    } else {
        favorites.splice(idx, 1);
        alert('Eliminat din favorite.');
    }
    localStorage.setItem('auroraFavs', JSON.stringify(favorites));
    renderAll();
}

function saveCart() { localStorage.setItem('auroraCart', JSON.stringify(cart)); }

function checkout() {
    if (!currentUser) return alert("Trebuie să fii logată pentru a comanda! (Test: folosește email: test@test.com, parolă: 123)");
    if (!cart.length) return alert("Coșul este gol!");
    confetti({ particleCount: 400, spread: 90, origin: { y: 0.6 } });
    alert(`Comanda ta de ${document.getElementById('total-price').textContent} RON a fost plasată cu succes, ${currentUser.split('@')[0]}! Mulțumim că strălucești cu noi! ✨`);
    cart = []; saveCart(); renderAll(); goTo('home');
}

// Inițializare
updateAuthLink();
renderAll();