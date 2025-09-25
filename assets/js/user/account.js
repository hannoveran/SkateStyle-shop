// ===================================================================
// УПРАВЛІННЯ ОБЛІКОВИМ ЗАПИСОМ КОРИСТУВАЧА
// ===================================================================
// Відповідає за відображення інформації користувача, завантаження
// історії замовлень, обробку виходу з акаунта та видалення даних


function loadUserInfo() {
    var user = localStorage.getItem("user");
            
    if (user) {
        var parseUser = JSON.parse(user);
                
        document.getElementById("userSection").classList.remove("hidden");
        document.getElementById("guestSection").classList.add("hidden");
                
        document.getElementById("welcomeMessage").innerHTML = `Вітаємо, ${parseUser.name}!`;
        document.getElementById("userName").textContent = parseUser.name;
        document.getElementById("userUsername").textContent = parseUser.username;
        document.getElementById("userEmail").textContent = parseUser.email || 'Не вказано';
        document.getElementById("userRegDate").textContent = parseUser.registrationDate ? 
            new Date(parseUser.registrationDate).toLocaleDateString('uk-UA') : 'Не відомо';
                
        loadUserOrders(parseUser.username);
                
    } else {
        document.getElementById("guestSection").classList.remove("hidden");
        document.getElementById("userSection").classList.add("hidden");
        document.getElementById("welcomeMessage").innerHTML = 'Ласкаво просимо!';
    }
}

function loadUserOrders(username) {
    const ordersKey = `orders_${username}`;
    const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const ordersContainer = document.getElementById("userOrders");
            
    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>У вас поки немає замовлень</p>';
        return;
    }
            
    const ordersHTML = orders.map(order => `
        <div class="order-item">
            <h4>Замовлення #${order.id}</h4>
            <p><strong>Дата:</strong> ${new Date(order.date).toLocaleString('uk-UA')}</p>
            <p><strong>Статус:</strong> ${order.status === 'pending' ? 'Обробляється' : order.status}</p>
            <p><strong>Товарів:</strong> ${order.items.length}</p>
        </div>
    `).join('');
            
    ordersContainer.innerHTML = ordersHTML;
}

document.getElementById("logout").addEventListener("click", function() {
    if (confirm("Ви впевнені, що хочете вийти з акаунту?")) {
        if (window.onUserLogout) {
            window.onUserLogout();
        }
                
        localStorage.removeItem("user");
        alert("Ви вийшли з акаунту");
        window.location.href = "login.html";
    }
});

document.getElementById("clearData").addEventListener("click", function() {
    if (confirm("Ви впевнені, що хочете видалити всі свої дані? Це незворотна дія!")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            localStorage.removeItem(user.username);
            localStorage.removeItem(`cart_${user.username}`);
            localStorage.removeItem(`orders_${user.username}`);
            localStorage.removeItem("user");
                    
            alert("Всі ваші дані видалено");
            window.location.href = "index.html";
        }
    }
});

loadUserInfo();