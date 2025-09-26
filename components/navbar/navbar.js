function createNavbar(options = {}) {
    const defaults = {
        logoSrc: './assets/images/logo/logoRemoveBg.png',
        logoAlt: 'Skate Style Store Logo',
        cartCount: 0,
        currentPage: '' 
    };
    
    const config = { ...defaults, ...options };
    
    return `
        <section class="navbar">
            <div class="logo">
                <a href="/index.html">
                    <img src="${config.logoSrc}" alt="${config.logoAlt}">
                </a>
            </div>
            
            <div class="nav-links main-links">
                <nav>
                    <ul>
                        <li><a href="/pages/category.html#type=women" ${config.currentPage === 'women' ? 'class="active"' : ''}>Жінкам</a></li>
                        <li><a href="/pages/category.html#type=men" ${config.currentPage === 'men' ? 'class="active"' : ''}>Чоловікам</a></li>
                        <li><a href="/pages/category.html#type=skates" ${config.currentPage === 'skates' ? 'class="active"' : ''}>Ковзани</a></li>
                        <li><a href="/pages/category.html#type=accessories" ${config.currentPage === 'accessories' ? 'class="active"' : ''}>Аксесуари</a></li>
                        <li><a href="/pages/aboutUs.html" ${config.currentPage === 'about' ? 'class="active"' : ''}>Про нас</a></li>
                        <li><a href="#phone-number">Контакти</a></li>
                    </ul>
                </nav>
            </div>
            
            <div class="nav-links">
                <nav>
                    <ul>
                        <li class="search">
                            <a href="#" onclick="toggleSearch(event)">
                                <img src="/assets/images/index/search.png" alt="Search">
                                <span>Шукати</span>
                            </a>
                        </li>
                        <li>
                            <a href="/pages/user/account.html">
                                <img src="/assets/images/index/account.png" alt="Account">
                            </a>
                        </li>
                        <li class="cart">
                            <a href="#" onclick="toggleCart(event)">
                                <img src="/assets/images/index/cart.png" alt="Cart">
                            </a>
                            <span id="cart-count">${config.cartCount}</span>
                        </li>
                        <li>
                            <div class="burger" onclick="toggleMenu()">☰</div>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    `;
}

function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Ініціалізація навбара
function initNavbar(options = {}) {
    const navbarContainer = document.querySelector('[data-component="navbar"]');
    if (navbarContainer) {
        navbarContainer.innerHTML = createNavbar(options);
        
        if (options.currentPage) {
            setActiveNavItem(options.currentPage);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createNavbar, initNavbar, updateCartCount, setActiveNavItem };
}