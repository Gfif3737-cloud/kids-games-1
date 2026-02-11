/* ============================
   ОБЩАЯ НАВИГАЦИЯ
============================ */

const screens = {
  menu: document.getElementById("menu"),
  memorySetup: document.getElementById("memorySetup"),
  memory: document.getElementById("memory"),
  mazeSetup: document.getElementById("mazeSetup"),
  maze: document.getElementById("maze"),
  match3: document.getElementById("match3"),
  metroMap: document.getElementById("metroMap")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.style.display = "none");
  screens[name].style.display = "block";
}

/* ============================
   ПЕРСОНАЖИ
============================ */

const characters = [
  { id: "pin", name: "Пин", emoji: "🔵" },
  { id: "bibi", name: "Биби", emoji: "🚗" },
  { id: "losyash", name: "Лосяш", emoji: "🦌" },
  { id: "krosh", name: "Крош", emoji: "🐰" }
];

let selectedCharacter = characters[0];

/* ============================
   МЕНЮ
============================ */

document.getElementById("btnMemory").onclick = () => showMemorySetup();
document.getElementById("btnMaze").onclick = () => showMazeSetup();
document.getElementById("btnMatch3").onclick = () => startMatch3();

document.querySelectorAll(".btnBack").forEach(btn => {
  btn.onclick = () => showScreen("menu");
});

/* ============================
   ЛИНИЯ ПАМЯТИ — НАСТРОЙКИ
============================ */

const memorySizes = [
  { w: 4, h: 2 },
  { w: 4, h: 4 },
  { w: 4, h: 5 },
  { w: 4, h: 6 }
];

function showMemorySetup() {
  showScreen("memorySetup");

  const sizeBox = document.getElementById("memorySizes");
  sizeBox.innerHTML = "";
  memorySizes.forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = `${size.w}×${size.h}`;
    btn.onclick = () => startMemory(size.w, size.h);
    sizeBox.appendChild(btn);
  });

  renderCharacterSelect("memoryCharacters");
}

function renderCharacterSelect(containerId) {
  const box = document.getElementById(containerId);
  box.innerHTML = "";
  characters.forEach(ch => {
    const btn = document.createElement("button");
    btn.textContent = `${ch.emoji} ${ch.name}`;
    btn.onclick = () => {
      selectedCharacter = ch;
      [...box.children].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    box.appendChild(btn);
  });
}

/* ============================
   ЛИНИЯ ПАМЯТИ — ИГРА
============================ */

let memoryFirst = null;
let memoryLock = false;
let memoryFound = 0;

function startMemory(w, h) {
  showScreen("memory");
  const grid = document.getElementById("memoryGrid");
  grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
  grid.innerHTML = "";

  const total = w * h;
  const pairs = total / 2;
  memoryFound = 0;
  memoryFirst = null;
  memoryLock = false;

  let values = [];
  for (let i = 0; i < pairs; i++) values.push(i, i);
  values = shuffle(values);

  values.forEach(val => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "❓";
    card.onclick = () => memoryFlip(card, val);
    grid.appendChild(card);
  });
}

function memoryFlip(card, value) {
  if (memoryLock || card.classList.contains("open")) return;

  card.classList.add("open");
  card.textContent = selectedCharacter.emoji;

  if (!memoryFirst) {
    memoryFirst = { card, value };
    return;
  }

  if (memoryFirst.value === value) {
    memoryFound += 2;
    memoryFirst = null;
    if (memoryFound === document.querySelectorAll("#memoryGrid .card").length) {
      setTimeout(() => alert("🎉 Победа!"), 300);
    }
  } else {
    memoryLock = true;
    setTimeout(() => {
      card.classList.remove("open");
      memoryFirst.card.classList.remove("open");
      card.textContent = "❓";
      memoryFirst.card.textContent = "❓";
      memoryFirst = null;
      memoryLock = false;
    }, 700);
  }
}

/* ============================
   ЛАБИРИНТ — НАСТРОЙКИ
============================ */

function showMazeSetup() {
  showScreen("mazeSetup");
  renderCharacterSelect("mazeCharacters");
}

let mazeLevel = 1;

/* ============================
   ЛАБИРИНТ — ИГРА
============================ */

function startMaze() {
  mazeLevel = 1;
  generateMazeLevel();
}

function generateMazeLevel() {
  showScreen("maze");
  const size = 9 + mazeLevel;
  const maze = generateMaze(size, size);
  renderMaze(maze);
}

