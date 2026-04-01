document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('memoryGrid');
    const startBtn = document.getElementById('startBtn');
    const themeSelect = document.getElementById('themeSelect');
    const levelSelect = document.getElementById('levelSelect');
    
    // Уровни
    const LEVELS = [
        { id: 'level1', size: '4x2', name: 'Лёгкий (4x2)', pairs: 4 },
        { id: 'level2', size: '4x3', name: 'Средний (4x3)', pairs: 6 },
        { id: 'level3', size: '4x4', name: 'Сложный (4x4)', pairs: 8 },
        { id: 'level4', size: '4x5', name: 'Эксперт (4x5)', pairs: 10 },
        { id: 'level5', size: '4x6', name: 'Мастер (4x6)', pairs: 12 }
    ];
    
    // Персонажи
    const THEMES = {
        smeshariki: ['🐰', '🦔', '🐷', '🐑', '🦌', '🐻', '🦉', '🐧'],
        prostokvashino: ['🐱', '🐶', '👦', '📮', '🐦', '🐄', '👩', '🦫'],
        fixiki: ['0️⃣', '1️⃣', '👨', '👩', '👴', '🔧', '🧵', '🔩'],
        vinni: ['🐻', '🐖', '🐇', '🐴', '🦉', '🐯', '🦘', '👶'],
        masha: ['👧', '🐻', '🐼', '🌸', '🐰', '🐺', '🐿️', '🦔']
    };
    
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
    
    function updateLevelSelect() {
        levelSelect.innerHTML = '';
        LEVELS.forEach((level, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.textContent = level.name;
            levelSelect.appendChild(option);
        });
        currentLevel = 0;
        levelSelect.value = 0;
    }
    
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
        
        const chars = THEMES[currentTheme];
        
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
        const statsDiv = document.getElementById('statsPanel');
        if (!statsDiv) {
            const newStats = document.createElement('div');
            newStats.id = 'statsPanel';
            grid.parentNode.insertBefore(newStats, grid);
        }
        const stats = document.getElementById('statsPanel');
        if (stats) stats.innerHTML = `<span>Ходы: ${moves}</span><span>Время: ${timer}с</span>`;
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
                    setTimeout(() => alert(`🎉 Победа! Ходов: ${moves}, Время: ${timer}с`), 300);
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
    
    themeSelect.addEventListener('change', () => {
        currentTheme = themeSelect.value;
        initGame();
    });
    
    levelSelect.addEventListener('change', () => {
        currentLevel = parseInt(levelSelect.value);
        initGame();
    });
    
    startBtn.addEventListener('click', () => {
        initGame();
    });
    
    updateLevelSelect();
    initGame();
});