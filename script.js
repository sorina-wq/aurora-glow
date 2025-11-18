const products = [
    { id: 1, name: "Colier Glow Moon & Stars", price: 279, category: "colier", img: "https://img.joomcdn.net/b90d2260a17b79c6aead8b753ec9928bbd4a3f8d_original.jpeg" },
    { id: 2, name: "Cercei Cristal Roz Quartz", price: 229, category: "cercei", img: "https://daisyfay.ro/wp-content/uploads/bijuterii-argint-pietre-semipretioase-Daisy-Fay-2023-feb-52-Edit-Edit.jpg" },
    { id: 3, name: "Brățară Perle Glow", price: 199, category: "bratara", img: "https://i.pinimg.com/736x/b2/12/14/b21214ec1a74e2f78e235058a79a3b7b.jpg" },
    { id: 4, name: "Inel Glow Butterfly", price: 149, category: "inel", img: "https://i.pinimg.com/1200x/32/55/15/325515ee3c200ebb3cacbbf8bf0aa392.jpg" },
    { id: 5, name: "Set Layering Silver Glow", price: 399, category: "colier", img: "https://i.pinimg.com/1200x/61/d6/66/61d66627cea6eda4f23b0290fba7639b.jpg" },
    { id: 6, name: "Cercei Chandelier Glow", price: 489, category: "cercei", img: "https://i.pinimg.com/1200x/d3/90/95/d39095caa55e21c350111406b8e12ef8.jpg" },
    { id: 7, name: "Colier Personalizat Glow", price: 259, category: "colier", img: "https://i.pinimg.com/1200x/cf/c5/32/cfc5328b2c217ace03db41a08dee5d00.jpg" },
    { id: 8, name: "Brățară Tennis Glow", price: 459, category: "bratara", img: "https://i.pinimg.com/1200x/87/72/f1/8772f1ddff116e5f5c9a4955bf5b74e6.jpg" }
];

let cart = JSON.parse(localStorage.getItem('auroraCart')) || [];
let favorites = JSON.parse(localStorage.getItem('auroraFavs')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function goTo(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    renderAll();
}

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-btn');
    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        btn.innerHTML = 'Soare';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        btn.innerHTML = 'Luna';
        localStorage.setItem('theme', 'dark');
    }
}
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.replace('dark-mode', 'light-mode');
    document.getElementById('theme-btn').innerHTML = 'Soare';
}

function toggleAuthModal() {
    document.getElementById('auth-modal').style.display = 
        document.getElementById('auth-modal').style.display === 'block' ? 'none' : 'block';
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
    if (!email || !pass) return alert("Completează tot!");
    let users = JSON.parse(localStorage.getItem('auroraUsers') || '{}');
    if (users[email]) return alert("Există deja acest email!");
    users[email] = pass;
    localStorage.setItem('auroraUsers', JSON.stringify(users));
    alert("Cont creat! Loghează-te acum");
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
    } else alert("Email/parolă greșită!");
}

function logout() {
    if (confirm("Deconectare?")) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthLink();
    }
}

function updateAuthLink() {
    const link = document.getElementById('auth-link');
    if (currentUser) {
        link.textContent = currentUser.split('@')[0];
        link.onclick = logout;
    } else {
        link.textContent = "Log In";
        link.onclick = toggleAuthModal;
    }
}

function createProductHTML(p) {
    const isFav = favorites.some(f => f.id === p.id);
    const item = cart.find(c => c.id === p.id);
    const qty = item ? item.qty : 0;
    return `
        <div class="product">
            <div class="fav-btn ${isFav?'active':''}" onclick="toggleFavorite(${p.id})">Inimă</div>
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price} RON</div>
                ${qty > 0 ? `<div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQty(${p.id},-1)">−</button>
                    <span style="color:#ff9aed;font-weight:bold;">${qty}</span>
                    <button class="quantity-btn" onclick="changeQty(${p.id},1)">+</button>
                </div>` : `<button class="add-to-cart" onclick="addToCart(${p.id})">Adaugă în coș</button>`}
            </div>
        </div>`;
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

    document.getElementById('products-grid').innerHTML = list.length ? list.map(createProductHTML).join('') : '<p style="text-align:center;color:#ccc;margin:50px;">Nimic găsit...</p>';
}

