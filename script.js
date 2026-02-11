/* ============================
   НАВИГАЦИЯ
============================ */

const screens = {
  menu: document.getElementById("menu"),
  memorySetup: document.getElementById("memorySetup"),
  memory: document.getElementById("memory"),
  mazeSetup: document.getElementById("mazeSetup"),
  maze: document.getElementById("maze"),
  match3: document.getElementById("match3")
};

function showScreen(name) {
  Object.values(screens).forEach(s => (s.style.display = "none"));
  screens[name].style.display = "block";
}

showScreen("menu");

document.getElementById("btnMemory").onclick = () => showMemorySetup();
document.getElementById("btnMaze").onclick = () => showMazeSetup();
document.getElementById("btnMatch3").onclick = () => startMatch3();

document.querySelectorAll(".back-btn").forEach(btn => {
  btn.onclick = () => showScreen("menu");
});

/* ============================
   ЛИНИЯ ПАМЯТИ — ДАННЫЕ
============================ */

const memoryThemes = {
  smeshariki: {
    name: "Смешарики",
    icons: ["🐰", "🦔", "🐻", "🐷", "🦉", "🐧", "🐮", "🦌"]
  },
  fixiki: {
    name: "Фиксики",
    icons: ["🔧", "🔩", "⚙️", "🔌", "💡", "🧲", "📡", "🔋"]
  },
  masha: {
    name: "Маша и Медведь",
    icons: ["👧", "🐻", "🍯", "🌲", "🏠", "🐝", "🥣", "🧸"]
  },
  winnie: {
    name: "Винни-Пух",
    icons: ["🐻", "🍯", "🐷", "🐯", "🦉", "🌳", "🎈", "🍎"]
  }
};

const memorySizes = [
  { w: 4, h: 2 },
  { w: 4, h: 4 },
  { w: 4, h: 5 },
  { w: 4, h: 6 }
];

let selectedMemoryTheme = memoryThemes.smeshariki;

/* ============================
   ЛИНИЯ ПАМЯТИ — НАСТРОЙКИ
============================ */

function showMemorySetup() {
  showScreen("memorySetup");

  const themeBox = document.getElementById("memoryThemes");
  themeBox.innerHTML = "";
  Object.values(memoryThemes).forEach((theme, i) => {
    const btn = document.createElement("button");
    btn.textContent = theme.name;
    if (i === 0) btn.classList.add("active");
    btn.onclick = () => {
      selectedMemoryTheme = theme;
      [...themeBox.children].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    themeBox.appendChild(btn);
  });

  const sizeBox = document.getElementById("memorySizes");
  sizeBox.innerHTML = "";
  memorySizes.forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = `${size.w}×${size.h}`;
    btn.onclick = () => startMemory(size.w, size.h);
    sizeBox.appendChild(btn);
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

  const icons = selectedMemoryTheme.icons.slice(0, pairs);
  let values = [];
  icons.forEach(i => values.push(i, i));
  values = shuffle(values);

  values.forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "❓";
    card.onclick = () => memoryFlip(card, icon);
    grid.appendChild(card);
  });
}

