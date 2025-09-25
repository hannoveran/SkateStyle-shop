
let cartComponent = null;

function initCart() {
    if (!cartComponent) {
        cartComponent = new CartComponent();
        
        window.toggleCart = cartComponent.toggleCart;
        window.closeCart = cartComponent.closeCart;
        window.addToCart = cartComponent.addToCart;
        window.proceedToCheckout = cartComponent.proceedToCheckout;
        
        window.onUserLogin = cartComponent.onUserLogin;
        window.onUserLogout = cartComponent.onUserLogout;
    }
    
    return cartComponent;
}

function getCartInstance() {
    return cartComponent || initCart();
}

function getCartCount() {
    const cart = getCartInstance();
    return cart.getCartCount();
}

function updateCartCounter() {
    const cart = getCartInstance();
    const counter = document.querySelector('.cart span') || document.getElementById('cart-counter');
    
    if (counter) {
        counter.innerText = cart.getCartCount().toString();
    }
}

window.initCart = initCart;
window.getCartInstance = getCartInstance;
window.getCartCount = getCartCount;
window.updateCartCounter = updateCartCounter;