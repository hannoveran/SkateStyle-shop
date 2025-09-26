// ===================================================================
// УПРАВЛІННЯ СТОРІНКОЮ КАТЕГОРІЙ ТОВАРІВ (жіночий одяг, чоловічий одяг, ковзани, аксесуари) 
// ===================================================================
// Відповідає за відображення інформації про товари та фільтрів


const categoryNamesUa = {
    skates: 'Ковзани',
    accessories: 'Аксесуари', 
    women: 'Жіночий одяг',
    men: 'Чоловічий одяг'
};

const filtersConfig = {
    women: {
        'Розмір': ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
        'Колір': ['Чорний', 'Білий', 'Червоний', 'Синій', 'Блакитний', 'Зелений', 'Жовтий', 'Рожевий', 'Фіолетовий', 'Бірюзовий'],
        'Бренд': ['ProFigure', 'FigureSkate', 'IceQueen', 'Elegance'],
        'Країна': ['Україна', 'Італія', 'США', 'Китай']
    },
    men: {
        'Розмір': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'Колір': ['Чорний', 'Білий', 'Сірий', 'Синій', 'Темно-синій'],
        'Бренд': ['MenSkate', 'IceMaster', 'ProFigure'],
        'Країна': ['Україна', 'Італія', 'США', 'Китай']
    },
    skates: {
        'Розмір': ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
        'Бренд': ['Bauer', 'CCM', 'Jackson', 'Riedell', 'Graf'],
        'Країна': ['Канада', 'США', 'Чехія', 'Китай']
    },
    accessories: {
        'Колір': ['Рожевий', 'Блакитний', 'Фіолетовий', 'Чорний', 'Білий', 'Синій', 'Жовтий'],
        'Бренд': ['Universal', 'ProCare', 'SkateGuard', 'Transpack', 'EDEA', 'Tolbi'],
        'Країна': ['Україна', 'США', 'Китай', 'Канада', 'Італія']
    }
};

let categoryProducts = [];
let currentCategory = '';

function getCurrentCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = window.location.hash;
    
    let cat = urlParams.get('category') || urlParams.get('type');
    
    if (!cat && hashParams) {
        const match = hashParams.match(/type=([^&]+)/);
        cat = match ? match[1] : null;
    }
    
    return cat;
}

