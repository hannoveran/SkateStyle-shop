// ===================================================================
// УПРАВЛІННЯ РЕЄСТРАЦІЄЮ КОРИСТУВАЧА
// ===================================================================
// Відповідає за перевірку правильності даних, реєстрацію

document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("name").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword) {
        alert("Паролі не співпадають");
        return;
    }

    if (localStorage.getItem(username)) {
        alert("Користувач з таким ім'ям вже існує");
        return;
    }

    const user = {
        name: name,
        username: username,
        email: email,
        password: password,
        registrationDate: new Date().toISOString()
    };

    localStorage.setItem(username, JSON.stringify(user));
    alert("Реєстрація успішна! Тепер ви можете увійти.");
    window.location.href = "login.html";
});