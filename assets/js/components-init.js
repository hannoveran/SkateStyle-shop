// ===================================================================
// ІНІЦІАЛІЗАЦІЯ КОМПОНЕНТІВ
// ===================================================================



// Функція для завантаження всіх компонентів
function loadComponents() {
    const currentPage = getCurrentPageType();
    
    // Кошик
    initCart();
    
    // Кількість товарів з кошика
    const cartCount = getCartCount();
    
    // Навбар
    initNavbar({
        currentPage: currentPage,
        cartCount: cartCount
    });
    
    // Features 
    if (document.querySelector('[data-component="features"]')) {
        initFeatures();
    }
    
    // Features-wrap 
    if (document.querySelector('[data-component="features-wrap"]')) {
        initFeaturesWrap();
    }
    
    // Footer
    initFooter();
    
}

// Визначення типу сторінки
function getCurrentPageType() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path.includes('aboutUs.html')) return 'about';
    if (hash.includes('type=women')) return 'women';
    if (hash.includes('type=men')) return 'men';
    if (hash.includes('type=skates')) return 'skates';
    if (hash.includes('type=accessories')) return 'accessories';
    
    return '';
}

function getPageType() {
    const path = window.location.pathname;
    
    if (path.includes('aboutUs.html') || path.includes('about.html')) return 'about';
    if (path.includes('index.html') || path === '/') return 'homepage';
    
    return 'default';
}

function toggleSearch(event) {
    event.preventDefault();
}

// Ці функції беруться з компонента кошика через window
// function toggleCart(event) - визначається в cart-init.js
// function closeCart() - визначається в cart-init.js

function toggleMenu() {
    console.log('Toggle mobile menu');
}

function updateNavbarCartCount() {
    const cartCount = getCartCount();
    if (window.updateNavbarCartCounter) {
        window.updateNavbarCartCounter(cartCount);
    }
}

document.addEventListener('DOMContentLoaded', loadComponents);

window.addEventListener('hashchange', () => {
    const currentPage = getCurrentPageType();
    if (window.setActiveNavItem) {
        setActiveNavItem(currentPage);
    }
});

window.addEventListener('storage', (e) => {
    if (e.key && e.key.includes('cart_')) {
        updateCartCounter();
        updateNavbarCartCount();
    }
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            if (!document.querySelector('[data-component="footer"] footer')) {
                setTimeout(() => {
                    initFooter();
                }, 100);
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});