document.addEventListener("DOMContentLoaded", () => {
    // ==================== КОНФИГУРАЦИЯ ====================
    const BOARD_WIDTH = 5;
    const BOARD_SIZE = BOARD_WIDTH * BOARD_WIDTH;
    const POINTS_PER_MATCH = 10;

    // ==================== НАГРАДЫ ЗА УРОВНИ ====================
    const LEVEL_REWARDS = {
        level1: 'Вагон типа А (1935)',
        level2: 'Вагон типа Б (1937)',
        level3: 'Вагон типа Г (1940)',
        level4: 'Вагон типа Д (1955)'
    };

    // ==================== ПОЛНЫЕ ДАННЫЕ УРОВНЕЙ ====================
    const LEVELS = {
        level1: {
            name: 'Классическое метро',
            lines: [
                { id: 'sokolnicheskaya', name: 'Сокольническая', color: '#e74c3c', stations: [
                    'Бульвар Рокоссовского', 'Черкизовская', 'Преображенская площадь', 'Сокольники', 'Красносельская',
                    'Комсомольская', 'Красные Ворота', 'Чистые пруды', 'Лубянка', 'Охотный Ряд',
                    'Библиотека им. Ленина', 'Кропоткинская', 'Парк культуры', 'Фрунзенская', 'Спортивная',
                    'Воробьёвы горы', 'Университет', 'Проспект Вернадского', 'Юго-Западная', 'Тропарёво',
                    'Румянцево', 'Саларьево', 'Филатов Луг', 'Прокшино', 'Ольховая', 'Коммунарка'
                ]},
                { id: 'zamoskvoretskaya', name: 'Замоскворецкая', color: '#2ecc71', stations: [
                    'Ховрино', 'Беломорская', 'Речной вокзал', 'Водный стадион', 'Войковская',
                    'Сокол', 'Аэропорт', 'Динамо', 'Белорусская', 'Маяковская',
                    'Тверская', 'Театральная', 'Новокузнецкая', 'Павелецкая', 'Автозаводская',
                    'Технопарк', 'Коломенская', 'Каширская', 'Кантемировская', 'Царицыно',
                    'Орехово', 'Домодедовская', 'Красногвардейская', 'Алма-Атинская'
                ]},
                { id: 'arbatsko_pokrovskaya', name: 'Арбатско-Покровская', color: '#00008B', stations: [
                    'Щёлковская', 'Первомайская', 'Измайловская', 'Партизанская', 'Семёновская',
                    'Электрозаводская', 'Бауманская', 'Курская', 'Площадь Революции', 'Арбатская',
                    'Смоленская', 'Киевская', 'Парк Победы', 'Славянский бульвар', 'Кунцевская',
                    'Молодёжная', 'Крылатское', 'Строгино', 'Мякинино', 'Волоколамская',
                    'Митино', 'Пятницкое шоссе'
                ]},
                { id: 'filyovskaya', name: 'Филёвская', color: '#87CEEB', stations: [
                    'Александровский сад', 'Арбатская', 'Смоленская', 'Киевская', 'Студенческая',
                    'Кутузовская', 'Фили', 'Багратионовская', 'Филевский парк', 'Пионерская',
                    'Кунцевская', 'Выставочная', 'Международная'
                ]},
                { id: 'koltsevaya', name: 'Кольцевая', color: '#8B4513', stations: [
                    'Киевская', 'Краснопресненская', 'Белорусская', 'Новослободская', 'Проспект Мира',
                    'Комсомольская', 'Курская', 'Таганская', 'Павелецкая', 'Добрынинская',
                    'Октябрьская', 'Парк культуры'
                ]}
            ]
        },
        level2: {
            name: 'Радиальные линии',
            lines: [
                { id: 'kaluzhsko_rizhskaya', name: 'Калужско-Рижская', color: '#FF8C00', stations: [
                    'Медведково', 'Бабушкинская', 'Свиблово', 'Ботанический сад', 'ВДНХ',
                    'Алексеевская', 'Рижская', 'Проспект Мира', 'Сухаревская', 'Тургеневская',
                    'Китай-город', 'Третьяковская', 'Октябрьская', 'Шаболовская', 'Ленинский проспект',
                    'Академическая', 'Профсоюзная', 'Новые Черёмушки', 'Калужская', 'Беляево',
                    'Коньково', 'Тёплый Стан', 'Ясенево', 'Новоясеневская'
                ]},
                { id: 'tagansko_krasnopresnenskaya', name: 'Таганско-Краснопресненская', color: '#8B00FF', stations: [
                    'Планерная', 'Сходненская', 'Тушинская', 'Спартак', 'Щукинская',
                    'Октябрьское поле', 'Полежаевская', 'Беговая', 'Улица 1905 года', 'Баррикадная',
                    'Пушкинская', 'Кузнецкий мост', 'Китай-город', 'Таганская', 'Пролетарская',
                    'Волгоградский проспект', 'Текстильщики', 'Кузьминки', 'Рязанский проспект', 'Выхино',
                    'Лермонтовский проспект', 'Жулебино', 'Котельники'
                ]},
                { id: 'kalinskaya', name: 'Калининская', color: '#FFD700', stations: [
                    'Новогиреево', 'Перово', 'Шоссе Энтузиастов', 'Авиамоторная', 'Площадь Ильича',
                    'Марксистская', 'Третьяковская'
                ]},
                { id: 'solntsevskaya', name: 'Солнцевская', color: '#DC143C', stations: [
                    'Деловой центр', 'Парк Победы', 'Минская', 'Ломоносовский проспект', 'Раменки',
                    'Мичуринский проспект', 'Озёрная', 'Говорово', 'Солнцево', 'Боровское шоссе',
                    'Новопеределкино', 'Рассказовка', 'Пыхтино', 'Аэропорт Внуково'
                ]},
                { id: 'serpukhovsko_timiryazevskaya', name: 'Серпуховско-Тимирязевская', color: '#708090', stations: [
                    'Алтуфьево', 'Бибирево', 'Отрадное', 'Владыкино', 'Петровско-Разумовская',
                    'Тимирязевская', 'Дмитровская', 'Савёловская', 'Менделеевская', 'Цветной бульвар',
                    'Чеховская', 'Боровицкая', 'Полянка', 'Серпуховская', 'Тульская',
                    'Нагатинская', 'Нагорная', 'Нахимовский проспект', 'Севастопольская', 'Чертановская',
                    'Южная', 'Пражская', 'Улица Академика Янгеля', 'Аннино', 'Бульвар Дмитрия Донского'
                ]}
            ]
        },
        level3: {
            name: 'Новые линии',
            lines: [
                { id: 'lublinsko_dmitrovskaya', name: 'Люблинско-Дмитровская', color: '#32CD32', stations: [
                    'Физтех', 'Лианозово', 'Яхромская', 'Селигерская', 'Верхние Лихоборы',
                    'Окружная', 'Петровско-Разумовская', 'Фонвизинская', 'Бутырская', 'Марьина Роща',
                    'Достоевская', 'Трубная', 'Сретенский бульвар', 'Чкаловская', 'Римская',
                    'Крестьянская застава', 'Дубровка', 'Кожуховская', 'Печатники', 'Волжская',
                    'Люблино', 'Братиславская', 'Марьино', 'Борисово', 'Шипиловская',
                    'Зябликово'
                ]},
                { id: 'bolshaya_koltsevaya', name: 'Большая кольцевая', color: '#DC143C', stations: [
                    'Деловой центр', 'Шелепиха', 'Хорошёвская', 'ЦСКА', 'Петровский парк',
                    'Савёловская', 'Марьина Роща', 'Рижская', 'Сокольники', 'Электрозаводская',
                    'Лефортово', 'Авиамоторная', 'Нижегородская', 'Текстильщики', 'Печатники',
                    'Нагатинский Затон', 'Кленовый бульвар', 'Каширская', 'Варшавская', 'Каховская',
                    'Зюзино', 'Воронцовская', 'Новаторская', 'Проспект Вернадского', 'Мичуринский проспект',
                    'Аминьевская', 'Давыдково', 'Можайская'
                ]},
                { id: 'butovskaya', name: 'Бутовская', color: '#ADD8E6', stations: [
                    'Битцевский парк', 'Лесопарковая', 'Улица Старокачаловская', 'Улица Скобелевская', 'Бульвар Адмирала Ушакова',
                    'Улица Горчакова', 'Бунинская аллея'
                ]},
                { id: 'troitskaya', name: 'Троицкая', color: '#DDA0DD', stations: [
                    'ЗИЛ', 'Крымская', 'Академическая', 'Вавиловская', 'Новаторская',
                    'Университет Дружбы Народов', 'Генерала Тюленева', 'Тютчевская', 'Корниловская', 'Коммунарка',
                    'Новомосковская', 'Сосенки', 'Летово', 'Десна', 'Кедровая',
                    'Ватутинки', 'Троицк'
                ]},
                { id: 'mck', name: 'МЦК', color: '#CD5C5C', stations: [
                    'Окружная', 'Лихоборы', 'Коптево', 'Балтийская', 'Стрешнево',
                    'Панфиловская', 'Зорге', 'Хорошёво', 'Шелепиха', 'Деловой центр',
                    'Кутузовская', 'Лужники', 'Площадь Гагарина', 'Крымская', 'Верхние Котлы',
                    'ЗИЛ', 'Автозаводская', 'Дубровка', 'Угрешская', 'Новохохловская',
                    'Нижегородская', 'Андроновка', 'Шоссе Энтузиастов', 'Соколиная Гора', 'Измайлово',
                    'Локомотив', 'Бульвар Рокоссовского', 'Белокаменная', 'Ростокино', 'Ботанический сад',
                    'Владыкино'
                ]}
            ]
        },
        level4: {
            name: 'МЦД',
            lines: [
                { id: 'mcd1', name: 'МЦД-1', color: '#FFA500', stations: [
                    'Одинцово', 'Баковка', 'Сколково', 'Немчиновка', 'Сетунь',
                    'Рабочий Посёлок', 'Кунцевская', 'Фили', 'Тестовская', 'Беговая',
                    'Белорусская', 'Савёловская', 'Тимирязевская', 'Окружная', 'Дегунино',
                    'Бескудниково', 'Лианозово', 'Марк', 'Новодачная', 'Долгопрудная',
                    'Водники', 'Хлебниково', 'Шереметьевская', 'Лобня'
                ]},
                { id: 'mcd2', name: 'МЦД-2', color: '#FF69B4', stations: [
                    'Нахабино', 'Аникеевка', 'Опалиха', 'Красногорская', 'Павшино',
                    'Пенягино', 'Волоколамская', 'Трикотажная', 'Тушинская', 'Щукинская',
                    'Стрешнево', 'Красный Балтиец', 'Гражданская', 'Дмитровская', 'Марьина Роща',
                    'Рижская', 'Каланчёвская', 'Курская', 'Москва-Товарная', 'Калитники',
                    'Текстильщики', 'Люблино', 'Перерва', 'Курьяново', 'Москворечье',
                    'Царицыно', 'Покровское', 'Красный Строитель', 'Битца', 'Бутово',
                    'Щербинка', 'Остафьево', 'Силикатная', 'Подольск'
                ]},
                { id: 'mcd3', name: 'МЦД-3', color: '#1E90FF', stations: [
                    'Крюково', 'Малино', 'Фирсановка', 'Сходня', 'Подрезково',
                    'Новоподрезково', 'Молжаниново', 'Химки', 'Левобережная', 'Ховрино',
                    'Грачёвская', 'Моссельмаш', 'Лихоборы', 'Петровско-Разумовская', 'Останкино',
                    'Рижская', 'Митьково', 'Электрозаводская', 'Сортировочная', 'Авиамоторная',
                    'Андроновка', 'Перово', 'Плющево', 'Вешняки', 'Выхино',
                    'Косино', 'Ухтомская', 'Люберцы', 'Панки', 'Томилино',
                    'Красково', 'Малаховка', 'Удельная', 'Быково', 'Ильинская',
                    'Отдых', 'Кратово', 'Есенинская', 'Фабричная', 'Раменское'
                ]},
                { id: 'mcd4', name: 'МЦД-4', color: '#228B22', stations: [
                    'Апрелевка', 'Реутово', 'Победа', 'Крёкшино', 'Санино',
                    'Кокошкино', 'Толстопальцево', 'Лесной Городок', 'Внуково', 'Мичуринец',
                    'Переделкино', 'Мещерская', 'Солнечная', 'Новопеределкино', 'Очаково',
                    'Аминьевская', 'Матвеевская', 'Минская', 'Поклонная', 'Кутузовская',
                    'Москва-Сити', 'Ермакова Роща', 'Марьина Роща', 'Савёловская', 'Станколит',
                    'Нижегородская', 'Новохохловская', 'Калитники', 'Текстильщики', 'Перово',
                    'Чухлинка', 'Кусково', 'Новогиреево', 'Реутово', 'Никольское',
                    'Салтыковская', 'Кучино', 'Железнодорожная'
                ]}
            ]
        }
    };

    // ==================== ЭЛЕМЕНТЫ ====================
    const boardElement = document.getElementById('game-board');
    const restartBtn = document.getElementById('restart');
    const lineScoreElement = document.getElementById('line-score');
    const totalScoreElement = document.getElementById('total-score');
    const levelProgressElement = document.getElementById('level-progress');
    const levelSelect = document.getElementById('level-select');
    const lineSelect = document.getElementById('line-select');
    const stationsListDiv = document.getElementById('stations-list');
    const linesStatusDiv = document.getElementById('lines-status-list');

    // ==================== ПЕРЕМЕННЫЕ ====================
    let board = [];
    let selectedCell = null;
    let currentLevel = 'level1';
    let currentLineId = 'sokolnicheskaya';
    let lineScore = 0;
    let totalScore = 0;
    let isProcessing = false;
    let bestScoreThisRun = 0; // для достижений за одну попытку

    // Прогресс уровней
    let userProgress = JSON.parse(localStorage.getItem('match3_progress')) || {
        level1: { unlocked: true, completed: false },
        level2: { unlocked: false, completed: false },
        level3: { unlocked: false, completed: false },
        level4: { unlocked: false, completed: false }
    };

    // Собранные станции
    let collectedStations = JSON.parse(localStorage.getItem('match3_collected')) || {};

    // Артефакты
    let artifacts = JSON.parse(localStorage.getItem('metro_artifacts')) || {
        wagons: [false, false, false, false]
    };

    // ==================== ДОСТИЖЕНИЯ ====================
    let achievements = JSON.parse(localStorage.getItem('match3_achievements')) || {
        score500: false,
        score1000: false,
        score1500: false,
        score2000: false,
        score2500: false,
        allLevels: false,
        scoreWithoutCompletion: false
    };

    // ==================== ФУНКЦИИ ====================
    function getLevelColors() {
        return LEVELS[currentLevel].lines.map(line => line.color);
    }

    function getCurrentLine() {
        return LEVELS[currentLevel].lines.find(line => line.id === currentLineId);
    }

    function updateLevelsUI() {
        Array.from(levelSelect.options).forEach(option => {
            if (userProgress[option.value]?.unlocked) {
                option.disabled = false;
                option.textContent = LEVELS[option.value].name;
                if (userProgress[option.value]?.completed) {
                    option.textContent += ' ✓';
                }
            } else {
                option.disabled = true;
                option.textContent = '🔒 ' + LEVELS[option.value].name;
            }
        });
    }

    function updateLinesUI() {
        lineSelect.innerHTML = '';
        LEVELS[currentLevel].lines.forEach(line => {
            const option = document.createElement('option');
            option.value = line.id;
            option.textContent = `🚇 ${line.name}`;
            lineSelect.appendChild(option);
        });
        currentLineId = LEVELS[currentLevel].lines[0].id;
        lineSelect.value = currentLineId;
    }

    function updateStationsUI() {
        const line = getCurrentLine();
        if (!line) return;

        stationsListDiv.innerHTML = '';
        line.stations.forEach(station => {
            const isChecked = collectedStations[currentLevel]?.[currentLineId]?.[station] || false;
            const item = document.createElement('div');
            item.className = `station-item ${isChecked ? 'checked' : ''}`;
            item.innerHTML = `
                <input type="checkbox" ${isChecked ? 'checked' : ''} readonly>
                <span>${station}</span>
            `;
            stationsListDiv.appendChild(item);
        });
    }

    function updateLinesStatusUI() {
        linesStatusDiv.innerHTML = '';
        const level = LEVELS[currentLevel];
        let completedLinesCount = 0;

        level.lines.forEach(line => {
            const stations = line.stations;
            const collected = collectedStations[currentLevel]?.[line.id] || {};
            const collectedCount = stations.filter(s => collected[s]).length;
            const isCompleted = collectedCount === stations.length;
            if (isCompleted) completedLinesCount++;

            const item = document.createElement('div');
            item.className = `line-status-item ${isCompleted ? 'completed' : ''}`;
            item.innerHTML = `
                <span class="line-color" style="background-color: ${line.color};"></span>
                <span class="line-name">${line.name}</span>
                <span class="line-progress">${collectedCount}/${stations.length}</span>
            `;
            linesStatusDiv.appendChild(item);
        });

        levelProgressElement.textContent = `${completedLinesCount}/${level.lines.length}`;

        if (completedLinesCount === level.lines.length && !userProgress[currentLevel]?.completed) {
            completeLevel();
        }
    }

    function saveCollectedStations() {
        localStorage.setItem('match3_collected', JSON.stringify(collectedStations));
    }

    function saveProgress() {
        localStorage.setItem('match3_progress', JSON.stringify(userProgress));
    }

    function markStation(color) {
        const line = LEVELS[currentLevel].lines.find(l => l.color === color);
        if (!line) return;

        const available = line.stations.filter(s => !collectedStations[currentLevel]?.[line.id]?.[s]);
        if (available.length === 0) return;

        const randomStation = available[Math.floor(Math.random() * available.length)];
        if (!collectedStations[currentLevel]) collectedStations[currentLevel] = {};
        if (!collectedStations[currentLevel][line.id]) collectedStations[currentLevel][line.id] = {};
        collectedStations[currentLevel][line.id][randomStation] = true;

        if (line.id === currentLineId) updateStationsUI();
        updateLinesStatusUI();
        saveCollectedStations();
    }

    function completeLevel() {
        userProgress[currentLevel].completed = true;
        
        const levelOrder = ['level1', 'level2', 'level3', 'level4'];
        const currentIndex = levelOrder.indexOf(currentLevel);
        if (currentIndex < levelOrder.length - 1) {
            userProgress[levelOrder[currentIndex + 1]].unlocked = true;
        }
        
        saveProgress();
        updateLevelsUI();
        
        const reward = LEVEL_REWARDS[currentLevel];
        const levelIndex = { level1: 0, level2: 1, level3: 2, level4: 3 }[currentLevel];
        
        if (!artifacts.wagons[levelIndex]) {
            artifacts.wagons[levelIndex] = true;
            localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
            
            setTimeout(() => {
                alert(`🏛️ ПОЛУЧЕН АРТЕФАКТ!\n\n${reward}\n\nЗагляни в Музей метро!`);
            }, 300);
        }
        
        // Проверяем достижение "Пройти все уровни"
        checkAllLevelsAchievement();
    }

    function checkAllLevelsAchievement() {
        if (!achievements.allLevels) {
            let allCompleted = true;
            for (let level in userProgress) {
                if (!userProgress[level].completed) {
                    allCompleted = false;
                    break;
                }
            }
            if (allCompleted) {
                achievements.allLevels = true;
                unlockAchievement(`🏆 Все уровни три в ряд пройдены!`);
            }
        }
    }

    function checkScoreAchievements(score) {
        if (score >= 500 && !achievements.score500) {
            achievements.score500 = true;
            unlockAchievement(`🎯 500 очков за одну игру!`);
        }
        if (score >= 1000 && !achievements.score1000) {
            achievements.score1000 = true;
            unlockAchievement(`🎯 1000 очков за одну игру!`);
        }
        if (score >= 1500 && !achievements.score1500) {
            achievements.score1500 = true;
            unlockAchievement(`🎯 1500 очков за одну игру!`);
        }
        if (score >= 2000 && !achievements.score2000) {
            achievements.score2000 = true;
            unlockAchievement(`🎯 2000 очков за одну игру!`);
        }
        if (score >= 2500 && !achievements.score2500) {
            achievements.score2500 = true;
            unlockAchievement(`🎯 2500 очков за одну игру!`);
        }
        
        localStorage.setItem('match3_achievements', JSON.stringify(achievements));
    }

    function checkScoreWithoutCompletion() {
        if (!achievements.scoreWithoutCompletion && bestScoreThisRun > 0) {
            // Проверяем, что уровень не пройден, но очки есть
            if (!userProgress[currentLevel]?.completed) {
                achievements.scoreWithoutCompletion = true;
                unlockAchievement(`🎲 Мастер комбинаций! ${bestScoreThisRun} очков без завершения уровня!`);
            }
        }
    }

    function unlockAchievement(text) {
        setTimeout(() => {
            alert(`🏅 ДОСТИЖЕНИЕ ПОЛУЧЕНО!\n\n${text}\n\nНаграда добавлена в Музей!`);
        }, 500);
        
        if (!artifacts.match3Achievements) artifacts.match3Achievements = [];
        if (!artifacts.match3Achievements.includes(text)) {
            artifacts.match3Achievements.push(text);
            localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
        }
    }

    // ==================== ИГРОВАЯ МЕХАНИКА ====================
    function initBoard() {
        boardElement.innerHTML = '';
        board = [];
        const colors = getLevelColors();
        bestScoreThisRun = 0;

        for (let i = 0; i < BOARD_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            cell.style.backgroundColor = color;
            
            cell.addEventListener('click', () => handleClick(i));
            boardElement.appendChild(cell);
            
            board.push({
                element: cell,
                color: color
            });
        }
        
        setTimeout(() => {
            while (findMatches().length > 0) {
                removeMatches(false);
            }
        }, 10);
    }

    function findMatches() {
        const matches = new Set();

        for (let row = 0; row < BOARD_WIDTH; row++) {
            for (let col = 0; col < BOARD_WIDTH - 2; col++) {
                const idx1 = row * BOARD_WIDTH + col;
                const idx2 = idx1 + 1;
                const idx3 = idx1 + 2;
                
                if (board[idx1].color && 
                    board[idx1].color === board[idx2].color && 
                    board[idx1].color === board[idx3].color) {
                    matches.add(idx1);
                    matches.add(idx2);
                    matches.add(idx3);
                }
            }
        }

        for (let col = 0; col < BOARD_WIDTH; col++) {
            for (let row = 0; row < BOARD_WIDTH - 2; row++) {
                const idx1 = row * BOARD_WIDTH + col;
                const idx2 = idx1 + BOARD_WIDTH;
                const idx3 = idx2 + BOARD_WIDTH;
                
                if (board[idx1].color && 
                    board[idx1].color === board[idx2].color && 
                    board[idx1].color === board[idx3].color) {
                    matches.add(idx1);
                    matches.add(idx2);
                    matches.add(idx3);
                }
            }
        }

        return Array.from(matches);
    }

    function removeMatches(shouldScore = true) {
        const matches = findMatches();
        if (matches.length === 0) return false;

        if (shouldScore) {
            const colors = new Set(matches.map(i => board[i].color));
            colors.forEach(color => {
                if (color) {
                    markStation(color);
                    lineScore += POINTS_PER_MATCH;
                    totalScore += POINTS_PER_MATCH;
                    bestScoreThisRun += POINTS_PER_MATCH;
                }
            });
            lineScoreElement.textContent = lineScore;
            totalScoreElement.textContent = totalScore;
            
            // Проверяем достижения по очкам
            checkScoreAchievements(bestScoreThisRun);
        }

        matches.forEach(index => {
            board[index].color = '';
            board[index].element.style.backgroundColor = '';
        });

        dropCells(shouldScore);
        return true;
    }

    function dropCells(shouldScore = true) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            const columnColors = [];
            for (let row = 0; row < BOARD_WIDTH; row++) {
                const idx = row * BOARD_WIDTH + col;
                columnColors.push(board[idx].color);
            }
            
            const nonEmptyColors = columnColors.filter(color => color !== '');
            
            const emptyCount = BOARD_WIDTH - nonEmptyColors.length;
            const newColors = [];
            const levelColors = getLevelColors();
            for (let i = 0; i < emptyCount; i++) {
                newColors.push(levelColors[Math.floor(Math.random() * levelColors.length)]);
            }
            
            const newColumn = [...newColors, ...nonEmptyColors];
            
            for (let row = 0; row < BOARD_WIDTH; row++) {
                const idx = row * BOARD_WIDTH + col;
                board[idx].color = newColumn[row];
                board[idx].element.style.backgroundColor = board[idx].color;
            }
        }
        
        if (findMatches().length > 0) {
            removeMatches(shouldScore);
        }
    }

    function handleClick(index) {
        if (isProcessing) return;

        if (selectedCell === null) {
            selectedCell = index;
            board[index].element.style.border = '3px solid white';
            board[index].element.style.boxShadow = '0 0 20px white';
        } else {
            board[selectedCell].element.style.border = '';
            board[selectedCell].element.style.boxShadow = '';

            if (index !== selectedCell) {
                const x1 = selectedCell % BOARD_WIDTH;
                const y1 = Math.floor(selectedCell / BOARD_WIDTH);
                const x2 = index % BOARD_WIDTH;
                const y2 = Math.floor(index / BOARD_WIDTH);
                
                const isAdjacent = (
                    (Math.abs(x1 - x2) === 1 && y1 === y2) ||
                    (Math.abs(y1 - y2) === 1 && x1 === x2)
                );

                if (!isAdjacent) {
                    selectedCell = null;
                    return;
                }

                const tempColor = board[selectedCell].color;
                board[selectedCell].color = board[index].color;
                board[index].color = tempColor;
                
                board[selectedCell].element.style.backgroundColor = board[selectedCell].color;
                board[index].element.style.backgroundColor = board[index].color;

                if (findMatches().length > 0) {
                    while (removeMatches(true)) {}
                    // После удаления троек проверяем, не завершился ли уровень
                    checkScoreWithoutCompletion();
                } else {
                    const backTemp = board[selectedCell].color;
                    board[selectedCell].color = board[index].color;
                    board[index].color = backTemp;
                    
                    board[selectedCell].element.style.backgroundColor = board[selectedCell].color;
                    board[index].element.style.backgroundColor = board[index].color;
                }
            }
            
            selectedCell = null;
        }
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    levelSelect.addEventListener('change', () => {
        currentLevel = levelSelect.value;
        currentLineId = LEVELS[currentLevel].lines[0].id;
        updateLinesUI();
        updateStationsUI();
        updateLinesStatusUI();
        initBoard();
        lineScore = 0;
        totalScore = 0;
        lineScoreElement.textContent = lineScore;
        totalScoreElement.textContent = totalScore;
    });

    lineSelect.addEventListener('change', () => {
        currentLineId = lineSelect.value;
        updateStationsUI();
    });

    restartBtn.addEventListener('click', () => {
        initBoard();
        lineScore = 0;
        totalScore = 0;
        lineScoreElement.textContent = lineScore;
        totalScoreElement.textContent = totalScore;
    });

    function initCollectedStations() {
        if (!collectedStations[currentLevel]) {
            collectedStations[currentLevel] = {};
            LEVELS[currentLevel].lines.forEach(line => {
                collectedStations[currentLevel][line.id] = {};
                line.stations.forEach(station => {
                    collectedStations[currentLevel][line.id][station] = false;
                });
            });
        }
    }

    // ==================== ЗАПУСК ====================
    updateLevelsUI();
    updateLinesUI();
    initCollectedStations();
    updateStationsUI();
    updateLinesStatusUI();
    initBoard();
});