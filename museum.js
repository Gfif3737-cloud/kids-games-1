document.addEventListener('DOMContentLoaded', () => {
    // ==================== ЗАГРУЗКА ДАННЫХ ====================
    let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {};

    // ==================== НАГРАДЫ ПО ИГРАМ ====================
    const gameRewards = {
        memory: {
            name: '🧠 Линия памяти',
            icon: '🧠',
            rewards: []
        },
        match3: {
            name: '💎 Три в ряд',
            icon: '💎',
            rewards: []
        },
        maze: {
            name: '🌀 Лабиринт',
            icon: '🌀',
            rewards: []
        }
    };

    // ==================== ЗАПОЛНЯЕМ НАГРАДЫ ПАМЯТИ ====================
    const memoryThemes = [
        { name: 'Смешарики', icon: '🐰', rewards: ['Крош', 'Ёжик', 'Нюша', 'Бараш', 'Лосяш'] },
        { name: 'Простоквашино', icon: '🐱', rewards: ['Матроскин', 'Шарик', 'Дядя Фёдор', 'Печкин', 'Галчонок'] },
        { name: 'Фиксики', icon: '🔧', rewards: ['Нолик', 'Симка', 'Папус', 'Мася', 'Дедус'] },
        { name: 'Винни Пух', icon: '🐻', rewards: ['Винни', 'Пятачок', 'Кролик', 'Иа', 'Сова'] },
        { name: 'Маша и Медведь', icon: '👧', rewards: ['Маша', 'Медведь', 'Панда', 'Розочка', 'Зайка'] }
    ];

    for (let t of memoryThemes) {
        for (let i = 0; i < t.rewards.length; i++) {
            const levelNames = ['Лёгкий (4×2)', 'Средний (4×3)', 'Сложный (4×4)', 'Эксперт (4×5)', 'Мастер (4×6)'];
            gameRewards.memory.rewards.push({
                name: `${t.rewards[i]} (${t.name})`,
                icon: t.icon,
                howto: `🎮 Пройди уровень «${levelNames[i]}» в игре «Линия памяти» для мультфильма «${t.name}»`,
                desc: `Фигурка ${t.rewards[i]} из мультфильма "${t.name}".`,
                obtained: artifacts.memoryRewards?.[t.name]?.[i] || false
            });
        }
    }

    // ==================== ЗАПОЛНЯЕМ НАГРАДЫ ТРИ В РЯД ====================
    const match3Rewards = [
        { name: 'Вагон типа А (1935)', icon: '🚃', howto: '🏆 Пройди УРОВЕНЬ 1 в игре «Три в ряд»', desc: 'Первый серийный вагон. Деревянные скамьи, кожаные ремни.' },
        { name: 'Вагон типа Б (1937)', icon: '🚋', howto: '🏆 Пройди УРОВЕНЬ 2 в игре «Три в ряд»', desc: 'Модернизированная версия. Появились мягкие диваны.' },
        { name: 'Вагон типа Г (1940)', icon: '🚞', howto: '🏆 Пройди УРОВЕНЬ 3 в игре «Три в ряд»', desc: 'Цельнометаллический. Прозвали «широколобым».' },
        { name: 'Вагон типа Д (1955)', icon: '🚆', howto: '🏆 Пройди УРОВЕНЬ 4 в игре «Три в ряд»', desc: 'Тот самый «синий вагон» из песни.' }
    ];

    for (let i = 0; i < match3Rewards.length; i++) {
        gameRewards.match3.rewards.push({
            ...match3Rewards[i],
            obtained: artifacts.wagons?.[i] || false
        });
    }

    // ==================== ЗАПОЛНЯЕМ НАГРАДЫ ЛАБИРИНТА ====================
    const mazeRewardsList = [
        { level: 3, name: '🏆 Первый километр', howto: 'Пройди 3 уровня в лабиринте' },
        { level: 6, name: '🏆 Подземный ходок', howto: 'Пройди 6 уровней в лабиринте' },
        { level: 9, name: '🏆 Станция «Туннель»', howto: 'Пройди 9 уровней в лабиринте' },
        { level: 12, name: '🏆 Машинист 3-го класса', howto: 'Пройди 12 уровней в лабиринте' },
        { level: 15, name: '🏆 Машинист 2-го класса', howto: 'Пройди 15 уровней в лабиринте' },
        { level: 18, name: '🏆 Машинист 1-го класса', howto: 'Пройди 18 уровней в лабиринте' },
        { level: 21, name: '🏆 Начальник депо', howto: 'Пройди 21 уровень в лабиринте' },
        { level: 24, name: '🏆 Начальник линии', howto: 'Пройди 24 уровня в лабиринте' },
        { level: 27, name: '🏆 Начальник метро', howto: 'Пройди 27 уровней в лабиринте' },
        { level: 30, name: '🏆 Легенда метро', howto: 'Пройди 30 уровней в лабиринте' }
    ];

    for (let r of mazeRewardsList) {
        gameRewards.maze.rewards.push({
            name: r.name,
            icon: '🏆',
            howto: r.howto,
            desc: 'Награда за прохождение уровней в лабиринте',
            obtained: artifacts.mazeRewards?.[r.level] || false
        });
    }

    // ==================== ДОСТИЖЕНИЯ ПАМЯТИ ====================
    const memoryAchievements = [];

    // Все сложности для каждого мультфильма
    for (let t of memoryThemes) {
        memoryAchievements.push({
            name: `🌟 Все сложности (${t.name})`,
            icon: '🌟',
            howto: `Пройди все 5 уровней в мультфильме «${t.name}»`,
            obtained: artifacts.memoryAchievements?.includes(`🌟 Все сложности пройдены в мультфильме "${t.name}"!`) || false
        });
    }

    // Полная коллекция
    memoryAchievements.push({
        name: '🏆 Полная коллекция',
        icon: '🏆',
        howto: 'Пройди все уровни во всех мультфильмах!',
        obtained: artifacts.memoryAchievements?.includes('🏆 Полная коллекция! Все уровни во всех мультфильмах пройдены!') || false
    });

    // Скоростные рекорды
    for (let t of memoryThemes) {
        memoryAchievements.push({
            name: `⚡ Скоростной рекорд (${t.name})`,
            icon: '⚡',
            howto: `Пройди уровень Мастер (4×6) меньше чем за 20 секунд в мультфильме «${t.name}»`,
            obtained: artifacts.memoryAchievements?.includes(`⚡ Скоростной рекорд! Уровень Мастер в "${t.name}"`) || false
        });
    }

    // ==================== ДОСТИЖЕНИЯ ТРИ В РЯД ====================
    const match3Achievements = [
        { name: '🎯 500 очков', icon: '🎯', howto: 'Набери 500 очков за одну игру' },
        { name: '🎯 1000 очков', icon: '🎯', howto: 'Набери 1000 очков за одну игру' },
        { name: '🎯 1500 очков', icon: '🎯', howto: 'Набери 1500 очков за одну игру' },
        { name: '🎯 2000 очков', icon: '🎯', howto: 'Набери 2000 очков за одну игру' },
        { name: '🎯 2500 очков', icon: '🎯', howto: 'Набери 2500 очков за одну игру' },
        { name: '🏆 Все уровни', icon: '🏆', howto: 'Пройди все 4 уровня в «Три в ряд»' },
        { name: '🎲 Мастер комбинаций', icon: '🎲', howto: 'Набери очки без завершения уровня' }
    ];

    for (let a of match3Achievements) {
        a.obtained = artifacts.match3Achievements?.includes(a.name) || false;
    }

    // ==================== ДОСТИЖЕНИЯ ЛАБИРИНТА ====================
    const mazeAchievements = [];

    const characters = [
        { id: 'cheburashka', name: 'Чебурашка' },
        { id: 'pin', name: 'Пин' },
        { id: 'matroskin', name: 'Матроскин' },
        { id: 'masha', name: 'Маша' }
    ];

    const milestones = [5, 10, 15, 20, 25];

    for (let c of characters) {
        for (let m of milestones) {
            mazeAchievements.push({
                name: `🎭 ${c.name} (${m} уровней)`,
                icon: '🎭',
                howto: `Пройди ${m} уровней с персонажем ${c.name}`,
                obtained: artifacts.mazeAchievements?.includes(`🎭 ${c.name} прошёл ${m} уровней!`) || false
            });
        }
    }

    mazeAchievements.push({
        name: '🏅 Мастер лабиринта',
        icon: '🏅',
        howto: 'Пройди 50 уровней в лабиринте',
        obtained: artifacts.mazeAchievements?.includes('🏅 Мастер лабиринта! 50 уровней!') || false
    });

    mazeAchievements.push({
        name: '👑 Легенда лабиринта',
        icon: '👑',
        howto: 'Пройди 100 уровней в лабиринте',
        obtained: artifacts.mazeAchievements?.includes('👑 Легенда лабиринта! 100 уровней!') || false
    });

    // ==================== ПОДСЧЁТ ВСЕГО ====================
    function countTotal() {
        let total = 0;
        // Награды памяти
        total += gameRewards.memory.rewards.filter(r => r.obtained).length;
        // Награды три в ряд
        total += gameRewards.match3.rewards.filter(r => r.obtained).length;
        // Награды лабиринта
        total += gameRewards.maze.rewards.filter(r => r.obtained).length;
        // Достижения памяти
        total += memoryAchievements.filter(a => a.obtained).length;
        // Достижения три в ряд
        total += match3Achievements.filter(a => a.obtained).length;
        // Достижения лабиринта
        total += mazeAchievements.filter(a => a.obtained).length;
        return total;
    }

    // ==================== ОТРИСОВКА ====================
    const container = document.getElementById('artifacts-container');
    const totalSpan = document.getElementById('total-collected');
    const modal = document.getElementById('artifact-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalHowto = document.getElementById('modal-howto');
    const modalDesc = document.getElementById('modal-desc');
    const modalStatus = document.getElementById('modal-status');
    const closeBtn = document.querySelector('.close-btn');
    
    let currentGame = 'memory';
    let currentType = 'rewards';

    function renderCategory() {
        container.innerHTML = '';
        
        if (currentType === 'rewards') {
            const rewards = gameRewards[currentGame].rewards;
            rewards.forEach(reward => {
                createCard(reward.name, reward.icon, reward.obtained, reward.howto, reward.desc);
            });
        } else if (currentType === 'achievements') {
            let achievements = [];
            if (currentGame === 'memory') achievements = memoryAchievements;
            if (currentGame === 'match3') achievements = match3Achievements;
            if (currentGame === 'maze') achievements = mazeAchievements;
            
            achievements.forEach(ach => {
                createCard(ach.name, ach.icon, ach.obtained, ach.howto, 'Достижение');
            });
        }
        
        totalSpan.textContent = countTotal();
    }

    function createCard(name, icon, obtained, howto, desc) {
        const card = document.createElement('div');
        card.className = `artifact-card ${obtained ? '' : 'locked'}`;
        card.innerHTML = `
            <div class="artifact-icon">${icon}</div>
            <div class="artifact-name">${name}</div>
            <div class="artifact-year">${obtained ? '✓ Получено' : '🔒 Не получено'}</div>
        `;
        
        card.addEventListener('click', () => showModal(name, icon, obtained, howto, desc));
        container.appendChild(card);
    }

    function showModal(name, icon, obtained, howto, desc) {
        modalIcon.textContent = icon;
        modalTitle.textContent = name;
        modalHowto.innerHTML = `📜 <strong>Как получить:</strong><br>${howto}`;
        modalDesc.innerHTML = `📖 <strong>Описание:</strong><br>${desc}`;
        modalStatus.textContent = obtained ? '✅ ПОЛУЧЕНО' : '🔒 ЕЩЁ НЕ ПОЛУЧЕНО';
        modalStatus.style.background = obtained ? '#4a2c00' : '#5a3a2a';
        modal.style.display = 'block';
    }

    // ==================== КАТЕГОРИИ ====================
    const games = [
        { id: 'memory', name: '🧠 Линия памяти' },
        { id: 'match3', name: '💎 Три в ряд' },
        { id: 'maze', name: '🌀 Лабиринт' }
    ];

    const gameSelector = document.createElement('div');
    gameSelector.className = 'game-selector';
    gameSelector.style.display = 'flex';
    gameSelector.style.justifyContent = 'center';
    gameSelector.style.gap = '10px';
    gameSelector.style.marginBottom = '20px';
    
    games.forEach(game => {
        const btn = document.createElement('button');
        btn.textContent = game.name;
        btn.style.padding = '10px 20px';
        btn.style.borderRadius = '30px';
        btn.style.border = '2px solid #ffaa33';
        btn.style.background = currentGame === game.id ? '#ff7b4f' : '#1e3a5f';
        btn.style.color = 'white';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
            document.querySelectorAll('.game-btn').forEach(b => b.style.background = '#1e3a5f');
            btn.style.background = '#ff7b4f';
            currentGame = game.id;
            renderCategory();
        };
        btn.classList.add('game-btn');
        gameSelector.appendChild(btn);
    });
    
    const categoryContainer = document.querySelector('.museum-categories');
    if (categoryContainer) {
        categoryContainer.parentNode.insertBefore(gameSelector, categoryContainer);
        categoryContainer.innerHTML = '';
        
        const rewardsBtn = document.createElement('button');
        rewardsBtn.className = `category-btn ${currentType === 'rewards' ? 'active' : ''}`;
        rewardsBtn.textContent = '🎁 Награды';
        rewardsBtn.onclick = () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            rewardsBtn.classList.add('active');
            currentType = 'rewards';
            renderCategory();
        };
        
        const achievementsBtn = document.createElement('button');
        achievementsBtn.className = `category-btn ${currentType === 'achievements' ? 'active' : ''}`;
        achievementsBtn.textContent = '🏆 Достижения';
        achievementsBtn.onclick = () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            achievementsBtn.classList.add('active');
            currentType = 'achievements';
            renderCategory();
        };
        
        categoryContainer.appendChild(rewardsBtn);
        categoryContainer.appendChild(achievementsBtn);
    }

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // ==================== ЗАПУСК ====================
    renderCategory();
});