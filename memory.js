document.addEventListener('DOMContentLoaded', () => {
    // ==================== КОНФИГУРАЦИЯ ====================
    const LEVELS = [
        { id: 'level1', size: '4x2', name: 'Лёгкий', cards: 8, pairs: 4, rewardIndex: 0 },
        { id: 'level2', size: '4x3', name: 'Средний', cards: 12, pairs: 6, rewardIndex: 1 },
        { id: 'level3', size: '4x4', name: 'Сложный', cards: 16, pairs: 8, rewardIndex: 2 },
        { id: 'level4', size: '4x5', name: 'Эксперт', cards: 20, pairs: 10, rewardIndex: 3 },
        { id: 'level5', size: '4x6', name: 'Мастер', cards: 24, pairs: 12, rewardIndex: 4 }
    ];

    // ==================== ДАННЫЕ МУЛЬТФИЛЬМОВ С НАГРАДАМИ ====================
    const THEMES = {
        smeshariki: {
            name: 'Смешарики',
            icon: '🐰',
            chars: [
                { name: 'Крош', emoji: '🐰', color: '#FF69B4' },
                { name: 'Ёжик', emoji: '🦔', color: '#8B4513' },
                { name: 'Нюша', emoji: '🐷', color: '#FFB6C1' },
                { name: 'Бараш', emoji: '🐑', color: '#87CEEB' },
                { name: 'Лосяш', emoji: '🦌', color: '#FFD700' },
                { name: 'Копатыч', emoji: '🐻', color: '#CD853F' },
                { name: 'Совунья', emoji: '🦉', color: '#9370DB' },
                { name: 'Пин', emoji: '🐧', color: '#4169E1' }
            ],
            rewards: [
                'Крош (фигурка)',
                'Ёжик (фигурка)',
                'Нюша (фигурка)',
                'Бараш (фигурка)',
                'Лосяш (фигурка)'
            ]
        },
        prostokvashino: {
            name: 'Простоквашино',
            icon: '🐱',
            chars: [
                { name: 'Матроскин', emoji: '🐱', color: '#FFA500' },
                { name: 'Шарик', emoji: '🐶', color: '#DEB887' },
                { name: 'Дядя Фёдор', emoji: '👦', color: '#98FB98' },
                { name: 'Печкин', emoji: '📮', color: '#708090' },
                { name: 'Галчонок', emoji: '🐦', color: '#000000' },
                { name: 'Мурка', emoji: '🐄', color: '#FFFFFF' },
                { name: 'Тётя Зина', emoji: '👩', color: '#FFB6C1' },
                { name: 'Бобр', emoji: '🦫', color: '#8B4513' }
            ],
            rewards: [
                'Матроскин (фигурка)',
                'Шарик (фигурка)',
                'Дядя Фёдор (фигурка)',
                'Печкин (фигурка)',
                'Галчонок (фигурка)'
            ]
        },
        fixiki: {
            name: 'Фиксики',
            icon: '🔧',
            chars: [
                { name: 'Нолик', emoji: '0️⃣', color: '#00BFFF' },
                { name: 'Симка', emoji: '1️⃣', color: '#FF69B4' },
                { name: 'Папус', emoji: '👨', color: '#4169E1' },
                { name: 'Мася', emoji: '👩', color: '#FFA500' },
                { name: 'Дедус', emoji: '👴', color: '#708090' },
                { name: 'Игрек', emoji: '🔧', color: '#FFD700' },
                { name: 'Шпуля', emoji: '🧵', color: '#9370DB' },
                { name: 'Верта', emoji: '🔩', color: '#00FF00' },
                { name: 'Файер', emoji: '🔥', color: '#FF4500' }
            ],
            rewards: [
                'Нолик (фигурка)',
                'Симка (фигурка)',
                'Папус (фигурка)',
                'Мася (фигурка)',
                'Дедус (фигурка)'
            ]
        },
        vinni: {
            name: 'Винни Пух',
            icon: '🐻',
            chars: [
                { name: 'Винни', emoji: '🐻', color: '#CD853F' },
                { name: 'Пятачок', emoji: '🐖', color: '#FFB6C1' },
                { name: 'Кролик', emoji: '🐇', color: '#87CEEB' },
                { name: 'Иа', emoji: '🐴', color: '#708090' },
                { name: 'Сова', emoji: '🦉', color: '#9370DB' },
                { name: 'Тигра', emoji: '🐯', color: '#FFA500' },
                { name: 'Кенга', emoji: '🦘', color: '#8B4513' },
                { name: 'Ру', emoji: '👶', color: '#FFB6C1' }
            ],
            rewards: [
                'Винни (фигурка)',
                'Пятачок (фигурка)',
                'Кролик (фигурка)',
                'Иа (фигурка)',
                'Сова (фигурка)'
            ]
        },
        masha: {
            name: 'Маша и Медведь',
            icon: '👧',
            chars: [
                { name: 'Маша', emoji: '👧', color: '#FF69B4' },
                { name: 'Медведь', emoji: '🐻', color: '#8B4513' },
                { name: 'Панда', emoji: '🐼', color: '#000000' },
                { name: 'Розочка', emoji: '🌸', color: '#FFB6C1' },
                { name: 'Зайка', emoji: '🐰', color: '#87CEEB' },
                { name: 'Волк', emoji: '🐺', color: '#708090' },
                { name: 'Белка', emoji: '🐿️', color: '#FFA500' },
                { name: 'Ёжик', emoji: '🦔', color: '#8B4513' }
            ],
            rewards: [
                'Маша (фигурка)',
                'Медведь (фигурка)',
                'Панда (фигурка)',
                'Розочка (фигурка)',
                'Зайка (фигурка)'
            ]
        }
    };

    // ==================== ЭЛЕМЕНТЫ ====================
    const grid = document.getElementById('memoryGrid');
    const startBtn = document.getElementById('startBtn');
    const themeSelect = document.getElementById('themeSelect');
    const levelSelect = document.getElementById('levelSelect');

    // ==================== ПЕРЕМЕННЫЕ ====================
    let firstCardIndex = null;
    let secondCardIndex = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    let timer = 0;
    let timerInterval = null;
    let currentTheme = 'smeshariki';
    let currentLevel = 0;
    let board = [];
    let levelProgress = {};

    // Рубашка
    const cardBackStyle = {
        backgroundColor: '#2c3e50',
        text: '❓',
        color: 'white'
    };

    // ==================== ПРОГРЕСС ====================
    function loadProgress() {
        const saved = localStorage.getItem('memory_progress');
        if (saved) {
            levelProgress = JSON.parse(saved);
        } else {
            for (let theme in THEMES) {
                levelProgress[theme] = {};
                for (let i = 0; i < LEVELS.length; i++) {
                    levelProgress[theme][LEVELS[i].id] = false;
                }
                levelProgress[theme][LEVELS[0].id] = true;
            }
        }
    }

    function saveProgress() {
        localStorage.setItem('memory_progress', JSON.stringify(levelProgress));
    }

    function updateLevelSelect() {
        levelSelect.innerHTML = '';
        const themeProgress = levelProgress[currentTheme];
        
        LEVELS.forEach((level, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = `${level.name} (${level.size})`;
            
            const isUnlocked = themeProgress[level.id];
            const isCompleted = themeProgress[level.id + '_completed'];
            
            if (isUnlocked) {
                option.disabled = false;
                if (isCompleted) {
                    option.textContent += ' ✓';
                }
            } else {
                option.disabled = true;
                option.textContent = `🔒 ${level.name} (${level.size})`;
            }
            
            levelSelect.appendChild(option);
        });
        
        for (let i = 0; i < LEVELS.length; i++) {
            if (themeProgress[LEVELS[i].id]) {
                currentLevel = i;
                levelSelect.value = i;
                break;
            }
        }
    }

    function giveReward(levelIndex) {
        const reward = THEMES[currentTheme].rewards[levelIndex];
        if (!reward) return;
        
        let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {
            wagons: new Array(10).fill(false),
            stations: new Array(15).fill(false),
            tickets: new Array(8).fill(false),
            interiors: new Array(12).fill(false),
            uniforms: new Array(6).fill(false),
            equipment: new Array(9).fill(false),
            construction: new Array(7).fill(false),
            bonus: new Array(3).fill(false)
        };
        
        if (!artifacts.rewards) artifacts.rewards = {};
        if (!artifacts.rewards[currentTheme]) artifacts.rewards[currentTheme] = [];
        
        if (!artifacts.rewards[currentTheme][levelIndex]) {
            artifacts.rewards[currentTheme][levelIndex] = true;
            localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
            
            setTimeout(() => {
                alert(`🎁 ПОЛУЧЕНА НАГРАДА!\n\n${reward}\n\nЗагляни в Музей метро!`);
            }, 300);
        }
    }

    function completeLevel() {
        const levelId = LEVELS[currentLevel].id;
        
        if (!levelProgress[currentTheme][levelId + '_completed']) {
            levelProgress[currentTheme][levelId + '_completed'] = true;
            
            if (currentLevel + 1 < LEVELS.length) {
                levelProgress[currentTheme][LEVELS[currentLevel + 1].id] = true;
            }
            
            saveProgress();
            updateLevelSelect();
            giveReward(currentLevel);
            
            const nextName = currentLevel + 1 < LEVELS.length ? LEVELS[currentLevel + 1].name : 'все уровни пройдены!';
            setTimeout(() => {
                alert(`🎉 Уровень пройден! Получена награда!\n\nСледующий уровень: ${nextName}`);
            }, 300);
        }
    }

    // ==================== ИГРОВАЯ МЕХАНИКА ====================
    function createStatsPanel() {
        const oldStats = document.getElementById('statsPanel');
        if (oldStats) oldStats.remove();
        
        const statsDiv = document.createElement('div');
        statsDiv.id = 'statsPanel';
        statsDiv.innerHTML = `<span>Ходы: 0</span><span>Время: 0с</span>`;
        grid.parentNode.insertBefore(statsDiv, grid);
    }

    function updateStats() {
        const statsDiv = document.getElementById('statsPanel');
        if (statsDiv) {
            statsDiv.innerHTML = `<span>Ходы: ${moves}</span><span>Время: ${timer}с</span>`;
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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCards(theme, levelIndex) {
        const level = LEVELS[levelIndex];
        const cols = 4;
        const rows = parseInt(level.size.split('x')[1]);
        const total = cols * rows;
        totalPairs = total / 2;

        const themeData = THEMES[theme];
        const chars = themeData.chars;
        
        let values = [];
        for (let i = 0; i < totalPairs; i++) {
            const char = chars[i % chars.length];
            values.push({ ...char });
            values.push({ ...char });
        }

        return shuffleArray(values);
    }

    function renderGrid(theme, levelIndex) {
        grid.innerHTML = '';
        createStatsPanel();

        const values = createCards(theme, levelIndex);
        const cols = 4;

        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        firstCardIndex = null;
        secondCardIndex = null;
        lockBoard = false;
        moves = 0;
        matchedPairs = 0;
        updateStats();

        board = values.map((char, index) => ({
            element: null,
            name: char.name,
            emoji: char.emoji,
            color: char.color,
            matched: false,
            open: false
        }));

        values.forEach((char, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            
            card.style.backgroundColor = cardBackStyle.backgroundColor;
            card.style.color = cardBackStyle.color;
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.justifyContent = 'center';
            card.style.fontSize = '24px';
            card.textContent = cardBackStyle.text;
            
            card.onclick = () => flipCard(index);
            grid.appendChild(card);
            board[index].element = card;
        });

        startTimer();
    }

    function flipCard(index) {
        // Запрещаем клики, если:
        // - доска заблокирована (ждём закрытия)
        // - карточка уже совпала
        // - карточка уже открыта
        if (lockBoard) return;
        if (board[index].matched) return;
        if (board[index].open) return;
        
        // Если уже открыты две карточки, но не совпали — блокируем
        if (firstCardIndex !== null && secondCardIndex !== null) {
            return;
        }

        // Открываем карточку
        const card = board[index];
        card.open = true;
        card.element.style.backgroundColor = card.color;
        card.element.style.color = 'white';
        card.element.style.fontSize = '32px';
        card.element.textContent = card.emoji;

        // Если это первая карточка
        if (firstCardIndex === null) {
            firstCardIndex = index;
            return;
        }
        
        // Если это вторая карточка
        if (secondCardIndex === null && firstCardIndex !== index) {
            secondCardIndex = index;
            moves++;
            updateStats();
            
            // Проверяем совпадение
            if (board[firstCardIndex].name === board[secondCardIndex].name) {
                // Совпали!
                board[firstCardIndex].matched = true;
                board[secondCardIndex].matched = true;
                board[firstCardIndex].open = false;
                board[secondCardIndex].open = false;
                board[firstCardIndex].element.style.opacity = '0.6';
                board[secondCardIndex].element.style.opacity = '0.6';
                
                matchedPairs++;
                firstCardIndex = null;
                secondCardIndex = null;
                
                if (matchedPairs === totalPairs) {
                    stopTimer();
                    completeLevel();
                    setTimeout(() => {
                        alert(`🎉 Победа! Ты сделал ${moves} ходов за ${timer} секунд!`);
                    }, 300);
                }
            } else {
                // Не совпали — блокируем и закрываем обе
                lockBoard = true;
                
                setTimeout(() => {
                    // Закрываем первую карточку
                    board[firstCardIndex].open = false;
                    board[firstCardIndex].element.style.backgroundColor = cardBackStyle.backgroundColor;
                    board[firstCardIndex].element.style.fontSize = '24px';
                    board[firstCardIndex].element.textContent = cardBackStyle.text;
                    
                    // Закрываем вторую карточку
                    board[secondCardIndex].open = false;
                    board[secondCardIndex].element.style.backgroundColor = cardBackStyle.backgroundColor;
                    board[secondCardIndex].element.style.fontSize = '24px';
                    board[secondCardIndex].element.textContent = cardBackStyle.text;
                    
                    // Сбрасываем индексы
                    firstCardIndex = null;
                    secondCardIndex = null;
                    
                    // Разблокируем доску
                    lockBoard = false;
                }, 700);
            }
        }
    }

    // ==================== СОБЫТИЯ ====================
    themeSelect.addEventListener('change', () => {
        currentTheme = themeSelect.value;
        updateLevelSelect();
        renderGrid(currentTheme, currentLevel);
    });

    levelSelect.addEventListener('change', () => {
        currentLevel = parseInt(levelSelect.value);
        renderGrid(currentTheme, currentLevel);
    });

    startBtn.addEventListener('click', () => {
        renderGrid(currentTheme, currentLevel);
    });

    // ==================== ЗАПУСК ====================
    loadProgress();
    updateLevelSelect();
    renderGrid('smeshariki', 0);
});