/* =====================
   ОБЩЕЕ
===================== */
const menu = document.getElementById("menu");
const memoryScreen = document.getElementById("memoryScreen");
const mazeScreen = document.getElementById("mazeScreen");
const matchScreen = document.getElementById("matchScreen");

function show(screen) {
  menu.classList.add("hidden");
  memoryScreen.classList.add("hidden");
  mazeScreen.classList.add("hidden");
  matchScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

function backToMenu() {
  show(menu);
}

/* =====================
   🔴 ЛИНИЯ ПАМЯТИ
===================== */

const memoryThemes = {
  smeshariki: ["🐰", "🐷", "🦔", "🐧", "🦉", "🐻"],
  fixiki: ["🔧", "⚙️", "💡", "🔌", "🔋", "🪛"],
  masha: ["👧", "🐻", "🍯", "🏡", "🌲", "🐾"],
  winnie: ["🐻", "🍯", "🐷", "🐯", "🦉", "🐰"],
  prostokvashino: ["🐱", "🐶", "📸", "🥛", "🚜", "🏡"]
};

let memoryFirst = null;
let memoryLock = false;

function openMemory() {
  show(memoryScreen);
  startMemory();
}

function startMemory() {
  const theme = document.getElementById("memoryTheme").value;
  const base = memoryThemes[theme];
  const cards = [...base, ...base].sort(() => Math.random() - 0.5);

  const grid = document.getElementById("memoryGrid");
  grid.innerHTML = "";
  memoryFirst = null;
  memoryLock = false;

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "memoryCard";
    card.textContent = "❓";

    card.onclick = () => {
      if (memoryLock || card.classList.contains("open")) return;
      card.classList.add("open");
      card.textContent = symbol;

      if (!memoryFirst) {
        memoryFirst = card;
      } else {
        if (memoryFirst.textContent === symbol) {
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
    };

    grid.appendChild(card);
  });
}

/* =====================
   🔵 ЛИНИЯ ЛАБИРИНТА
===================== */

const mazeCharacters = [
  { player: "🐵", goal: "🍊", name: "Чебурашка → мандарин" },
  { player: "🤖", goal: "🚗", name: "Пин → Биби" },
  { player: "🐱", goal: "🐮", name: "Матроскин → Мурка" },
  { player: "👧", goal: "🏠", name: "Маша → домик" }
];

let mazeLevel = 1;
let mazePlayerPos = { x: 0, y: 0 };
let mazeGoalPos = { x: 0, y: 0 };
let mazeMap = [];
let mazeChar = mazeCharacters[0];

function openMaze() {
  show(mazeScreen);
  mazeLevel = 1;
  newMaze();
}

function newMaze() {
  mazeChar = mazeCharacters[Math.floor(Math.random() * mazeCharacters.length)];
  document.getElementById("mazeTitle").textContent = "🔵 " + mazeChar.name;
  document.getElementById("mazeLevel").textContent = "Уровень " + mazeLevel;

  const size = 7;
  mazeMap = Array.from({ length: size }, () => Array(size).fill(1));

  function carve(x, y) {
    mazeMap[y][x] = 0;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]].sort(() => Math.random() - 0.5);
    for (const [dx, dy] of dirs) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;
      if (ny >= 0 && ny < size && nx >= 0 && nx < size && mazeMap[ny][nx] === 1) {
        mazeMap[y + dy][x + dx] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(0, 0);

  mazePlayerPos = { x: 0, y: 0 };
  mazeGoalPos = { x: size - 1, y: size - 1 };

  drawMaze();
}

function drawMaze() {
  const grid = document.getElementById("mazeGrid");
  grid.innerHTML = "";

  for (let y = 0; y < mazeMap.length; y++) {
    for (let x = 0; x < mazeMap[0].length; x++) {
      const cell = document.createElement("div");
      cell.className = "mazeCell";
      if (mazeMap[y][x] === 1) cell.classList.add("wall");

      if (x === mazePlayerPos.x && y === mazePlayerPos.y) {
        cell.classList.add("player");
        cell.textContent = mazeChar.player;
      } else if (x === mazeGoalPos.x && y === mazeGoalPos.y) {
        cell.classList.add("goal");
        cell.textContent = mazeChar.goal;
      }

      grid.appendChild(cell);
    }
  }
}

document.addEventListener("keydown", e => {
  if (mazeScreen.classList.contains("hidden")) return;

  let dx = 0, dy = 0;
  if (e.key === "ArrowUp") dy = -1;
  if (e.key === "ArrowDown") dy = 1;
  if (e.key === "ArrowLeft") dx = -1;
  if (e.key === "ArrowRight") dx = 1;

  const nx = mazePlayerPos.x + dx;
  const ny = mazePlayerPos.y + dy;

  if (
    ny >= 0 &&
    ny < mazeMap.length &&
    nx >= 0 &&
    nx < mazeMap[0].length &&
    mazeMap[ny][nx] === 0
  ) {
    mazePlayerPos = { x: nx, y: ny };
    drawMaze();

    if (nx === mazeGoalPos.x && ny === mazeGoalPos.y) {
      mazeLevel++;
      setTimeout(newMaze, 400);
    }
  }
});

/* =====================
   🟣 ТРИ В РЯД — МЕТРО
===================== */

const metroLines = [
  { name: "Сокольническая", color: "#d32f2f", stations: ["Бульвар Рокоссовского","Черкизовская","Преображенская площадь","Сокольники","Красносельская","Комсомольская","Красные ворота","Чистые пруды","Лубянка","Охотный ряд","Библиотека им. Ленина","Кропоткинская","Парк культуры","Фрунзенская","Спортивная","Воробьёвы горы","Университет","Проспект Вернадского","Юго-Западная"] },
  { name: "Замоскворецкая", color: "#2e7d32", stations: ["Ховрино","Беломорская","Речной вокзал","Водный стадион","Войковская","Сокол","Аэропорт","Динамо","Белорусская","Маяковская","Тверская","Театральная","Новокузнецкая","Павелецкая","Автозаводская","Технопарк","Коломенская","Каширская","Кантемировская","Царицыно","Орехово","Домодедовская","Красногвардейская","Алма-Атинская"] },
  { name: "Арбатско-Покровская", color: "#1565c0", stations: ["Пятницкое шоссе","Митино","Волоколамская","Мякинино","Строгино","Крылатское","Молодёжная","Кунцевская","Славянский бульвар","Парк Победы","Киевская","Смоленская","Арбатская","Площадь Революции","Курская","Бауманская","Электрозаводская","Семёновская","Партизанская","Измайловская","Первомайская","Щёлковская"] },
  { name: "Филёвская", color: "#00acc1", stations: ["Кунцевская","Пионерская","Филёвский парк","Багратионовская","Фили","Кутузовская","Студенческая","Киевская","Смоленская","Арбатская","Александровский сад"] },
  { name: "Кольцевая", color: "#8d6e63", stations: ["Комсомольская","Курская","Таганская","Павелецкая","Добрынинская","Октябрьская","Парк культуры","Киевская","Краснопресненская","Белорусская","Новослободская","Проспект Мира"] }
];

const matchColors = [
  "#d32f2f", // красная
  "#2e7d32", // зелёная
  "#1565c0", // синяя
  "#00acc1", // голубая
  "#8d6e63"  // коричневая
];

let matchGrid = [];
let selectedCell = null;
let matchLevel = 1;
let currentLines = [];
let collectedStations = [];

function openMatch() {
  show(matchScreen);
  matchLevel = 1;
  startMatchLevel();
}

function startMatchLevel() {
  document.getElementById("matchLevelText").textContent = "Уровень " + matchLevel + " — собери станции";

  const start = (matchLevel - 1) * 5;
  currentLines = metroLines.slice(start, start + 5);
  collectedStations = [];

  generateMatchGrid();
  renderStationsPanel();
}

function randomColor() {
  return matchColors[Math.floor(Math.random() * matchColors.length)];
}

function generateMatchGrid() {
  const size = 6;
  matchGrid = [];

  for (let y = 0; y < size; y++) {
    matchGrid[y] = [];
    for (let x = 0; x < size; x++) {
      let color;
      do {
        color = randomColor();
      } while (
        (x >= 2 && matchGrid[y][x-1] === color && matchGrid[y][x-2] === color) ||
        (y >= 2 && matchGrid[y-1][x] === color && matchGrid[y-2][x] === color)
      );
      matchGrid[y][x] = color;
    }
  }

  drawMatchGrid();
}

function drawMatchGrid() {
  const grid = document.getElementById("matchGrid");
  grid.innerHTML = "";

  for (let y = 0; y < matchGrid.length; y++) {
    for (let x = 0; x < matchGrid[0].length; x++) {
      const cell = document.createElement("div");
      cell.className = "matchCell";
      cell.style.background = matchGrid[y][x];

      cell.onclick = () => onMatchCellClick(x, y);

      grid.appendChild(cell);
    }
  }
}

function onMatchCellClick(x, y) {
  if (!selectedCell) {
    selectedCell = { x, y };
  } else {
    const dx = Math.abs(selectedCell.x - x);
    const dy = Math.abs(selectedCell.y - y);
    if (dx + dy === 1) {
      swapCells(selectedCell.x, selectedCell.y, x, y);
      if (!checkMatches()) {
        swapCells(selectedCell.x, selectedCell.y, x, y);
      }
    }
    selectedCell = null;
  }
}

function swapCells(x1, y1, x2, y2) {
  const temp = matchGrid[y1][x1];
  matchGrid[y1][x1] = matchGrid[y2][x2];
  matchGrid[y2][x2] = temp;
  drawMatchGrid();
}

function checkMatches() {
  let found = false;
  const toClear = [];

  // горизонталь
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 4; x++) {
      const c = matchGrid[y][x];
      if (c && matchGrid[y][x+1] === c && matchGrid[y][x+2] === c) {
        toClear.push([x,y],[x+1,y],[x+2,y]);
        found = true;
      }
    }
  }

  // вертикаль
  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 4; y++) {
      const c = matchGrid[y][x];
      if (c && matchGrid[y+1][x] === c && matchGrid[y+2][x] === c) {
        toClear.push([x,y],[x,y+1],[x,y+2]);
        found = true;
      }
    }
  }

  if (found) {
    clearMatches(toClear);
  }

  return found;
}

