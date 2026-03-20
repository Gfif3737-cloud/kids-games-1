document.addEventListener('DOMContentLoaded', () => {
    // ==================== КОНФИГУРАЦИЯ ====================
    const LEVELS = [
        { id: 'level1', size: '4x2', name: 'Лёгкий', cards: 8, pairs: 4, rewardIndex: 0 },
        { id: 'level2', size: '4x3', name: 'Средний', cards: 12, pairs: 6, rewardIndex: 1 },
        { id: 'level3', size: '4x4', name: 'Сложный', cards: 16, pairs: 8, rewardIndex: 2 },
        { id: 'level4', size: '4x5', name: 'Эксперт', cards: 20, pairs: 10, rewardIndex: 3 },
        { id: 'level5', size: '4x6', name: 'Мастер', cards: 24, pairs: 12, rewardIndex: 4 }
    ];

    // ==================== ДАННЫЕ МУЛЬТФИЛЬМОВ ====================
    const THEMES = {
        smeshariki: {
            name: 'Смешарики',
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
            rewards: ['Крош', 'Ёжик', 'Нюша', 'Бараш', 'Лосяш']
        },
        prostokvashino: {
            name: 'Простоквашино',
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
            rewards: ['Матроскин', 'Шарик', 'Дядя Фёдор', 'Печкин', 'Галчонок']
        },
        fixiki: {
            name: 'Фиксики',
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
            rewards: ['Нолик', 'Симка', 'Папус', 'Мася', 'Дедус']
        },
        vinni: {
            name: 'Винни Пух',
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
            rewards: ['Винни', 'Пятачок', 'Кролик', 'Иа', 'Сова']
        },
        masha: {
            name: 'Маша и Медведь',
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
            rewards: ['Маша', 'Медведь', 'Панда', 'Розочка', 'Зайка']
        }
    };

    // ==================== ЭЛЕМЕНТЫ ====================
    const grid = document.getElementById('memoryGrid');
    const startBtn = document.getElementById('startBtn');
    const themeSelect = document.getElementById('themeSelect');
    const levelSelect = document.getElementById('levelSelect');

    // ==================== ПЕРЕМЕННЫЕ ====================
    let cards = [];           // массив объектов карточек
    let openedCards = [];     // индексы открытых карточек
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    let timer = 0;
    let timerInterval = null;
    let currentTheme = 'smeshariki';
    let currentLevel = 0;
    let levelProgress = {};

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
            
            if (themeProgress[level.id]) {
                option.disabled = false;
                if (themeProgress[level.id + '_completed']) {
                    option.textContent += ' ✓';
                }
            } else {
                option.disabled = true;
                option.textContent = `🔒 ${level.name} (${level.size})`;
            }
            levelSelect.appendChild(option);
        });
        
        for (let i = 0; i < LEVELS.length; i++) {
            if (levelProgress[currentTheme][LEVELS[i].id]) {
                currentLevel = i;
                levelSelect.value = i;
                break;
            }
        }
    }

    function giveReward(levelIndex) {
        const reward = THEMES[currentTheme].rewards[levelIndex];
        if (!reward) return;
        
        let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {};
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

    function initGame() {
        const level = LEVELS[currentLevel];
        const cols = 4;
        const rows = parseInt(level.size.split('x')[1]);
        const total = cols * rows;
        totalPairs = total / 2;

        const themeData = THEMES[currentTheme];
        const chars = themeData.chars;
        
        // Создаём пары
        let cardValues = [];
        for (let i = 0; i < totalPairs; i++) {
            const char = chars[i % chars.length];
            cardValues.push({ ...char });
            cardValues.push({ ...char });
        }
        
        // Перемешиваем
        cardValues = shuffleArray(cardValues);
        
        // Создаём массив карточек
        cards = cardValues.map((card, idx) => ({
            id: idx,
            name: card.name,
            emoji: card.emoji,
            color: card.color,
            isMatched: false,
            isOpen: false,
            element: null
        }));
        
        // Очищаем сетку
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // Создаём DOM элементы
        cards.forEach((card, idx) => {
            const div = document.createElement('div');
            div.className = 'memory-card';
            div.style.backgroundColor = '#2c3e50';
            div.style.color = 'white';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.fontSize = '24px';
            div.textContent = '❓';
            div.onclick = () => onCardClick(idx);
            grid.appendChild(div);
            cards[idx].element = div;
        });
        
        // Сбрасываем состояние игры
        openedCards = [];
        lockBoard = false;
        moves = 0;
        matchedPairs = 0;
        updateStats();
        
        createStatsPanel();
        startTimer();
    }

    function onCardClick(clickedIndex) {
        // Запреты
        if (lockBoard) return;
        if (cards[clickedIndex].isMatched) return;
        if (cards[clickedIndex].isOpen) return;
        if (openedCards.length >= 2) return;
        
        // Открываем карточку
        const card = cards[clickedIndex];
        card.isOpen = true;
        card.element.style.backgroundColor = card.color;
        card.element.style.fontSize = '32px';
        card.element.textContent = card.emoji;
        
        // Добавляем в список открытых
        openedCards.push(clickedIndex);
        
        // Если открыто 2 карточки — проверяем
        if (openedCards.length === 2) {
            moves++;
            updateStats();
            
            const firstIdx = openedCards[0];
            const secondIdx = openedCards[1];
            const firstCard = cards[firstIdx];
            const secondCard = cards[secondIdx];
            
            if (firstCard.name === secondCard.name) {
                // СОВПАЛИ!
                firstCard.isMatched = true;
                secondCard.isMatched = true;
                firstCard.isOpen = false;
                secondCard.isOpen = false;
                firstCard.element.style.opacity = '0.6';
                secondCard.element.style.opacity = '0.6';
                
                matchedPairs++;
                openedCards = [];
                
                if (matchedPairs === totalPairs) {
                    stopTimer();
                    completeLevel();
                    setTimeout(() => {
                        alert(`🎉 Победа! Ты сделал ${moves} ходов за ${timer} секунд!`);
                    }, 300);
                }
            } else {
                // НЕ СОВПАЛИ — закрываем через 0.7 сек
                lockBoard = true;
                
                setTimeout(() => {
                    // Закрываем первую
                    cards[firstIdx].isOpen = false;
                    cards[firstIdx].element.style.backgroundColor = '#2c3e50';
                    cards[firstIdx].element.style.fontSize = '24px';
                    cards[firstIdx].element.textContent = '❓';
                    
                    // Закрываем вторую
                    cards[secondIdx].isOpen = false;
                    cards[secondIdx].element.style.backgroundColor = '#2c3e50';
                    cards[secondIdx].element.style.fontSize = '24px';
                    cards[secondIdx].element.textContent = '❓';
                    
                    openedCards = [];
                    lockBoard = false;
                }, 700);
            }
        }
    }

    // ==================== СОБЫТИЯ ====================
    themeSelect.addEventListener('change', () => {
        currentTheme = themeSelect.value;
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

    // ==================== ЗАПУСК ====================
    loadProgress();
    updateLevelSelect();
    initGame();
});