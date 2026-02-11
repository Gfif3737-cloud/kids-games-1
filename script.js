/******************************
 * ОБЩЕЕ
 ******************************/
const screens = {
  menu: document.getElementById("menuScreen"),
  memory: document.getElementById("memoryScreen"),
  maze: document.getElementById("mazeScreen"),
  match3: document.getElementById("match3Screen")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

/******************************
 * КНОПКИ МЕНЮ
 ******************************/
document.getElementById("btnMemory").onclick = () => showScreen("memory");
document.getElementById("btnMaze").onclick = () => showScreen("maze");
document.getElementById("btnMatch3").onclick = () => showScreen("match3");

document.querySelectorAll(".back-btn").forEach(btn => {
  btn.onclick = () => showScreen("menu");
});

/******************************
 * ===== ЛИНИЯ ПАМЯТИ =====
 ******************************/
const memoryGrid = document.getElementById("memoryGrid");
const memorySizeSelect = document.getElementById("memorySize");
const memoryThemeSelect = document.getElementById("memoryTheme");
const memoryStartBtn = document.getElementById("memoryStart");

const memoryThemes = {
  "Смешарики": ["🦔", "🐰", "🐻", "🐷", "🐧", "🦉", "🐶", "🐱", "🦊", "🐼"],
  "Фиксики": ["🔧", "⚙️", "🔌", "🔋", "💡", "📺", "📱", "🖥️", "🧲", "🔑"],
  "Маша и Медведь": ["👧", "🐻", "🐺", "🐷", "🐰", "🐼", "🐿️", "🐶", "🐔", "🦊"],
  "Винни Пух": ["🐻", "🐷", "🐰", "🐯", "🦉", "🐴", "🍯", "🌳", "🎈", "🍃"]
};

let memoryFirst = null;
let memorySecond = null;
let memoryLock = false;
let memoryMatched = 0;

memoryStartBtn.onclick = startMemory;

function startMemory() {
  const [w, h] = memorySizeSelect.value.split("x").map(Number);
  const total = w * h;
  const pairs = total / 2;
  const theme = memoryThemeSelect.value;

  const symbols = [...memoryThemes[theme]].slice(0, pairs);
  const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

  memoryGrid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
  memoryGrid.innerHTML = "";
  memoryMatched = 0;

  cards.forEach(sym => {
    const div = document.createElement("div");
    div.className = "memory-card";
    div.textContent = "❓";
    div.dataset.symbol = sym;
    div.onclick = () => flipMemory(div);
    memoryGrid.appendChild(div);
  });
}

function flipMemory(card) {
  if (memoryLock || card.classList.contains("open")) return;

  card.classList.add("open");
  card.textContent = card.dataset.symbol;

  if (!memoryFirst) {
    memoryFirst = card;
    return;
  }

  memorySecond = card;
  memoryLock = true;

  if (memoryFirst.dataset.symbol === memorySecond.dataset.symbol) {
    memoryFirst = null;
    memorySecond = null;
    memoryLock = false;
    memoryMatched += 2;

    if (memoryMatched === memoryGrid.children.length) {
      setTimeout(() => alert("🎉 Победа!"), 300);
    }
  } else {
    setTimeout(() => {
      memoryFirst.classList.remove("open");
      memorySecond.classList.remove("open");
      memoryFirst.textContent = "❓";
      memorySecond.textContent = "❓";
      memoryFirst = null;
      memorySecond = null;
      memoryLock = false;
    }, 700);
  }
}

/******************************
 * ===== ЛАБИРИНТ =====
 ******************************/
const mazeGrid = document.getElementById("mazeGrid");
const mazeLevelText = document.getElementById("mazeLevel");

let mazeSize = 11;
let maze;
let mazePlayer;
let mazeGoal;
let mazeLevel = 1;

const mazeCharacters = [
  { name: "Чебурашка → 🍊", icon: "🐵", goal: "🍊" },
  { name: "Пин → 🤖", icon: "🐧", goal: "🤖" },
  { name: "Матроскин → 🐱", icon: "😼", goal: "🐱" },
  { name: "Маша → 🏠", icon: "👧", goal: "🏠" }
];

let currentMazeChar = 0;

function startMaze() {
  mazeLevelText.textContent = `Уровень ${mazeLevel}`;
  generateMaze();
}

function generateMaze() {
  const size = mazeSize;
  maze = Array.from({ length: size }, () => Array(size).fill(1));

  function carve(x, y) {
    maze[y][x] = 0;
    const dirs = [
      [2, 0], [-2, 0], [0, 2], [0, -2]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);

  mazePlayer = { x: 1, y: 1 };
  mazeGoal = { x: size - 2, y: size - 2 };

  renderMaze();
}

function renderMaze() {
  mazeGrid.innerHTML = "";
  mazeGrid.style.gridTemplateColumns = `repeat(${mazeSize}, 1fr)`;

  const char = mazeCharacters[currentMazeChar];

  for (let y = 0; y < mazeSize; y++) {
    for (let x = 0; x < mazeSize; x++) {
      const cell = document.createElement("div");
      cell.className = "maze-cell";

      if (maze[y][x] === 1) cell.classList.add("maze-wall");
      else cell.classList.add("maze-path");

      if (x === mazeGoal.x && y === mazeGoal.y) {
        cell.classList.add("maze-goal");
        cell.textContent = char.goal;
      }

      if (x === mazePlayer.x && y === mazePlayer.y) {
        cell.classList.add("maze-player");
        cell.textContent = char.icon;
      }

      mazeGrid.appendChild(cell);
    }
  }
}

function moveMaze(dx, dy) {
  const nx = mazePlayer.x + dx;
  const ny = mazePlayer.y + dy;
  if (maze[ny][nx] === 0) {
    mazePlayer.x = nx;
    mazePlayer.y = ny;
    renderMaze();

    if (nx === mazeGoal.x && ny === mazeGoal.y) {
      setTimeout(() => {
        alert("🎉 Уровень пройден!");
        mazeLevel++;
        currentMazeChar = (currentMazeChar + 1) % mazeCharacters.length;
        startMaze();
      }, 200);
    }
  }
}

document.addEventListener("keydown", e => {
  if (screens.maze.classList.contains("hidden")) return;
  if (e.key === "ArrowUp") moveMaze(0, -1);
  if (e.key === "ArrowDown") moveMaze(0, 1);
  if (e.key === "ArrowLeft") moveMaze(-1, 0);
  if (e.key === "ArrowRight") moveMaze(1, 0);
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
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 20) moveMaze(1, 0);
    else if (dx < -20) moveMaze(-1, 0);
  } else {
    if (dy > 20) moveMaze(0, 1);
    else if (dy < -20) moveMaze(0, -1);
  }
});