function clearMatches(cells) {
  cells.forEach(([x,y]) => {
    const color = matchGrid[y][x];
    awardStation(color);
    matchGrid[y][x] = null;
  });

  dropCells();
  setTimeout(drawMatchGrid, 200);
}

function dropCells() {
  for (let x = 0; x < 6; x++) {
    for (let y = 5; y >= 0; y--) {
      if (matchGrid[y][x] === null) {
        for (let yy = y - 1; yy >= 0; yy--) {
          if (matchGrid[yy][x] !== null) {
            matchGrid[y][x] = matchGrid[yy][x];
            matchGrid[yy][x] = null;
            break;
          }
        }
        if (matchGrid[y][x] === null) {
          matchGrid[y][x] = randomColor();
        }
      }
    }
  }

  if (checkMatches()) return;
}

function awardStation(color) {
  const line = currentLines.find(l => l.color === color);
  if (!line) return;

  const remaining = line.stations.filter(s => !collectedStations.includes(s));
  if (remaining.length === 0) return;

  const station = remaining[0];
  collectedStations.push(station);
  renderStationsPanel();

  const totalStations = currentLines.reduce((sum, l) => sum + l.stations.length, 0);
  if (collectedStations.length >= totalStations) {
    setTimeout(() => {
      alert("🚇 Линии собраны!");
      matchLevel++;
      if ((matchLevel - 1) * 5 < metroLines.length) {
        startMatchLevel();
      } else {
        alert("🎉 Всё метро собрано!");
        backToMenu();
      }
    }, 300);
  }
}

function renderStationsPanel() {
  const panel = document.getElementById("stationsPanel");
  panel.innerHTML = "";

  currentLines.forEach(line => {
    line.stations.forEach(st => {
      const badge = document.createElement("div");
      badge.className = "stationBadge";
      badge.textContent = st;
      badge.style.background = collectedStations.includes(st) ? line.color : "#333";
      panel.appendChild(badge);
    });
  });
}