const game = document.getElementById("game");

/* ======================
   ===== ЛИНИЯ ПАМЯТИ =====
   ====================== */

function showMemoryMenu() {
  game.innerHTML = `
    <h2>🔴 Линия памяти</h2>
    <p>Выбери персонажей</p>
    <button class="line red" onclick="startMemory('smeshariki')">Смешарики</button>
    <button class="line red" onclick="startMemory('fixiki')">Фиксики</button>
    <button class="line red" onclick="startMemory('masha')">Маша и Медведь</button>
    <button class="line red" onclick="startMemory('vinni')">Винни Пух</button>
    <button class="line red" onclick="startMemory('prostokvashino')">Простоквашино</button>
    <br>
    <p>Сложность</p>
    <button class="control-btn" onclick="startMemoryLevel(8)">8</button>
    <button class="control-btn" onclick="startMemoryLevel(12)">12</button>
    <button class="control-btn" onclick="startMemoryLevel(16)">16</button>
    <button class="control-btn" onclick="startMemoryLevel(20)">20</button>
  `;
}

let memoryTheme = "smeshariki";
let memoryCount = 12;

function startMemory(theme) {
  memoryTheme = theme;
}

function startMemoryLevel(count) {
  memoryCount = count;
  showMemoryGame();
}

function showMemoryGame() {
  game.innerHTML = `<h2>🧠 Найди пару</h2>`;
  
  const sets = {
    smeshariki: ["🐰 Крош", "🦔 Ёжик", "🐷 Нюша", "🐻 Копатыч", "🧠 Пин", "🐧 Лосяш", "🐦 Совунья", "🐑 Бараш", "🐢 Кар-Карыч", "🐮 Биби"],
    fixiki: ["🔧 Нолик", "⚙️ Симка", "🔌 Папус", "💡 Мася", "📺 Дедус", "🔋 Файер", "🧲 Игрек", "🛠 Шуруп"],
    masha: ["👧 Маша", "🐻 Медведь", "🐰 Заяц", "🐺 Волк", "🐯 Тигр", "🐼 Панда", "🐷 Поросёнок", "🦆 Утка"],
    vinni: ["🐻 Винни", "🐷 Пятачок", "🐯 Тигра", "🐴 Иа", "🐰 Кролик", "🦉 Сова", "🐦 Кенга", "🦘 Ру"],
    prostokvashino: ["🐱 Матроскин", "🐶 Шарик", "👦 Дядя Фёдор", "📮 Печкин", "🐮 Мурка", "🐤 Галчонок", "🐐 Козёл", "🐔 Курица"]
  };

  const pairs = sets[memoryTheme].slice(0, memoryCount / 2);
  const cards = [...pairs, ...pairs].sort(() => 0.5 - Math.random());

  let firstCard = null;
  let lock = false;
  let found = 0;

  cards.forEach(text => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "🚇";

    card.onclick = () => {
      if (lock || card.textContent !== "🚇") return;
      card.textContent = text;

      if (!firstCard) {
        firstCard = card;
      } else {
        if (firstCard.textContent !== card.textContent) {
          lock = true;
          setTimeout(() => {
            card.textContent = "🚇";
            firstCard.textContent = "🚇";
            firstCard = null;
            lock = false;
          }, 700);
        } else {
          firstCard = null;
          found++;
          if (found === cards.length / 2) {
            setTimeout(() => alert("🎉 Все пары найдены!"), 300);
          }
        }
      }
    };

    game.appendChild(card);
  });
}

/* ========================
   ===== ЛИНИЯ ЛАБИРИНТА =====
   ======================== */

function showMazeMenu() {
  game.innerHTML = `
    <h2>🔵 Линия лабиринта</h2>
    <p>Выбери персонажа</p>
    <button class="line blue" onclick="startMaze('cheburashka')">Чебурашка → 🍊 Апельсин</button>
    <button class="line blue" onclick="startMaze('pin')">Пин → 🤖 Биби</button>
    <button class="line blue" onclick="startMaze('matroskin')">Матроскин → 🐮 Мурка</button>
    <button class="line blue" onclick="startMaze('masha')">Маша → 🏠 Дом Мишки</button>
  `;
}

let mazeGoal = "";

function startMaze(type) {
  const goals = {
    cheburashka: "🍊",
    pin: "🤖",
    matroskin: "🐮",
    masha: "🏠"
  };
  mazeGoal = goals[type];
  generateMazeGame();
}

/* --- ГЕНЕРАЦИЯ ЛАБИРИНТА С ГАРАНТИРОВАННЫМ ВЫХОДОМ --- */

let maze = [];
let mazeSize = 7;
let player = { x: 1, y: 1 };
let finish = { x: 5, y: 5 };

function generateMazeGame() {
  maze = generateMaze(mazeSize, mazeSize);
  player = { x: 1, y: 1 };
  finish = { x: mazeSize - 2, y: mazeSize - 2 };
  drawMazeGame();
}

