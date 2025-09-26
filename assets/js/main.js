// ===================================================================
// ГОЛОВНА ЧАСТИНА 
// ===================================================================



let searchComponent = null;

// Функція ініціалізації всіх компонентів
function initializeApp() {
    
    // Кошик
    initCart();
    
    // Пошук
    initSearch();
    
    initNavigation();
    initMobileMenu();
    
}

// Функція ініціалізації навігації
function initNavigation() {
    const currentPage = getCurrentPageType();
    setActiveNavItem(currentPage);
}

// Функція для визначення поточної сторінки
function getCurrentPageType() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path.includes('about.html')) return 'about';
    if (path.includes('catalog.html')) return 'catalog';
    if (path.includes('cart.html')) return 'cart';
    if (path.includes('checkout.html')) return 'checkout';
    if (path.includes('product.html')) return 'product';
    if (hash.includes('type=women')) return 'women';
    if (hash.includes('type=men')) return 'men';
    if (hash.includes('type=skates')) return 'skates';
    if (hash.includes('type=accessories')) return 'accessories';
    
    return 'home';
}

function setActiveNavItem(pageType) {
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeItem = document.querySelector(`[data-page="${pageType}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function initSearch() {
    console.log('Пошук ініціалізується через компонент');
}

function toggleSearch(event) {
    event.preventDefault();
    const searchInstance = getSearchInstance();
    if (searchInstance) {
        searchInstance.toggleSearch(event);
    }
}

function handleSearch(event) {
    event.preventDefault();
    const searchInput = event.target.querySelector('input[type="search"]');
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (query) {
        performSearch(query);
    }
}

function performSearch(query) {
    const searchInstance = getSearchInstance();
    if (searchInstance) {
        searchInstance.openWithQuery(query);
    } else {
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        const catalogPath = isInPagesFolder ? 'catalog.html' : 'pages/catalog.html';
        
        window.location.href = `${catalogPath}?search=${encodeURIComponent(query)}`;
    }
}

function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }
}

function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
}

function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

function updateAuthUI() {
    const user = getCurrentUser();
    const accountLink = document.querySelector('a[href*="account"]');
    const loginElements = document.querySelectorAll('.login-required');
    
    if (accountLink) {
        if (user) {
            accountLink.title = `Акаунт: ${user.name || user.username}`;
        } else {
            accountLink.title = 'Увійти в акаунт';
        }
    }
    
    loginElements.forEach(element => {
        if (user) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

function onUserLogin() {
    updateAuthUI();
    
    const cart = getCartInstance();
    if (cart) {
        cart.onUserLogin();
    }
}

function onUserLogout() {
    updateAuthUI();
    
    const cart = getCartInstance();
    if (cart) {
        cart.onUserLogout();
    }
}

function updateNavbarCartCounter() {
    const counter = document.querySelector('.cart span') || document.getElementById('cart-counter');
    const cart = getCartInstance();
    
    if (counter && cart) {
        counter.innerText = cart.getCartCount().toString();
    }
}

window.addEventListener('hashchange', () => {
    const currentPage = getCurrentPageType();
    setActiveNavItem(currentPage);
});

window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
        updateAuthUI();
        
        if (e.newValue) {
            onUserLogin();
        } else {
            onUserLogout();
        }
    }
    
    if (e.key && e.key.includes('cart_')) {
        updateNavbarCartCounter();
    }
});

// Обробник помилок
window.addEventListener('error', (event) => {
    console.error('Глобальна помилка:', event.error);
});

// Функція для безпечного виклику функцій
function safeCall(fn, ...args) {
    try {
        return fn(...args);
    } catch (error) {
        console.error('Помилка при виклику функції:', error);
        return null;
    }
}

// Утілітарні функції
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Експорт функцій для глобального використання
window.toggleSearch = toggleSearch;
window.toggleMenu = toggleMenu;
window.onUserLogin = onUserLogin;
window.onUserLogout = onUserLogout;
window.updateNavbarCartCounter = updateNavbarCartCounter;
window.getCurrentUser = getCurrentUser;
window.isUserLoggedIn = isUserLoggedIn;
window.performSearch = performSearch;

document.addEventListener('DOMContentLoaded', initializeApp);

// Додаткова ініціалізація після повного завантаження сторінки
window.addEventListener('load', () => {
    updateAuthUI();
    updateNavbarCartCounter();
});


