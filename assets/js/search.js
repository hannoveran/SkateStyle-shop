// ===================================================================
// УПРАВЛІННЯ ПОШУКОМ 
// ===================================================================
// Відповідає за відображення вкладки пошуку

function toggleSearch(event) {
    event.preventDefault();
    document.body.classList.toggle('showSearch');
}

function closeSearch() {
    document.body.classList.remove('showSearch');
}

const listSearch = document.querySelector('.listSearch');
const productTemplate = document.querySelector('#product-template');
const search = document.querySelector('#search');

let products = [];

search.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    products.forEach(product => {
        const isVisible = product.name.toLowerCase().includes(value);
        product.element.classList.toggle("hide", !isVisible);
    }) 
});

fetch(`./assets/js/data/products.json`)
    .then(res => res.json())
    .then(data => {
        listSearch.innerHTML = '';
        
        products = data.map(product => {
            const itemSearch = productTemplate.content.cloneNode(true);
            
            // Дані товару
            itemSearch.querySelector('.image img').src = product.image;
            itemSearch.querySelector('.image img').alt = product.name;
            itemSearch.querySelector('.name').textContent = product.name;
            itemSearch.querySelector('.totalPrice').textContent = `${product.price} грн`;
            
            const searchItem = itemSearch.querySelector('.search-item');
            
            const linkElement = document.createElement('a');
            linkElement.href = `product.html?id=${product.id}&category=${product.category}`;
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
            }
        });
    })
    .catch(error => {
        console.error('Помилка завантаження товарів:', error);
    });