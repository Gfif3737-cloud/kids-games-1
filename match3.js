// ==ClosureCompiler==
// @output_file_name match3.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

document.addEventListener('DOMContentLoaded', () => {
    // ==================== КОНФИГУРАЦИЯ ====================
    const BOARD_WIDTH = 5; // ИЗМЕНЕНО С 6 НА 5
    const BOARD_SIZE = BOARD_WIDTH * BOARD_WIDTH;
    const POINTS_PER_MATCH = 10;
    const BONUS_SHUFFLE_COST = 100;
    const BONUS_BOMB_COST = 150;
    const BONUS_ROCKET_COST = 200;

    // ==================== ДАННЫЕ УРОВНЕЙ (ПОЛНЫЕ) ====================
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
                { id: 'kaluzhsko_rizhskaya', name: 'Калужско-Рижская', color: '#FFD700', stations: [
                    'Медведково', 'Бабушкинская', 'Свиблово', 'Ботанический сад', 'ВДНХ',
                    'Алексеевская', 'Рижская', 'Проспект Мира', 'Сухаревская', 'Тургеневская',
                    'Китай-город', 'Третьяковская', 'Октябрьская', 'Шаболовская', 'Ленинский проспект',
                    'Академическая', 'Профсоюзная', 'Новые Черёмушки', 'Калужская', 'Беляево',
                    'Коньково', 'Тёплый Стан', 'Ясенево', 'Новоясеневская'
                ]},
                { id: 'tagansko_krasnopresnenskaya', name: 'Таганско-Краснопресненская', color: '#9b59b6', stations: [
                    'Планерная', 'Сходненская', 'Тушинская', 'Спартак', 'Щукинская',
                    'Октябрьское поле', 'Полежаевская', 'Беговая', 'Улица 1905 года', 'Баррикадная',
                    'Пушкинская', 'Кузнецкий мост', 'Китай-город', 'Таганская', 'Пролетарская',
                    'Волгоградский проспект', 'Текстильщики', 'Кузьминки', 'Рязанский проспект', 'Выхино',
                    'Лермонтовский проспект', 'Жулебино', 'Котельники'
                ]},
                { id: 'kalinskaya', name: 'Калининская', color: '#f1c40f', stations: [
                    'Новогиреево', 'Перово', 'Шоссе Энтузиастов', 'Авиамоторная', 'Площадь Ильича',
                    'Марксистская', 'Третьяковская'
                ]},
                { id: 'solntsevskaya', name: 'Солнцевская', color: '#ffaa00', stations: [
                    'Деловой центр', 'Парк Победы', 'Минская', 'Ломоносовский проспект', 'Раменки',
                    'Мичуринский проспект', 'Озёрная', 'Говорово', 'Солнцево', 'Боровское шоссе',
                    'Новопеределкино', 'Рассказовка', 'Пыхтино', 'Аэропорт Внуково'
                ]},
                { id: 'serpukhovsko_timiryazevskaya', name: 'Серпуховско-Тимирязевская', color: '#95a5a6', stations: [
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
                { id: 'lublinsko_dmitrovskaya', name: 'Люблинско-Дмитровская', color: '#00CED1', stations: [
                    'Физтех', 'Лианозово', 'Яхромская', 'Селигерская', 'Верхние Лихоборы',
                    'Окружная', 'Петровско-Разумовская', 'Фонвизинская', 'Бутырская', 'Марьина Роща',
                    'Достоевская', 'Трубная', 'Сретенский бульвар', 'Чкаловская', 'Римская',
                    'Крестьянская застава', 'Дубровка', 'Кожуховская', 'Печатники', 'Волжская',
                    'Люблино', 'Братиславская', 'Марьино', 'Борисово', 'Шипиловская',
                    'Зябликово'
                ]},
                { id: 'bolshaya_koltsevaya', name: 'Большая кольцевая', color: '#FF1493', stations: [
                    'Деловой центр', 'Шелепиха', 'Хорошёвская', 'ЦСКА', 'Петровский парк',
                    'Савёловская', 'Марьина Роща', 'Рижская', 'Сокольники', 'Электрозаводская',
                    'Лефортово', 'Авиамоторная', 'Нижегородская', 'Текстильщики', 'Печатники',
                    'Нагатинский Затон', 'Кленовый бульвар', 'Каширская', 'Варшавская', 'Каховская',
                    'Зюзино', 'Воронцовская', 'Новаторская', 'Проспект Вернадского', 'Мичуринский проспект',
                    'Аминьевская', 'Давыдково', 'Можайская'
                ]},
                { id: 'butovskaya', name: 'Бутовская', color: '#B0C4DE', stations: [
                    'Битцевский парк', 'Лесопарковая', 'Улица Старокачаловская', 'Улица Скобелевская', 'Бульвар Адмирала Ушакова',
                    'Улица Горчакова', 'Бунинская аллея'
                ]},
                { id: 'troitskaya', name: 'Троицкая', color: '#DA70D6', stations: [
                    'ЗИЛ', 'Крымская', 'Академическая', 'Вавиловская', 'Новаторская',
                    'Университет Дружбы Народов', 'Генерала Тюленева', 'Тютчевская', 'Корниловская', 'Коммунарка',
                    'Новомосковская', 'Сосенки', 'Летово', 'Десна', 'Кедровая',
                    'Ватутинки', 'Троицк'
                ]},
                { id: 'mck', name: 'МЦК', color: '#FF6347', stations: [
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
                { id: 'mcd1', name: 'МЦД-1', color: '#e67e22', stations: [
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
                { id: 'mcd3', name: 'МЦД-3', color: '#4169E1', stations: [
                    'Крюково', 'Малино', 'Фирсановка', 'Сходня', 'Подрезково',
                    'Новоподрезково', 'Молжаниново', 'Химки', 'Левобережная', 'Ховрино',
                    'Грачёвская', 'Моссельмаш', 'Лихоборы', 'Петровско-Разумовская', 'Останкино',
                    'Рижская', 'Митьково', 'Электрозаводская', 'Сортировочная', 'Авиамоторная',
                    'Андроновка', 'Перово', 'Плющево', 'Вешняки', 'Выхино',
                    'Косино', 'Ухтомская', 'Люберцы', 'Панки', 'Томилино',
                    'Красково', 'Малаховка', 'Удельная', 'Быково', 'Ильинская',
                    'Отдых', 'Кратово', 'Есенинская', 'Фабричная', 'Раменское'
                ]},
                { id: 'mcd4', name: 'МЦД-4', color: '#32CD32', stations: [
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

    // ==================== СИСТЕМА АРТЕФАКТОВ ====================
    const ARTIFACT_NAMES = {
        wagons: ['Вагон типа А (1935)', 'Вагон типа Б (1937)', 'Вагон типа Г (1940)', 'Вагон типа Д (1955)']
    };

    function loadArtifacts() {
        return JSON.parse(localStorage.getItem('metro_artifacts')) || {
            wagons: [false, false, false, false, false, false, false, false, false, false],
            stations: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            tickets: [false, false, false, false, false, false, false, false],
            interiors: [false, false, false, false, false, false, false, false, false, false, false, false],
            uniforms: [false, false, false, false, false, false],
            equipment: [false, false, false, false, false, false, false, false, false],
            construction: [false, false, false, false, false, false, false],
            bonus: [false, false, false]
        };
    }

    function saveArtifacts(artifacts) {
        localStorage.setItem('metro_artifacts', JSON.stringify(artifacts));
    }

    function giveArtifact(levelIndex) {
        let artifacts = loadArtifacts();
        if (!artifacts.wagons[levelIndex]) {
            artifacts.wagons[levelIndex] = true;
            saveArtifacts(artifacts);
            setTimeout(() => {
                alert(`🏛️ ПОЛУЧЕН АРТЕФАКТ!\n\n${ARTIFACT_NAMES.wagons[levelIndex]}\n\nЗагляни в Музей метро!`);
            }, 300);
        }
    }

    // ==================== ПРОГРЕСС ПОЛЬЗОВАТЕЛЯ ====================
    function loadUserProgress() {
        return JSON.parse(localStorage.getItem('match3_progress')) || {
            level1: { unlocked: true, completed: false },
            level2: { unlocked: false, completed: false },
            level3: { unlocked: false, completed: false },
            level4: { unlocked: false, completed: false }
        };
    }

    function saveUserProgress(progress) {
        localStorage.setItem('match3_progress', JSON.stringify(progress));
    }

    function loadCompletedLevels() {
        return JSON.parse(localStorage.getItem('match3_completed')) || [];
    }

    function saveCompletedLevels(completed) {
        localStorage.setItem('match3_completed', JSON.stringify(completed));
    }

    // ==================== ОСНОВНЫЕ ПЕРЕМЕННЫЕ ====================
    const boardElement = document.getElementById('game-board');
    const restartBtn = document.getElementById('restart');
    const lineScoreElement = document.getElementById('line-score');
    const totalScoreElement = document.getElementById('total-score');
    const levelProgressElement = document.getElementById('level-progress');
    const levelSelect = document.getElementById('level-select');
    const lineSelect = document.getElementById('line-select');
    const stationsListDiv = document.getElementById('stations-list');
    const linesStatusDiv = document.getElementById('lines-status-list');

    let board = []; // Массив объектов клеток { color, element }
    let selectedCell = null;
    let currentLevel = 'level1';
    let currentLineId = 'sokolnicheskaya';
    let lineScore = 0;
    let totalScore = 0;
    let isProcessing = false; // Флаг, чтобы блокировать клики во время анимаций/обработки
    let bonusMode = null; // 'bomb', 'rocket' или null

    let userProgress = loadUserProgress();
    let completedLevels = loadCompletedLevels();
    let collectedStations = JSON.parse(localStorage.getItem('match3_collected')) || {};

    // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
    function getLevelColors() {
        return LEVELS[currentLevel].lines.map(line => line.color);
    }

    function getCurrentLine() {
        return LEVELS[currentLevel].lines.find(line => line.id === currentLineId);
    }

    // Обновление интерфейса уровней (блокировка недоступных)
    function updateLevelsUI() {
        for (let option of levelSelect.options) {
            if (userProgress[option.value]?.unlocked) {
                option.disabled = false;
                option.textContent = LEVELS[option.value].name;
                if (userProgress[option.value]?.completed) option.textContent += ' ✓';
            } else {
                option.disabled = true;
                option.textContent = '🔒 ' + LEVELS[option.value].name;
            }
        }
    }

    // Обновление выпадающего списка линий
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

    // Обновление списка станций текущей линии
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

    // Обновление статуса линий на уровне
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

        // Проверка на завершение уровня
        if (completedLinesCount === level.lines.length && !userProgress[currentLevel]?.completed) {
            userProgress[currentLevel].completed = true;
            const levelOrder = ['level1', 'level2', 'level3', 'level4'];
            const currentIndex = levelOrder.indexOf(currentLevel);
            if (currentIndex < levelOrder.length - 1) {
                userProgress[levelOrder[currentIndex + 1]].unlocked = true;
            }
            saveUserProgress(userProgress);

            const levelIndex = { level1: 0, level2: 1, level3: 2, level4: 3 }[currentLevel];
            if (!completedLevels.includes(currentLevel)) {
                completedLevels.push(currentLevel);
                saveCompletedLevels(completedLevels);
                giveArtifact(levelIndex);
            }
            updateLevelsUI();
        }
    }

    // Сохранение собранных станций
    function saveCollectedStations() {
        localStorage.setItem('match3_collected', JSON.stringify(collectedStations));
    }

    // Отметка станции по цвету
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

        if (line.stations.every(s => collectedStations[currentLevel]?.[line.id]?.[s])) {
            setTimeout(() => alert(`🎉 ЛИНИЯ СОБРАНА! Ты полностью собрал линию ${line.name}!`), 200);
        }
    }

    // ==================== ИГРОВАЯ МЕХАНИКА ====================
    function initBoard() {
        boardElement.innerHTML = '';
        board = [];
        const colors = getLevelColors();

        for (let i = 0; i < BOARD_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            boardElement.appendChild(cell);
            board.push({
                element: cell,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        applyBoardColors();
        
        // Убираем начальные тройки
        setTimeout(() => {
            removeInitialMatches();
        }, 10);
    }

    function applyBoardColors() {
        board.forEach(cell => {
            cell.element.style.backgroundColor = cell.color;
        });
    }

    function removeInitialMatches() {
        let anyRemoved;
        do {
            anyRemoved = false;
            const matches = findAllMatches();
            if (matches.length > 0) {
                anyRemoved = true;
                matches.forEach(index => {
                    board[index].color = '';
                });
                applyBoardColors();
                dropCells(false); // Не запускаем рекурсивно проверку совпадений
            }
        } while (anyRemoved);
    }

    function findAllMatches() {
        const matches = new Set();

        // Горизонтальные
        for (let row = 0; row < BOARD_WIDTH; row++) {
            for (let col = 0; col < BOARD_WIDTH - 2; col++) {
                const idx1 = row * BOARD_WIDTH + col;
                const idx2 = idx1 + 1;
                const idx3 = idx1 + 2;
                if (board[idx1].color && board[idx1].color === board[idx2].color && board[idx1].color === board[idx3].color) {
                    matches.add(idx1);
                    matches.add(idx2);
                    matches.add(idx3);
                }
            }
        }

        // Вертикальные
        for (let col = 0; col < BOARD_WIDTH; col++) {
            for (let row = 0; row < BOARD_WIDTH - 2; row++) {
                const idx1 = row * BOARD_WIDTH + col;
                const idx2 = idx1 + BOARD_WIDTH;
                const idx3 = idx2 + BOARD_WIDTH;
                if (board[idx1].color && board[idx1].color === board[idx2].color && board[idx1].color === board[idx3].color) {
                    matches.add(idx1);
                    matches.add(idx2);
                    matches.add(idx3);
                }
            }
        }

        return Array.from(matches);
    }

    function processMatchesAndScore() {
        if (isProcessing) return;
        isProcessing = true;

        const matches = findAllMatches();
        if (matches.length === 0) {
            isProcessing = false;
            return;
        }

        // Начисляем очки
        const colorCounts = {};
        matches.forEach(index => {
            const color = board[index].color;
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        });

        Object.keys(colorCounts).forEach(color => {
            if (color) {
                markStation(color);
                lineScore += POINTS_PER_MATCH;
                totalScore += POINTS_PER_MATCH;
            }
        });

        lineScoreElement.textContent = lineScore;
        totalScoreElement.textContent = totalScore;

        // Удаляем совпавшие клетки
        matches.forEach(index => {
            board[index].color = '';
        });
        applyBoardColors();

        // Запускаем падение
        dropCells(true);
    }

    function dropCells(continueProcessing = true) {
        // Сдвигаем вниз
        for (let col = 0; col < BOARD_WIDTH; col++) {
            const columnIndices = [];
            for (let row = 0; row < BOARD_WIDTH; row++) {
                columnIndices.push(row * BOARD_WIDTH + col);
            }

            // Собираем непустые цвета снизу вверх
            const colors = [];
            for (let i = BOARD_WIDTH - 1; i >= 0; i--) {
                const idx = columnIndices[i];
                if (board[idx].color) {
                    colors.push(board[idx].color);
                }
            }

            // Дополняем новыми цветами сверху
            const colorsNeeded = BOARD_WIDTH - colors.length;
            const levelColors = getLevelColors();
            for (let i = 0; i < colorsNeeded; i++) {
                colors.push(levelColors[Math.floor(Math.random() * levelColors.length)]);
            }

            // Записываем обратно в столбец снизу вверх
            for (let i = 0; i < BOARD_WIDTH; i++) {
                const idx = columnIndices[BOARD_WIDTH - 1 - i];
                board[idx].color = colors[i];
            }
        }

        applyBoardColors();

        if (continueProcessing) {
            setTimeout(() => {
                processMatchesAndScore();
            }, 150);
        } else {
            isProcessing = false;
        }
    }

    function trySwap(index1, index2) {
        if (isProcessing) return false;

        // Проверка соседства
        const x1 = index1 % BOARD_WIDTH;
        const y1 = Math.floor(index1 / BOARD_WIDTH);
        const x2 = index2 % BOARD_WIDTH;
        const y2 = Math.floor(index2 / BOARD_WIDTH);
        const isAdjacent = (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;

        if (!isAdjacent) return false;

        // Меняем цвета
        const tempColor = board[index1].color;
        board[index1].color = board[index2].color;
        board[index2].color = tempColor;
        applyBoardColors();

        // Проверяем, есть ли совпадения
        const matches = findAllMatches();
        if (matches.length > 0) {
            // Есть совпадения - обрабатываем
            processMatchesAndScore();
            return true;
        } else {
            // Нет совпадений - меняем обратно
            const tempColorBack = board[index1].color;
            board[index1].color = board[index2].color;
            board[index2].color = tempColorBack;
            applyBoardColors();
            return false;
        }
    }

    // ==================== БОНУСЫ ====================
    function activateBonusShuffle() {
        if (totalScore < BONUS_SHUFFLE_COST) {
            alert(`❌ Недостаточно очков! Нужно ${BONUS_SHUFFLE_COST}`);
            return;
        }

        totalScore -= BONUS_SHUFFLE_COST;
        totalScoreElement.textContent = totalScore;

        const colors = getLevelColors();
        board.forEach(cell => {
            cell.color = colors[Math.floor(Math.random() * colors.length)];
        });
        applyBoardColors();

        // После перемешивания сразу ищем совпадения
        setTimeout(() => processMatchesAndScore(), 100);
    }

    function activateBonusBomb() {
        if (totalScore < BONUS_BOMB_COST) {
            alert(`❌ Недостаточно очков! Нужно ${BONUS_BOMB_COST}`);
            return;
        }
        totalScore -= BONUS_BOMB_COST;
        totalScoreElement.textContent = totalScore;
        bonusMode = 'bomb';
        alert('💣 Выбери клетку для бомбы 3×3');
    }

    function activateBonusRocket() {
        if (totalScore < BONUS_ROCKET_COST) {
            alert(`❌ Недостаточно очков! Нужно ${BONUS_ROCKET_COST}`);
            return;
        }
        totalScore -= BONUS_ROCKET_COST;
        totalScoreElement.textContent = totalScore;
        bonusMode = 'rocket';
        alert('✨ Выбери клетку для ракеты (удаляет ряд)');
    }

    function useBomb(centerIndex) {
        const centerX = centerIndex % BOARD_WIDTH;
        const centerY = Math.floor(centerIndex / BOARD_WIDTH);
        let removed = false;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = centerX + dx;
                const y = centerY + dy;
                if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_WIDTH) {
                    const idx = y * BOARD_WIDTH + x;
                    if (board[idx].color) {
                        board[idx].color = '';
                        removed = true;
                    }
                }
            }
        }

        if (removed) {
            applyBoardColors();
            dropCells(true);
        }
    }

    function useRocket(index) {
        const y = Math.floor(index / BOARD_WIDTH);
        let removed = false;

        for (let x = 0; x < BOARD_WIDTH; x++) {
            const idx = y * BOARD_WIDTH + x;
            if (board[idx].color) {
                board[idx].color = '';
                removed = true;
            }
        }

        if (removed) {
            applyBoardColors();
            dropCells(true);
        }
    }

    // ==================== ОБРАБОТЧИКИ ====================
    boardElement.addEventListener('click', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell || isProcessing) return;

        const index = parseInt(cell.dataset.index);

        if (bonusMode === 'bomb') {
            useBomb(index);
            bonusMode = null;
            return;
        }

        if (bonusMode === 'rocket') {
            useRocket(index);
            bonusMode = null;
            return;
        }

        if (selectedCell === null) {
            selectedCell = index;
            board[index].element.style.border = '3px solid white';
            board[index].element.style.boxShadow = '0 0 20px rgba(255,255,255,0.9)';
        } else {
            // Снимаем выделение
            board[selectedCell].element.style.border = '';
            board[selectedCell].element.style.boxShadow = '';

            if (index !== selectedCell) {
                trySwap(selectedCell, index);
            }
            selectedCell = null;
        }
    });

    // Убираем выделение при клике вне игрового поля
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cell') && selectedCell !== null) {
            board[selectedCell].element.style.border = '';
            board[selectedCell].element.style.boxShadow = '';
            selectedCell = null;
        }
    });

    // ==================== ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА ====================
    levelSelect.addEventListener('change', () => {
        currentLevel = levelSelect.value;
        currentLineId = LEVELS[currentLevel].lines[0].id;
        updateLinesUI();
        updateStationsUI();
        updateLinesStatusUI();
        initBoard();
        lineScore = 0;
        lineScoreElement.textContent = lineScore;
    });

    lineSelect.addEventListener('change', () => {
        currentLineId = lineSelect.value;
        updateStationsUI();
    });

    restartBtn.addEventListener('click', () => {
        initBoard();
        lineScore = 0;
        lineScoreElement.textContent = lineScore;
    });

    // Создание магазина бонусов
    const shopPanel = document.createElement('div');
    shopPanel.className = 'shop-panel';
    shopPanel.innerHTML = `
        <h3>🛒 БОНУСЫ</h3>
        <div class="bonus-buttons">
            <button class="bonus-btn" data-bonus="shuffle">🔄 Перемешать (${BONUS_SHUFFLE_COST})</button>
            <button class="bonus-btn" data-bonus="bomb">💣 Бомба 3×3 (${BONUS_BOMB_COST})</button>
            <button class="bonus-btn" data-bonus="rocket">✨ Ракета (${BONUS_ROCKET_COST})</button>
        </div>
    `;

    const scoreContainer = document.querySelector('.score-container');
    if (scoreContainer) {
        scoreContainer.parentNode.insertBefore(shopPanel, scoreContainer.nextSibling);
    } else {
        boardElement.parentNode.insertBefore(shopPanel, boardElement.nextSibling);
    }

    document.querySelectorAll('.bonus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bonus = e.target.dataset.bonus;
            if (bonus === 'shuffle') activateBonusShuffle();
            if (bonus === 'bomb') activateBonusBomb();
            if (bonus === 'rocket') activateBonusRocket();
        });
    });

    // Инициализация прогресса по станциям
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