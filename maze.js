document.addEventListener("DOMContentLoaded", () => {
  // ==================== ЭЛЕМЕНТЫ ====================
  const game = document.getElementById("game");
  const characterSelect = document.getElementById("characterSelect");
  const startBtn = document.querySelector("button[onclick='startGame()']");
  
  // ==================== ПЕРСОНАЖИ ====================
  const characters = {
    cheburashka: { player: "🐵", goal: "🍊" },
    pin: { player: "🐧", goal: "🚗" },
    matroskin: { player: "🐱", goal: "🐄" },
    masha: { player: "👧", goal: "🐻" }
  };
  
  // ==================== ПЕРЕМЕННЫЕ ====================
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
  
  // Для отслеживания пройденных уровней
  let completedLevels = JSON.parse(localStorage.getItem("maze_completed")) || 0;
  
  // ==================== СИСТЕМА АРТЕФАКТОВ ====================
  let artifacts = JSON.parse(localStorage.getItem("metro_artifacts")) || {
    wagons: [false, false, false, false, false, false, false, false, false, false],
    stations: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    tickets: [false, false, false, false, false, false, false, false],
    interiors: [false, false, false, false, false, false, false, false, false, false, false, false],
    uniforms: [false, false, false, false, false, false],
    equipment: [false, false, false, false, false, false, false, false, false],
    construction: [false, false, false, false, false, false, false],
    bonus: [false, false, false]
  };

  // Данные артефактов для лабиринта
  const artifactNames = {
    interiors: [
      "Старые указатели (1935)",
      "Касса 1930-х (1935)",
      "Скамья 1950-х (1955)",
      "Часы с курантами (1940)",
      "Газетный киоск (1960)",
      "Бочка с квасом (1970)",
      "Автомат с газировкой (1980)",
      "Турникет УТ-1 (1960)",
      "Светильник 1935",
      "Мозаика Корзина (1938)",
      "Барельеф Метрострой (1944)",
      "Эскалатор 1935"
    ],
    equipment: [
      "Контроллер машиниста (1935)",
      "Светофор семафорного типа (1940)",
      "Эскалаторный привод (1935)",
      "Телефонный аппарат (1950)",
      "Рельс 1935",
      "Шпала деревянная (1935)",
      "Вентиляционная установка (1940)",
      "Компостер (1960)",
      "Рация 1970-х"
    ]
  };

  // ==================== ФУНКЦИЯ ВЫДАЧИ АРТЕФАКТА ====================
  function giveArtifact() {
    const artifactType = (Math.floor(completedLevels / 5) % 2 === 0) ? "interiors" : "equipment";
    const artifactIndex = Math.floor(completedLevels / 10) % 12;
    
    if (artifactType === "interiors" && artifactIndex < 12 && !artifacts.interiors[artifactIndex]) {
      artifacts.interiors[artifactIndex] = true;
      localStorage.setItem("metro_artifacts", JSON.stringify(artifacts));
      
      setTimeout(() => {
        alert(`🏛️ ПОЛУЧЕН АРТЕФАКТ!\n\n${artifactNames.interiors[artifactIndex]}\n\nЗагляни в Музей метро!`);
      }, 500);
    }
    
    if (artifactType === "equipment" && artifactIndex < 9 && !artifacts.equipment[artifactIndex]) {
      artifacts.equipment[artifactIndex] = true;
      localStorage.setItem("metro_artifacts", JSON.stringify(artifacts));
      
      setTimeout(() => {
        alert(`🏛️ ПОЛУЧЕН АРТЕФАКТ!\n\n${artifactNames.equipment[artifactIndex]}\n\nЗагляни в Музей метро!`);
      }, 500);
    }
  }

  // ==================== ФУНКЦИИ ИНТЕРФЕЙСА ====================
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

  // ==================== ГЕНЕРАЦИЯ ЛАБИРИНТА ====================
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

  function getRandomPosition() {
    return {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size)
    };
  }

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
      
      let startPos;
      do {
        startPos = getRandomPosition();
      } while (startPos.x % 2 !== 0 || startPos.y % 2 !== 0);
      
      player = startPos;
      carve(player.x, player.y);
      
      do {
        goal = getRandomPosition();
      } while ((Math.abs(goal.x - player.x) < 5 && Math.abs(goal.y - player.y) < 5) || 
               maze[goal.y][goal.x] === 1);
      
      maze[goal.y][goal.x] = 0;
      
      attempts++;
      
      if (attempts > maxAttempts) {
        return generateSimpleMaze();
      }
      
    } while (!isPathExists());
  }

  function generateSimpleMaze() {
    maze = Array(size).fill().map(() => Array(size).fill(0));
    
    for (let i = 0; i < size * 2; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if ((x !== player.x || y !== player.y) && (x !== goal.x || y !== goal.y)) {
        maze[y][x] = 1;
      }
    }
  }

  // ==================== ОТРИСОВКА ====================
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

  // ==================== ДВИЖЕНИЕ ====================
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
        
        completedLevels++;
        localStorage.setItem("maze_completed", JSON.stringify(completedLevels));
        
        if (completedLevels % 5 === 0) {
          giveArtifact();
        }
        
        document.getElementById("nextLevelBtn").style.display = "inline-block";
        
        setTimeout(() => {
          alert(`🎉 Уровень ${currentLevel} пройден! Ты сделал ${steps} шагов за ${timer} секунд!`);
        }, 100);
      }
    }
  }

  // ==================== СТАРТ ИГРЫ ====================
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

  // ==================== УПРАВЛЕНИЕ ====================
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

  // ==================== ЗАПУСК ====================
  createLevelPanel();
  createStatsPanel();

  startBtn.onclick = () => {
    currentLevel = 1;
    document.getElementById("levelNum").textContent = "1";
    startGame();
  };

  startGame();
});