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
    
    // Прогресс
    let completedLevels = JSON.parse(localStorage.getItem("maze_completed")) || 0;
    let characterLevelCount = JSON.parse(localStorage.getItem("maze_character_levels")) || {
        cheburashka: 0, pin: 0, matroskin: 0, masha: 0
    };
    let totalLevelsCompleted = JSON.parse(localStorage.getItem("maze_total_completed")) || 0;

    // ==================== НАГРАДЫ ====================
    const LEVEL_REWARDS = {
        3: "🏆 Первый километр",
        6: "🏆 Подземный ходок",
        9: "🏆 Станция «Туннель»",
        12: "🏆 Машинист 3-го класса",
        15: "🏆 Машинист 2-го класса",
        18: "🏆 Машинист 1-го класса",
        21: "🏆 Начальник депо",
        24: "🏆 Начальник линии",
        27: "🏆 Начальник метро",
        30: "🏆 Легенда метро"
    };

    // ==================== ДОСТИЖЕНИЯ ====================
    let achievements = JSON.parse(localStorage.getItem('maze_achievements')) || {
        characterLevels: { cheburashka: [], pin: [], matroskin: [], masha: [] },
        total50: false,
        total100: false
    };

    let artifacts = JSON.parse(localStorage.getItem("metro_artifacts")) || {};

    function initArtifacts() {
        if (!artifacts.mazeRewards) {
            artifacts.mazeRewards = {};
            for (let level in LEVEL_REWARDS) artifacts.mazeRewards[level] = false;
        }
        if (!artifacts.mazeAchievements) artifacts.mazeAchievements = [];
        localStorage.setItem("metro_artifacts", JSON.stringify(artifacts));
    }

    function giveReward(level) {
        const rewardName = LEVEL_REWARDS[level];
        if (!rewardName || artifacts.mazeRewards[level]) return;
        artifacts.mazeRewards[level] = true;
        localStorage.setItem("metro_artifacts", JSON.stringify(artifacts));
        setTimeout(() => alert(`🏆 НАГРАДА!\n\n${rewardName}`), 300);
    }

    function unlockAchievement(text) {
        if (artifacts.mazeAchievements.includes(text)) return;
        artifacts.mazeAchievements.push(text);
        localStorage.setItem("metro_artifacts", JSON.stringify(artifacts));
        setTimeout(() => alert(`🏅 ДОСТИЖЕНИЕ!\n\n${text}`), 500);
    }

    function checkAchievements(character) {
        characterLevelCount[character]++;
        totalLevelsCompleted++;
        localStorage.setItem("maze_character_levels", JSON.stringify(characterLevelCount));
        localStorage.setItem("maze_total_completed", JSON.stringify(totalLevelsCompleted));
        
        const milestones = [5, 10, 15, 20, 25];
        const charName = { cheburashka: "Чебурашка", pin: "Пин", matroskin: "Матроскин", masha: "Маша" }[character];
        
        for (let m of milestones) {
            if (characterLevelCount[character] >= m && !achievements.characterLevels[character].includes(m)) {
                achievements.characterLevels[character].push(m);
                unlockAchievement(`🎭 ${charName} прошёл ${m} уровней!`);
            }
        }
        if (totalLevelsCompleted >= 50 && !achievements.total50) {
            achievements.total50 = true;
            unlockAchievement(`🏅 Мастер лабиринта! 50 уровней!`);
        }
        if (totalLevelsCompleted >= 100 && !achievements.total100) {
            achievements.total100 = true;
            unlockAchievement(`👑 Легенда лабиринта! 100 уровней!`);
        }
        localStorage.setItem('maze_achievements', JSON.stringify(achievements));
    }

    // ==================== ГЕНЕРАЦИЯ ЛАБИРИНТА (один путь + тупики) ====================
    function generateMazeWithOnePath() {
        // Создаём сетку из стен
        maze = Array(size).fill().map(() => Array(size).fill(1));
        
        // Рекурсивный алгоритм для создания основного пути
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
        
        // Начинаем с левого верхнего угла
        carve(0, 0);
        
        // Убеждаемся, что цель доступна (правый нижний угол)
        goal = { x: size - 1, y: size - 1 };
        maze[goal.y][goal.x] = 0;
        
        // Добавляем тупики (ответвления) для сложности
        for (let i = 0; i < size * 3; i++) {
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            // Не трогаем старт и цель
            if ((x === 0 && y === 0) || (x === goal.x && y === goal.y)) continue;
            
            // Если клетка — проход, проверяем, можно ли добавить стену
            if (maze[y][x] === 0) {
                // Считаем соседей-проходов
                let pathNeighbors = 0;
                if (x > 0 && maze[y][x-1] === 0) pathNeighbors++;
                if (x < size-1 && maze[y][x+1] === 0) pathNeighbors++;
                if (y > 0 && maze[y-1][x] === 0) pathNeighbors++;
                if (y < size-1 && maze[y+1][x] === 0) pathNeighbors++;
                
                // Если у клетки 3 соседа-прохода — это тупик или развилка
                if (pathNeighbors === 3) {
                    // Превращаем в стену, создавая тупик
                    maze[y][x] = 1;
                }
            }
        }
        
        // Убеждаемся, что путь до цели всё ещё существует
        if (!isPathToGoal()) {
            // Если пути нет — перегенерируем
            generateMazeWithOnePath();
        }
    }
    
    // Проверка существования пути от старта до цели (BFS)
    function isPathToGoal() {
        const queue = [{ x: 0, y: 0 }];
        const visited = Array(size).fill().map(() => Array(size).fill(false));
        visited[0][0] = true;
        
        while (queue.length > 0) {
            const { x, y } = queue.shift();
            if (x === goal.x && y === goal.y) return true;
            
            const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 0 && !visited[ny][nx]) {
                    visited[ny][nx] = true;
                    queue.push({ x: nx, y: ny });
                }
            }
        }
        return false;
    }

    // ==================== ОТРИСОВКА ====================
    function draw() {
        game.innerHTML = "";
        const cellSize = Math.min(38, window.innerWidth / size);
        game.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                
                if (x === player.x && y === player.y) {
                    cell.classList.add("player");
                    cell.textContent = playerEmoji;
                    cell.style.fontSize = `${cellSize * 0.7}px`;
                } 
                else if (x === goal.x && y === goal.y) {
                    cell.classList.add("goal");
                    cell.textContent = goalEmoji;
                    cell.style.fontSize = `${cellSize * 0.7}px`;
                }
                else if (maze[y][x] === 1) {
                    cell.classList.add("wall");
                    cell.textContent = "█";
                    cell.style.fontSize = `${cellSize * 0.6}px`;
                    cell.style.color = "#3a5a6a";
                }
                else {
                    cell.classList.add("path");
                    cell.textContent = "·";
                    cell.style.fontSize = `${cellSize * 0.5}px`;
                    cell.style.color = "#4a6a7a";
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
        
        if (nx >= 0 && ny >= 0 && nx < size && ny < size && maze[ny][nx] === 0) {
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
                
                if (completedLevels % 3 === 0) giveReward(completedLevels);
                checkAchievements(characterSelect.value);
                
                document.getElementById("nextLevelBtn").style.display = "inline-block";
                updateStats();
                
                setTimeout(() => {
                    alert(`🎉 Уровень ${currentLevel} пройден!\nШагов: ${steps}\nВремя: ${timer}с`);
                }, 100);
            }
        }
    }

    // ==================== ИНТЕРФЕЙС ====================
    function createLevelPanel() {
        const panel = document.createElement("div");
        panel.className = "level-panel";
        panel.innerHTML = `
            <button class="next-btn" id="nextLevelBtn" style="display: none;">➡️ Дальше</button>
            <div class="level-display">Уровень: <span id="levelNum">1</span></div>
        `;
        document.querySelector(".controls").parentNode.insertBefore(panel, document.querySelector(".controls").nextSibling);
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
        statsDiv.innerHTML = `<span>Шаги: 0</span><span>Время: 0с</span><span>Уровни: ${completedLevels}</span>`;
        game.parentNode.insertBefore(statsDiv, game);
    }

    function updateStats() {
        const statsDiv = document.getElementById("statsPanel");
        if (statsDiv) statsDiv.innerHTML = `<span>Шаги: ${steps}</span><span>Время: ${timer}с</span><span>Уровни: ${completedLevels}</span>`;
    }

    function startTimer() {
        stopTimer();
        timer = 0;
        updateStats();
        timerInterval = setInterval(() => { timer++; updateStats(); }, 1000);
    }

    function stopTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }

    function startGame() {
        const choice = characterSelect.value;
        playerEmoji = characters[choice].player;
        goalEmoji = characters[choice].goal;
        steps = 0;
        gameActive = true;
        generateMazeWithOnePath();
        player = { x: 0, y: 0 };
        draw();
        stopTimer();
        startTimer();
        updateStats();
        document.getElementById("nextLevelBtn").style.display = "none";
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

    let touchStartX = 0, touchStartY = 0;
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
        if (e.target.closest("#game")) e.preventDefault();
    }, { passive: false });

    // ==================== ЗАПУСК ====================
    createLevelPanel();
    createStatsPanel();
    initArtifacts();

    startBtn.onclick = () => {
        currentLevel = 1;
        document.getElementById("levelNum").textContent = "1";
        startGame();
    };

    startGame();
});