/* =====================
   ОБЩАЯ НАВИГАЦИЯ
===================== */

const screens = {
  menu: document.getElementById("menu"),
  memory: document.getElementById("memory"),
  maze: document.getElementById("maze"),
  match3: document.getElementById("match3"),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

document.getElementById("btnMemory").onclick = () => showScreen("memory");
document.getElementById("btnMaze").onclick = () => startMaze();
document.getElementById("btnMatch3").onclick = () => startMatch3();

document.querySelectorAll(".btnBack").forEach(btn => {
  btn.onclick = () => showScreen("menu");
});

/* =====================
   ===== ПАМЯТЬ =====
===================== */

const memoryGrid = document.getElementById("memoryGrid");
const memorySizeSelect = document.getElementById("memorySize");
const memoryThemeSelect = document.getElementById("memoryTheme");
const startMemoryBtn = document.getElementById("startMemory");

const memoryThemes = {
  cartoons: ["Смешарики", "Фиксики", "Маша", "Винни Пух"],
};

let memoryFirst = null;
let memoryLock = false;

startMemoryBtn.onclick = startMemory;

function startMemory() {
  const size = memorySizeSelect.value;
  const cols = 4;
  const rows = size === "4x2" ? 2 : 5;
  const total = cols * rows;
  const pairs = total / 2;

  const base = memoryThemes[memoryThemeSelect.value];
  let values = [];

  for (let i = 0; i < pairs; i++) {
    values.push(base[i % base.length]);
    values.push(base[i % base.length]);
  }

  values = shuffle(values);

  memoryGrid.innerHTML = "";
  memoryGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  memoryFirst = null;
  memoryLock = false;

  values.forEach(v => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.textContent = "❓";
    card.dataset.value = v;
    card.onclick = () => flipCard(card);
    memoryGrid.appendChild(card);
  });
}

function flipCard(card) {
  if (memoryLock || card.classList.contains("open")) return;

  card.classList.add("open");
  card.textContent = card.dataset.value;

  if (!memoryFirst) {
    memoryFirst = card;
  } else {
    if (memoryFirst.dataset.value === card.dataset.value) {
      memoryFirst = null;
    } else {
      memoryLock = true;
      setTimeout(() => {
        card.classList.remove("open");
        memoryFirst.classList.remove("open");
        card.textContent = "❓";
        memoryFirst.textContent = "❓";
        memoryFirst = null;
        memoryLock = false;
      }, 700);
    }
  }
}

/* =====================
   ===== ЛАБИРИНТ =====
===================== */

const mazeGrid = document.getElementById("mazeGrid");
const mazeLevelText = document.getElementById("mazeLevel");

let mazeSize = 9;
let maze = [];
let player = { x: 1, y: 1 };
let goal = { x: 7, y: 7 };
let mazeLevel = 1;

function startMaze() {
  showScreen("maze");
  mazeLevel = 1;
  generateMazeLevel();
}

function generateMazeLevel() {
  mazeLevelText.textContent = "Уровень " + mazeLevel;
  maze = generateMazeMap(mazeSize);
  player = { x: 1, y: 1 };
  goal = { x: mazeSize - 2, y: mazeSize - 2 };
  drawMaze();
}

function generateMazeMap(size) {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 1)
  );

  function carve(x, y) {
    grid[y][x] = 0;
    const dirs = shuffle([
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ]);
    for (let [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx > 0 &&
        ny > 0 &&
        nx < size - 1 &&
        ny < size - 1 &&
        grid[ny][nx] === 1
      ) {
        grid[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  return grid;
}

function drawMaze() {
  mazeGrid.innerHTML = "";
  mazeGrid.style.gridTemplateColumns = `repeat(${mazeSize}, 28px)`;

  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      const cell = document.createElement("div");
      cell.className = "maze-cell";
      if (maze[y][x] === 1) cell.classList.add("wall");
      if (x === player.x && y === player.y) {
        cell.textContent = "🙂";
        cell.classList.add("player");
      }
      if (x === goal.x && y === goal.y) {
        cell.textContent = "🎯";
        cell.classList.add("goal");
      }
      mazeGrid.appendChild(cell);
    }
  }
}

function movePlayer(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
    drawMaze();
    if (player.x === goal.x && player.y === goal.y) {
      setTimeout(() => {
        mazeLevel++;
        generateMazeLevel();
      }, 300);
    }
  }
}

/* клавиатура */
document.addEventListener("keydown", e => {
  if (screens.maze.classList.contains("hidden")) return;
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

/* свайпы */
let touchStartX = 0;
let touchStartY = 0;

mazeGrid.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});

mazeGrid.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20) movePlayer(1, 0);
    else if (dx < -20) movePlayer(-1, 0);
  } else {
    if (dy > 20) movePlayer(0, 1);
    else if (dy < -20) movePlayer(0, -1);
  }
});

/* =====================
   ===== ТРИ В РЯД =====
===================== */

