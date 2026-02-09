const game = document.getElementById("game");

function showMenu() {
  game.innerHTML = `
    <h2>🧠 Линия памяти</h2>
    <p>Выбери персонажей:</p>
    <button onclick="startMemory('smeshariki')">🌈 Смешарики</button>
    <button onclick="startMemory('fixiki')">🔧 Фиксики</button>
    <button onclick="startMemory('masha')">🐻 Маша и Медведь</button>
    <button onclick="startMemory('pooh')">🍯 Винни Пух</button>
    <button onclick="startMemory('prostokvashino')">🐱 Простоквашино</button>
  `;
}

function startMemory(theme) {
  game.innerHTML = `
    <h2>🎮 Игра запущена!</h2>
    <p>Тема: <b>${theme}</b></p>
    <p>Скоро здесь будет настоящая игра 😎</p>
    <button onclick="showMenu()">⬅ Назад</button>
  `;
}

function showMazeMenu() {
  game.innerHTML = `
    <h2>🌀 Линия лабиринта</h2>
    <p>Выбери персонажа:</p>
    <button onclick="startMaze('cheburashka')">🍊 Чебурашка → апельсин</button>
    <button onclick="startMaze('pin')">🤖 Пин → Биби</button>
    <button onclick="startMaze('matroskin')">🐱 Матроскин → Мурка</button>
    <button onclick="startMaze('masha')">🏠 Маша → Мишка</button>
  `;
}

function startMaze(hero) {
  game.innerHTML = `
    <h2>🚇 Лабиринт</h2>
    <p>Персонаж: <b>${hero}</b></p>
    <p>Скоро здесь будет управление 🎮</p>
    <button onclick="showMazeMenu()">⬅ Назад</button>
  `;
}
    