function generateMaze(w, h) {
  const maze = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => 1)
  );

  function carve(x, y) {
    maze[y][x] = 0;
    const dirs = shuffle([
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ]);
    for (const [dx, dy] of dirs) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (ny > 0 && ny < h - 1 && nx > 0 && nx < w - 1 && maze[ny][nx] === 1) {
        maze[y + dy][x + dx] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  maze[h - 2][w - 2] = 2;
  return maze;
}

let player = { x: 1, y: 1 };

function renderMaze(maze) {
  const box = document.getElementById("mazeGrid");
  box.style.gridTemplateColumns = `repeat(${maze[0].length}, 24px)`;
  box.innerHTML = "";
  player = { x: 1, y: 1 };

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const d = document.createElement("div");
      d.className = "mazeCell";
      if (cell === 1) d.classList.add("wall");
      if (cell === 2) d.classList.add("exit");
      if (x === player.x && y === player.y) d.textContent = selectedCharacter.emoji;
      box.appendChild(d);
    });
  });

  document.onkeydown = e => {
    const moves = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0]
    };
    if (!moves[e.key]) return;
    movePlayer(moves[e.key][0], moves[e.key][1], maze);
  };
}

function movePlayer(dx, dy, maze) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (maze[ny][nx] === 1) return;

  player.x = nx;
  player.y = ny;

  if (maze[ny][nx] === 2) {
    mazeLevel++;
    setTimeout(generateMazeLevel, 300);
  }

  renderMaze(maze);
}

/* ============================
   ТРИ В РЯД — МЕТРО
============================ */

const match3Size = 6;
const match3Colors = ["red", "blue", "green", "cyan", "gray"];
let match3Grid = [];
let match3Selected = null;
let match3Level = 1;

function startMatch3() {
  showScreen("match3");
  match3Level = 1;
  generateMatch3Level();
}

function generateMatch3Level() {
  const gridEl = document.getElementById("match3Grid");
  gridEl.style.gridTemplateColumns = `repeat(${match3Size}, 1fr)`;
  match3Grid = [];

  for (let y = 0; y < match3Size; y++) {
    match3Grid[y] = [];
    for (let x = 0; x < match3Size; x++) {
      let color;
      do {
        color = randomFrom(match3Colors);
      } while (
        (x >= 2 &&
          match3Grid[y][x - 1] === color &&
          match3Grid[y][x - 2] === color) ||
        (y >= 2 &&
          match3Grid[y - 1][x] === color &&
          match3Grid[y - 2][x] === color)
      );
      match3Grid[y][x] = color;
    }
  }

  renderMatch3();
}

function renderMatch3() {
  const gridEl = document.getElementById("match3Grid");
  gridEl.innerHTML = "";
  match3Grid.forEach((row, y) => {
    row.forEach((color, x) => {
      const d = document.createElement("div");
      d.className = "match3Cell " + color;
      d.onclick = () => selectMatch3(x, y);
      gridEl.appendChild(d);
    });
  });
}

function selectMatch3(x, y) {
  if (!match3Selected) {
    match3Selected = { x, y };
    return;
  }

  const dx = Math.abs(match3Selected.x - x);
  const dy = Math.abs(match3Selected.y - y);
  if (dx + dy !== 1) {
    match3Selected = null;
    return;
  }

  swap(match3Grid, match3Selected.x, match3Selected.y, x, y);
  if (findMatches().length === 0) {
    swap(match3Grid, match3Selected.x, match3Selected.y, x, y);
  } else {
    resolveMatches();
  }

  match3Selected = null;
  renderMatch3();
}

function findMatches() {
  const matches = [];

  for (let y = 0; y < match3Size; y++) {
    for (let x = 0; x < match3Size - 2; x++) {
      const c = match3Grid[y][x];
      if (c && c === match3Grid[y][x + 1] && c === match3Grid[y][x + 2]) {
        matches.push([x, y], [x + 1, y], [x + 2, y]);
      }
    }
  }

  for (let x = 0; x < match3Size; x++) {
    for (let y = 0; y < match3Size - 2; y++) {
      const c = match3Grid[y][x];
      if (c && c === match3Grid[y + 1][x] && c === match3Grid[y + 2][x]) {
        matches.push([x, y], [x, y + 1], [x, y + 2]);
      }
    }
  }

  return matches;
}

function resolveMatches() {
  const matches = findMatches();
  if (matches.length === 0) return;

  matches.forEach(([x, y]) => {
    match3Grid[y][x] = null;
  });

  for (let x = 0; x < match3Size; x++) {
    let col = [];
    for (let y = 0; y < match3Size; y++) {
      if (match3Grid[y][x]) col.push(match3Grid[y][x]);
    }
    while (col.length < match3Size) col.unshift(randomFrom(match3Colors));
    for (let y = 0; y < match3Size; y++) {
      match3Grid[y][x] = col[y];
    }
  }

  setTimeout(resolveMatches, 200);
}

/* ============================
   ВСПОМОГАТЕЛЬНЫЕ
============================ */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function swap(grid, x1, y1, x2, y2) {
  const t = grid[y1][x1];
  grid[y1][x1] = grid[y2][x2];
  grid[y2][x2] = t;
}