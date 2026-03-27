document.addEventListener('DOMContentLoaded', () => {
    // ==================== ЗАГРУЗКА ВСЕХ ДАННЫХ ====================
    let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {};

    // ==================== ВСЕ АРТЕФАКТЫ С ПОДСКАЗКАМИ ====================
    const artifactsData = {
        // Вагоны из три в ряд
        wagons: [
            { name: 'Вагон типа А (1935)', icon: '🚃', howto: '🏆 Пройди УРОВЕНЬ 1 в игре «Три в ряд»', desc: 'Первый серийный вагон. Деревянные скамьи, кожаные ремни.' },
            { name: 'Вагон типа Б (1937)', icon: '🚋', howto: '🏆 Пройди УРОВЕНЬ 2 в игре «Три в ряд»', desc: 'Модернизированная версия. Появились мягкие диваны.' },
            { name: 'Вагон типа Г (1940)', icon: '🚞', howto: '🏆 Пройди УРОВЕНЬ 3 в игре «Три в ряд»', desc: 'Цельнометаллический. Прозвали «широколобым».' },
            { name: 'Вагон типа Д (1955)', icon: '🚆', howto: '🏆 Пройди УРОВЕНЬ 4 в игре «Три в ряд»', desc: 'Тот самый «синий вагон» из песни.' }
        ],
        // Награды из памяти
        memoryRewards: [],
        // Достижения из памяти
        memoryAchievements: [],
        // Достижения из три в ряд
        match3Achievements: [],
        // Награды из лабиринта
        mazeRewards: [],
        // Достижения из лабиринта
        mazeAchievements: []
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
            artifactsData.memoryRewards.push({
                name: `${t.rewards[i]} (${t.name})`,
                icon: t.icon,
                howto: `🎮 Пройди уровень ${i+1} (${['Лёгкий', 'Средний', 'Сложный', 'Эксперт', 'Мастер'][i]}) в игре «Линия памяти» для мультфильма «${t.name}»`,
                desc: `Фигурка ${t.rewards[i]} из мультфильма "${t.name}".`
            });
        }
    }

    // ==================== ДОСТИЖЕНИЯ ПАМЯТИ ====================
    const memoryAchievementsList = [
        { name: '🌟 Все сложности (Смешарики)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Смешарики»' },
        { name: '🌟 Все сложности (Простоквашино)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Простоквашино»' },
        { name: '🌟 Все сложности (Фиксики)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Фиксики»' },
        { name: '🌟 Все сложности (Винни Пух)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Винни Пух»' },
        { name: '🌟 Все сложности (Маша и Медведь)', icon: '🌟', howto: 'Пройди все 5 уровней в мультфильме «Маша и Медведь»' },
        { name: '🏆 Полная коллекция', icon: '🏆', howto: 'Пройди все уровни во всех мультфильмах!' },
        { name: '⚡ Скоростной рекорд (Смешарики)', icon: '⚡', howto: 'Пройди уровень Мастер (4×6) меньше чем за 20 секунд в мультфильме «Смешарики»' },
        { name: '⚡ Скоростной рекорд (Простоквашино)', icon: '⚡', howto: 'Пройди уровень Мастер (4×6) меньше чем за 20 секунд в мультфильме «Простоквашино»' },
        { name: '⚡ Скоростной рекорд (Фиксики)', icon: '⚡', howto: 'Пройди уровень Мастер (4×6) меньше чем за 20 секунд в мультфильме «Фиксики»' },
        { name: '⚡ Скоростной рекорд (Винни Пух)', icon: '⚡', howto: 'Пройди уровень Мастер (4×6) меньше чем за 20 секунд в мультфильме «Винни Пух»' },
        { name: '⚡ Скоростной рекорд (Маша и Медведь)', icon: '⚡', howto: 'Пройди уровень Мастер (4×6) меньше чем за 20 секунд в мультфильме «Маша и Медведь»' }
    ];

    // ==================== ДОСТИЖЕНИЯ ТРИ В РЯД ====================
    const match3AchievementsList = [
        { name: '🎯 500 очков', icon: '🎯', howto: 'Набери 500 очков за одну игру в «Три в ряд»' },
        { name: '🎯 1000 очков', icon: '🎯', howto: 'Набери 1000 очков за одну игру в «Три в ряд»' },
        { name: '🎯 1500 очков', icon: '🎯', howto: 'Набери 1500 очков за одну игру в «Три в ряд»' },
        { name: '🎯 2000 очков', icon: '🎯', howto: 'Набери 2000 очков за одну игру в «Три в ряд»' },
        { name: '🎯 2500 очков', icon: '🎯', howto: 'Набери 2500 очков за одну игру в «Три в ряд»' },
        { name: '🏆 Все уровни', icon: '🏆', howto: 'Пройди все 4 уровня в «Три в ряд»' },
        { name: '🎲 Мастер комбинаций', icon: '🎲', howto: 'Набери очки в «Три в ряд» без завершения уровня' }
    ];

    // ==================== НАГРАДЫ ЛАБИРИНТА ====================
    const mazeRewardsList = [
        { name: '🏆 Первый километр', icon: '🏆', howto: 'Пройди 3 уровня в лабиринте' },
        { name: '🏆 Подземный ходок', icon: '🏆', howto: 'Пройди 6 уровней в лабиринте' },
        { name: '🏆 Станция «Туннель»', icon: '🏆', howto: 'Пройди 9 уровней в лабиринте' },
        { name: '🏆 Машинист 3-го класса', icon: '🏆', howto: 'Пройди 12 уровней в лабиринте' },
        { name: '🏆 Машинист 2-го класса', icon: '🏆', howto: 'Пройди 15 уровней в лабиринте' },
        { name: '🏆 Машинист 1-го класса', icon: '🏆', howto: 'Пройди 18 уровней в лабиринте' },
        { name: '🏆 Начальник депо', icon: '🏆', howto: 'Пройди 21 уровень в лабиринте' },
        { name: '🏆 Начальник линии', icon: '🏆', howto: 'Пройди 24 уровня в лабиринте' },
        { name: '🏆 Начальник метро', icon: '🏆', howto: 'Пройди 27 уровней в лабиринте' },
        { name: '🏆 Легенда метро', icon: '🏆', howto: 'Пройди 30 уровней в лабиринте' }
    ];

    // ==================== ДОСТИЖЕНИЯ ЛАБИРИНТА ====================
    const mazeAchievementsList = [
        { name: '🎭 Чебурашка (5 уровней)', icon: '🎭', howto: 'Пройди 5 уровней с Чебурашкой' },
        { name: '🎭 Чебурашка (10 уровней)', icon: '🎭', howto: 'Пройди 10 уровней с Чебурашкой' },
        { name: '🎭 Чебурашка (15 уровней)', icon: '🎭', howto: 'Пройди 15 уровней с Чебурашкой' },
        { name: '🎭 Чебурашка (20 уровней)', icon: '🎭', howto: 'Пройди 20 уровней с Чебурашкой' },
        { name: '🎭 Чебурашка (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Чебурашкой' },
        { name: '🎭 Пин (5 уровней)', icon: '🎭', howto: 'Пройди 5 уровней с Пином' },
        { name: '🎭 Пин (10 уровней)', icon: '🎭', howto: 'Пройди 10 уровней с Пином' },
        { name: '🎭 Пин (15 уровней)', icon: '🎭', howto: 'Пройди 15 уровней с Пином' },
        { name: '🎭 Пин (20 уровней)', icon: '🎭', howto: 'Пройди 20 уровней с Пином' },
        { name: '🎭 Пин (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Пином' },
        { name: '🎭 Матроскин (5 уровней)', icon: '🎭', howto: 'Пройди 5 уровней с Матроскиным' },
        { name: '🎭 Матроскин (10 уровней)', icon: '🎭', howto: 'Пройди 10 уровней с Матроскиным' },
        { name: '🎭 Матроскин (15 уровней)', icon: '🎭', howto: 'Пройди 15 уровней с Матроскиным' },
        { name: '🎭 Матроскин (20 уровней)', icon: '🎭', howto: 'Пройди 20 уровней с Матроскиным' },
        { name: '🎭 Матроскин (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Матроскиным' },
        { name: '🎭 Маша (5 уровней)', icon: '🎭', howto: 'Пройди 5 уровней с Машей' },
        { name: '🎭 Маша (10 уровней)', icon: '🎭', howto: 'Пройди 10 уровней с Машей' },
        { name: '🎭 Маша (15 уровней)', icon: '🎭', howto: 'Пройди 15 уровней с Машей' },
        { name: '🎭 Маша (20 уровней)', icon: '🎭', howto: 'Пройди 20 уровней с Машей' },
        { name: '🎭 Маша (25 уровней)', icon: '🎭', howto: 'Пройди 25 уровней с Машей' },
        { name: '🏅 Мастер лабиринта', icon: '🏅', howto: 'Пройди 50 уровней в лабиринте' },
        { name: '👑 Легенда лабиринта', icon: '👑', howto: 'Пройди 100 уровней в лабиринте' }
    ];

    // ==================== ФУНКЦИЯ ПОЛУЧЕНИЯ СТАТУСА ====================
    function isObtained(artifacts, type, identifier) {
        if (type === 'wagons') {
            return artifacts.wagons && artifacts.wagons[identifier];
        }
        if (type === 'memoryRewards') {
            return artifacts.memoryRewards && artifacts.memoryRewards[identifier];
        }
        if (type === 'memoryAchievements') {
            return artifacts.memoryAchievements && artifacts.memoryAchievements.includes(identifier);
        }
        if (type === 'match3Achievements') {
            return artifacts.match3Achievements && artifacts.match3Achievements.includes(identifier);
        }
        if (type === 'mazeRewards') {
            return artifacts.mazeRewards && artifacts.mazeRewards[identifier];
        }
        if (type === 'mazeAchievements') {
            return artifacts.mazeAchievements && artifacts.mazeAchievements.includes(identifier);
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
    
    let currentCategory = 'memoryRewards';

    function countTotal() {
        let total = 0;
        
        // Вагоны
        if (artifacts.wagons) total += artifacts.wagons.filter(v => v === true).length;
        // Награды памяти
        if (artifacts.memoryRewards) {
            for (let theme in artifacts.memoryRewards) {
                total += artifacts.memoryRewards[theme].filter(v => v === true).length;
            }
        }
        // Достижения памяти
        if (artifacts.memoryAchievements) total += artifacts.memoryAchievements.length;
        // Достижения три в ряд
        if (artifacts.match3Achievements) total += artifacts.match3Achievements.length;
        // Награды лабиринта
        if (artifacts.mazeRewards) {
            for (let level in artifacts.mazeRewards) {
                if (artifacts.mazeRewards[level]) total++;
            }
        }
        // Достижения лабиринта
        if (artifacts.mazeAchievements) total += artifacts.mazeAchievements.length;
        
        return total;
    }

    function renderCategory() {
        container.innerHTML = '';
        
        if (currentCategory === 'wagons') {
            artifactsData.wagons.forEach((item, idx) => {
                const obtained = isObtained(artifacts, 'wagons', idx);
                createCard(item, obtained, item.howto, item.desc);
            });
        }
        
        if (currentCategory === 'memoryRewards') {
            // Собираем все награды памяти
            for (let t of memoryThemes) {
                for (let i = 0; i < t.rewards.length; i++) {
                    const obtained = artifacts.memoryRewards && artifacts.memoryRewards[t.name] && artifacts.memoryRewards[t.name][i];
                    const item = {
                        name: `${t.rewards[i]} (${t.name})`,
                        icon: t.icon,
                        howto: `🎮 Пройди уровень ${i+1} в игре «Линия памяти» для мультфильма «${t.name}»`,
                        desc: `Фигурка ${t.rewards[i]} из мультфильма "${t.name}".`
                    };
                    createCard(item, obtained, item.howto, item.desc);
                }
            }
        }
        
        if (currentCategory === 'memoryAchievements') {
            memoryAchievementsList.forEach((item, idx) => {
                const obtained = artifacts.memoryAchievements && artifacts.memoryAchievements.includes(item.name);
                createCard(item, obtained, item.howto, 'Достижение в игре «Линия памяти»');
            });
        }
        
        if (currentCategory === 'match3Achievements') {
            match3AchievementsList.forEach((item, idx) => {
                const obtained = artifacts.match3Achievements && artifacts.match3Achievements.includes(item.name);
                createCard(item, obtained, item.howto, 'Достижение в игре «Три в ряд»');
            });
        }
        
        if (currentCategory === 'mazeRewards') {
            mazeRewardsList.forEach((item, idx) => {
                const level = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30][idx];
                const obtained = artifacts.mazeRewards && artifacts.mazeRewards[level];
                createCard(item, obtained, item.howto, 'Награда за прохождение уровней в лабиринте');
            });
        }
        
        if (currentCategory === 'mazeAchievements') {
            mazeAchievementsList.forEach((item, idx) => {
                const obtained = artifacts.mazeAchievements && artifacts.mazeAchievements.includes(item.name);
                createCard(item, obtained, item.howto, 'Достижение в игре «Лабиринт»');
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
    const categories = [
        { name: 'memoryRewards', title: '🎁 Награды памяти' },
        { name: 'memoryAchievements', title: '🌟 Достижения памяти' },
        { name: 'match3Achievements', title: '💎 Достижения три в ряд' },
        { name: 'wagons', title: '🚃 Вагоны' },
        { name: 'mazeRewards', title: '🏆 Награды лабиринта' },
        { name: 'mazeAchievements', title: '🌀 Достижения лабиринта' }
    ];

    const categoryContainer = document.querySelector('.museum-categories');
    if (categoryContainer) {
        categoryContainer.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `category-btn ${currentCategory === cat.name ? 'active' : ''}`;
            btn.dataset.category = cat.name;
            btn.textContent = cat.title;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = cat.name;
                renderCategory();
            });
            categoryContainer.appendChild(btn);
        });
    }

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // ==================== ЗАПУСК ====================
    renderCategory();
});