document.addEventListener('DOMContentLoaded', () => {
    // ==================== ЗАГРУЗКА АРТЕФАКТОВ ====================
    let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {};

    // ==================== ДАННЫЕ ВСЕХ АРТЕФАКТОВ ====================
    const artifactsData = {
        // Вагоны (4 штуки из три в ряд)
        wagons: [
            { name: 'Вагон типа А (1935)', year: 1935, desc: 'Первый серийный вагон. Деревянные скамьи, кожаные ремни. Вмещал 180 человек. Ходил до 1975 года.', icon: '🚃' },
            { name: 'Вагон типа Б (1937)', year: 1937, desc: 'Модернизированная версия. Появились мягкие диваны. Первый с пневматическими дверями.', icon: '🚋' },
            { name: 'Вагон типа Г (1940)', year: 1940, desc: 'Цельнометаллический. Прозвали «широколобым» за форму кабины. Работал до 1983 года.', icon: '🚞' },
            { name: 'Вагон типа Д (1955)', year: 1955, desc: 'Тот самый «синий вагон» из песни. С люстрами и мягкими диванами.', icon: '🚆' }
        ],
        // Награды из линии памяти (5 мультиков × 5 уровней = 25)
        memoryRewards: []
    };

    // ==================== МУЛЬТФИЛЬМЫ И ИХ НАГРАДЫ ====================
    const memoryThemes = {
        smeshariki: { 
            name: 'Смешарики', 
            icon: '🐰', 
            rewards: ['Крош', 'Ёжик', 'Нюша', 'Бараш', 'Лосяш'],
            desc: [
                'Весёлый и энергичный кролик. Любит приключения и морковку!',
                'Застенчивый и добрый ёжик. Коллекционирует кактусы и грибы.',
                'Красавица-хрюшка. Мечтает стать принцессой и любит моду.',
                'Поэтичный и чувствительный баран. Пишет стихи и грустит.',
                'Умный лось-учёный. Знает всё на свете и любит читать.'
            ]
        },
        prostokvashino: { 
            name: 'Простоквашино', 
            icon: '🐱', 
            rewards: ['Матроскин', 'Шарик', 'Дядя Фёдор', 'Печкин', 'Галчонок'],
            desc: [
                'Хозяйственный кот в полосатой тельняшке. Любит корову Мурку и экономию.',
                'Пёс-охотник. Мечтает о фотоаппарате и дружит с Матроскиным.',
                'Добрый мальчик, который ушёл из дома и нашёл друзей в Простоквашино.',
                'Почтальон с велосипедом. Любит чай и всегда приносит новости.',
                'Маленькая галка, которая научилась говорить. Любимое выражение: «Кто там?».'
            ]
        },
        fixiki: { 
            name: 'Фиксики', 
            icon: '🔧', 
            rewards: ['Нолик', 'Симка', 'Папус', 'Мася', 'Дедус'],
            desc: [
                'Маленький фиксик в оранжевом комбинезоне. Любит приключения и сладости.',
                'Фиксик в красном комбинезоне. Умная и ответственная сестра Нолика.',
                'Папа фиксиков. Знает всё о технике и любит свою семью.',
                'Мама фиксиков. Заботливая и вкусно готовит.',
                'Мудрый дедушка фиксиков. Знает самые древние секреты.'
            ]
        },
        vinni: { 
            name: 'Винни Пух', 
            icon: '🐻', 
            rewards: ['Винни', 'Пятачок', 'Кролик', 'Иа', 'Сова'],
            desc: [
                'Медвежонок, который любит мёд и сочинять песенки. Добрый и наивный.',
                'Маленький поросёнок. Лучший друг Винни. Немного трусоват, но верный.',
                'Практичный кролик. Любит порядок и свой огород. Всегда готов принять гостей.',
                'Осёл с грустным голосом. Иногда теряет свой хвост, но находит друзей.',
                'Мудрая сова. Любит рассказывать истории и писать письма.'
            ]
        },
        masha: { 
            name: 'Маша и Медведь', 
            icon: '👧', 
            rewards: ['Маша', 'Медведь', 'Панда', 'Розочка', 'Зайка'],
            desc: [
                'Непоседливая девочка, которая постоянно придумывает новые игры и приключения.',
                'Добрый медведь, который раньше работал в цирке. Любит покой и рыбалку.',
                'Племянник Медведя. Любит спорт и соревнования.',
                'Маленькая свинка, подруга Маши. Любит наряжаться и красивые вещи.',
                'Быстрый зайка. Любит морковку и всегда прибегает первым.'
            ]
        }
    };

    // ==================== ЗАПОЛНЯЕМ НАГРАДЫ ПАМЯТИ ====================
    for (let theme in memoryThemes) {
        const themeData = memoryThemes[theme];
        themeData.rewards.forEach((reward, idx) => {
            artifactsData.memoryRewards.push({
                id: `${theme}_${idx}`,
                name: `${reward} (${themeData.name})`,
                year: idx + 1,
                desc: themeData.desc[idx] || `Фигурка ${reward} из мультфильма "${themeData.name}". Получена за прохождение уровня ${idx + 1}.`,
                icon: themeData.icon,
                theme: theme,
                level: idx + 1
            });
        });
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ АРТЕФАКТОВ ====================
    function initArtifacts() {
        if (!artifacts.wagons) artifacts.wagons = [false, false, false, false];
        if (!artifacts.memoryRewards) {
            artifacts.memoryRewards = {};
            for (let theme in memoryThemes) {
                artifacts.memoryRewards[theme] = [false, false, false, false, false];
            }
        }
        localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
    }

    // ==================== ПОДСЧЁТ СОБРАННЫХ ====================
    function countTotal() {
        let total = 0;
        
        // Вагоны
        if (artifacts.wagons) {
            total += artifacts.wagons.filter(v => v === true).length;
        }
        
        // Награды из памяти
        if (artifacts.memoryRewards) {
            for (let theme in artifacts.memoryRewards) {
                total += artifacts.memoryRewards[theme].filter(v => v === true).length;
            }
        }
        
        return total;
    }

    // ==================== ОТРИСОВКА ====================
    const container = document.getElementById('artifacts-container');
    const totalSpan = document.getElementById('total-collected');
    const modal = document.getElementById('artifact-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');
    const modalDesc = document.getElementById('modal-desc');
    const modalStatus = document.getElementById('modal-status');
    const closeBtn = document.querySelector('.close-btn');
    
    let currentCategory = 'memoryRewards';

    function renderCategory() {
        container.innerHTML = '';
        
        if (currentCategory === 'wagons') {
            artifactsData.wagons.forEach((item, idx) => {
                const isObtained = artifacts.wagons && artifacts.wagons[idx];
                createCard(item, isObtained);
            });
        }
        
        if (currentCategory === 'memoryRewards') {
            artifactsData.memoryRewards.forEach((item) => {
                const isObtained = artifacts.memoryRewards?.[item.theme]?.[item.level - 1] || false;
                createCard(item, isObtained);
            });
        }
        
        totalSpan.textContent = countTotal();
    }

    function createCard(item, isObtained) {
        const card = document.createElement('div');
        card.className = `artifact-card ${isObtained ? '' : 'locked'}`;
        card.innerHTML = `
            <div class="artifact-icon">${item.icon}</div>
            <div class="artifact-name">${item.name}</div>
            <div class="artifact-year">${item.year} уровень</div>
        `;
        
        if (isObtained) {
            card.addEventListener('click', () => showModal(item, true));
        } else {
            card.addEventListener('click', () => showModal(item, false));
        }
        
        container.appendChild(card);
    }

    function showModal(item, obtained) {
        modalTitle.textContent = item.name;
        modalYear.textContent = obtained ? `Получено` : `Ещё не получено`;
        modalDesc.textContent = item.desc;
        modalStatus.textContent = obtained ? '✅ ПОЛУЧЕНО' : '🔒 ЕЩЁ НЕ ПОЛУЧЕНО';
        modalStatus.style.background = obtained ? '#4a2c00' : '#5a3a2a';
        modal.style.display = 'block';
    }

    // ==================== КАТЕГОРИИ ====================
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderCategory();
        });
    });

    // Закрытие модалки
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ==================== ЗАПУСК ====================
    initArtifacts();
    renderCategory();
});