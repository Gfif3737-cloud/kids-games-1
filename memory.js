document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('memoryGrid');
    const startBtn = document.getElementById('startBtn');
    const themeSelect = document.getElementById('themeSelect');
    const levelSelect = document.getElementById('levelSelect');
    
    // ==================== УРОВНИ ====================
    const LEVELS = [
        { id: 'level1', size: '4x2', name: 'Лёгкий (4x2)', pairs: 4, rewardIndex: 0 },
        { id: 'level2', size: '4x3', name: 'Средний (4x3)', pairs: 6, rewardIndex: 1 },
        { id: 'level3', size: '4x4', name: 'Сложный (4x4)', pairs: 8, rewardIndex: 2 },
        { id: 'level4', size: '4x5', name: 'Эксперт (4x5)', pairs: 10, rewardIndex: 3 },
        { id: 'level5', size: '4x6', name: 'Мастер (4x6)', pairs: 12, rewardIndex: 4 }
    ];
    
    // ==================== МУЛЬТФИЛЬМЫ С НАГРАДАМИ ====================
    const THEMES = {
        smeshariki: {
            name: 'Смешарики',
            chars: ['🐰', '🦔', '🐷', '🐑', '🦌', '🐻', '🦉', '🐧'],
            rewards: ['Крош', 'Ёжик', 'Нюша', 'Бараш', 'Лосяш']
        },
        prostokvashino: {
            name: 'Простоквашино',
            chars: ['🐱', '🐶', '👦', '📮', '🐦', '🐄', '👩', '🦫'],
            rewards: ['Матроскин', 'Шарик', 'Дядя Фёдор', 'Печкин', 'Галчонок']
        },
        fixiki: {
            name: 'Фиксики',
            chars: ['0️⃣', '1️⃣', '👨', '👩', '👴', '🔧', '🧵', '🔩'],
            rewards: ['Нолик', 'Симка', 'Папус', 'Мася', 'Дедус']
        },
        vinni: {
            name: 'Винни Пух',
            chars: ['🐻', '🐖', '🐇', '🐴', '🦉', '🐯', '🦘', '👶'],
            rewards: ['Винни', 'Пятачок', 'Кролик', 'Иа', 'Сова']
        },
        masha: {
            name: 'Маша и Медведь',
            chars: ['👧', '🐻', '🐼', '🌸', '🐰', '🐺', '🐿️', '🦔'],
            rewards: ['Маша', 'Медведь', 'Панда', 'Розочка', 'Зайка']
        }
    };
    
    // ==================== ПЕРЕМЕННЫЕ ====================
    let cards = [];
    let openedCards = [];
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    let timer = 0;
    let timerInterval = null;
    let currentTheme = 'smeshariki';
    let currentLevel = 0;
    
    // Прогресс
    let levelProgress = JSON.parse(localStorage.getItem('memory_progress')) || {};
    let bestTimes = JSON.parse(localStorage.getItem('memory_best_times')) || {};
    let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {};
    
    // ==================== ФУНКЦИИ ПРОГРЕССА ====================
    function saveProgress() {
        localStorage.setItem('memory_progress', JSON.stringify(levelProgress));
    }
    
    function updateLevelSelect() {
        levelSelect.innerHTML = '';
        const themeProgress = levelProgress[currentTheme] || {};
        
        LEVELS.forEach((level, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            const isUnlocked = themeProgress[level.id] !== false;
            const isCompleted = themeProgress[level.id + '_completed'] === true;
            
            if (isUnlocked) {
                option.disabled = false;
                option.textContent = level.name + (isCompleted ? ' ✓' : '');
            } else {
                option.disabled = true;
                option.textContent = '🔒 ' + level.name;
            }
            levelSelect.appendChild(option);
        });
        
        // Выбираем первый доступный уровень
        for (let i = 0; i < LEVELS.length; i++) {
            const themeProgress = levelProgress[currentTheme] || {};
            if (themeProgress[LEVELS[i].id] !== false) {
                currentLevel = i;
                levelSelect.value = i;
                break;
            }
        }
    }
    
    function giveReward(levelIndex) {
        const themeData = THEMES[currentTheme];
        const reward = themeData.rewards[levelIndex];
        if (!reward) return;
        
        if (!artifacts.memoryRewards) artifacts.memoryRewards = {};
        if (!artifacts.memoryRewards[currentTheme]) artifacts.memoryRewards[currentTheme] = [];
        
        if (!artifacts.memoryRewards[currentTheme][levelIndex]) {
            artifacts.memoryRewards[currentTheme][levelIndex] = true;
            localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
            setTimeout(() => {
                alert(`🎁 ПОЛУЧЕНА НАГРАДА!\n\n${reward} (фигурка)\n\nЗагляни в Музей метро!`);
            }, 300);
        }
    }
    
    function unlockAchievement(text) {
        if (!artifacts.memoryAchievements) artifacts.memoryAchievements = [];
        if (artifacts.memoryAchievements.includes(text)) return;
        
        artifacts.memoryAchievements.push(text);
        localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
        setTimeout(() => alert(`🏅 ДОСТИЖЕНИЕ!\n\n${text}`), 500);
    }
    
    function checkAchievements(time) {
        const themeName = THEMES[currentTheme].name;
        const themeProgress = levelProgress[currentTheme] || {};
        
        // 1. Все сложности мультика
        let allCompleted = true;
        for (let i = 0; i < LEVELS.length; i++) {
            if (!themeProgress[LEVELS[i].id + '_completed']) {
                allCompleted = false;
                break;
            }
        }
        if (allCompleted) {
            unlockAchievement(`🌟 Все сложности пройдены в мультфильме "${themeName}"!`);
        }
        
        // 2. Полная коллекция (все мультики, все уровни)
        let allThemesCompleted = true;
        for (let theme in THEMES) {
            const progress = levelProgress[theme] || {};
            for (let i = 0; i < LEVELS.length; i++) {
                if (!progress[LEVELS[i].id + '_completed']) {
                    allThemesCompleted = false;
                    break;
                }
            }
        }
        if (allThemesCompleted) {
            unlockAchievement(`🏆 Полная коллекция! Все уровни во всех мультфильмах пройдены!`);
        }
        
        // 3. Скоростной рекорд (Мастер < 20 сек)
        if (LEVELS[currentLevel].size === '4x6' && time < 20) {
            unlockAchievement(`⚡ Скоростной рекорд! Уровень Мастер в "${themeName}" пройден за ${time} секунд!`);
        }
    }
    
    function completeLevel() {
        const levelId = LEVELS[currentLevel].id;
        
        if (!levelProgress[currentTheme]) levelProgress[currentTheme] = {};
        
        if (!levelProgress[currentTheme][levelId + '_completed']) {
            levelProgress[currentTheme][levelId + '_completed'] = true;
            
            // Сохраняем лучшее время
            const key = `${currentTheme}_${currentLevel}`;
            if (!bestTimes[key] || timer < bestTimes[key]) {
                bestTimes[key] = timer;
                localStorage.setItem('memory_best_times', JSON.stringify(bestTimes));
            }
            
            // Открываем следующий уровень
            if (currentLevel + 1 < LEVELS.length) {
                levelProgress[currentTheme][LEVELS[currentLevel + 1].id] = true;
            }
            
            saveProgress();
            updateLevelSelect();
            giveReward(currentLevel);
            checkAchievements(timer);
            
            const nextName = currentLevel + 1 < LEVELS.length ? LEVELS[currentLevel + 1].name : 'все уровни пройдены!';
            setTimeout(() => {
                alert(`🎉 Уровень пройден! Время: ${timer} сек\n\nСледующий уровень: ${nextName}`);
            }, 300);
        }
    }
    
    // ==================== ИГРОВАЯ МЕХАНИКА ====================
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    function initGame() {
        const level = LEVELS[currentLevel];
        const cols = 4;
        const rows = parseInt(level.size.split('x')[1]);
        const total = cols * rows;
        totalPairs = total / 2;
        
        const chars = THEMES[currentTheme].chars;
        
        let cardValues = [];
        for (let i = 0; i < totalPairs; i++) {
            const char = chars[i % chars.length];
            cardValues.push(char);
            cardValues.push(char);
        }
        cardValues = shuffleArray(cardValues);
        
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        cards = cardValues.map((emoji, idx) => ({
            id: idx,
            emoji: emoji,
            isMatched: false,
            isOpen: false,
            element: null
        }));
        
        cards.forEach((card, idx) => {
            const div = document.createElement('div');
            div.className = 'memory-card';
            div.textContent = '❓';
            div.onclick = () => onCardClick(idx);
            grid.appendChild(div);
            cards[idx].element = div;
        });
        
        openedCards = [];
        lockBoard = false;
        moves = 0;
        matchedPairs = 0;
        timer = 0;
        updateStats();
        
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => { timer++; updateStats(); }, 1000);
    }
    
    function updateStats() {
        let statsDiv = document.getElementById('statsPanel');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'statsPanel';
            grid.parentNode.insertBefore(statsDiv, grid);
        }
        statsDiv.innerHTML = `<span>Ходы: ${moves}</span><span>Время: ${timer}с</span>`;
    }
    
    function onCardClick(index) {
        if (lockBoard) return;
        if (cards[index].isMatched) return;
        if (cards[index].isOpen) return;
        if (openedCards.length >= 2) return;
        
        const card = cards[index];
        card.isOpen = true;
        card.element.textContent = card.emoji;
        card.element.style.backgroundColor = '#ffaa33';
        
        openedCards.push(index);
        
        if (openedCards.length === 2) {
            moves++;
            updateStats();
            
            const firstIdx = openedCards[0];
            const secondIdx = openedCards[1];
            
            if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
                cards[firstIdx].isMatched = true;
                cards[secondIdx].isMatched = true;
                cards[firstIdx].isOpen = false;
                cards[secondIdx].isOpen = false;
                cards[firstIdx].element.style.opacity = '0.5';
                cards[secondIdx].element.style.opacity = '0.5';
                openedCards = [];
                matchedPairs++;
                
                if (matchedPairs === totalPairs) {
                    clearInterval(timerInterval);
                    completeLevel();
                }
            } else {
                lockBoard = true;
                setTimeout(() => {
                    cards[firstIdx].isOpen = false;
                    cards[secondIdx].isOpen = false;
                    cards[firstIdx].element.textContent = '❓';
                    cards[secondIdx].element.textContent = '❓';
                    cards[firstIdx].element.style.backgroundColor = '#2c3e50';
                    cards[secondIdx].element.style.backgroundColor = '#2c3e50';
                    openedCards = [];
                    lockBoard = false;
                }, 700);
            }
        }
    }
    
    // ==================== СОБЫТИЯ ====================
    themeSelect.addEventListener('change', () => {
        currentTheme = themeSelect.value;
        if (!levelProgress[currentTheme]) levelProgress[currentTheme] = {};
        if (!levelProgress[currentTheme][LEVELS[0].id]) levelProgress[currentTheme][LEVELS[0].id] = true;
        updateLevelSelect();
        initGame();
    });
    
    levelSelect.addEventListener('change', () => {
        currentLevel = parseInt(levelSelect.value);
        initGame();
    });
    
    startBtn.addEventListener('click', () => {
        initGame();
    });
    
    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    // Инициализация прогресса
    for (let theme in THEMES) {
        if (!levelProgress[theme]) {
            levelProgress[theme] = {};
            levelProgress[theme][LEVELS[0].id] = true;
        }
    }
    saveProgress();
    
    updateLevelSelect();
    initGame();
});