function generateMaze(w, h) {
  const grid = Array.from({ length: h }, () => Array(w).fill(1));

  function carve(x, y) {
    const dirs = [
      [0, -2],
      [2, 0],
      [0, 2],
      [-2, 0]
    ].sort(() => Math.random() - 0.5);

    dirs.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (ny > 0 && ny < h - 1 && nx > 0 && nx < w - 1 && grid[ny][nx] === 1) {
        grid[ny][nx] = 0;
        grid[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    });
  }

  grid[1][1] = 0;
  carve(1, 1);
  grid[h - 2][w - 2] = 2; // выход
  return grid;
}

function drawMazeGame() {
  game.innerHTML = `
    <h2>🚆 Дойди до цели ${mazeGoal}</h2>
    <div id="maze"></div>
    <br>
    <button class="control-btn" onclick="move('up')">↑</button><br>
    <button class="control-btn" onclick="move('left')">←</button>
    <button class="control-btn" onclick="move('right')">→</button><br>
    <button class="control-btn" onclick="move('down')">↓</button>
  `;
  drawMaze();
}

function drawMaze() {
  const mazeDiv = document.getElementById("maze");
  mazeDiv.innerHTML = "";

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const div = document.createElement("div");
      div.className = "cell";

      if (cell === 1) div.classList.add("wall");
      if (cell === 2) div.classList.add("finish");
      if (player.x === x && player.y === y) div.classList.add("player");

      mazeDiv.appendChild(div);
    });
    mazeDiv.appendChild(document.createElement("br"));
  });
}

function move(dir) {
  let { x, y } = player;
  if (dir === "up") y--;
  if (dir === "down") y++;
  if (dir === "left") x--;
  if (dir === "right") x++;

  if (maze[y][x] !== 1) {
    player = { x, y };
    drawMaze();

    if (maze[y][x] === 2) {
      setTimeout(() => alert("🎉 Цель достигнута!"), 200);
    }
  }
}

/* ==========================
   ===== ТРИ В РЯД — МЕТРО =====
   ========================== */

function showMatch3() {
  game.innerHTML = `
    <h2>🚇 Метро — Три в ряд</h2>
    <p>Собирай 3 одинаковые линии — получай станции!</p>
    <div id="match3-board"></div>
    <p>Станций открыто: <span id="match3-score">0</span></p>
  `;
  createMatch3();
}

const match3Size = 6;
const match3Colors = ["red", "blue", "green", "brown", "purple"];
let match3Grid = [];
let match3Score = 0;
let firstCell = null;

function createMatch3() {
  const board = document.getElementById("match3-board");
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(6, 1fr)";
  board.style.gap = "6px";
  board.style.maxWidth = "300px";
  board.style.margin = "15px auto";

  board.innerHTML = "";
  match3Grid = [];

  for (let i = 0; i < match3Size * match3Size; i++) {
    const cell = document.createElement("div");
    cell.className = `match3-cell ${randomMatch3Color()}`;
    cell.dataset.index = i;
    cell.onclick = () => handleMatch3Click(cell);
    board.appendChild(cell);
    match3Grid.push(cell);
  }

  setTimeout(checkMatch3, 200);
}

function randomMatch3Color() {
  return match3Colors[Math.floor(Math.random() * match3Colors.length)];
}

function handleMatch3Click(cell) {
  if (!firstCell) {
    firstCell = cell;
    cell.style.outline = "3px solid white";
  } else {
    swapMatch3(firstCell, cell);
    firstCell.style.outline = "none";
    firstCell = null;
  }
}

function swapMatch3(a, b) {
  const temp = a.className;
  a.className = b.className;
  b.className = temp;
  setTimeout(checkMatch3, 150);
}

function checkMatch3() {
  let matched = false;

  // Горизонталь
  for (let i = 0; i < match3Size * match3Size; i++) {
    if (i % match3Size > match3Size - 3) continue;
    const a = match3Grid[i];
    const b = match3Grid[i + 1];
    const c = match3Grid[i + 2];
    if (sameMatch3(a, b, c)) {
      clearMatch3(a, b, c);
      matched = true;
    }
  }

  // Вертикаль
  for (let i = 0; i < match3Size * match3Size - match3Size * 2; i++) {
    const a = match3Grid[i];
    const b = match3Grid[i + match3Size];
    const c = match3Grid[i + match3Size * 2];
    if (sameMatch3(a, b, c)) {
      clearMatch3(a, b, c);
      matched = true;
    }
  }

  if (matched) setTimeout(fillMatch3, 250);
}

function sameMatch3(a, b, c) {
  return a && b && c && a.className === b.className && b.className === c.className;
}

function clearMatch3(a, b, c) {
  a.className = "match3-cell empty";
  b.className = "match3-cell empty";
  c.className = "match3-cell empty";
  match3Score++;
  document.getElementById("match3-score").textContent = match3Score;
}

function fillMatch3() {
  match3Grid.forEach(cell => {
    if (cell.classList.contains("empty")) {
      cell.className = `match3-cell ${randomMatch3Color()}`;
    }
  });
  setTimeout(checkMatch3, 200);
}