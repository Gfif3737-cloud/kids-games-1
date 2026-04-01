document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const startBtn = document.getElementById('startBtn');
    const characterSelect = document.getElementById('characterSelect');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const levelDisplay = document.getElementById('levelDisplay');
    const statsPanel = document.getElementById('statsPanel');
    
    // ==================== ПЕРСОНАЖИ ====================
    const characters = {
        cheburashka: { player: "🐵", goal: "🍊" },
        pin: { player: "🐧", goal: "🚗" },
        matroskin: { player: "🐱", goal: "🐄" },
        masha: { player: "👧", goal: "🐻" }
    };
    
    // ==================== ПЕРЕМЕННЫЕ ====================
    let size = 11;
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
    let completedLevels = JSON.parse(localStorage.getItem('maze_completed')) || 0;
    
    function updateStats() {
        statsPanel.innerHTML = `<span>Шаги: ${steps}</span><span>Время: ${timer}с</span><span>Уровни: ${completedLevels}</span>`;
    }
    
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timer = 0;
        updateStats();
        timerInterval = setInterval(() => { timer++; updateStats(); }, 1000);
    }
    
    function stopTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }
    
    // ==================== ГЕНЕРАЦИЯ ЛАБИРИНТА ====================
    function generateMaze() {
        maze = Array(size).fill().map(() => Array(size).fill(1));
        
        function carve(x, y) {
            const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]].sort(() => Math.random() - 0.5);
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
        
        carve(0, 0);
        goal = { x: size - 1, y: size - 1 };
        maze[goal.y][goal.x] = 0;
    }
    
    // ==================== ОТРИСОВКА ====================
    function draw() {
        game.innerHTML = "";
        const cellSize = Math.min(35, window.innerWidth / size);
        game.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                
                if (x === player.x && y === player.y) {
                    cell.classList.add("player");
                    cell.textContent = playerEmoji;
                } 
                else if (x === goal.x && y === goal.y) {
                    cell.classList.add("goal");
                    cell.textContent = goalEmoji;
                }
                else if (maze[y][x] === 1) {
                    cell.classList.add("wall");
                    cell.textContent = "█";
                }
                else {
                    cell.classList.add("path");
                    cell.textContent = "·";
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
                localStorage.setItem('maze_completed', JSON.stringify(completedLevels));
                updateStats();
                nextLevelBtn.style.display = "block";
                setTimeout(() => {
                    alert(`🎉 Уровень ${currentLevel} пройден!\nШагов: ${steps}\nВремя: ${timer}с`);
                }, 100);
            }
        }
    }
    
    // ==================== СТАРТ ====================
    function startGame() {
        const choice = characterSelect.value;
        playerEmoji = characters[choice].player;
        goalEmoji = characters[choice].goal;
        
        steps = 0;
        gameActive = true;
        generateMaze();
        player = { x: 0, y: 0 };
        draw();
        stopTimer();
        startTimer();
        updateStats();
        nextLevelBtn.style.display = "none";
        levelDisplay.textContent = `Уровень: ${currentLevel}`;
    }
    
    function nextLevel() {
        currentLevel++;
        levelDisplay.textContent = `Уровень: ${currentLevel}`;
        startGame();
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
    
    // ==================== КНОПКИ ====================
    startBtn.onclick = () => {
        currentLevel = 1;
        startGame();
    };
    
    nextLevelBtn.onclick = () => {
        nextLevel();
    };
    
    // Запуск
    startGame();
});