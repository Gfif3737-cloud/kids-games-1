/* =======================
   ОБЩИЕ НАСТРОЙКИ
======================= */

const screens = {
  menu: document.getElementById("menu"),
  match3: document.getElementById("match3"),
  memory: document.getElementById("memory"),
  maze: document.getElementById("maze"),
  metroMap: document.getElementById("metroMap")
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.style.display = "none");
  screens[name].style.display = "block";
}

/* =======================
   КНОПКИ МЕНЮ
======================= */

document.getElementById("btnMatch3").onclick = () => showMatch3();
document.getElementById("btnMemory").onclick = () => showMemory();
document.getElementById("btnMaze").onclick = () => showMaze();

document.querySelectorAll(".back-btn").forEach(btn => {
  btn.onclick = () => showScreen("menu");
});

/* =======================
   ---------- ТРИ В РЯД ----------
======================= */

const match3Grid = document.getElementById("match3Grid");
const stationList = document.getElementById("stationList");

let match3Level = 1;
let match3Size = 6;
let match3Selected = null;

const colors = ["red", "blue", "green", "cyan", "gray"];

function showMatch3() {
  showScreen("match3");
  buildMatch3();
}

function buildMatch3() {
  match3Grid.innerHTML = "";
  match3Selected = null;

  for (let i = 0; i < match3Size * match3Size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.color = colors[Math.floor(Math.random() * colors.length)];
    cell.style.background = cell.dataset.color;
    cell.dataset.index = i;

    cell.onclick = () => handleMatch3Click(cell);
    cell.ontouchstart = e => {
      e.preventDefault();
      handleMatch3Click(cell);
    };

    match3Grid.appendChild(cell);
  }
}

function handleMatch3Click(cell) {
  if (!match3Selected) {
    match3Selected = cell;
    cell.classList.add("selected");
  } else {
    swapCells(match3Selected, cell);
    match3Selected.classList.remove("selected");
    match3Selected = null;
    setTimeout(checkMatches, 200);
  }
}

function swapCells(a, b) {
  const temp = a.dataset.color;
  a.dataset.color = b.dataset.color;
  b.dataset.color = temp;
  a.style.background = a.dataset.color;
  b.style.background = b.dataset.color;
}

function checkMatches() {
  const cells = [...document.querySelectorAll("#match3Grid .cell")];
  let matched = false;

  // горизонтали
  for (let r = 0; r < match3Size; r++) {
    for (let c = 0; c < match3Size - 2; c++) {
      const i = r * match3Size + c;
      const a = cells[i], b = cells[i + 1], c2 = cells[i + 2];
      if (a.dataset.color === b.dataset.color && b.dataset.color === c2.dataset.color) {
        a.style.opacity = b.style.opacity = c2.style.opacity = 0.3;
        matched = true;
      }
    }
  }

  // вертикали
  for (let c = 0; c < match3Size; c++) {
    for (let r = 0; r < match3Size - 2; r++) {
      const i = r * match3Size + c;
      const a = cells[i], b = cells[i + match3Size], c2 = cells[i + match3Size * 2];
      if (a.dataset.color === b.dataset.color && b.dataset.color === c2.dataset.color) {
        a.style.opacity = b.style.opacity = c2.style.opacity = 0.3;
        matched = true;
      }
    }
  }

  if (matched) {
    setTimeout(() => {
      showMetroMap();
    }, 600);
  }
}

/* =======================
   ---------- КАРТА МЕТРО ----------
======================= */

function showMetroMap() {
  showScreen("metroMap");
}

/* =======================
   ---------- ЛИНИЯ ПАМЯТИ ----------
======================= */

const memoryGrid = document.getElementById("memoryGrid");

let memoryFirst = null;
let memoryLock = false;

const memoryIcons = ["🐻", "🐼", "🐸", "🐱", "🐶", "🦊"];

function showMemory() {
  showScreen("memory");
  buildMemory();
}

function buildMemory() {
  memoryGrid.innerHTML = "";
  memoryFirst = null;
  memoryLock = false;

  const cards = [...memoryIcons, ...memoryIcons].sort(() => Math.random() - 0.5);

  cards.forEach(icon => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.textContent = "?";
    card.dataset.icon = icon;

    card.onclick = () => handleMemoryClick(card);
    card.ontouchstart = e => {
      e.preventDefault();
      handleMemoryClick(card);
    };

    memoryGrid.appendChild(card);
  });
}

function handleMemoryClick(card) {
  if (memoryLock || card.classList.contains("open")) return;

  card.textContent = card.dataset.icon;
  card.classList.add("open");

  if (!memoryFirst) {
    memoryFirst = card;
  } else {
    if (memoryFirst.dataset.icon === card.dataset.icon) {
      memoryFirst = null;
    } else {
      memoryLock = true;
      setTimeout(() => {
        card.textContent = "?";
        memoryFirst.textContent = "?";
        card.classList.remove("open");
        memoryFirst.classList.remove("open");
        memoryFirst = null;
        memoryLock = false;
      }, 700);
    }
  }
}

/* =======================
   ---------- ЛАБИРИНТ ----------
======================= */

const mazeGrid = document.getElementById("mazeGrid");

let playerPos = 0;
let goalPos = 35;
const mazeSize = 6;

function showMaze() {
  showScreen("maze");
  buildMaze();
}

function buildMaze() {
  mazeGrid.innerHTML = "";
  playerPos = 0;

  for (let i = 0; i < mazeSize * mazeSize; i++) {
    const cell = document.createElement("div");
    cell.className = "maze-cell";
    if (i === playerPos) cell.textContent = "🙂";
    if (i === goalPos) cell.textContent = "🏁";
    mazeGrid.appendChild(cell);
  }

  document.onkeydown = handleMazeMove;
}

function handleMazeMove(e) {
  let newPos = playerPos;

  if (e.key === "ArrowRight") newPos++;
  if (e.key === "ArrowLeft") newPos--;
  if (e.key === "ArrowUp") newPos -= mazeSize;
  if (e.key === "ArrowDown") newPos += mazeSize;

  if (newPos < 0 || newPos >= mazeSize * mazeSize) return;

  playerPos = newPos;
  buildMaze();

  if (playerPos === goalPos) {
    setTimeout(() => {
      alert("🏆 Победа!");
      showScreen("menu");
    }, 200);
  }
}

/* =======================
   ЗАПУСК
======================= */

showScreen("menu");