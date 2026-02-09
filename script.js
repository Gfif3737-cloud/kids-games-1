const game = document.getElementById("game");

function showPairs() {
  game.innerHTML = `
    <h2>🔴 Линия памяти</h2>
    <p>Выбери персонажей:</p>

    <button onclick="startMemory('smeshariki')">🌈 Смешарики</button>
    <button onclick="startMemory('fixiki')">🔧 Фиксики</button>
    <button onclick="startMemory('masha')">🐻 Маша и Медведь</button>
    <button onclick="startMemory('winnie')">🍯 Винни Пух</button>
    <button onclick="startMemory('prostokvashino')">🐶 Простоквашино</button>
  `;
}

function startMemory(type) {
  game.innerHTML = `
    <h3>🧠 Игра "Найди пару"</h3>
    <p>Персонажи: <b>${type}</b></p>
    <p>(Скоро здесь будет настоящая игра 😉)</p>
    <button onclick="showPairs()">⬅ Назад</button>
  `;
}

function showMaze() {
  game.innerHTML = `
    <h2>🔵 Линия лабиринта</h2>
    <p>Выбери персонажа:</p>

    <button onclick="startMaze('cheburashka')">🍊 Чебурашка → апельсин</button>
    <button onclick="startMaze('pin')">🤖 Пин → Биби</button>
    <button onclick="startMaze('matroskin')">🐱 Матроскин → Мурка</button>
    <button onclick="startMaze('masha')">🏠 Маша → к Мишке</button>
  `;
}

function startMaze(type) {
  game.innerHTML = `
    <h3>🧩 Лабиринт</h3>
    <p>Персонаж: <b>${type}</b></p>
    <p>(Скоро будет управляемый лабиринт 😉)</p>
    <button onclick="showMaze()">⬅ Назад</button>
  `;
}
