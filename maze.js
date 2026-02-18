const game = document.getElementById("game");
const characterSelect = document.getElementById("characterSelect");
const startBtn = document.querySelector("button[onclick='startGame()']");
let size = 9; // базовый размер
let maze = [];
let player = { x: 0, y: 0 };
let goal = { x: size - 1, y: size - 1 };
let playerEmoji = "🐵";
let goalEmoji = "🍊";
let steps = 0;
let timer = 0;
let timerInterval = null;
let gameActive = true;
let currentLevel = "medium"; // по умолчанию

/* ---------- Персонажи ---------- */
const characters = {
  cheburashka: { player: "🐵", goal: "🍊" },
  pin: { player: "🐧", goal: "🚗" },
  matroskin: { player: "🐱", goal: "🐄" },
  masha: { player: "👧", goal: "🐻" }
};

/* ---------- Создание панели уровней ---------- */
function createLevelPanel() {
  const panel = document.createElement("div");
  panel.className = "level-panel";
  panel.innerHTML = `
    <button class="level-btn" data-level="easy">🌟 Лёгкий</button>
    <button class="level-btn active" data-level="medium">⚡ Средний</button>
    <button class="level-btn" data-level="hard">🔥 Сложный</button>
  `;
  
  const controls = document.querySelector(".controls");
  controls.parentNode.insertBefore(panel, controls.nextSibling);
  
  panel.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      panel.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentLevel = e.target.dataset.level;
    });
  });
}

/* ---------- Создание панели статистики ---------- */
function createStatsPanel() {
  const oldStats = document.getElementById("statsPanel");
  if (oldStats) oldStats.remove();
  
  const statsDiv = document.createElement("div");
  statsDiv.id = "statsPanel";
  statsDiv.className = "stats-panel";
  statsDiv.innerHTML = `<span>Шаги: 0</span><span>Время: 0с</span>`;
  game.parentNode.insertBefore(statsDiv, game);
}

/* ---------- Обновление статистики ---------- */
function updateStats() {
  const statsDiv = document.getElementById("statsPanel");
  if (statsDiv) {
    statsDiv.innerHTML = `<span>Шаги: ${steps}</span><span>Время: ${timer}с</span>`;
  }
}

/* ---------- Таймер ---------- */
function startTimer() {
  stopTimer();
  timer = 0;
  updateStats();
  timerInterval = setInterval(() => {
    timer++;
    updateStats();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/* ---------- Настройка размера по уровню ---------- */
function getLevelConfig(level) {
  switch(level) {
    case "easy":
      return { size: 7, difficulty: 0.3 }; // больше проходов
    case "medium":
      return { size: 9, difficulty: 0.5 };
    case "hard":
      return { size: 11, difficulty: 0.7 }; // больше стен, запутаннее
    default:
      return { size: 9, difficulty: 0.5 };
  }
}

/* ---------- Генерация лабиринта (более сложный алгоритм) ---------- */
function generateMaze() {
  const config = getLevelConfig(currentLevel);
  size = config.size;
  
  // Создаём сетку, заполненную стенами (1)
  maze = Array(size).fill().map(() => Array(size).fill(1));

  // Рекурсивный алгоритм генерации
  function carve(x, y) {
    // Направления: вверх, вправо, вниз, влево
    const dirs = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5);

    maze[y][x] = 0; // делаем проход

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      
      // Проверяем границы и что клетка - стена
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 1) {
        // Убираем стену между текущей и следующей клеткой
        maze[y + dy/2][x + dx/2] = 0;
        carve(nx, ny);
      }
    }
  }

  // Начинаем с верхнего левого угла
  carve(0, 0);
  
  // Добавляем дополнительные проходы для сложности
  if (config.difficulty > 0.5) {
    addExtraPaths(config.difficulty);
  }
  
  // Устанавливаем игрока и цель
  player = { x: 0, y: 0 };
  goal = { x: size - 1, y: size - 1 };
  maze[goal.y][goal.x] = 0; // гарантируем, что цель доступна
}

/* ---------- Добавление дополнительных путей (для сложности) ---------- */
function addExtraPaths(difficulty) {
  const extraPaths = Math.floor(size * size * (difficulty - 0.3));
  
  for (let i = 0; i < extraPaths; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    // Убираем случайную стену, но не портим структуру
    if (maze[y][x] === 1) {
      // Проверяем, что рядом есть проходы
      let neighbors = 0;
      if (x > 0 && maze[y][x-1] === 0) neighbors++;
      if (x < size-1 && maze[y][x+1] === 0) neighbors++;
      if (y > 0 && maze[y-1][x] === 0) neighbors++;
      if (y < size-1 && maze[y+1][x] === 0) neighbors++;
      
      if (neighbors >= 2) {
        maze[y][x] = 0; // убираем стену
      }
    }
  }
}

/* ---------- Отрисовка ---------- */
function draw() {
  game.innerHTML = "";
  game.style.gridTemplateColumns = `repeat(${size}, minmax(35px, 42px))`;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (maze[y][x] === 1) {
        cell.classList.add("wall");
      } else {
        cell.classList.add("path");
      }

      if (x === player.x && y === player.y) {
        cell.classList.add("player");
        cell.textContent = playerEmoji;
      } else if (x === goal.x && y === goal.y) {
        cell.classList.add("goal");
        cell.textContent = goalEmoji;
      }

      game.appendChild(cell);
    }
  }
}

/* ---------- Движение ---------- */
function move(dx, dy) {
  if (!gameActive) return;
  
  const nx = player.x + dx;
  const ny = player.y + dy;

  if (
    nx >= 0 && ny >= 0 &&
    nx < size && ny < size &&
    maze[ny][nx] === 0
  ) {
    player.x = nx;
    player.y = ny;
    steps++;
    updateStats();
    draw();

    if (player.x === goal.x && player.y === goal.y) {
      gameActive = false;
      stopTimer();
      setTimeout(() => {
        alert(`🎉 Победа! Ты дошёл за ${steps} шагов и ${timer} секунд!`);
      }, 100);
    }
  }
}

/* ---------- Старт игры ---------- */
function startGame() {
  const choice = characterSelect.value;
  playerEmoji = characters[choice].player;
  goalEmoji = characters[choice].goal;
  
  steps = 0;
  gameActive = true;
  
  generateMaze();
  draw();
  
  stopTimer();
  startTimer();
  updateStats();
}

/* ---------- Управление с клавиатуры ---------- */
document.addEventListener("keydown", (e) => {
  if (!gameActive) return;
  
  switch(e.key) {
    case "ArrowUp": e.preventDefault(); move(0, -1); break;
    case "ArrowDown": e.preventDefault(); move(0, 1); break;
    case "ArrowLeft": e.preventDefault(); move(-1, 0); break;
    case "ArrowRight": e.preventDefault(); move(1, 0); break;
  }
});

/* ---------- Управление свайпами (для телефона) ---------- */
let touchStartX = 0;
let touchStartY = 0;

game.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  e.preventDefault();
});

game.addEventListener("touchend", (e) => {
  if (!gameActive) return;
  
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
    if (dx > 0) move(1, 0);
    else move(-1, 0);
  } else if (Math.abs(dy) > 30) {
    if (dy > 0) move(0, 1);
    else move(0, -1);
  }
  e.preventDefault();
});

/* ---------- Запрещаем скролл при свайпах ---------- */
document.addEventListener("touchmove", (e) => {
  if (e.target.closest("#game")) {
    e.preventDefault();
  }
}, { passive: false });

/* ---------- Инициализация ---------- */
createLevelPanel();
createStatsPanel();
startGame(); // автостарт