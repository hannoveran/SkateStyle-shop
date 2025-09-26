// ===================================================================
// УПРАВЛІННЯ ПОПУЛЯРНИМИ ТОВАРАМИ НА ГОЛОВНІЙ СТОРІНЦІ
// ===================================================================
// Відповідає за відображення популярних товарів

function loadPopularProducts() {
    const productsGrid = document.getElementById('popular-products-list');
    const basePath = window.location.pathname.includes('/pages/') ? '../' : './';
    fetch(`${basePath}assets/js/data/products.json`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(allProducts => {
            const popularProducts = allProducts
                .filter(product => product.popular === true || Math.random() > 0.7) 
                .sort(() => 0.5 - Math.random()) 
                .slice(0, 8); 

            if (popularProducts.length < 4) {
                popularProducts.push(...allProducts.slice(0, 8 - popularProducts.length));
            }

            const productsHTML = popularProducts.map((product, index) => `
                <div class="popular-product-card">
                    <a href="product.html?id=${product.id}&category=${product.category}">
                        <div class="popular-product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
                        <h3 class="popular-product-name">${product.name}</h3>
                        <p class="popular-product-price">${product.price} грн</p>
                    </a>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
                        Додати до кошика
                    </button>
                </div>
            `).join('');

            productsGrid.innerHTML = productsHTML;
        })
        .catch(error => {
            console.error('Помилка завантаження популярних товарів:', error);
            productsGrid.innerHTML = `
                <div class="error">
                    <h3>Помилка завантаження</h3>
                    <p>Не вдалося завантажити популярні товари. Спробуйте оновити сторінку.</p>
                </div>
            `;
        });
}

document.addEventListener('DOMContentLoaded', loadPopularProducts);