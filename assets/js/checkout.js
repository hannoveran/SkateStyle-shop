// ===================================================================
// УПРАВЛІННЯ СТОРІНКОЮ ОФОРМЛЕННЯ ЗАМОВЛЕННЯ 
// ===================================================================
// Відповідає за відображення товарів з кошику

let listCart = [];
let products = [];

// Функції для роботи з користувачами 
function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function getUserCartKey() {
    const user = getCurrentUser();
    return user ? `cart_${user.username}` : 'cart_guest';
}

function isUserLoggedIn() {
    return getCurrentUser() !== null;
}

function cleanCartData(cartData) {
    if (!Array.isArray(cartData)) return [];
    
    return cartData.filter(item => {
        return item && 
               item.productId && 
               (typeof item.productId === 'string' || typeof item.productId === 'number') &&
               item.quantity && 
               item.quantity > 0;
    });
}

function loadCartData() {
    const cartKey = getUserCartKey();
    const cartData = localStorage.getItem(cartKey);
    
    if (!cartData || cartData === '[]') {
        document.querySelector('.returnCart .list').innerHTML = '<p>Кошик порожній</p>';
        document.querySelector('.totalQuantity').innerText = '0';
        document.querySelector('.totalPrice').innerText = '0 грн';
        return;
    }

    try {
        const rawCartData = JSON.parse(cartData);
        listCart = cleanCartData(rawCartData);
        
        if (listCart.length === 0) {
            document.querySelector('.returnCart .list').innerHTML = '<p>Кошик порожній або містить некоректні дані</p>';
            document.querySelector('.totalQuantity').innerText = '0';
            document.querySelector('.totalPrice').innerText = '0 грн';
            return;
        }
    } catch (error) {
        console.error('Помилка парсингу даних кошика:', error);
        document.querySelector('.returnCart .list').innerHTML = '<p>Помилка завантаження кошика</p>';
        return;
    }

    fetch('/assets/js/data/products.json')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(result => {
            products = result;
            renderCart();
        })
        .catch(err => {
            console.error('Помилка при завантаженні товарів:', err);
            document.querySelector('.returnCart .list').innerHTML = '<p>Помилка завантаження товарів</p>';
        });
}

function renderCart() {
    const listCartHTML = document.querySelector('.returnCart .list');
    const totalQuantityHTML = document.querySelector('.totalQuantity');
    const totalPriceHTML = document.querySelector('.wholePrice');

    if (!listCartHTML || !totalQuantityHTML || !totalPriceHTML) {
        console.error('Не знайдено необхідні елементи DOM');
        return;
    }

    listCartHTML.innerHTML = '';

    let totalQuantity = 0;
    let totalPrice = 0;

    if (!listCart || listCart.length === 0) {
        listCartHTML.innerHTML = '<p>Кошик порожній</p>';
        totalQuantityHTML.innerText = '0';
        totalPriceHTML.innerText = '0 грн';
        return;
    }

    listCart.forEach(cartItem => {
        
        if (!cartItem.productId) {
            console.warn('Товар без productId:', cartItem);
            return; 
        }
        
        const product = products.find(p => {
            if (!p || !p.id) return false;
            
            return (
                p.id.toString() === cartItem.productId.toString() ||
                p.id === cartItem.productId ||
                p.id === parseInt(cartItem.productId)
            );
        });
        
        if (product) {
            
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                <div class="info">
                    <div class="name">${product.name}</div>
                    <div class="price">${product.price} грн / 1 товар</div>
                </div>
                <div class="quantity">${cartItem.quantity || 1}</div>
                <div class="returnPrice">${parseInt(product.price) * (cartItem.quantity || 1)} грн</div>
            `;
            listCartHTML.appendChild(item);

            totalQuantity += cartItem.quantity || 1;
            totalPrice += parseInt(product.price) * (cartItem.quantity || 1);
        } else {
            console.warn('Товар не знайдено для ID:', cartItem.productId);
            
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <div style="color: red; padding: 10px;">
                    <div class="info">
                        <div class="name">Товар не знайдено (ID: ${cartItem.productId})</div>
                        <div class="price">Помилка</div>
                    </div>
                    <div class="quantity">${cartItem.quantity || 1}</div>
                    <div class="returnPrice">— грн</div>
                </div>
            `;
            listCartHTML.appendChild(item);
        }
    });

    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = `${totalPrice} грн`;
    
}

// Функція для оновлення відображення при зміні користувача
function refreshCartDisplay() {
    loadCartData();
}

window.addEventListener('storage', function(e) {
    if (e.key === 'user') {
        setTimeout(refreshCartDisplay, 100); 
    }
});

window.addEventListener('storage', function(e) {
    if (e.key && (e.key.startsWith('cart_') || e.key === 'cart_guest')) {
        loadCartData();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
});

loadCartData();