function renderFavorites() {
    const term = document.getElementById('search-fav')?.value.toLowerCase() || '';
    let list = favorites.filter(p => p.name.toLowerCase().includes(term));
    document.getElementById('favorites-grid').innerHTML = list.length ? list.map(createProductHTML).join('') : '<p style="text-align:center;color:#ccc;margin:50px;">Nimic în favorite...</p>';
    document.getElementById('fav-count').textContent = favorites.length;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!cart.length) {
        container.innerHTML = '<p style="text-align:center;color:#ccc;margin:50px;">Coșul e gol...</p>';
        document.getElementById('total-price').textContent = '0';
        document.getElementById('cart-count').textContent = '0';
        return;
    }
    let total = 0;
    container.innerHTML = cart.map((item,i) => {
        total += item.price * item.qty;
        return `<div class="cart-item">
            <div><strong>${item.name}</strong><br>${item.price} RON × ${item.qty}</div>
            <div>
                <button class="quantity-btn" onclick="changeQty(${item.id},-1)">−</button>
                <span style="margin:0 12px;font-weight:bold;">${item.qty}</span>
                <button class="quantity-btn" onclick="changeQty(${item.id},1)">+</button>
                <button onclick="removeFromCart(${i})" style="margin-left:15px;background:#ff6bd6;color:white;padding:8px 15px;border:none;border-radius:10px;">Șterge</button>
            </div>
        </div>`;
    }).join('');
    document.getElementById('total-price').textContent = total;
    document.getElementById('cart-count').textContent = cart.reduce((s,c)=>s+c.qty,0);
}

function renderAll() { renderProducts(); renderFavorites(); renderCart(); }

function addToCart(id) { const p = products.find(x=>x.id===id); const e = cart.find(x=>x.id===id); e ? e.qty++ : cart.push({...p,qty:1}); saveCart(); renderAll(); }
function changeQty(id,delta) { const item = cart.find(c=>c.id===id); if(!item) return; item.qty += delta; if(item.qty<=0) cart = cart.filter(c=>c.id!==id); saveCart(); renderAll(); }
function removeFromCart(i) { cart.splice(i,1); saveCart(); renderAll(); }
function toggleFavorite(id) { const p = products.find(x=>x.id===id); const idx = favorites.findIndex(f=>f.id===id); idx===-1 ? favorites.push(p) : favorites.splice(idx,1); localStorage.setItem('auroraFavs',JSON.stringify(favorites)); renderAll(); }
function saveCart() { localStorage.setItem('auroraCart',JSON.stringify(cart)); }

function checkout() {
    if (!currentUser) return alert("Trebuie să fii logată!");
    if (!cart.length) return alert("Coșul e gol!");
    confetti({particleCount:300,spread:80,origin:{y:0.6}});
    alert(`Comanda plasată! Mulțumim, ${currentUser.split('@')[0]}!`);
    cart=[]; saveCart(); renderAll(); goTo('home');
}

updateAuthLink();
renderAll();
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
    } else alert("Email sau parolă greșită!");
}
function logout() {
    if (confirm("Sigur vrei să te deconectezi?")) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthLink();
        alert("Te-ai deconectat!");
    }
}
function updateAuthLink() {
    const link = document.getElementById('auth-link');
    if (currentUser) {
        link.textContent = currentUser.split('@')[0];
        link.onclick = logout;
    } else {
        link.textContent = "Log In";
        link.onclick = toggleAuthModal;
    }
}

// === PRODUSE ===
function createProductHTML(p) {
    const isFav = favorites.some(f => f.id === p.id);
    const item = cart.find(c => c.id === p.id);
    const qty = item ? item.qty : 0;

    return `
        <div class="product">
            <div class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${p.id})">Inimă</div>
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price} RON</div>
                ${qty > 0 ? `
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQty(${p.id}, -1)">−</button>
                        <span style="color:#ff9aed;font-weight:bold;">${qty}</span>
                        <button class="quantity-btn" onclick="changeQty(${p.id}, 1)">+</button>
                    </div>
                ` : `<button class="add-to-cart" onclick="addToCart(${p.id})">Adaugă în coș</button>`}
            </div>
        </div>
    `;
}

