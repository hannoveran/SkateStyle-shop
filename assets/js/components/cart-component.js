// ===================================================================
// КОМПОНЕНТ КОШИКА ПОКУПОК
// ===================================================================
// Управляє додаванням/видаленням товарів, збереженням стану,
// синхронізацією між гостями та користувачами


class CartComponent {
    constructor() {
        this.cart = [];
        this.products = [];
        this.isProcessing = false;
        
        this.cartTab = null;
        this.listCartHTML = null;
        this.cartCounter = null;
        
        this.addToCart = this.addToCart.bind(this);
        this.toggleCart = this.toggleCart.bind(this);
        this.closeCart = this.closeCart.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);
        this.proceedToCheckout = this.proceedToCheckout.bind(this);
        
        this.init();
    }

    init() {
        this.createCartHTML();
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.loadProducts();
    }
    
    // Створення HTML структури кошика
    createCartHTML() {
        if (document.querySelector('.cartTab')) {
            this.cartTab = document.querySelector('.cartTab');
            this.listCartHTML = this.cartTab.querySelector('.listCart');
            this.cartCounter = document.querySelector('.cart span');
            return;
        }
        
        const cartHTML = `
            <div class="cartTab">
                <h1>Кошик</h1>
                <div class="listCart">
                    <div class="empty-cart">
                        <p>Ваш кошик порожній</p>
                    </div>
                </div>
                <div class="btn">
                    <button class="close">Закрити</button>
                    <button class="checkOut">Оформити замовлення</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', cartHTML);
        
        this.cartTab = document.querySelector('.cartTab');
        this.listCartHTML = this.cartTab.querySelector('.listCart');
        this.cartCounter = document.querySelector('.cart span');
    }
    
    // Налаштування обробників подій
    setupEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('addCart')) {
                event.preventDefault();
                event.stopPropagation();
                
                const productCard = event.target.closest('[data-id]');
                if (productCard) {
                    const productId = productCard.dataset.id;
                    this.addToCart(productId);
                }
            }
        });
        
        if (this.listCartHTML) {
            this.listCartHTML.addEventListener('click', (event) => {
                const positionClick = event.target;
                const productId = positionClick.closest('.item')?.dataset.id;
                
                if (!productId) return;
                
                if (positionClick.classList.contains('plus')) {
                    this.changeQuantity(productId, 'plus');
                } else if (positionClick.classList.contains('minus')) {
                    this.changeQuantity(productId, 'minus');
                }
            });
        }
        
        this.cartTab.querySelector('.close').addEventListener('click', this.closeCart);
        this.cartTab.querySelector('.checkOut').addEventListener('click', this.proceedToCheckout);
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'user') {
                if (e.newValue) {
                    this.transferGuestCartToUser();
                } else {
                    this.clearCartOnLogout();
                }
                this.updateCartHTML();
            }
        });
    }
    
    // Завантаження товарів
    async loadProducts() {
        try {
            const response = await fetch('/assets/js/data/products.json');
            this.products = await response.json();
            
            this.transferGuestCartToUser();
            this.updateCartHTML();
        } catch (error) {
            console.error('Помилка завантаження товарів:', error);
        }
    }
    
    // Функції для роботи з користувачами
    getCurrentUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    
    getUserCartKey() {
        const user = this.getCurrentUser();
        return user ? `cart_${user.username}` : 'cart_guest';
    }
    
    isUserLoggedIn() {
        return this.getCurrentUser() !== null;
    }
    
    // Функції для роботи з кошиком
    loadCartFromStorage() {
        const cartKey = this.getUserCartKey();
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        } else {
            this.cart = [];
        }
    }
    
    saveCartToStorage() {
        const cartKey = this.getUserCartKey();
        localStorage.setItem(cartKey, JSON.stringify(this.cart));
    }
    
    addToCart(productId) {
        if (this.isProcessing) {
            console.log('Додавання до кошику...');
            return;
        }
        
        this.isProcessing = true;
        
        const product = this.products.find(p => p.id == productId);
        if (!product) {
            this.isProcessing = false;
            return;
        }
        
        const positionInCart = this.cart.findIndex((item) => item.productId === productId);
        
        if (positionInCart === -1) {
            this.cart.push({ productId, quantity: 1 });
        } else {
            this.cart[positionInCart].quantity += 1;
        }
        
        
        this.updateCartHTML();
        this.saveCartToStorage();
        this.showNotification(`${product.name} додано до кошика!`);
        
        setTimeout(() => {
            this.isProcessing = false;
        }, 500);
    }
    
    changeQuantity(productId, type) {
        const index = this.cart.findIndex((item) => item.productId == productId);
        if (index >= 0) {
            if (type === 'plus') {
                this.cart[index].quantity++;
            } else {
                this.cart[index].quantity--;
                if (this.cart[index].quantity <= 0) {
                    this.cart.splice(index, 1);
                }
            }
            
            this.updateCartHTML();
            this.saveCartToStorage();
        }
    }
    
    removeFromCart(productId) {
        const index = this.cart.findIndex((item) => item.productId == productId);
        if (index >= 0) {
            const product = this.products.find(p => p.id == productId);
            this.cart.splice(index, 1);
            
            this.updateCartHTML();
            this.saveCartToStorage();
            
            if (product) {
                this.showNotification(`${product.name} видалено з кошика`);
            }
        }
    }
    
    clearCart() {
        this.cart = [];
        this.updateCartHTML();
        this.saveCartToStorage();
        this.showNotification('Кошик очищено');
    }
    
    updateCartHTML() {
        if (!this.listCartHTML) return;
        
        this.listCartHTML.innerHTML = '';
        
        let totalQuantity = 0;
        let totalPrice = 0;
        
        if (this.cart.length === 0) {
            this.listCartHTML.innerHTML = `
                <div class="empty-cart">
                    <p>Ваш кошик порожній</p>
                    ${!this.isUserLoggedIn() ? '<p><small>Увійдіть в акаунт, щоб зберегти ваші товари</small></p>' : ''}
                </div>
            `;
            if (this.cartCounter) this.cartCounter.innerText = '0';
            return;
        }
        
        this.cart.forEach(cartItem => {
            totalQuantity += cartItem.quantity;
            
            const product = this.products.find(p => p.id == cartItem.productId);
            if (product) {
                const itemPrice = parseInt(product.price) * cartItem.quantity;
                totalPrice += itemPrice;
                
                const item = document.createElement('div');
                item.classList.add('item');
                item.dataset.id = cartItem.productId;
                item.innerHTML = `
                    <div class="image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="name">${product.name}</div>
                    <div class="totalPrice">${itemPrice} грн</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${cartItem.quantity}</span>
                        <span class="plus">+</span>
                    </div>
                `;
                this.listCartHTML.appendChild(item);
            }
        });
        
        if (this.cart.length > 0) {
            const summaryDiv = document.createElement('div');
            summaryDiv.classList.add('cart-summary');
            summaryDiv.innerHTML = `
                <div class="total-info">
                    <div class="total-price">Загалом: ${totalPrice} грн</div>
                    ${!this.isUserLoggedIn() ? '<p class="login-reminder"><small><a href="/pages/user/login.html">Увійдіть</a> для збереження замовлення</small></p>' : ''}
                </div>
            `;
            this.listCartHTML.appendChild(summaryDiv);
        }
        
        if (this.cartCounter) {
            this.cartCounter.innerText = totalQuantity.toString();
        }

    }

    toggleCart(event) {
        event.preventDefault();
        document.body.classList.toggle('showCart');
    }
    
    closeCart() {
        document.body.classList.remove('showCart');
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.opacity = '1', 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Функції для авторизації
    transferGuestCartToUser() {
        const guestCart = localStorage.getItem('cart_guest');
        
        if (guestCart && this.isUserLoggedIn()) {
            const user = this.getCurrentUser();
            const userCartKey = `cart_${user.username}`;
            
            const existingUserCart = localStorage.getItem(userCartKey);
            
            if (!existingUserCart) {
                localStorage.setItem(userCartKey, guestCart);
            } else {
                const guestCartItems = JSON.parse(guestCart);
                const userCartItems = JSON.parse(existingUserCart);
                
                guestCartItems.forEach(guestItem => {
                    const existingIndex = userCartItems.findIndex(item => item.productId === guestItem.productId);
                    
                    if (existingIndex === -1) {
                        userCartItems.push(guestItem);
                    } else {
                        userCartItems[existingIndex].quantity += guestItem.quantity;
                    }
                });
                
                localStorage.setItem(userCartKey, JSON.stringify(userCartItems));
            }
            
            localStorage.removeItem('cart_guest');
            this.loadCartFromStorage();
            this.updateCartHTML();
        }
    }
    
    clearCartOnLogout() {
        if (this.cart.length > 0 && this.isUserLoggedIn()) {
            localStorage.setItem('cart_guest', JSON.stringify(this.cart));
        }
        
        this.cart = [];
        this.updateCartHTML();
    }
    
    proceedToCheckout() {
        if (!this.isUserLoggedIn()) {
            if (confirm('Для оформлення замовлення потрібно увійти в акаунт. Перейти до входу?')) {
                window.location.href = 'login.html';
            }
            return;
        }
        
        if (this.cart.length === 0) {
            alert('Ваш кошик порожній!');
            return;
        }
        
        window.location.href = '/pages/checkout.html';
    }
    
    saveOrder() {
        const user = this.getCurrentUser();
        if (!user) return;
        
        const order = {
            id: Date.now(),
            username: user.username,
            items: [...this.cart],
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        const ordersKey = `orders_${user.username}`;
        const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        existingOrders.push(order);
        localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
        
    }
    
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    getCartItems() {
        return this.cart;
    }
    
    getCartTotal() {
        return this.cart.reduce((total, cartItem) => {
            const product = this.products.find(p => p.id == cartItem.productId);
            return product ? total + (parseInt(product.price) * cartItem.quantity) : total;
        }, 0);
    }
    
    onUserLogin() {
        this.transferGuestCartToUser();
        this.updateCartHTML();
    }
    
    onUserLogout() {
        this.clearCartOnLogout();
    }
}

// Експорт для використання в інших файлах
window.CartComponent = CartComponent;