function memoryFlip(card, icon) {
  if (memoryLock || card.classList.contains("open")) return;

  card.classList.add("open");
  card.textContent = icon;

  if (!memoryFirst) {
    memoryFirst = { card, icon };
    return;
  }

  if (memoryFirst.icon === icon) {
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
   ЛИНИЯ ЛАБИРИНТА — ДАННЫЕ
============================ */

const mazeCharacters = [
  { id: "cheb", name: "Чебурашка → 🍊", icon: "🐭", goal: "🍊" },
  { id: "pin", name: "Пин → Биби", icon: "🐧", goal: "🤖" },
  { id: "matroskin", name: "Матроскин → Мурка", icon: "🐱", goal: "🐮" },
  { id: "masha", name: "Маша → Медведю", icon: "👧", goal: "🐻" }
];

let selectedMazeChar = mazeCharacters[0];

/* ============================
   ЛИНИЯ ЛАБИРИНТА — НАСТРОЙКИ
============================ */

function showMazeSetup() {
  showScreen("mazeSetup");
  const box = document.getElementById("mazeCharacters");
  box.innerHTML = "";
  mazeCharacters.forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.textContent = ch.name;
    if (i === 0) btn.classList.add("active");
    btn.onclick = () => {
      selectedMazeChar = ch;
      [...box.children].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    box.appendChild(btn);
  });
}

document.getElementById("startMazeBtn").onclick = () => startMaze();

/* ============================
   ЛИНИЯ ЛАБИРИНТА — ИГРА
============================ */

let mazeLevel = 1;
let mazeData = [];
let player = { x: 1, y: 1 };

function startMaze() {
  mazeLevel = 1;
  generateMazeLevel();
}

function generateMazeLevel() {
  showScreen("maze");
  document.getElementById("mazeLevelText").textContent = `Уровень ${mazeLevel}`;
  const size = 9 + mazeLevel;
  mazeData = generateMaze(size, size);
  player = { x: 1, y: 1 };
  renderMaze();
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

function renderMaze() {
  const box = document.getElementById("mazeGrid");
  box.style.gridTemplateColumns = `repeat(${mazeData[0].length}, 28px)`;
  box.innerHTML = "";

  mazeData.forEach((row, y) => {
    row.forEach((cell, x) => {
      const d = document.createElement("div");
      d.className = "mazeCell";
      if (cell === 1) d.classList.add("wall");
      if (cell === 2) d.classList.add("exit");
      if (x === player.x && y === player.y) {
        d.classList.add("player");
        d.textContent = selectedMazeChar.icon;
      }
      if (cell === 2) d.textContent = selectedMazeChar.goal;
      box.appendChild(d);
    });
  });
}

function movePlayer(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (mazeData[ny][nx] === 1) return;

  player.x = nx;
  player.y = ny;

  if (mazeData[ny][nx] === 2) {
    mazeLevel++;
    setTimeout(generateMazeLevel, 300);
  }

  renderMaze();
}

document.addEventListener("keydown", e => {
  const moves = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  };
  if (moves[e.key]) movePlayer(moves[e.key][0], moves[e.key][1]);
});

/* --- свайпы --- */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) movePlayer(1, 0);
    if (dx < -30) movePlayer(-1, 0);
  } else {
    if (dy > 30) movePlayer(0, 1);
    if (dy < -30) movePlayer(0, -1);
  }
});

/* ============================
   ТРИ В РЯД — ДАННЫЕ ЛИНИЙ
============================ */

const metroLines = {
  "Сокольническая": ["Бульвар Рокоссовского", "Черкизовская", "Преображенская", "Сокольники", "Красносельская"],
  "Замоскворецкая": ["Ховрино", "Беломорская", "Речной вокзал", "Водный стадион", "Войковская"],
  "Арбатско-Покровская": ["Щёлковская", "Первомайская", "Измайловская", "Партизанская", "Семёновская"],
  "Филёвская": ["Кунцевская", "Пионерская", "Филёвский парк", "Багратионовская", "Фили"],
  "Кольцевая": ["Комсомольская", "Курская", "Таганская", "Павелецкая", "Добрынинская"]
};

let openedStations = {};
Object.keys(metroLines).forEach(line => {
  openedStations[line] = [];
});

/* ============================
   ТРИ В РЯД — ИГРА
============================ */

const match3Size = 6;
const match3Colors = ["red", "blue", "green", "yellow", "purple"];
let match3Grid = [];
let match3Selected = null;
let match3Level = 1;

function startMatch3() {
  showScreen("match3");
  setupLineSelect();
  generateMatch3Level();
}

function setupLineSelect() {
  const select = document.getElementById("lineSelect");
  select.innerHTML = "";
  Object.keys(metroLines).forEach(line => {
    const opt = document.createElement("option");
    opt.value = line;
    opt.textContent = line;
    select.appendChild(opt);
  });
  select.onchange = () => renderStations();
  renderStations();
}

function renderStations() {
  const line = document.getElementById("lineSelect").value;
  const box = document.getElementById("stationsBox");
  const stations = metroLines[line];
  const opened = openedStations[line];

  box.innerHTML = `<b>${line}</b><br>` + stations
    .map(st => opened.includes(st) ? `✅ ${st}` : `⬜ ${st}`)
    .join("<br>");
}

function generateMatch3Level() {
  document.getElementById("match3LevelText").textContent =
    `Уровень ${match3Level} — собери станции`;
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

  const line = document.getElementById("lineSelect").value;
  const stations = metroLines[line];
  const opened = openedStations[line];

  matches.forEach(([x, y]) => {
    match3Grid[y][x] = null;
  });

  // открыть станцию за каждый ход
  const unopened = stations.filter(s => !opened.includes(s));
  if (unopened.length > 0) {
    opened.push(unopened[0]);
    renderStations();
  }

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