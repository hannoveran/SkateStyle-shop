// ===================================================================
// КОМПОНЕНТ ПОШУКУ ТОВАРІВ
// ===================================================================
// Дозволяє пошук товарів


(function() {
    'use strict';
    
    function createSearchHTML() {
        const searchHTML = `
            <div class="searchTab">
                <h1>Пошук</h1>
                <input type="search" id="search">
                <div class="listSearch"></div>
                
                <!-- Template для товару -->
                <template id="product-template">
                    <div class="search-item">
                        <div class="image">
                            <img src="" alt="">
                        </div>
                        <div class="name"></div>
                        <div class="totalPrice"></div>
                    </div>
                </template>
                
                <div class="btn">
                    <button class="close" onclick="closeSearch()">Закрити</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', searchHTML);
    }
    
    function toggleSearch(event) {
        event.preventDefault();
        document.body.classList.toggle('showSearch');
    }
    
    function closeSearch() {
        document.body.classList.remove('showSearch');
    }
    
    function initSearchLogic() {
        const listSearch = document.querySelector('.listSearch');
        const productTemplate = document.querySelector('#product-template');
        const search = document.querySelector('#search');
        let products = [];
        
        if (!listSearch || !productTemplate || !search) {
            console.error('Елементи пошуку не знайдено');
            return;
        }
        
        search.addEventListener("input", e => {
            const value = e.target.value.toLowerCase();
            products.forEach(product => {
                const isVisible = product.name.toLowerCase().includes(value);
                product.element.classList.toggle("hide", !isVisible);
            });
        });
        
        const possiblePaths = [
            'assets/js/data/products.json',
            '/assets/js/data/products.json'
        ];
        
        async function loadProducts() {
            for (const path of possiblePaths) {
                try {
                    const response = await fetch(path);
                    if (response.ok) {
                        const data = await response.json();
                        processProducts(data);
                        return;
                    }
                } catch (error) {
                    console.log('Не вдалося завантажити з:', path);
                }
            }
            console.error('Не вдалося знайти products.json');
        }
        
        function processProducts(data) {
            listSearch.innerHTML = '';
            
            products = data.map(product => {
                const itemSearch = productTemplate.content.cloneNode(true);
                
                itemSearch.querySelector('.image img').src = product.image;
                itemSearch.querySelector('.image img').alt = product.name;
                itemSearch.querySelector('.name').textContent = product.name;
                itemSearch.querySelector('.totalPrice').textContent = `${product.price} грн`;
                
                const searchItem = itemSearch.querySelector('.search-item');
                
                const linkElement = document.createElement('a');
                
                const currentPath = window.location.pathname;
                const isInPages = currentPath.includes('/pages/');
                const productPath = isInPages ? 'product.html' : 'pages/product.html';
                
                linkElement.href = `${productPath}?id=${product.id}&category=${product.category}`;
                linkElement.className = 'search-item-link';
                
                linkElement.appendChild(searchItem);
                
                listSearch.appendChild(linkElement);
                
                return { 
                    image: product.image, 
                    name: product.name, 
                    price: product.price,
                    category: product.category,
                    id: product.id,
                    element: linkElement
                };
            });
        
        }
        
        loadProducts();
    }
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        if (document.querySelector('.searchTab')) {
            console.log('Пошук ініціалізовано');
            return;
        }
        
        createSearchHTML();
        
        setTimeout(() => {
            initSearchLogic();
        }, 100);
        
        window.toggleSearch = toggleSearch;
        window.closeSearch = closeSearch;
        
    }
    
    init();
    
})();