// === RENDER + CĂUTARE ===
function renderProducts() {
    let list = [...products];
    const term = document.getElementById('search-input')?.value.toLowerCase() || '';
    const sort = document.getElementById('sort-price')?.value || 'default';
    const cat = document.getElementById('filter-category')?.value || 'all';

    if (term) list = list.filter(p => p.name.toLowerCase().includes(term));
    if (cat !== 'all') list = list.filter(p => p.category === cat);
    if (sort === 'low') list.sort((a,b) => a.price - b.price);
    if (sort === 'high') list.sort((a,b) => b.price - a.price);

    document.getElementById('products-grid').innerHTML = list.map(createProductHTML).join('');
}

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const term = event?.target?.value.toLowerCase() || '';
    let list = term ? favorites.filter(p => p.name.toLowerCase().includes(term)) : favorites;

    grid.innerHTML = list.length === 0 
        ? '<p style="text-align:center;color:#ccc;margin-top:50px;">Nimic aici încă...</p>'
        : list.map(createProductHTML).join('');
    document.getElementById('fav-count').textContent = favorites.length;
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#ccc;margin-top:50px;">Coșul tău este gol...</p>';
        document.getElementById('total-price').textContent = '0';
        document.getElementById('cart-count').textContent = '0';
        return;
    }
    let total = 0;
    container.innerHTML = cart.map((item, i) => {
        total += item.price * item.qty;
        return `<div class="cart-item">
            <div><strong>${item.name}</strong><br>${item.price} RON × ${item.qty}</div>
            <div>
                <button class="quantity-btn" onclick="changeQty(${item.id}, -1)">−</button>
                <span style="margin:0 12px;font-weight:bold;">${item.qty}</span>
                <button class="quantity-btn" onclick="changeQty(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${i})" style="margin-left:15px;background:#ff6bd6;color:white;padding:8px 15px;border:none;border-radius:10px;">Șterge</button>
            </div>
        </div>`;
    }).join('');
    document.getElementById('total-price').textContent = total;
    document.getElementById('cart-count').textContent = cart.reduce((s,c) => s + c.qty, 0);
}

function renderAll() {
    renderProducts();
    renderFavorites();
    renderCart();
}

// === COȘ & FAVORITE ===
function addToCart(id) {
    const p = products.find(x => x.id === id);
    const existing = cart.find(x => x.id === id);
    existing ? existing.qty++ : cart.push({ ...p, qty: 1 });
    saveCart();
    renderAll();
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
    cart.splice(i, 1);
    saveCart();
    renderAll();
}
function toggleFavorite(id) {
    const p = products.find(x => x.id === id);
    const idx = favorites.findIndex(f => f.id === id);
    idx === -1 ? favorites.push(p) : favorites.splice(idx, 1);
    localStorage.setItem('auroraFavs', JSON.stringify(favorites));
    renderAll();
}
function saveCart() {
    localStorage.setItem('auroraCart', JSON.stringify(cart));
}

// === CĂUTARE ÎN FAVORITE ===
document.addEventListener('input', function(e) {
    if (e.target && e.target.placeholder === "Caută în favorite...") {
        renderFavorites();
    }
});

// === FINALIZARE COMANDĂ ===
function checkout() {
    if (!currentUser) return alert("Trebuie să fii logată pentru a comanda!");
    if (cart.length === 0) return alert("Coșul e gol!");
    confetti({ particleCount: 300, spread: 80, origin: { y: 0.6 } });
    alert(`Comanda ta a fost plasată cu succes, ${currentUser.split('@')[0]}! Mulțumim că strălucești cu noi!`);
    cart = [];
    saveCart();
    renderAll();
    goTo('home');
}

// === INIȚIALIZARE ===
updateAuthLink();
renderAll();