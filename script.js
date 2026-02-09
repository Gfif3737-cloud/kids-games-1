const game = document.getElementById("game");

/* ---------- ГЛАВНОЕ МЕНЮ ---------- */
function showPairs() {
  game.innerHTML = `
    <h2>🔴 Линия памяти</h2>
    <p>Выбери персонажей:</p>

    <button onclick="startMemory('Смешарики')">🌈 Смешарики</button>
    <button onclick="startMemory('Фиксики')">🔧 Фиксики</button>
    <button onclick="startMemory('Маша и Медведь')">🐻 Маша и Медведь</button>
    <button onclick="startMemory('Винни Пух')">🍯 Винни Пух</button>
    <button onclick="startMemory('Простоквашино')">🐶 Простоквашино</button>
  `;
}

function startMemory(name) {
  game.innerHTML = `
    <h3>🧠 Игра "Найди пару"</h3>
    <p>Персонажи: <b>${name}</b></p>
    <p>(Скоро здесь будет настоящая игра 😉)</p>
    <button onclick="showPairs()">⬅ Назад</button>
  `;
}

/* ---------- ЛАБИРИНТ ---------- */
function showMaze() {
  game.innerHTML = `
    <h2>🔵 Линия лабиринта</h2>
    <p>Выбери персонажа:</p>

    <button onclick="startMaze('🍊', 'Чебурашка')">🍊 Чебурашка → апельсин</button>
    <button onclick="startMaze('🤖', 'Пин')">🤖 Пин → Биби</button>
    <button onclick="startMaze('🐮', 'Матроскин')">🐱 Матроскин → Мурка</button>
    <button onclick="startMaze('🏠', 'Маша')">👧 Маша → Мишке</button>
  `;
}

let player = { x: 0, y: 0 };
let goal = { x: 4, y: 4 };
let playerEmoji = "🙂";

function startMaze(goalEmoji, heroName) {
  player = { x: 0, y: 0 };
  playerEmoji = heroName === "Чебурашка" ? "🐻" :
                heroName === "Пин" ? "🐧" :
                heroName === "Матроскин" ? "🐱" : "👧";

  game.innerHTML = `
    <h3>🧩 ${heroName} в лабиринте</h3>
    <p>Дойди до ${goalEmoji}</p>

    <div id="maze"></div>

    <div class="controls">
      <button onclick="move(0,-1)">⬆</button>
      <div>
        <button onclick="move(-1,0)">⬅</button>
        <button onclick="move(1,0)">➡</button>
      </div>
      <button onclick="move(0,1)">⬇</button>
    </div>

    <br>
    <button onclick="showMaze()">⬅ Назад</button>
  `;

  drawMaze(goalEmoji);
}

function drawMaze(goalEmoji) {
  const maze = document.getElementById("maze");
  let html = "";

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (x === player.x && y === player.y) html += playerEmoji;
      else if (x === goal.x && y === goal.y) html += goalEmoji;
      else html += "⬜";
    }
    html += "<br>";
  }

  maze.innerHTML = html;
}

function move(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
    player.x = nx;
    player.y = ny;
    drawMaze("🎯");

    if (player.x === goal.x && player.y === goal.y) {
      setTimeout(() => alert("🎉 Молодец! Ты дошёл!"), 100);
    }
  }
}