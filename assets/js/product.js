// ===================================================================
// УПРАВЛІННЯ СТОРІНКОЮ ПРОДУКТУ 
// ===================================================================
// Відповідає за відображення продукту, інформації про нього, схожих продуктів
  
 
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

const productId = getProductIdFromUrl();
const category = getCategoryFromUrl();

if (!productId) {
    document.getElementById('product-container').innerHTML = '<h2>Товар не знайдено</h2><p>Відсутній ID товару в URL</p>';
    throw new Error('Відсутній ID товару');
}

const categoryNamesUa = {
    skates: 'Ковзани',
    accessories: 'Аксесуари',
    women: 'Жіночий одяг',
    men: 'Чоловічий одяг'
};
const basePath = window.location.pathname.includes('/pages/') ? '../' : './';
fetch(`${basePath}assets/js/data/products.json`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(allProducts => {
            
        const product = allProducts.find(item => item.id.toString() === productId.toString());
            
        if (!product) {
            console.error('Товар не знайдено з ID:', productId);
            document.getElementById('product-container').innerHTML = '<h2>Товар не знайдено</h2><p>Товар з таким ID не існує</p>';
            return;
        }

        const productCategory = product.category || category;
        const categoryName = categoryNamesUa[productCategory] || 'Товар';
        document.title = `${product.name} | ${categoryName}`;

        const productHTML = `
            <section class="main-description">
            <div class="product-images">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h1 class="product-name">${product.name}</h1>
                <div class="product-description">${product.description}</div>
                <p class="product-price">${product.price} грн</p>
                    
                <div class="product-options">
                    <h3>Розмір</h3>
                    <div class="size-options">
                        ${product.sizes && product.sizes.length > 0 ? 
                            product.sizes.map(size => 
                                `<div class="size-option" data-size="${size}">${size}</div>`
                            ).join('') : 
                            '<div class="size-option" data-size="OneSize">Один розмір</div>'
                        }
                    </div>
                        
                    ${product.colors && product.colors.length > 0 ? `
                    <h3>Колір</h3>
                    <div class="color-options">
                        ${product.colors.map(color => 
                            `<div class="color-option" data-color="${color}">${color}</div>`
                        ).join('')}
                    </div>` : ''}
                </div>
        
                <div class="quantity-selector">
                    <button id="decrease-qty">-</button>
                    <input id="quantity" value="1" min="1" max="10">
                    <button id="increase-qty">+</button>
                </div>
                    
                <div class="action-buttons">
                    <button class="add-to-cart">Додати до кошика</button>
                    <button class="buy-now">Купити зараз</button>
                </div>
            </div>
            </section>
                
            <div class="product-details">
                <h2>Характеристики товару</h2>
                <div class="product-details-content">
                    <div class="details-column">
                        <div class="detail-item">
                            <span>Категорія:</span> ${categoryName}
                        </div>
                        <div class="detail-item">
                            <span>Артикул:</span> ${product.id}
                        </div>
                        ${product.brand ? `
                        <div class="detail-item">
                            <span>Бренд:</span> ${product.brand}
                        </div>` : ''}
                        ${product.material ? `
                        <div class="detail-item">
                            <span>Матеріал:</span> ${product.material}
                        </div>` : ''}
                    </div>
                    <div class="details-column">
                        ${product.weight ? `
                        <div class="detail-item">
                            <span>Вага:</span> ${product.weight}
                        </div>` : ''}
                        ${product.warranty ? `
                        <div class="detail-item">
                            <span>Гарантія:</span> ${product.warranty}
                        </div>` : ''}
                        ${product.countryOfOrigin ? `
                        <div class="detail-item">
                            <span>Країна виробник:</span> ${product.countryOfOrigin}
                        </div>` : ''}
                    </div>
                </div>
            </div>
                
            <div class="related-products">
                <h2>Схожі товари</h2>
                <div class="related-products-container" id="related-products">
                    <!-- Схожі товари -->
                </div>
            </div>
        `;
            
        document.getElementById('product-container').innerHTML = productHTML;

        // Обробка вибору розміру та кольору
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Кнопки для вибору кількості
        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const quantityInput = document.getElementById('quantity');

        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', function() {
                if (parseInt(quantityInput.value) > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                }
            });

            increaseBtn.addEventListener('click', function() {
                if (parseInt(quantityInput.value) < 10) {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                }
            });
        }

        // Схожі товари з тієї ж категорії
        const relatedProducts = allProducts
            .filter(item => 
                item.id.toString() !== productId.toString() && 
                item.category === product.category
            )
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        const relatedHTML = relatedProducts.length > 0 ? 
            relatedProducts.map(item => `
                <div class="related-product-card">
                    <a href="product.html?id=${item.id}&category=${item.category}">
                        <img src="${item.image}" alt="${item.name}">
                        <h4>${item.name}</h4>
                        <p>${item.price} грн</p>
                    </a>
                </div>
            `).join('') : 
            '<p>Немає схожих товарів</p>';

        const relatedContainer = document.getElementById('related-products');
        if (relatedContainer) {
            relatedContainer.innerHTML = relatedHTML;
        }

        // Обробка додавання до кошика
        const addToCartBtn = document.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const selectedSize = document.querySelector('.size-option.selected')?.dataset.size || 
                                document.querySelector('.size-option')?.dataset.size;
                const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || 
                                    document.querySelector('.color-option')?.dataset.color;
                const quantity = quantityInput ? quantityInput.value : '1';
                    
                alert(`Товар додано до кошика!\nНазва: ${product.name}\nРозмір: ${selectedSize || 'Не вибрано'}\nКолір: ${selectedColor || 'Не вибрано'}\nКількість: ${quantity}`);
            });
        }

        const buyNowBtn = document.querySelector('.buy-now');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                const selectedSize = document.querySelector('.size-option.selected')?.dataset.size || 
                                document.querySelector('.size-option')?.dataset.size;
                const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || 
                                    document.querySelector('.color-option')?.dataset.color;
                const quantity = quantityInput ? quantityInput.value : '1';
                    
                alert(`Перехід до оформлення замовлення!\nНазва: ${product.name}\nРозмір: ${selectedSize || 'Не вибрано'}\nКолір: ${selectedColor || 'Не вибрано'}\nКількість: ${quantity}`);
            });
        }

        // Автоматично вибраний перший розмір та колір
        const firstSizeOption = document.querySelector('.size-option');
        if (firstSizeOption) firstSizeOption.classList.add('selected');
            
        const firstColorOption = document.querySelector('.color-option');
        if (firstColorOption) firstColorOption.classList.add('selected');

    })
    .catch(error => {
        console.error('Помилка завантаження товарів:', error);
        document.getElementById('product-container').innerHTML = `
            <h2>Помилка завантаження товару</h2>
            <p>Не вдалося завантажити дані товару. Спробуйте оновити сторінку.</p>
            <p>Деталі помилки: ${error.message}</p>
        `;
    });