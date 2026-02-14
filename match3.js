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
        level1: {
            name: "Классическое метро",
            lines: [
                { id: "sokolnicheskaya", name: "Сокольническая", color: "#e74c3c", stations: [
                    "Бульвар Рокоссовского", "Черкизовская", "Преображенская площадь", "Сокольники", "Красносельская",
                    "Комсомольская", "Красные Ворота", "Чистые пруды", "Лубянка", "Охотный Ряд",
                    "Библиотека им. Ленина", "Кропоткинская", "Парк культуры", "Фрунзенская", "Спортивная",
                    "Воробьёвы горы", "Университет", "Проспект Вернадского", "Юго-Западная", "Тропарёво",
                    "Румянцево", "Саларьево", "Филатов Луг", "Прокшино", "Ольховая", "Коммунарка"
                ]},
                { id: "zamoskvoretskaya", name: "Замоскворецкая", color: "#2ecc71", stations: [
                    "Ховрино", "Беломорская", "Речной вокзал", "Водный стадион", "Войковская",
                    "Сокол", "Аэропорт", "Динамо", "Белорусская", "Маяковская",
                    "Тверская", "Театральная", "Новокузнецкая", "Павелецкая", "Автозаводская",
                    "Технопарк", "Коломенская", "Каширская", "Кантемировская", "Царицыно",
                    "Орехово", "Домодедовская", "Красногвардейская", "Алма-Атинская"
                ]},
                { id: "arbatsko_pokrovskaya", name: "Арбатско-Покровская", color: "#00008B", stations: [
                    "Щёлковская", "Первомайская", "Измайловская", "Партизанская", "Семёновская",
                    "Электрозаводская", "Бауманская", "Курская", "Площадь Революции", "Арбатская",
                    "Смоленская", "Киевская", "Парк Победы", "Славянский бульвар", "Кунцевская",
                    "Молодёжная", "Крылатское", "Строгино", "Мякинино", "Волоколамская",
                    "Митино", "Пятницкое шоссе"
                ]},
                { id: "filyovskaya", name: "Филёвская", color: "#87CEEB", stations: [
                    "Александровский сад", "Арбатская", "Смоленская", "Киевская", "Студенческая",
                    "Кутузовская", "Фили", "Багратионовская", "Филевский парк", "Пионерская",
                    "Кунцевская", "Выставочная", "Международная"
                ]},
                { id: "koltsevaya", name: "Кольцевая", color: "#8B4513", stations: [
                    "Киевская", "Краснопресненская", "Белорусская", "Новослободская", "Проспект Мира",
                    "Комсомольская", "Курская", "Таганская", "Павелецкая", "Добрынинская",
                    "Октябрьская", "Парк культуры"
                ]}
            ]
        },
        level2: {
            name: "Радиальные линии",
            lines: [
                { id: "kaluzhsko_rizhskaya", name: "Калужско-Рижская", color: "#f39c12", stations: [
                    "Медведково", "Бабушкинская", "Свиблово", "Ботанический сад", "ВДНХ",
                    "Алексеевская", "Рижская", "Проспект Мира", "Сухаревская", "Тургеневская",
                    "Китай-город", "Третьяковская", "Октябрьская", "Шаболовская", "Ленинский проспект",
                    "Академическая", "Профсоюзная", "Новые Черёмушки", "Калужская", "Беляево",
                    "Коньково", "Тёплый Стан", "Ясенево", "Новоясеневская"
                ]},
                { id: "tagansko_krasnopresnenskaya", name: "Таганско-Краснопресненская", color: "#9b59b6", stations: [
                    "Планерная", "Сходненская", "Тушинская", "Спартак", "Щукинская",
                    "Октябрьское поле", "Полежаевская", "Беговая", "Улица 1905 года", "Баррикадная",
                    "Пушкинская", "Кузнецкий мост", "Китай-город", "Таганская", "Пролетарская",
                    "Волгоградский проспект", "Текстильщики", "Кузьминки", "Рязанский проспект", "Выхино",
                    "Лермонтовский проспект", "Жулебино", "Котельники"
                ]},
                { id: "kalinskaya", name: "Калининская", color: "#f1c40f", stations: [
                    "Новогиреево", "Перово", "Шоссе Энтузиастов", "Авиамоторная", "Площадь Ильича",
                    "Марксистская", "Третьяковская"
                ]},
                { id: "solntsevskaya", name: "Солнцевская", color: "#ffaa00", stations: [
                    "Деловой центр", "Парк Победы", "Минская", "Ломоносовский проспект", "Раменки",
                    "Мичуринский проспект", "Озёрная", "Говорово", "Солнцево", "Боровское шоссе",
                    "Новопеределкино", "Рассказовка", "Пыхтино", "Аэропорт Внуково"
                ]},
                { id: "serpukhovsko_timiryazevskaya", name: "Серпуховско-Тимирязевская", color: "#95a5a6", stations: [
                    "Алтуфьево", "Бибирево", "Отрадное", "Владыкино", "Петровско-Разумовская",
                    "Тимирязевская", "Дмитровская", "Савёловская", "Менделеевская", "Цветной бульвар",
                    "Чеховская", "Боровицкая", "Полянка", "Серпуховская", "Тульская",
                    "Нагатинская", "Нагорная", "Нахимовский проспект", "Севастопольская", "Чертановская",
                    "Южная", "Пражская", "Улица Академика Янгеля", "Аннино", "Бульвар Дмитрия Донского"
                ]}
            ]
        },
        level3: {
            name: "МЦД",
            lines: [
                { id: "mcd1", name: "МЦД-1 (Одинцово–Лобня)", color: "#e67e22", stations: [
                    "Одинцово", "Баковка", "Сколково", "Немчиновка", "Сетунь",
                    "Рабочий Посёлок", "Кунцевская", "Фили", "Тестовская", "Беговая",
                    "Белорусская", "Савёловская", "Тимирязевская", "Окружная", "Дегунино",
                    "Бескудниково", "Лианозово", "Марк", "Новодачная", "Долгопрудная",
                    "Водники", "Хлебниково", "Шереметьевская", "Лобня"
                ]},
                { id: "mcd2", name: "МЦД-2 (Нахабино–Подольск)", color: "#27ae60", stations: [
                    "Нахабино", "Аникеевка", "Опалиха", "Красногорская", "Павшино",
                    "Пенягино", "Волоколамская", "Трикотажная", "Тушинская", "Щукинская",
                    "Стрешнево", "Красный Балтиец", "Гражданская", "Дмитровская", "Марьина Роща",
                    "Рижская", "Каланчёвская", "Курская", "Москва-Товарная", "Калитники",
                    "Текстильщики", "Люблино", "Перерва", "Курьяново", "Москворечье",
                    "Царицыно", "Покровское", "Красный Строитель", "Битца", "Бутово",
                    "Щербинка", "Остафьево", "Силикатная", "Подольск"
                ]},
                { id: "mcd3", name: "МЦД-3 (Крюково–Раменское)", color: "#3498db", stations: [
                    "Крюково", "Малино", "Фирсановка", "Сходня", "Подрезково",
                    "Новоподрезково", "Молжаниново", "Химки", "Левобережная", "Ховрино",
                    "Грачёвская", "Моссельмаш", "Лихоборы", "Петровско-Разумовская", "Останкино",
                    "Рижская", "Митьково", "Электрозаводская", "Сортировочная", "Авиамоторная",
                    "Андроновка", "Перово", "Плющево", "Вешняки", "Выхино",
                    "Косино", "Ухтомская", "Люберцы", "Панки", "Томилино",
                    "Красково", "Малаховка", "Удельная", "Быково", "Ильинская",
                    "Отдых", "Кратово", "Есенинская", "Фабричная", "Раменское"
                ]},
                { id: "mcd4", name: "МЦД-4 (Апрелевка–Железнодорожная)", color: "#8e44ad", stations: [
                    "Апрелевка", "Реутово", "Победа", "Крёкшино", "Санино",
                    "Кокошкино", "Толстопальцево", "Лесной Городок", "Внуково", "Мичуринец",
                    "Переделкино", "Мещерская", "Солнечная", "Новопеределкино", "Очаково",
                    "Аминьевская", "Матвеевская", "Минская", "Поклонная", "Кутузовская",
                    "Москва-Сити", "Ермакова Роща", "Марьина Роща", "Савёловская", "Станколит",
                    "Нижегородская", "Новохохловская", "Калитники", "Текстильщики", "Перово",
                    "Чухлинка", "Кусково", "Новогиреево", "Реутово", "Никольское",
                    "Салтыковская", "Кучино", "Железнодорожная"
                ]},
                { id: "mcd5", name: "МЦД-5 (Пушкино–Домодедово)", color: "#e67e22", stations: [
                    "Пушкино", "Мамонтовская", "Клязьма", "Тарасовская", "Челюскинская",
                    "Строитель", "Мытищи", "Тайнинская", "Лосиноостровская", "Северянин",
                    "Ярославская", "Москва-3", "Каланчёвская", "Площадь трёх вокзалов", "Курская",
                    "Серп и Молот", "Нижегородская", "Котляково", "Красный Строитель", "Битца",
                    "Бутово", "Щербинка", "Силикатная", "Домодедово"
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
    
    // Обновить выпадающий список линий при смене уровня
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

    // Отрисовка списка станций текущей линии
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

    // Отрисовка статуса всех линий уровня
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

        // Обновить прогресс уровня
        const completedLines = level.lines.filter(line => {
            const stations = line.stations;
            const collected = collectedStations[currentLevel][line.id];
            return stations.filter(s => collected[s]).length === stations.length;
        }).length;
        
        levelProgressElement.textContent = `${completedLines}/${level.lines.length} линий`;
    }

    // Отметить станцию по цвету
    function markStationByColor(color) {
        const level = levels[currentLevel];
        
        // Ищем линию по цвету
        const line = level.lines.find(l => l.color === color);
        if (!line) return;

        const availableStations = line.stations.filter(
            station => !collectedStations[currentLevel]?.[line.id]?.[station]
        );

        if (availableStations.length > 0) {
            const randomStation = availableStations[Math.floor(Math.random() * availableStations.length)];
            collectedStations[currentLevel][line.id][randomStation] = true;
            
            // Если это текущая линия — обновляем список станций
            if (line.id === currentLineId) {
                renderStationsList();
            }
            
            // Обновляем статус линий
            renderLinesStatus();

            // Проверяем, не собрана ли полностью текущая линия
            const isLineComplete = line.stations.every(
                s => collectedStations[currentLevel][line.id][s]
            );
            
            if (isLineComplete) {
                setTimeout(() => {
                    alert(`🎉 ЛИНИЯ СОБРАНА! Ты полностью собрал линию ${line.name}!`);
                }, 300);
            }

            // Проверяем, не пройден ли уровень
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
    
    // Проверка наличия троек на поле
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

    // Исправление тройки (меняем одну клетку)
    function fixTriple(i1, i2, i3) {
        const level = levels[currentLevel];
        const colors = level.lines.map(l => l.color);
        const otherColors = colors.filter(c => c !== squares[i1].dataset.color);
        const newColor = otherColors[Math.floor(Math.random() * otherColors.length)];
        squares[i1].dataset.color = newColor;
        squares[i1].style.backgroundColor = newColor;
    }

    // Полностью очищает поле от троек
    function removeAllMatches() {
        let fixed = false;
        do {
            fixed = false;
            
            // Горизонтальные тройки
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
            
            // Вертикальные тройки
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

    // Создание поля БЕЗ троек
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

        // Заполняем случайными цветами текущего уровня
        for (let i = 0; i < squares.length; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            squares[i].dataset.color = randomColor;
            squares[i].style.backgroundColor = randomColor;
        }
        
        // Убираем все тройки
        removeAllMatches();
    }

    function selectSquare(square) {
        if (!firstSelected) {
            firstSelected = square;
            square.style.border = "3px solid white";
            square.style.boxShadow = "0 0 20px rgba(255,255,255,0.9)";
            return;
        }

        const index1 = parseInt(firstSelected.dataset.id);
        const index2 = parseInt(square.dataset.id);

        // Проверка на соседство (только горизонтально или вертикально)
        const isAdjacent = (
            (index1 === index2 - 1 && index1 % width !== width - 1) || // справа
            (index1 === index2 + 1 && index2 % width !== width - 1) || // слева
            (index1 === index2 - width) || // снизу
            (index1 === index2 + width)    // сверху
        );

        if (isAdjacent) {
            // Пробуем обменять
            swapSquares(firstSelected, square);

            // Проверяем, появилась ли тройка
            if (hasAnyMatches()) {
                // Если да — начисляем очки и станцию
                const matchColor = findAnyMatchColor();
                if (matchColor) {
                    markStationByColor(matchColor);
                    lineScore += 10;
                    totalScore += 10;
                    lineScoreElement.textContent = lineScore;
                    totalScoreElement.textContent = totalScore;
                }
                
                // Удаляем тройки и запускаем падение
                removeMatchesAndDrop();
            } else {
                // Если тройки нет — меняем обратно
                swapSquares(firstSelected, square);
            }
        }

        // Снимаем выделение
        firstSelected.style.border = "none";
        firstSelected.style.boxShadow = "none";
        firstSelected = null;
    }

    function findAnyMatchColor() {
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const color = squares[i].dataset.color;
                if (color && squares[i + 1].dataset.color === color && squares[i + 2].dataset.color === color) {
                    return color;
                }
            }
        }
        for (let i = 0; i < width * (width - 2); i++) {
            const color = squares[i].dataset.color;
            if (color && squares[i + width].dataset.color === color && squares[i + width * 2].dataset.color === color) {
                return color;
            }
        }
        return null;
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

        // Удаляем горизонтальные тройки
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

        // Удаляем вертикальные тройки
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
            setTimeout(dropSquares, 200);
        }
    }

    function dropSquares() {
        const level = levels[currentLevel];
        const colors = level.lines.map(l => l.color);

        // Опускаем фишки
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

        // После падения УБИРАЕМ все новые тройки
        setTimeout(() => {
            removeAllMatches();
        }, 200);
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