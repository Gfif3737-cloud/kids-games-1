const game = document.getElementById("game");
const characterSelect = document.getElementById("characterSelect");
const startBtn = document.querySelector("button[onclick='startGame()']");
let size = 15;
let maze = [];
let player = { x: 0, y: 0 };
let goal = { x: size - 1, y: size - 1 };
let playerEmoji = "🐵";
let goalEmoji = "🍊";
let steps = 0;
let timer = 0;
let timerInterval = null;
let gameActive = true;
let currentLevel = 1;

const characters = {
  cheburashka: { player: "🐵", goal: "🍊" },
  pin: { player: "🐧", goal: "🚗" },
  matroskin: { player: "🐱", goal: "🐄" },
  masha: { player: "👧", goal: "🐻" }
};

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

function createStatsPanel() {
  const oldStats = document.getElementById("statsPanel");
  if (oldStats) oldStats.remove();
  
  const statsDiv = document.createElement("div");
  statsDiv.id = "statsPanel";
  statsDiv.className = "stats-panel";
  statsDiv.innerHTML = `<span>Шаги: 0</span><span>Время: 0с</span>`;
  game.parentNode.insertBefore(statsDiv, game);
}

function updateStats() {
  const statsDiv = document.getElementById("statsPanel");
  if (statsDiv) {
    statsDiv.innerHTML = `<span>Шаги: ${steps}</span><span>Время: ${timer}с</span>`;
  }
}

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

/* ---------- ПРОВЕРКА ПУТИ ---------- */
function isPathExists() {
  const queue = [{ x: player.x, y: player.y }];
  const visited = Array(size).fill().map(() => Array(size).fill(false));
  visited[player.y][player.x] = true;
  
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  
  while (queue.length > 0) {
    const { x, y } = queue.shift();
    
    if (x === goal.x && y === goal.y) {
      return true;
    }
    
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && 
          maze[ny][nx] === 0 && !visited[ny][nx]) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }
  
  return false;
}

/* ---------- ВЫБОР СЛУЧАЙНЫХ ПОЗИЦИЙ ---------- */
function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size)
  };
}

/* ---------- ГЕНЕРАЦИЯ ЛАБИРИНТА ---------- */
function generateMaze(level) {
  const complexity = Math.min(0.3 + level * 0.05, 0.7);
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    maze = Array(size).fill().map(() => Array(size).fill(1));
    
    function carve(x, y) {
      const dirs = [
        [0, -2], [2, 0], [0, 2], [-2, 0]
      ].sort(() => Math.random() - 0.5);
      
      maze[y][x] = 0;
      
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 1) {
          maze[y + dy/2][x + dx/2] = 0;
          carve(nx, ny);
        }
      }
    }
    
    // Выбираем случайную стартовую позицию
    let startPos;
    do {
      startPos = getRandomPosition();
    } while (startPos.x % 2 !== 0 || startPos.y % 2 !== 0);
    
    player = startPos;
    carve(player.x, player.y);
    
    // Выбираем случайную позицию для финиша
    do {
      goal = getRandomPosition();
    } while ((Math.abs(goal.x - player.x) < 5 && Math.abs(goal.y - player.y) < 5) || 
             maze[goal.y][goal.x] === 1);
    
    maze[goal.y][goal.x] = 0;
    
    // Добавляем стены
    addWalls(complexity);
    
    attempts++;
    
    if (attempts > maxAttempts) {
      return generateSimpleMaze();
    }
    
  } while (!isPathExists());
}

/* ---------- ПРОСТОЙ ЛАБИРИНТ ---------- */
function generateSimpleMaze() {
  maze = Array(size).fill().map(() => Array(size).fill(0));
  
  // Добавляем немного стен
  for (let i = 0; i < size * 2; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if ((x !== player.x || y !== player.y) && (x !== goal.x || y !== goal.y)) {
      maze[y][x] = 1;
    }
  }
}

/* ---------- ДОБАВЛЕНИЕ СТЕН ---------- */
function addWalls(complexity) {
  const wallsToAdd = Math.floor(size * size * complexity * 0.15);
  
  for (let i = 0; i < wallsToAdd; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    if ((x === player.x && y === player.y) || (x === goal.x && y === goal.y)) continue;
    
    if (maze[y][x] === 0) {
      maze[y][x] = 1;
      
      if (!isPathExists()) {
        maze[y][x] = 0;
      }
    }
  }
}

function draw() {
  game.innerHTML = "";
  
  game.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

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
      
      document.getElementById("nextLevelBtn").style.display = "inline-block";
      
      setTimeout(() => {
        alert(`🎉 Уровень ${currentLevel} пройден! Ты сделал ${steps} шагов за ${timer} секунд!`);
      }, 100);
    }
  }
}

function startGame() {
  const choice = characterSelect.value;
  playerEmoji = characters[choice].player;
  goalEmoji = characters[choice].goal;
  
  steps = 0;
  gameActive = true;
  
  const nextBtn = document.getElementById("nextLevelBtn");
  if (nextBtn) nextBtn.style.display = "none";
  
  generateMaze(currentLevel);
  draw();
  
  stopTimer();
  startTimer();
  updateStats();
}

document.addEventListener("keydown", (e) => {
  if (!gameActive) return;
  
  switch(e.key) {
    case "ArrowUp": e.preventDefault(); move(0, -1); break;
    case "ArrowDown": e.preventDefault(); move(0, 1); break;
    case "ArrowLeft": e.preventDefault(); move(-1, 0); break;
    case "ArrowRight": e.preventDefault(); move(1, 0); break;
  }
});

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
  
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
    if (dx > 0) move(1, 0);
    else move(-1, 0);
  } else if (Math.abs(dy) > 20) {
    if (dy > 0) move(0, 1);
    else move(0, -1);
  }
  e.preventDefault();
});

document.addEventListener("touchmove", (e) => {
  if (e.target.closest("#game")) {
    e.preventDefault();
  }
}, { passive: false });

createLevelPanel();
createStatsPanel();

startBtn.onclick = () => {
  currentLevel = 1;
  document.getElementById("levelNum").textContent = "1";
  startGame();
};

startGame();