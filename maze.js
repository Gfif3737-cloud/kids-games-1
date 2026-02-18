const game = document.getElementById("game");
const characterSelect = document.getElementById("characterSelect");
const startBtn = document.querySelector("button[onclick='startGame()']");
let size = 15; // базовый размер (увеличили!)
let maze = [];
let player = { x: 0, y: 0 };
let goal = { x: size - 1, y: size - 1 };
let playerEmoji = "🐵";
let goalEmoji = "🍊";
let steps = 0;
let timer = 0;
let timerInterval = null;
let gameActive = true;
let currentLevel = 1; // теперь уровень - число
let maxLevel = Infinity; // бесконечность

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
    <button class="next-btn" id="nextLevelBtn" style="display: none;">➡️ Дальше</button>
    <div class="level-display">Уровень: <span id="levelNum">1</span></div>
  `;
  
  const controls = document.querySelector(".controls");
  controls.parentNode.insertBefore(panel, controls.nextSibling);
  
  document.getElementById("nextLevelBtn").addEventListener("click", () => {
    currentLevel++;
    document.getElementById("levelNum").textContent = currentLevel;
    startGame();
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

/* ---------- Генерация лабиринта (рекурсивный алгоритм) ---------- */
function generateMaze(level) {
  // Размер остаётся 15, но сложность растёт с уровнем
  const complexity = Math.min(0.3 + level * 0.05, 0.8); // больше стен
  
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
      
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 1) {
        maze[y + dy/2][x + dx/2] = 0;
        carve(nx, ny);
      }
    }
  }

  // Начинаем с верхнего левого угла
  carve(0, 0);
  
  // Добавляем дополнительные стены для сложности
  addWalls(complexity);
  
  // Устанавливаем игрока и цель
  player = { x: 0, y: 0 };
  goal = { x: size - 1, y: size - 1 };
  maze[goal.y][goal.x] = 0;
  
  // Иногда делаем выход не в углу (для разнообразия)
  if (level > 3 && Math.random() > 0.5) {
    goal = {
      x: size - 1,
      y: Math.floor(Math.random() * (size - 2)) + 1
    };
    maze[goal.y][goal.x] = 0;
  }
}

/* ---------- Добавление стен для сложности ---------- */
function addWalls(complexity) {
  const wallsToAdd = Math.floor(size * size * complexity * 0.3);
  
  for (let i = 0; i < wallsToAdd; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    // Не трогаем старт и цель
    if ((x === 0 && y === 0) || (x === goal.x && y === goal.y)) continue;
    
    // Если это проход, можем сделать стеной
    if (maze[y][x] === 0) {
      // Проверяем, что не заблокируем путь
      let passable = false;
      if (x > 0 && maze[y][x-1] === 0) passable = true;
      if (x < size-1 && maze[y][x+1] === 0) passable = true;
      if (y > 0 && maze[y-1][x] === 0) passable = true;
      if (y < size-1 && maze[y+1][x] === 0) passable = true;
      
      // Если есть альтернативный путь, можно добавить стену
      if (passable && Math.random() > 0.7) {
        maze[y][x] = 1;
      }
    }
  }
}

/* ---------- Отрисовка ---------- */
function draw() {
  game.innerHTML = "";
  
  // Адаптивный размер клеток
  const screenWidth = window.innerWidth;
  let cellSize = 35;
  if (screenWidth > 600) cellSize = 45;
  if (screenWidth < 400) cellSize = 30;
  
  game.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;

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
      
      // Показываем кнопку "Дальше"
      document.getElementById("nextLevelBtn").style.display = "inline-block";
      
      setTimeout(() => {
        alert(`🎉 Уровень ${currentLevel} пройден! Ты сделал ${steps} шагов за ${timer} секунд!`);
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
  
  // Прячем кнопку "Дальше"
  const nextBtn = document.getElementById("nextLevelBtn");
  if (nextBtn) nextBtn.style.display = "none";
  
  generateMaze(currentLevel);
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

/* ---------- Управление свайпами ---------- */
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

/* ---------- Запрещаем скролл ---------- */
document.addEventListener("touchmove", (e) => {
  if (e.target.closest("#game")) {
    e.preventDefault();
  }
}, { passive: false });

/* ---------- Инициализация ---------- */
createLevelPanel();
createStatsPanel();

// Переопределяем кнопку "Начать"
startBtn.onclick = () => {
  currentLevel = 1;
  document.getElementById("levelNum").textContent = "1";
  startGame();
};

// Стартуем первый уровень
startGame();