const match3Grid = document.getElementById("match3Grid");
const lineSelect = document.getElementById("lineSelect");
const stationList = document.getElementById("stationList");

const colors = ["red", "yellow", "green", "blue", "purple"];
let board = [];
let selected = null;
let openedStations = {};

const metroLines = {
  "Сокольническая": [
    "Бульвар Рокоссовского",
    "Черкизовская",
    "Преображенская",
    "Сокольники",
    "Красносельская",
    "Комсомольская",
    "Красные Ворота",
    "Чистые пруды",
    "Лубянка",
    "Охотный ряд",
  ],
  "Замоскворецкая": [
    "Ховрино",
    "Беломорская",
    "Речной вокзал",
    "Водный стадион",
    "Войковская",
    "Сокол",
    "Аэропорт",
    "Динамо",
    "Белорусская",
    "Маяковская",
  ],
};

function startMatch3() {
  showScreen("match3");
  fillLineSelect();
  generateBoard();
  drawBoard();
}

function fillLineSelect() {
  lineSelect.innerHTML = "";
  Object.keys(metroLines).forEach(line => {
    const opt = document.createElement("option");
    opt.value = line;
    opt.textContent = line;
    lineSelect.appendChild(opt);
  });
  lineSelect.onchange = updateStationList;
  updateStationList();
}

function updateStationList() {
  const line = lineSelect.value;
  stationList.innerHTML = "";
  metroLines[line].forEach(st => {
    const div = document.createElement("div");
    div.className = "station-item";
    const done = openedStations[st];
    div.textContent = (done ? "✅ " : "⬜ ") + st;
    stationList.appendChild(div);
  });
}

/* генерация без стартовых совпадений */
function generateBoard() {
  board = [];
  for (let y = 0; y < 6; y++) {
    board[y] = [];
    for (let x = 0; x < 6; x++) {
      let color;
      do {
        color = randomColor();
      } while (
        (x >= 2 &&
          board[y][x - 1] === color &&
          board[y][x - 2] === color) ||
        (y >= 2 &&
          board[y - 1][x] === color &&
          board[y - 2][x] === color)
      );
      board[y][x] = color;
    }
  }
}

function drawBoard() {
  match3Grid.innerHTML = "";
  match3Grid.style.gridTemplateColumns = "repeat(6, 42px)";

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      const cell = document.createElement("div");
      cell.className = "m3-cell " + board[y][x];
      cell.onclick = () => tapCell(x, y);
      match3Grid.appendChild(cell);
    }
  }
}

function tapCell(x, y) {
  if (!selected) {
    selected = { x, y };
    highlightCell(x, y);
    return;
  }

  const dx = Math.abs(selected.x - x);
  const dy = Math.abs(selected.y - y);

  if (dx + dy === 1) {
    swap(selected.x, selected.y, x, y);
    if (findMatches().length === 0) {
      swap(selected.x, selected.y, x, y);
    } else {
      processMatches();
    }
  }

  selected = null;
  drawBoard();
}

function highlightCell(x, y) {
  drawBoard();
  const index = y * 6 + x;
  match3Grid.children[index].classList.add("selected");
}

function swap(x1, y1, x2, y2) {
  const temp = board[y1][x1];
  board[y1][x1] = board[y2][x2];
  board[y2][x2] = temp;
}

function findMatches() {
  const matches = [];

  // горизонтали
  for (let y = 0; y < 6; y++) {
    let run = 1;
    for (let x = 1; x <= 6; x++) {
      if (x < 6 && board[y][x] === board[y][x - 1]) {
        run++;
      } else {
        if (run >= 3) {
          for (let i = 0; i < run; i++) {
            matches.push({ x: x - 1 - i, y });
          }
        }
        run = 1;
      }
    }
  }

  // вертикали
  for (let x = 0; x < 6; x++) {
    let run = 1;
    for (let y = 1; y <= 6; y++) {
      if (y < 6 && board[y][x] === board[y - 1][x]) {
        run++;
      } else {
        if (run >= 3) {
          for (let i = 0; i < run; i++) {
            matches.push({ x, y: y - 1 - i });
          }
        }
        run = 1;
      }
    }
  }

  return matches;
}

function processMatches() {
  const matches = findMatches();
  if (matches.length === 0) return;

  matches.forEach(m => {
    board[m.y][m.x] = null;
  });

  collapse();
  refill();
  setTimeout(processMatches, 150);
}

function collapse() {
  for (let x = 0; x < 6; x++) {
    let pointer = 5;
    for (let y = 5; y >= 0; y--) {
      if (board[y][x] !== null) {
        board[pointer][x] = board[y][x];
        if (pointer !== y) board[y][x] = null;
        pointer--;
      }
    }
  }
}

function refill() {
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      if (board[y][x] === null) {
        board[y][x] = randomColor();
      }
    }
  }
  drawBoard();
}

/* =====================
   ВСПОМОГАТЕЛЬНОЕ
===================== */

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* =====================
   СТАРТ
===================== */

showScreen("menu");