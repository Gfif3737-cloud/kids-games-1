document.addEventListener('DOMContentLoaded', () => {
    // ==================== ЗАГРУЗКА АРТЕФАКТОВ ====================
    let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {};

    // ==================== ВСЕ АРТЕФАКТЫ С ПОДСКАЗКАМИ ====================
    const artifactsData = {
        wagons: [
            { 
                name: 'Вагон типа А (1935)', 
                icon: '🚃',
                howto: '🏆 Получи за прохождение УРОВНЯ 1 в игре «Три в ряд»',
                desc: 'Первый серийный вагон. Деревянные скамьи, кожаные ремни. Вмещал 180 человек. Ходил до 1975 года.'
            },
            { 
                name: 'Вагон типа Б (1937)', 
                icon: '🚋',
                howto: '🏆 Получи за прохождение УРОВНЯ 2 в игре «Три в ряд»',
                desc: 'Модернизированная версия. Появились мягкие диваны. Первый с пневматическими дверями.'
            },
            { 
                name: 'Вагон типа Г (1940)', 
                icon: '🚞',
                howto: '🏆 Получи за прохождение УРОВНЯ 3 в игре «Три в ряд»',
                desc: 'Цельнометаллический. Прозвали «широколобым» за форму кабины. Работал до 1983 года.'
            },
            { 
                name: 'Вагон типа Д (1955)', 
                icon: '🚆',
                howto: '🏆 Получи за прохождение УРОВНЯ 4 в игре «Три в ряд»',
                desc: 'Тот самый «синий вагон» из песни. С люстрами и мягкими диванами.'
            }
        ],
        memoryRewards: []
    };

    // ==================== МУЛЬТФИЛЬМЫ И ИХ НАГРАДЫ ====================
    const memoryThemes = [
        { name: 'Смешарики', icon: '🐰', 
          rewards: ['Крош', 'Ёжик', 'Нюша', 'Бараш', 'Лосяш'],
          desc: [
              'Весёлый и энергичный кролик. Любит приключения и морковку!',
              'Застенчивый и добрый ёжик. Коллекционирует кактусы и грибы.',
              'Красавица-хрюшка. Мечтает стать принцессой и любит моду.',
              'Поэтичный и чувствительный баран. Пишет стихи и грустит.',
              'Умный лось-учёный. Знает всё на свете и любит читать.'
          ] 
        },
        { name: 'Простоквашино', icon: '🐱', 
          rewards: ['Матроскин', 'Шарик', 'Дядя Фёдор', 'Печкин', 'Галчонок'],
          desc: [
              'Хозяйственный кот в полосатой тельняшке. Любит корову Мурку.',
              'Пёс-охотник. Мечтает о фотоаппарате и дружит с Матроскиным.',
              'Добрый мальчик, который нашёл друзей в Простоквашино.',
              'Почтальон с велосипедом. Любит чай и всегда приносит новости.',
              'Маленькая галка, которая научилась говорить: «Кто там?».'
          ] 
        },
        { name: 'Фиксики', icon: '🔧', 
          rewards: ['Нолик', 'Симка', 'Папус', 'Мася', 'Дедус'],
          desc: [
              'Маленький фиксик в оранжевом комбинезоне. Любит приключения.',
              'Фиксик в красном комбинезоне. Умная и ответственная сестра Нолика.',
              'Папа фиксиков. Знает всё о технике и любит свою семью.',
              'Мама фиксиков. Заботливая и вкусно готовит.',
              'Мудрый дедушка фиксиков. Знает самые древние секреты.'
          ] 
        },
        { name: 'Винни Пух', icon: '🐻', 
          rewards: ['Винни', 'Пятачок', 'Кролик', 'Иа', 'Сова'],
          desc: [
              'Медвежонок, который любит мёд и сочинять песенки.',
              'Маленький поросёнок. Лучший друг Винни.',
              'Практичный кролик. Любит порядок и свой огород.',
              'Осёл с грустным голосом. Иногда теряет свой хвост.',
              'Мудрая сова. Любит рассказывать истории и писать письма.'
          ] 
        },
        { name: 'Маша и Медведь', icon: '👧', 
          rewards: ['Маша', 'Медведь', 'Панда', 'Розочка', 'Зайка'],
          desc: [
              'Непоседливая девочка, которая придумывает новые игры.',
              'Добрый медведь, который раньше работал в цирке.',
              'Племянник Медведя. Любит спорт и соревнования.',
              'Маленькая свинка, подруга Маши. Любит наряжаться.',
              'Быстрый зайка. Любит морковку и всегда прибегает первым.'
          ] 
        }
    ];

    // ==================== ЗАПОЛНЯЕМ НАГРАДЫ ПАМЯТИ ====================
    for (let t of memoryThemes) {
        for (let i = 0; i < t.rewards.length; i++) {
            const levelNames = ['Лёгкий (4×2)', 'Средний (4×3)', 'Сложный (4×4)', 'Эксперт (4×5)', 'Мастер (4×6)'];
            artifactsData.memoryRewards.push({
                id: `${t.name}_${i}`,
                name: `${t.rewards[i]} (${t.name})`,
                icon: t.icon,
                howto: `🎮 Получи за прохождение уровня «${levelNames[i]}» в игре «Линия памяти» для мультфильма «${t.name}»`,
                desc: t.desc[i],
                theme: t.name,
                level: i + 1
            });
        }
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    function initArtifacts() {
        if (!artifacts.wagons) artifacts.wagons = [false, false, false, false];
        if (!artifacts.memoryRewards) {
            artifacts.memoryRewards = {};
            for (let t of memoryThemes) {
                artifacts.memoryRewards[t.name] = [false, false, false, false, false];
            }
        }
        localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
    }

    // ==================== ПОДСЧЁТ СОБРАННЫХ ====================
    function countTotal() {
        let total = 0;
        if (artifacts.wagons) total += artifacts.wagons.filter(v => v === true).length;
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
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalHowto = document.getElementById('modal-howto');
    const modalDesc = document.getElementById('modal-desc');
    const modalStatus = document.getElementById('modal-status');
    const closeBtn = document.querySelector('.close-btn');
    
    let currentCategory = 'memoryRewards';

    function renderCategory() {
        container.innerHTML = '';
        
        if (currentCategory === 'wagons') {
            artifactsData.wagons.forEach((item, idx) => {
                const isObtained = artifacts.wagons && artifacts.wagons[idx];
                createCard(item, isObtained, idx);
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
            <div class="artifact-year">${isObtained ? '✓ Получено' : '🔒 Не получено'}</div>
        `;
        
        card.addEventListener('click', () => showModal(item, isObtained));
        container.appendChild(card);
    }

    function showModal(item, obtained) {
        modalIcon.textContent = item.icon;
        modalTitle.textContent = item.name;
        modalHowto.innerHTML = `📜 <strong>Как получить:</strong><br>${item.howto}`;
        modalDesc.innerHTML = `📖 <strong>Описание:</strong><br>${item.desc}`;
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

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // ==================== ЗАПУСК ====================
    initArtifacts();
    renderCategory();
});