/******************************
 * ===== ТРИ В РЯД =====
 ******************************/
const match3Grid = document.getElementById("match3Grid");
const match3LineSelect = document.getElementById("match3Line");
const stationPanel = document.getElementById("stationPanel");

const match3Size = 6;
const match3Colors = ["#4caf50", "#2196f3", "#f44336", "#ffeb3b", "#9c27b0"];
let match3Board = [];
let match3Selected = null;

const metroLines = {
  "Сокольническая": [
    "Бульвар Рокоссовского","Черкизовская","Преображенская площадь",
    "Сокольники","Красносельская","Комсомольская",
    "Красные ворота","Чистые пруды","Лубянка",
    "Охотный ряд","Библиотека им. Ленина","Кропоткинская",
    "Парк культуры","Фрунзенская","Спортивная",
    "Воробьёвы горы","Университет","Проспект Вернадского",
    "Юго-Западная"
  ],
  "Арбатско-Покровская": [
    "Пятницкое шоссе","Митино","Волоколамская","Мякинино",
    "Строгино","Крылатское","Молодёжная","Кунцевская",
    "Славянский бульвар","Парк Победы","Киевская","Смоленская",
    "Арбатская","Площадь Революции","Курская","Бауманская",
    "Электрозаводская","Семёновская","Партизанская",
    "Измайловская","Первомайская","Щёлковская"
  ],
  "Замоскворецкая": [
    "Беломорская","Речной вокзал","Водный стадион","Войковская",
    "Сокол","Аэропорт","Динамо","Белорусская",
    "Маяковская","Тверская","Театральная","Новокузнецкая",
    "Павелецкая","Автозаводская","Технопарк","Коломенская",
    "Каширская","Кантемировская","Царицыно","Орехово",
    "Домодедовская","Красногвардейская","Алма-Атинская"
  ],
  "Филёвская": [
    "Кунцевская","Пионерская","Филёвский парк","Багратионовская",
    "Фили","Кутузовская","Студенческая","Киевская",
    "Смоленская","Арбатская","Александровский сад"
  ],
  "Кольцевая": [
    "Комсомольская","Курская","Таганская","Павелецкая",
    "Добрынинская","Октябрьская","Парк культуры","Киевская",
    "Краснопресненская","Белорусская","Новослободская",
    "Проспект Мира"
  ]
};

let openedStations = JSON.parse(localStorage.getItem("openedStations") || "{}");

function startMatch3() {
  generateMatch3Board();
  renderMatch3();
  renderStationPanel();
}