// Відображення товарів
function displayProductsList(products) {
    const productList = document.getElementById('product-list');
    
    if (!productList) {
        console.error('Елемент product-list не знайдено');
        return;
    }

    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p>Товари за вашими критеріями не знайдені</p>';
        return;
    }

    products.forEach(item => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <a href="product.html?id=${item.id}&category=${currentCategory}">
                <div class="img-container"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>
                <h3>${item.name}</h3>
                <p class="price">${item.price} грн</p>
                <p class="description">${item.description ? item.description.substring(0, 100) + '...' : 'Опис відсутній'}</p>
            </a>
            <button class="addCart" data-id="${item.id}">Додати до кошика</button>
        `;
        
        productList.appendChild(productCard);
    });
    
}

// Застосування фільтрів
function applyProductFilters() {
    const selectedFilters = {};
    
    document.querySelectorAll('#filters input[type="checkbox"]:checked').forEach(checkbox => {
        const filterName = checkbox.name;
        if (!selectedFilters[filterName]) {
            selectedFilters[filterName] = [];
        }
        selectedFilters[filterName].push(checkbox.value);
    });

    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const minPrice = minPriceInput ? (parseFloat(minPriceInput.value) || 0) : 0;
    const maxPrice = maxPriceInput ? (parseFloat(maxPriceInput.value) || Infinity) : Infinity;

    const filteredProducts = categoryProducts.filter(product => {
        for (const filterName in selectedFilters) {
            const filterValues = selectedFilters[filterName];
            let productValue = '';
            
            switch(filterName.toLowerCase()) {
                case 'розмір':
                    productValue = product.sizes || [];
                    break;
                case 'колір':
                    productValue = product.colors || [];
                    break;
                case 'бренд':
                    productValue = product.brand || '';
                    break;
                case 'матеріал':
                    productValue = product.material || '';
                    break;
                case 'країна':
                    productValue = product.countryOfOrigin || '';
                    break;
                case 'тип':
                    productValue = product.type || '';
                    break;
            }

            if (Array.isArray(productValue)) {
                const hasMatch = filterValues.some(filterValue => 
                    productValue.includes(filterValue)
                );
                if (!hasMatch) return false;
            } else {
                if (!filterValues.includes(productValue)) return false;
            }
        }

        const productPrice = parseFloat(product.price) || 0;
        if (productPrice < minPrice || productPrice > maxPrice) {
            return false;
        }

        return true;
    });

    displayProductsList(filteredProducts);
    updateResetButtonVisibility();
}

// Кнопка скидання фільтрів
function updateResetButtonVisibility() {
    const resetButton = document.getElementById('reset-filters');
    if (!resetButton) return;

    const hasActiveFilters = document.querySelectorAll('#filters input[type="checkbox"]:checked').length > 0 ||
                           (document.getElementById('min-price') && document.getElementById('min-price').value) ||
                           (document.getElementById('max-price') && document.getElementById('max-price').value);
    
    resetButton.style.display = hasActiveFilters ? 'inline-block' : 'none';
}

// Створення фільтрів
function createFiltersForCategory(category) {
    const filtersContainer = document.getElementById('filters');
    if (!filtersContainer) {
        console.error('Елемент filters не знайдено');
        return;
    }

    filtersContainer.innerHTML = '';
    
    const config = filtersConfig[category];
    if (!config) {
        console.log('Конфігурація фільтрів для категорії не знайдена:', category);
        return;
    }

    Object.entries(config).forEach(([filterName, options]) => {
        const filterGroup = document.createElement('div');
        filterGroup.className = 'filter-group';
        
        const filterTitle = document.createElement('h4');
        filterTitle.textContent = filterName;
        filterGroup.appendChild(filterTitle);

        options.forEach(option => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = filterName;
            checkbox.value = option;
            checkbox.addEventListener('change', applyProductFilters);
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + option));
            filterGroup.appendChild(label);
        });

        filtersContainer.appendChild(filterGroup);
    });

    const priceGroup = document.createElement('div');
    priceGroup.className = 'filter-group';
    priceGroup.innerHTML = `
        <h4>Ціна</h4>
        <div>
            <input type="number" id="min-price" placeholder="Ціна від" style="width: 80px; margin-right: 5px;">
            <input type="number" id="max-price" placeholder="Ціна до" style="width: 80px; margin: 0 5px;">
        </div>
    `;
    filtersContainer.appendChild(priceGroup);

    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    if (minPriceInput) minPriceInput.addEventListener('input', applyProductFilters);
    if (maxPriceInput) maxPriceInput.addEventListener('input', applyProductFilters);

    const applyButton = document.createElement('button');
    applyButton.id = 'apply-filters';
    applyButton.textContent = 'Застосувати фільтри';
    applyButton.addEventListener('click', applyProductFilters);
    filtersContainer.appendChild(applyButton);

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-filters';
    resetButton.textContent = 'Скинути фільтри';
    resetButton.style.display = 'none';
    resetButton.addEventListener('click', resetAllFilters);
    filtersContainer.appendChild(resetButton);

}

// Скидання фільтрів
function resetAllFilters() {
    document.querySelectorAll('#filters input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    applyProductFilters();
}

function isCategoryPage() {
    const hasCategory = getCurrentCategoryFromUrl();
    const isCategoryFile = window.location.pathname.includes('category') || 
                          window.location.pathname.includes('products') ||
                          document.querySelector('#filters') !== null; 
    
    return hasCategory || isCategoryFile;
}

function initializePage() {
    if (!isCategoryPage()) {
        return;
    }

    currentCategory = getCurrentCategoryFromUrl();
    
    if (!currentCategory || !categoryNamesUa[currentCategory]) {
        const productList = document.getElementById('product-list');
        if (productList) {
            productList.innerHTML = '<h2>Категорія не знайдена</h2><p>Перевірте правильність URL</p>';
        }
        return;
    }

    const pageTitle = categoryNamesUa[currentCategory];
    document.title = `Категорія: ${pageTitle}`;
    
    const h1Element = document.querySelector('h1');
    if (h1Element) {
        h1Element.textContent = pageTitle;
    }

    
    // Завантаження товарів
    fetch(`./assets/js/data/products.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(allProducts => {
            
            // Фільтр товарів за категорією
            categoryProducts = allProducts.filter(product => product.category === currentCategory);

            if (categoryProducts.length === 0) {
                const productList = document.getElementById('product-list');
                if (productList) {
                    productList.innerHTML = '<p>У цій категорії поки немає товарів</p>';
                }
                return;
            }

            displayProductsList(categoryProducts);
            createFiltersForCategory(currentCategory);
        })
        .catch(error => {
            console.error('Помилка завантаження товарів:', error);
            const productList = document.getElementById('product-list');
            if (productList) {
                productList.innerHTML = '<h2>Помилка завантаження товарів</h2><p>Спробуйте оновити сторінку</p>';
            }
        });
}

window.addEventListener('popstate', initializePage);
window.addEventListener('hashchange', initializePage);


// Запуск
document.addEventListener('DOMContentLoaded', initializePage);





