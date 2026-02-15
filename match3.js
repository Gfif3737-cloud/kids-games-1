document.addEventListener("DOMContentLoaded", () => {
    const width = 5;
    const board = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart");
    const lineScoreElement = document.getElementById("line-score");
    const totalScoreElement = document.getElementById("total-score");
    const levelProgressElement = document.getElementById("level-progress");
    const levelSelect = document.getElementById("level-select");
    const lineSelect = document.getElementById("line-select");
    const stationsListDiv = document.getElementById("stations-list");
    const linesStatusDiv = document.getElementById("lines-status-list");

    // ==================== ДАННЫЕ УРОВНЕЙ ====================
    const levels = {
        // УРОВЕНЬ 1: Классическое метро (5 линий)
        level1: {
            name: "Классическое метро",
            lines: [
                { id: "sokolnicheskaya", name: "Сокольническая", color: "#e74c3c", stations: [ // красный
                    "Бульвар Рокоссовского", "Черкизовская", "Преображенская площадь", "Сокольники", "Красносельская",
                    "Комсомольская", "Красные Ворота", "Чистые пруды", "Лубянка", "Охотный Ряд",
                    "Библиотека им. Ленина", "Кропоткинская", "Парк культуры", "Фрунзенская", "Спортивная",
                    "Воробьёвы горы", "Университет", "Проспект Вернадского", "Юго-Западная", "Тропарёво",
                    "Румянцево", "Саларьево", "Филатов Луг", "Прокшино", "Ольховая", "Коммунарка"
                ]},
                { id: "zamoskvoretskaya", name: "Замоскворецкая", color: "#2ecc71", stations: [ // зелёный
                    "Ховрино", "Беломорская", "Речной вокзал", "Водный стадион", "Войковская",
                    "Сокол", "Аэропорт", "Динамо", "Белорусская", "Маяковская",
                    "Тверская", "Театральная", "Новокузнецкая", "Павелецкая", "Автозаводская",
                    "Технопарк", "Коломенская", "Каширская", "Кантемировская", "Царицыно",
                    "Орехово", "Домодедовская", "Красногвардейская", "Алма-Атинская"
                ]},
                { id: "arbatsko_pokrovskaya", name: "Арбатско-Покровская", color: "#1E3A8A", stations: [ // тёмно-синий
                    "Щёлковская", "Первомайская", "Измайловская", "Партизанская", "Семёновская",
                    "Электрозаводская", "Бауманская", "Курская", "Площадь Революции", "Арбатская",
                    "Смоленская", "Киевская", "Парк Победы", "Славянский бульвар", "Кунцевская",
                    "Молодёжная", "Крылатское", "Строгино", "Мякинино", "Волоколамская",
                    "Митино", "Пятницкое шоссе"
                ]},
                { id: "filyovskaya", name: "Филёвская", color: "#87CEEB", stations: [ // голубой
                    "Александровский сад", "Арбатская", "Смоленская", "Киевская", "Студенческая",
                    "Кутузовская", "Фили", "Багратионовская", "Филевский парк", "Пионерская",
                    "Кунцевская", "Выставочная", "Международная"
                ]},
                { id: "koltsevaya", name: "Кольцевая", color: "#8B4513", stations: [ // коричневый
                    "Киевская", "Краснопресненская", "Белорусская", "Новослободская", "Проспект Мира",
                    "Комсомольская", "Курская", "Таганская", "Павелецкая", "Добрынинская",
                    "Октябрьская", "Парк культуры"
                ]}
            ]
        },
        
        // УРОВЕНЬ 2: Радиальные линии (5 линий)
        level2: {
            name: "Радиальные линии",
            lines: [
                { id: "kaluzhsko_rizhskaya", name: "Калужско-Рижская", color: "#F97316", stations: [ // ярко-оранжевый
                    "Медведково", "Бабушкинская", "Свиблово", "Ботанический сад", "ВДНХ",
                    "Алексеевская", "Рижская", "Проспект Мира", "Сухаревская", "Тургеневская",
                    "Китай-город", "Третьяковская", "Октябрьская", "Шаболовская", "Ленинский проспект",
                    "Академическая", "Профсоюзная", "Новые Черёмушки", "Калужская", "Беляево",
                    "Коньково", "Тёплый Стан", "Ясенево", "Новоясеневская"
                ]},
                { id: "tagansko_krasnopresnenskaya", name: "Таганско-Краснопресненская", color: "#A020F0", stations: [ // фиолетовый
                    "Планерная", "Сходненская", "Тушинская", "Спартак", "Щукинская",
                    "Октябрьское поле", "Полежаевская", "Беговая", "Улица 1905 года", "Баррикадная",
                    "Пушкинская", "Кузнецкий мост", "Китай-город", "Таганская", "Пролетарская",
                    "Волгоградский проспект", "Текстильщики", "Кузьминки", "Рязанский проспект", "Выхино",
                    "Лермонтовский проспект", "Жулебино", "Котельники"
                ]},
                { id: "kalinskaya", name: "Калининская", color: "#FBBF24", stations: [ // жёлтый
                    "Новогиреево", "Перово", "Шоссе Энтузиастов", "Авиамоторная", "Площадь Ильича",
                    "Марксистская", "Третьяковская"
                ]},
                { id: "solntsevskaya", name: "Солнцевская", color: "#F59E0B", stations: [ // тёмно-жёлтый
                    "Деловой центр", "Парк Победы", "Минская", "Ломоносовский проспект", "Раменки",
                    "Мичуринский проспект", "Озёрная", "Говорово", "Солнцево", "Боровское шоссе",
                    "Новопеределкино", "Рассказовка", "Пыхтино", "Аэропорт Внуково"
                ]},
                { id: "serpukhovsko_timiryazevskaya", name: "Серпуховско-Тимирязевская", color: "#6B7280", stations: [ // серый
                    "Алтуфьево", "Бибирево", "Отрадное", "Владыкино", "Петровско-Разумовская",
                    "Тимирязевская", "Дмитровская", "Савёловская", "Менделеевская", "Цветной бульвар",
                    "Чеховская", "Боровицкая", "Полянка", "Серпуховская", "Тульская",
                    "Нагатинская", "Нагорная", "Нахимовский проспект", "Севастопольская", "Чертановская",
                    "Южная", "Пражская", "Улица Академика Янгеля", "Аннино", "Бульвар Дмитрия Донского"
                ]}
            ]
        },
        
        // УРОВЕНЬ 3: Новые линии (5 линий)
        level3: {
            name: "Новые линии",
            lines: [
                { id: "lublinsko_dmitrovskaya", name: "Люблинско-Дмитровская", color: "#14B8A6", stations: [ // бирюзовый
                    "Физтех", "Лианозово", "Яхромская", "Селигерская", "Верхние Лихоборы",
                    "Окружная", "Петровско-Разумовская", "Фонвизинская", "Бутырская", "Марьина Роща",
                    "Достоевская", "Трубная", "Сретенский бульвар", "Чкаловская", "Римская",
                    "Крестьянская застава", "Дубровка", "Кожуховская", "Печатники", "Волжская",
                    "Люблино", "Братиславская", "Марьино", "Борисово", "Шипиловская",
                    "Зябликово"
                ]},
                { id: "bolshaya_koltsevaya", name: "Большая кольцевая", color: "#DB2777", stations: [ // малиновый
                    "Деловой центр", "Шелепиха", "Хорошёвская", "ЦСКА", "Петровский парк",
                    "Савёловская", "Марьина Роща", "Рижская", "Сокольники", "Электрозаводская",
                    "Лефортово", "Авиамоторная", "Нижегородская", "Текстильщики", "Печатники",
                    "Нагатинский Затон", "Кленовый бульвар", "Каширская", "Варшавская", "Каховская",
                    "Зюзино", "Воронцовская", "Новаторская", "Проспект Вернадского", "Мичуринский проспект",
                    "Аминьевская", "Давыдково", "Можайская"
                ]},
                { id: "butovskaya", name: "Бутовская", color: "#A5F3FC", stations: [ // светло-голубой
                    "Битцевский парк", "Лесопарковая", "Улица Старокачаловская", "Улица Скобелевская", "Бульвар Адмирала Ушакова",
                    "Улица Горчакова", "Бунинская аллея"
                ]},
                { id: "troitskaya", name: "Троицкая", color: "#C084FC", stations: [ // светло-фиолетовый
                    "ЗИЛ", "Крымская", "Академическая", "Вавиловская", "Новаторская",
                    "Университет Дружбы Народов", "Генерала Тюленева", "Тютчевская", "Корниловская", "Коммунарка",
                    "Новомосковская", "Сосенки", "Летово", "Десна", "Кедровая",
                    "Ватутинки", "Троицк"
                ]},
                { id: "mck", name: "МЦК", color: "#F87171", stations: [ // светло-красный
                    "Окружная", "Лихоборы", "Коптево", "Балтийская", "Стрешнево",
                    "Панфиловская", "Зорге", "Хорошёво", "Шелепиха", "Деловой центр",
                    "Кутузовская", "Лужники", "Площадь Гагарина", "Крымская", "Верхние Котлы",
                    "ЗИЛ", "Автозаводская", "Дубровка", "Угрешская", "Новохохловская",
                    "Нижегородская", "Андроновка", "Шоссе Энтузиастов", "Соколиная Гора", "Измайлово",
                    "Локомотив", "Бульвар Рокоссовского", "Белокаменная", "Ростокино", "Ботанический сад",
                    "Владыкино"
                ]}
            ]
        },
        
        // УРОВЕНЬ 4: МЦД (4 линии)
        level4: {
            name: "МЦД",
            lines: [
                { id: "mcd1", name: "МЦД-1", color: "#FB923C", stations: [ // оранжевый
                    "Одинцово", "Баковка", "Сколково", "Немчиновка", "Сетунь",
                    "Рабочий Посёлок", "Кунцевская", "Фили", "Тестовская", "Беговая",
                    "Белорусская", "Савёловская", "Тимирязевская", "Окружная", "Дегунино",
                    "Бескудниково", "Лианозово", "Марк", "Новодачная", "Долгопрудная",
                    "Водники", "Хлебниково", "Шереметьевская", "Лобня"
                ]},
                { id: "mcd2", name: "МЦД-2", color: "#F472B6", stations: [ // розовый
                    "Нахабино", "Аникеевка", "Опалиха", "Красногорская", "Павшино",
                    "Пенягино", "Волоколамская", "Трикотажная", "Тушинская", "Щукинская",
                    "Стрешнево", "Красный Балтиец", "Гражданская", "Дмитровская", "Марьина Роща",
                    "Рижская", "Каланчёвская", "Курская", "Москва-Товарная", "Калитники",
                    "Текстильщики", "Люблино", "Перерва", "Курьяново", "Москворечье",
                    "Царицыно", "Покровское", "Красный Строитель", "Битца", "Бутово",
                    "Щербинка", "Остафьево", "Силикатная", "Подольск"
                ]},
                { id: "mcd3", name: "МЦД-3", color: "#60A5FA", stations: [ // синий
                    "Крюково", "Малино", "Фирсановка", "Сходня", "Подрезково",
                    "Новоподрезково", "Молжаниново", "Химки", "Левобережная", "Ховрино",
                    "Грачёвская", "Моссельмаш", "Лихоборы", "Петровско-Разумовская", "Останкино",
                    "Рижская", "Митьково", "Электрозаводская", "Сортировочная", "Авиамоторная",
                    "Андроновка", "Перово", "Плющево", "Вешняки", "Выхино",
                    "Косино", "Ухтомская", "Люберцы", "Панки", "Томилино",
                    "Красково", "Малаховка", "Удельная", "Быково", "Ильинская",
                    "Отдых", "Кратово", "Есенинская", "Фабричная", "Раменское"
                ]},
                { id: "mcd4", name: "МЦД-4", color: "#4ADE80", stations: [ // зелёный
                    "Апрелевка", "Реутово", "Победа", "Крёкшино", "Санино",
                    "Кокошкино", "Толстопальцево", "Лесной Городок", "Внуково", "Мичуринец",
                    "Переделкино", "Мещерская", "Солнечная", "Новопеределкино", "Очаково",
                    "Аминьевская", "Матвеевская", "Минская", "Поклонная", "Кутузовская",
                    "Москва-Сити", "Ермакова Роща", "Марьина Роща", "Савёловская", "Станколит",
                    "Нижегородская", "Новохохловская", "Калитники", "Текстильщики", "Перово",
                    "Чухлинка", "Кусково", "Новогиреево", "Реутово", "Никольское",
                    "Салтыковская", "Кучино", "Железнодорожная"
                ]}
            ]
        }
    };

    // ==================== СОСТОЯНИЕ ИГРЫ ====================
    let squares = [];
    let firstSelected = null;
    let currentLevel = "level1";
    let currentLineId = "sokolnicheskaya";
    let lineScore = 0;
    let totalScore = 0;
    let isDropping = false;
    
    // Прогресс сбора станций
    let collectedStations = {};

    // Инициализация прогресса для всех уровней и линий
    function initProgress() {
        for (let level in levels) {
            collectedStations[level] = {};
            levels[level].lines.forEach(line => {
                collectedStations[level][line.id] = {};
                line.stations.forEach(station => {
                    collectedStations[level][line.id][station] = false;
                });
            });
        }
    }

    // ==================== UI ФУНКЦИИ ====================
    
    function updateLineSelect() {
        lineSelect.innerHTML = "";
        const level = levels[currentLevel];
        level.lines.forEach(line => {
            const option = document.createElement("option");
            option.value = line.id;
            option.textContent = `🚇 ${line.name}`;
            lineSelect.appendChild(option);
        });
        currentLineId = level.lines[0].id;
        lineSelect.value = currentLineId;
    }

    function renderStationsList() {
        const level = levels[currentLevel];
        const line = level.lines.find(l => l.id === currentLineId);
        if (!line) return;

        stationsListDiv.innerHTML = "";
        
        line.stations.forEach(station => {
            const isChecked = collectedStations[currentLevel]?.[currentLineId]?.[station] || false;
            const item = document.createElement("div");
            item.classList.add("station-item");
            if (isChecked) item.classList.add("checked");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isChecked;
            checkbox.readOnly = true;

            const stationName = document.createElement("span");
            stationName.textContent = station;

            item.appendChild(checkbox);
            item.appendChild(stationName);
            stationsListDiv.appendChild(item);
        });
    }

    function renderLinesStatus() {
        linesStatusDiv.innerHTML = "";
        const level = levels[currentLevel];
        
        level.lines.forEach(line => {
            const stations = line.stations;
            const collected = collectedStations[currentLevel][line.id];
            const collectedCount = stations.filter(s => collected[s]).length;
            const totalCount = stations.length;
            const isCompleted = collectedCount === totalCount;

            const item = document.createElement("div");
            item.classList.add("line-status-item");
            if (isCompleted) item.classList.add("completed");

            const colorDot = document.createElement("span");
            colorDot.classList.add("line-color");
            colorDot.style.backgroundColor = line.color;

            const lineName = document.createElement("span");
            lineName.classList.add("line-name");
            lineName.textContent = line.name;

            const progress = document.createElement("span");
            progress.classList.add("line-progress");
            progress.textContent = `${collectedCount}/${totalCount}`;

            item.appendChild(colorDot);
            item.appendChild(lineName);
            item.appendChild(progress);
            linesStatusDiv.appendChild(item);
        });

        const completedLines = level.lines.filter(line => {
            const stations = line.stations;
            const collected = collectedStations[currentLevel][line.id];
            return stations.filter(s => collected[s]).length === stations.length;
        }).length;
        
        levelProgressElement.textContent = `${completedLines}/${level.lines.length} линий`;
    }

    function markStationByColor(color) {
        const level = levels[currentLevel];
        const line = level.lines.find(l => l.color === color);
        if (!line) return;

        const availableStations = line.stations.filter(
            station => !collectedStations[currentLevel]?.[line.id]?.[station]
        );

        if (availableStations.length > 0) {
            const randomStation = availableStations[Math.floor(Math.random() * availableStations.length)];
            collectedStations[currentLevel][line.id][randomStation] = true;
            
            if (line.id === currentLineId) {
                renderStationsList();
            }
            
            renderLinesStatus();

            const isLineComplete = line.stations.every(
                s => collectedStations[currentLevel][line.id][s]
            );
            
            if (isLineComplete) {
                setTimeout(() => {
                    alert(`🎉 ЛИНИЯ СОБРАНА! Ты полностью собрал линию ${line.name}!`);
                }, 300);
            }

            const completedLines = level.lines.filter(l => {
                return l.stations.every(s => collectedStations[currentLevel][l.id][s]);
            }).length;
            
            if (completedLines === level.lines.length) {
                setTimeout(() => {
                    alert(`🎉 УРОВЕНЬ ПРОЙДЕН! Ты собрал все линии уровня ${level.name}!`);
                }, 300);
            }
        }
    }

    // ==================== ИГРОВАЯ МЕХАНИКА ====================
    
    function hasAnyMatches() {
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const color = squares[i]?.dataset.color;
                if (color && squares[i + 1]?.dataset.color === color && squares[i + 2]?.dataset.color === color) {
                    return true;
                }
            }
        }
        for (let i = 0; i < width * (width - 2); i++) {
            const color = squares[i]?.dataset.color;
            if (color && squares[i + width]?.dataset.color === color && squares[i + width * 2]?.dataset.color === color) {
                return true;
            }
        }
        return false;
    }

    function fixTriple(i1, i2, i3) {
        const level = levels[currentLevel];
        const colors = level.lines.map(l => l.color);
        const otherColors = colors.filter(c => c !== squares[i1].dataset.color);
        const newColor = otherColors[Math.floor(Math.random() * otherColors.length)];
        squares[i1].dataset.color = newColor;
        squares[i1].style.backgroundColor = newColor;
    }

    function removeAllMatches() {
        let fixed = false;
        do {
            fixed = false;
            
            for (let i = 0; i < width * width; i++) {
                if (i % width <= width - 3) {
                    const color = squares[i].dataset.color;
                    if (color && squares[i + 1].dataset.color === color && squares[i + 2].dataset.color === color) {
                        fixTriple(i, i + 1, i + 2);
                        fixed = true;
                        break;
                    }
                }
            }
            
            if (!fixed) {
                for (let i = 0; i < width * (width - 2); i++) {
                    const color = squares[i].dataset.color;
                    if (color && squares[i + width].dataset.color === color && squares[i + width * 2].dataset.color === color) {
                        fixTriple(i, i + width, i + width * 2);
                        fixed = true;
                        break;
                    }
                }
            }
        } while (fixed);
    }

    function createBoard() {
        board.innerHTML = "";
        squares = [];
        lineScore = 0;
        lineScoreElement.textContent = "0";

        const level = levels[currentLevel];
        const colors = level.lines.map(l => l.color);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.classList.add("cell");
            square.setAttribute("data-id", i);
            board.appendChild(square);
            squares.push(square);
            square.addEventListener("click", () => selectSquare(square));
        }

        for (let i = 0; i < squares.length; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            squares[i].dataset.color = randomColor;
            squares[i].style.backgroundColor = randomColor;
        }
        
        removeAllMatches();
    }

    function selectSquare(square) {
        if (isDropping) return;
        
        if (!firstSelected) {
            firstSelected = square;
            square.style.border = "3px solid white";
            square.style.boxShadow = "0 0 20px rgba(255,255,255,0.9)";
            return;
        }

        const index1 = parseInt(firstSelected.dataset.id);
        const index2 = parseInt(square.dataset.id);

        const isAdjacent = (
            (index1 === index2 - 1 && index1 % width !== width - 1) ||
            (index1 === index2 + 1 && index2 % width !== width - 1) ||
            (index1 === index2 - width) ||
            (index1 === index2 + width)
        );

        if (isAdjacent) {
            swapSquares(firstSelected, square);

            if (hasAnyMatches()) {
                processMatches();
            } else {
                swapSquares(firstSelected, square);
            }
        }

        firstSelected.style.border = "none";
        firstSelected.style.boxShadow = "none";
        firstSelected = null;
    }

    function processMatches() {
        let matchesFound = false;
        
        do {
            matchesFound = false;
            
            for (let i = 0; i < width * width; i++) {
                if (i % width <= width - 3) {
                    const color = squares[i].dataset.color;
                    if (color && squares[i + 1].dataset.color === color && squares[i + 2].dataset.color === color) {
                        markStationByColor(color);
                        lineScore += 10;
                        totalScore += 10;
                        matchesFound = true;
                    }
                }
            }
            
            for (let i = 0; i < width * (width - 2); i++) {
                const color = squares[i].dataset.color;
                if (color && squares[i + width].dataset.color === color && squares[i + width * 2].dataset.color === color) {
                    markStationByColor(color);
                    lineScore += 10;
                    totalScore += 10;
                    matchesFound = true;
                }
            }
            
            lineScoreElement.textContent = lineScore;
            totalScoreElement.textContent = totalScore;
            
            if (matchesFound) {
                removeMatchesAndDrop();
            }
        } while (matchesFound);
    }

    function swapSquares(square1, square2) {
        const color1 = square1.dataset.color;
        const color2 = square2.dataset.color;

        square1.dataset.color = color2;
        square2.dataset.color = color1;
        square1.style.backgroundColor = color2;
        square2.style.backgroundColor = color1;
    }

    function removeMatchesAndDrop() {
        let anyRemoved = false;

        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const color = squares[i].dataset.color;
                if (color && squares[i + 1].dataset.color === color && squares[i + 2].dataset.color === color) {
                    squares[i].dataset.color = "";
                    squares[i + 1].dataset.color = "";
                    squares[i + 2].dataset.color = "";
                    squares[i].style.backgroundColor = "transparent";
                    squares[i + 1].style.backgroundColor = "transparent";
                    squares[i + 2].style.backgroundColor = "transparent";
                    anyRemoved = true;
                }
            }
        }

        for (let i = 0; i < width * (width - 2); i++) {
            const color = squares[i].dataset.color;
            if (color && squares[i + width].dataset.color === color && squares[i + width * 2].dataset.color === color) {
                squares[i].dataset.color = "";
                squares[i + width].dataset.color = "";
                squares[i + width * 2].dataset.color = "";
                squares[i].style.backgroundColor = "transparent";
                squares[i + width].style.backgroundColor = "transparent";
                squares[i + width * 2].style.backgroundColor = "transparent";
                anyRemoved = true;
            }
        }

        if (anyRemoved) {
            isDropping = true;
            setTimeout(() => dropSquares(), 200);
        }
    }

    function dropSquares() {
        const level = levels[currentLevel];
        const colors = level.lines.map(l => l.color);

        for (let col = 0; col < width; col++) {
            for (let row = width - 1; row >= 0; row--) {
                const index = row * width + col;
                
                if (!squares[index].dataset.color) {
                    for (let above = row - 1; above >= 0; above--) {
                        const aboveIndex = above * width + col;
                        if (squares[aboveIndex].dataset.color) {
                            squares[index].dataset.color = squares[aboveIndex].dataset.color;
                            squares[index].style.backgroundColor = squares[aboveIndex].style.backgroundColor;

                            squares[aboveIndex].dataset.color = "";
                            squares[aboveIndex].style.backgroundColor = "transparent";
                            break;
                        }
                    }
                    
                    if (!squares[index].dataset.color) {
                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                        squares[index].dataset.color = randomColor;
                        squares[index].style.backgroundColor = randomColor;
                    }
                }
            }
        }

        setTimeout(() => {
            isDropping = false;
            
            if (hasAnyMatches()) {
                processMatches();
            } else {
                ensureAtLeastOneMatch();
            }
        }, 200);
    }

    function ensureAtLeastOneMatch() {
        if (hasAnyMatches()) return;
        
        for (let i = 0; i < squares.length; i++) {
            if (i % width < width - 1) {
                swapSquares(squares[i], squares[i + 1]);
                if (hasAnyMatches()) {
                    swapSquares(squares[i], squares[i + 1]);
                    return;
                } else {
                    swapSquares(squares[i], squares[i + 1]);
                }
            }
            
            if (i < width * (width - 1)) {
                swapSquares(squares[i], squares[i + width]);
                if (hasAnyMatches()) {
                    swapSquares(squares[i], squares[i + width]);
                    return;
                } else {
                    swapSquares(squares[i], squares[i + width]);
                }
            }
        }
        
        for (let attempts = 0; attempts < 10; attempts++) {
            const randomIndex = Math.floor(Math.random() * squares.length);
            const level = levels[currentLevel];
            const colors = level.lines.map(l => l.color);
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            squares[randomIndex].dataset.color = newColor;
            squares[randomIndex].style.backgroundColor = newColor;
            
            if (hasAnyMatches()) {
                return;
            }
        }
    }

    // ==================== СЛУШАТЕЛИ СОБЫТИЙ ====================
    
    levelSelect.addEventListener("change", (e) => {
        currentLevel = e.target.value;
        updateLineSelect();
        renderStationsList();
        renderLinesStatus();
        createBoard();
    });

    lineSelect.addEventListener("change", (e) => {
        currentLineId = e.target.value;
        renderStationsList();
    });

    restartBtn.addEventListener("click", () => {
        initProgress();
        renderStationsList();
        renderLinesStatus();
        createBoard();
        totalScore = 0;
        totalScoreElement.textContent = "0";
    });

    // ==================== ЗАПУСК ====================
    initProgress();
    updateLineSelect();
    renderStationsList();
    renderLinesStatus();
    createBoard();
});