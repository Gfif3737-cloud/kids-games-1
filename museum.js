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

    // ==================== СКРЫТЫЕ ДОСТИЖЕНИЯ ====================
    const hiddenAchievements = {
        memory: [
            { name: '👑 Король памяти', icon: '👑', howto: 'Пройди все уровни во всех мультфильмах меньше чем за 30 секунд каждый', desc: 'Легендарный рекорд!' },
            { name: '⚡ Молниеносный', icon: '⚡', howto: 'Пройди уровень Мастер (4×6) меньше чем за 15 секунд', desc: 'Невероятная скорость!' },
            { name: '🎯 Идеальный ход', icon: '🎯', howto: 'Пройди любой уровень без ошибок (все пары с первого раза)', desc: 'Абсолютная точность!' }
        ],
        match3: [
            { name: '👑 Повелитель комбинаций', icon: '👑', howto: 'Набери 5000 очков за одну игру', desc: 'Мастер комбинаций!' },
            { name: '⚡ Чистая линия', icon: '⚡', howto: 'Собери 10 комбинаций подряд без падений', desc: 'Невероятная серия!' },
            { name: '🎯 Один ход', icon: '🎯', howto: 'Пройди уровень с первой попытки, не используя бонусы', desc: 'Идеальный старт!' }
        ],
        maze: [
            { name: '👑 Хранитель лабиринта', icon: '👑', howto: 'Пройди 200 уровней в лабиринте', desc: 'Настоящий хранитель подземелий!' },
            { name: '⚡ Спринтер', icon: '⚡', howto: 'Пройди любой уровень меньше чем за 30 шагов', desc: 'Скорость света!' },
            { name: '🎯 Исследователь', icon: '🎯', howto: 'Найди все тупики на одном уровне', desc: 'Любопытство не порок!' }
        ]
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
            gameRewards.memory.rewards.push({
                name: `${t.rewards[i]} (${t.name})`,
                icon: t.icon,
                howto: `Пройди уровень ${i+1} в игре «Линия памяти» для мультфильма «${t.name}»`,
                desc: `Фигурка ${t.rewards[i]} из мультфильма "${t.name}".`,
                obtained: artifacts.memoryRewards?.[t.name]?.[i] || false
            });
        }
    }

    // ==================== ЗАПОЛНЯЕМ НАГРАДЫ ТРИ В РЯД ====================
    const match3Rewards = [
        { name: 'Вагон типа А (1935)', icon: '🚃', howto: 'Пройди УРОВЕНЬ 1 в игре «Три в ряд»', desc: 'Первый серийный вагон.' },
        { name: 'Вагон типа Б (1937)', icon: '🚋', howto: 'Пройди УРОВЕНЬ 2 в игре «Три в ряд»', desc: 'Модернизированная версия.' },
        { name: 'Вагон типа Г (1940)', icon: '🚞', howto: 'Пройди УРОВЕНЬ 3 в игре «Три в ряд»', desc: 'Цельнометаллический.' },
        { name: 'Вагон типа Д (1955)', icon: '🚆', howto: 'Пройди УРОВЕНЬ 4 в игре «Три в ряд»', desc: 'Тот самый «синий вагон».' }
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

    // ==================== ОБЫЧНЫЕ ДОСТИЖЕНИЯ (видимые) ====================
    const visibleAchievements = {
        memory: [
            { name: '🌟 Все сложности (Смешарики)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Смешарики»' },
            { name: '🌟 Все сложности (Простоквашино)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Простоквашино»' },
            { name: '🌟 Все сложности (Фиксики)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Фиксики»' },
            { name: '🌟 Все сложности (Винни Пух)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Винни Пух»' },
            { name: '🌟 Все сложности (Маша и Медведь)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Маша и Медведь»' },
            { name: '🏆 Полная коллекция', icon: '🏆', howto: 'Пройди все уровни во всех мультфильмах!' },
            { name: '⚡ Скоростной рекорд (Смешарики)', icon: '⚡', howto: 'Пройди уровень Мастер (4×6) меньше чем за 20 секунд в мультфильме «Смешарики»' }
        ],
        match3: [
            { name: '🎯 500 очков', icon: '🎯', howto: 'Набери 500 очков за одну игру' },
            { name: '🎯 1000 очков', icon: '🎯', howto: 'Набери 1000 очков за одну игру' },
            { name: '🎯 1500 очков', icon: '🎯', howto: 'Набери 1500 очков за одну игру' },
            { name: '🎯 2000 очков', icon: '🎯', howto: 'Набери 2000 очков за одну игру' },
            { name: '🎯 2500 очков', icon: '🎯', howto: 'Набери 2500 очков за одну игру' },
            { name: '🏆 Все уровни', icon: '🏆', howto: 'Пройди все 4 уровня в «Три в ряд»' },
            { name: '🎲 Мастер комбинаций', icon: '🎲', howto: 'Набери очки без завершения уровня' }
        ],
        maze: [
            { name: '🎭 Чебурашка (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Чебурашкой' },
            { name: '🎭 Пин (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Пином' },
            { name: '🎭 Матроскин (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Матроскиным' },
            { name: '🎭 Маша (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Машей' },
            { name: '🏅 Мастер лабиринта', icon: '🏅', howto: 'Пройди 50 уровней в лабиринте' },
            { name: '👑 Легенда лабиринта', icon: '👑', howto: 'Пройди 100 уровней в лабиринте' }
        ]
    };

    // ==================== ПОЛУЧЕНИЕ СТАТУСА ====================
    function isObtained(artifacts, game, identifier) {
        if (game === 'memory') {
            return artifacts.memoryAchievements?.includes(identifier) || false;
        }
        if (game === 'match3') {
            return artifacts.match3Achievements?.includes(identifier) || false;
        }
        if (game === 'maze') {
            return artifacts.mazeAchievements?.includes(identifier) || false;
        }
        return false;
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

    function countTotal() {
        let total = 0;
        // Награды памяти
        total += gameRewards.memory.rewards.filter(r => r.obtained).length;
        // Награды три в ряд
        total += gameRewards.match3.rewards.filter(r => r.obtained).length;
        // Награды лабиринта
        total += gameRewards.maze.rewards.filter(r => r.obtained).length;
        // Достижения памяти
        total += (artifacts.memoryAchievements?.length || 0);
        // Достижения три в ряд
        total += (artifacts.match3Achievements?.length || 0);
        // Достижения лабиринта
        total += (artifacts.mazeAchievements?.length || 0);
        return total;
    }

    function renderCategory() {
        container.innerHTML = '';
        
        if (currentType === 'rewards') {
            const rewards = gameRewards[currentGame].rewards;
            rewards.forEach(reward => {
                createCard(reward, reward.obtained, reward.howto, reward.desc);
            });
        } else if (currentType === 'achievements') {
            const achievements = visibleAchievements[currentGame];
            achievements.forEach(ach => {
                const obtained = isObtained(artifacts, currentGame, ach.name);
                createCard(ach, obtained, ach.howto, 'Достижение');
            });
        }
        
        totalSpan.textContent = countTotal();
    }

    function createCard(item, obtained, howto, desc) {
        const card = document.createElement('div');
        card.className = `artifact-card ${obtained ? '' : 'locked'}`;
        card.innerHTML = `
            <div class="artifact-icon">${item.icon}</div>
            <div class="artifact-name">${item.name}</div>
            <div class="artifact-year">${obtained ? '✓ Получено' : '🔒 Не получено'}</div>
        `;
        
        card.addEventListener('click', () => showModal(item, obtained, howto, desc));
        container.appendChild(card);
    }

    function showModal(item, obtained, howto, desc) {
        modalIcon.textContent = item.icon;
        modalTitle.textContent = item.name;
        modalHowto.innerHTML = `📜 <strong>Как получить:</strong><br>${howto}`;
        modalDesc.innerHTML = `📖 <strong>Описание:</strong><br>${desc}`;
        modalStatus.textContent = obtained ? '✅ ПОЛУЧЕНО' : '🔒 ЕЩЁ НЕ ПОЛУЧЕНО';
        modalStatus.style.background = obtained ? '#4a2c00' : '#5a3a2a';
        modal.style.display = 'block';
    }

    // ==================== КАТЕГОРИИ ====================
    const games = [
        { id: 'memory', name: '🧠 Линия памяти', icon: '🧠' },
        { id: 'match3', name: '💎 Три в ряд', icon: '💎' },
        { id: 'maze', name: '🌀 Лабиринт', icon: '🌀' }
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