function generateMatch3Board() {
  match3Board = [];

  for (let y = 0; y < match3Size; y++) {
    match3Board[y] = [];
    for (let x = 0; x < match3Size; x++) {
      let color;
      do {
        color = match3Colors[Math.floor(Math.random() * match3Colors.length)];
      } while (
        (x >= 2 &&
          match3Board[y][x - 1] === color &&
          match3Board[y][x - 2] === color) ||
        (y >= 2 &&
          match3Board[y - 1][x] === color &&
          match3Board[y - 2][x] === color)
      );
      match3Board[y][x] = color;
    }
  }
}

function renderMatch3() {
  match3Grid.innerHTML = "";
  match3Grid.style.gridTemplateColumns = `repeat(${match3Size}, 1fr)`;

  match3Board.forEach((row, y) => {
    row.forEach((color, x) => {
      const cell = document.createElement("div");
      cell.className = "match3-cell";
      cell.style.background = color;
      cell.onclick = () => selectMatch3(x, y);
      match3Grid.appendChild(cell);
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
    match3Selected = { x, y };
    return;
  }

  swapMatch3(match3Selected.x, match3Selected.y, x, y);
  match3Selected = null;
}

function swapMatch3(x1, y1, x2, y2) {
  [match3Board[y1][x1], match3Board[y2][x2]] =
    [match3Board[y2][x2], match3Board[y1][x1]];

  if (!checkMatches()) {
    [match3Board[y1][x1], match3Board[y2][x2]] =
      [match3Board[y2][x2], match3Board[y1][x1]];
    renderMatch3();
    return;
  }

  resolveMatches();
}

function checkMatches() {
  for (let y = 0; y < match3Size; y++) {
    for (let x = 0; x < match3Size - 2; x++) {
      const c = match3Board[y][x];
      if (c && c === match3Board[y][x + 1] && c === match3Board[y][x + 2]) return true;
    }
  }
  for (let x = 0; x < match3Size; x++) {
    for (let y = 0; y < match3Size - 2; y++) {
      const c = match3Board[y][x];
      if (c && c === match3Board[y + 1][x] && c === match3Board[y + 2][x]) return true;
    }
  }
  return false;
}

function resolveMatches() {
  const remove = Array.from({ length: match3Size }, () =>
    Array(match3Size).fill(false)
  );

  for (let y = 0; y < match3Size; y++) {
    for (let x = 0; x < match3Size - 2; x++) {
      const c = match3Board[y][x];
      if (c && c === match3Board[y][x + 1] && c === match3Board[y][x + 2]) {
        remove[y][x] = remove[y][x + 1] = remove[y][x + 2] = true;
      }
    }
  }

  for (let x = 0; x < match3Size; x++) {
    for (let y = 0; y < match3Size - 2; y++) {
      const c = match3Board[y][x];
      if (c && c === match3Board[y + 1][x] && c === match3Board[y + 2][x]) {
        remove[y][x] = remove[y + 1][x] = remove[y + 2][x] = true;
      }
    }
  }

  let removedAny = false;
  for (let y = 0; y < match3Size; y++) {
    for (let x = 0; x < match3Size; x++) {
      if (remove[y][x]) {
        match3Board[y][x] = null;
        removedAny = true;
      }
    }
  }

  if (!removedAny) return;

  for (let x = 0; x < match3Size; x++) {
    for (let y = match3Size - 1; y >= 0; y--) {
      if (match3Board[y][x] === null) {
        for (let yy = y - 1; yy >= 0; yy--) {
          if (match3Board[yy][x] !== null) {
            match3Board[y][x] = match3Board[yy][x];
            match3Board[yy][x] = null;
            break;
          }
        }
        if (match3Board[y][x] === null) {
          match3Board[y][x] =
            match3Colors[Math.floor(Math.random() * match3Colors.length)];
        }
      }
    }
  }

  renderMatch3();
  setTimeout(resolveMatches, 150);
}

function renderStationPanel() {
  const line = match3LineSelect.value;
  const stations = metroLines[line];

  if (!openedStations[line]) openedStations[line] = [];

  stationPanel.innerHTML = `<div class="station-line">${line}</div>`;

  stations.forEach(st => {
    const div = document.createElement("div");
    div.className = "station";
    if (openedStations[line].includes(st)) div.classList.add("done");
    div.textContent = (openedStations[line].includes(st) ? "✅ " : "⬜ ") + st;
    stationPanel.appendChild(div);
  });

  localStorage.setItem("openedStations", JSON.stringify(openedStations));
}

match3LineSelect.onchange = startMatch3;

/******************************
 * ИНИЦИАЛИЗАЦИЯ
 ******************************/
showScreen("menu");
startMaze();
startMatch3();
startMemory();