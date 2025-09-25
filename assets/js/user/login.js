// ===================================================================
// УПРАВЛІННЯ ВХОДОМ КОРИСТУВАЧА В АКАУНТ
// ===================================================================
// Відповідає за перевірку даних користувача, вхід в акаунт

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var user = localStorage.getItem(username);

    if (user) {
        var parseUser = JSON.parse(user);
        if(parseUser.password === password) {
            localStorage.setItem("user", JSON.stringify(parseUser));
                    
            if (window.onUserLogin) {
                window.onUserLogin();
            }
                    
            alert("Ласкаво просимо, " + parseUser.name + "!");
            window.location.href = "account.html";
        }else {
            alert("Неправильний пароль");
        }
    }else {
        alert("Користувача не знайдено");
    }
});