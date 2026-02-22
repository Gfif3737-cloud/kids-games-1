// ==================== СИСТЕМА АВТОРИЗАЦИИ ====================
const users = JSON.parse(localStorage.getItem("metro_users")) || {};
let currentUser = JSON.parse(localStorage.getItem("metro_current_user")) || null;

// Элементы
const loginContainer = document.getElementById("login-container");
const gameMenu = document.getElementById("game-menu");
const hint = document.getElementById("hint");
const userDisplay = document.getElementById("user-display");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");

// Обновление интерфейса
function updateUI() {
  if (currentUser) {
    loginContainer.style.display = "none";
    gameMenu.style.display = "flex";
    hint.style.display = "block";
    userDisplay.textContent = `👤 ${currentUser}`;
    logoutBtn.style.display = "block";
  } else {
    loginContainer.style.display = "block";
    gameMenu.style.display = "none";
    hint.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

// Регистрация
function register() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!username || !password) {
    alert("Введите имя и пароль!");
    return;
  }
  
  if (users[username]) {
    alert("Пользователь уже существует!");
    return;
  }
  
  users[username] = { password: password };
  localStorage.setItem("metro_users", JSON.stringify(users));
  alert("Регистрация успешна! Теперь войдите.");
}

// Вход
function login() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!username || !password) {
    alert("Введите имя и пароль!");
    return;
  }
  
  if (!users[username] || users[username].password !== password) {
    alert("Неверное имя или пароль!");
    return;
  }
  
  currentUser = username;
  localStorage.setItem("metro_current_user", JSON.stringify(currentUser));
  updateUI();
}

// Выход
function logout() {
  currentUser = null;
  localStorage.removeItem("metro_current_user");
  updateUI();
}

// Слушатели
loginBtn.addEventListener("click", login);
registerBtn.addEventListener("click", register);
logoutBtn.addEventListener("click", logout);

// Запуск
updateUI();