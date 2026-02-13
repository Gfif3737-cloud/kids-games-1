document.addEventListener("DOMContentLoaded", () => {
    const width = 5;
    const board = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart");
    const scoreElement = document.getElementById("score");
    const lineSelect = document.getElementById("line-select");
    const stationsListDiv = document.getElementById("stations-list");

    // Цвета ВСЕХ линий (пять цветов для поля)
    const allColors = [
        "#e74c3c", // красная (Сокольническая)
        "#2ecc71", // зелёная (Замоскворецкая)
        "#3498db", // синяя (Арбатско-Покровская)
        "#5dade2", // голубая (Филёвская)
        "#8e44ad"  // фиолетовая (Кольцевая)
    ];

    // Названия линий (для соответствия станциям)
    const lineNames = [
        "Сокольническая",
        "Замоскворецкая",
        "Арбатско-Покровская",
        "Филёвская",
        "Кольцевая"
    ];

    // Станции пяти линий московского метро
    const metroStations = {
        sokolnicheskaya: [
            "Бульвар Рокоссовского", "Черкизовская", "Преображенская площадь", "Сокольники", "Красносельская",
            "Комсомольская", "Красные Ворота", "Чистые пруды", "Лубянка", "Охотный Ряд",
            "Библиотека им. Ленина", "Кропоткинская", "Парк культуры", "Фрунзенская", "Спортивная",
            "Воробьёвы горы", "Университет", "Проспект Вернадского", "Юго-Западная", "Тропарёво",
            "Румянцево", "Саларьево", "Филатов Луг", "Прокшино", "Ольховая", "Коммунарка"
        ],
        zamoskvoretskaya: [
            "Ховрино", "Беломорская", "Речной вокзал", "Водный стадион", "Войковская",
            "Сокол", "Аэропорт", "Динамо", "Белорусская", "Маяковская",
            "Тверская", "Театральная", "Новокузнецкая", "Павелецкая", "Автозаводская",
            "Технопарк", "Коломенская", "Каширская", "Кантемировская", "Царицыно",
            "Орехово", "Домодедовская", "Красногвардейская", "Алма-Атинская"
        ],
        arbatsko_pokrovskaya: [
            "Щёлковская", "Первомайская", "Измайловская", "Партизанская", "Семёновская",
            "Электрозаводская", "Бауманская", "Курская", "Площадь Революции", "Арбатская",
            "Смоленская", "Киевская", "Парк Победы", "Славянский бульвар", "Кунцевская",
            "Молодёжная", "Крылатское", "Строгино", "Мякинино", "Волоколамская",
            "Митино", "Пятницкое шоссе"
        ],
        filyovskaya: [
            "Александровский сад", "Арбатская", "Смоленская", "Киевская", "Студенческая",
            "Кутузовская", "Фили", "Багратионовская", "Филевский парк", "Пионерская",
            "Кунцевская", "Выставочная", "Международная"
        ],
        koltsevaya: [
            "Киевская", "Краснопресненская", "Белорусская", "Новослободская", "Проспект Мира",
            "Комсомольская", "Курская", "Таганская", "Павелецкая", "Добрынинская",
            "Октябрьская", "Парк культуры"
        ]
    };

    let squares = [];
    let firstSelected = null;
    let score = 0;
    let currentLine = "sokolnicheskaya";
    
    // Хранилище собранных станций для каждой линии
    let collectedStations = {};

    // Инициализация собранных станций для всех линий
    function initAllCollectedStations() {
        for (let line in metroStations) {
            collectedStations[line] = {};
            metroStations[line].forEach(station => {
                collectedStations[line][station] = false;
            });
        }
    }

    // Проверка, все ли станции текущей линии собраны
    function isLineComplete(line) {
        const stations = metroStations[line];
        for (let station of stations) {
            if (!collectedStations[line]?.[station]) {
                return false;
            }
        }
        return true;
    }

    // Отрисовка списка станций для выбранной линии
    function renderStationsList(line) {
        stationsListDiv.innerHTML = "";
        const stations = metroStations[line];

        stations.forEach(station => {
            const isChecked = collectedStations[line]?.[station] || false;
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

    // Отметить станцию как собранную (только для текущей линии)
    function markRandomStationCollected() {
        if (!metroStations[currentLine]) return;

        // Находим ещё не собранные станции текущей линии
        const availableStations = metroStations[currentLine].filter(
            station => !collectedStations[currentLine]?.[station]
        );

        // Если есть что собирать — выбираем случайную
        if (availableStations.length > 0) {
            const randomStation = availableStations[Math.floor(Math.random() * availableStations.length)];
            collectedStations[currentLine][randomStation] = true;
            renderStationsList(currentLine);

            // Если после этого все станции собраны — показываем победу
            if (isLineComplete(currentLine)) {
                setTimeout(() => {
                    alert(`🎉 ПОБЕДА! Ты собрал все станции линии ${lineSelect.selectedOptions[0].textContent}! Счёт: ${score}`);
                }, 300);
            }
        }
    }

    // Создание игрового поля (все 5 цветов)
    function createBoard() {
        board.innerHTML = "";
        squares = [];
        score = 0;
        scoreElement.textContent = "0";

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.classList.add("cell");

            // Случайный цвет из пяти
            const randomColorIndex = Math.floor(Math.random() * allColors.length);
            const color = allColors[randomColorIndex];
            
            square.dataset.type = randomColorIndex;
            square.style.backgroundColor = color;

            square.setAttribute("data-id", i);
            board.appendChild(square);
            squares.push(square);

            square.addEventListener("click", () => selectSquare(square));
        }

        // Убираем начальные совпадения
        setTimeout(() => {
            while (checkMatches(true)) {}
        }, 10);
    }

    function selectSquare(square) {
        if (!firstSelected) {
            firstSelected = square;
            square.style.border = "3px solid white";
            square.style.boxShadow = "0 0 20px rgba(255,255,255,0.9)";
        } else {
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

                setTimeout(() => {
                    if (!checkMatches()) {
                        swapSquares(firstSelected, square);
                    }
                }, 10);
            }

            firstSelected.style.border = "none";
            firstSelected.style.boxShadow = "none";
            firstSelected = null;
        }
    }

    function swapSquares(square1, square2) {
        const type1 = square1.dataset.type;
        const type2 = square2.dataset.type;
        const color1 = square1.style.backgroundColor;
        const color2 = square2.style.backgroundColor;

        square1.dataset.type = type2;
        square2.dataset.type = type1;
        square1.style.backgroundColor = color2;
        square2.style.backgroundColor = color1;
    }

    function checkMatches(silent = false) {
        let matched = false;

        // Горизонтальные совпадения
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const type = squares[i].dataset.type;
                if (
                    type !== undefined &&
                    squares[i + 1].dataset.type === type &&
                    squares[i + 2].dataset.type === type
                ) {
                    // Если не в режиме silent — отмечаем станцию
                    if (!silent) {
                        markRandomStationCollected();
                        score += 10;
                    }

                    squares[i].dataset.type = "";
                    squares[i + 1].dataset.type = "";
                    squares[i + 2].dataset.type = "";
                    squares[i].style.backgroundColor = "transparent";
                    squares[i + 1].style.backgroundColor = "transparent";
                    squares[i + 2].style.backgroundColor = "transparent";
                    
                    matched = true;
                }
            }
        }

        // Вертикальные совпадения
        for (let i = 0; i < width * (width - 2); i++) {
            const type = squares[i].dataset.type;
            if (
                type !== undefined &&
                squares[i + width].dataset.type === type &&
                squares[i + width * 2].dataset.type === type
            ) {
                if (!silent) {
                    markRandomStationCollected();
                    score += 10;
                }

                squares[i].dataset.type = "";
                squares[i + width].dataset.type = "";
                squares[i + width * 2].dataset.type = "";
                squares[i].style.backgroundColor = "transparent";
                squares[i + width].style.backgroundColor = "transparent";
                squares[i + width * 2].style.backgroundColor = "transparent";
                
                matched = true;
            }
        }

        if (matched && !silent) {
            scoreElement.textContent = score;
            setTimeout(dropSquares, 200);
        }

        return matched;
    }

    function dropSquares() {
        for (let col = 0; col < width; col++) {
            for (let row = width - 1; row >= 0; row--) {
                const index = row * width + col;
                
                if (!squares[index].dataset.type && squares[index].dataset.type !== 0) {
                    for (let above = row - 1; above >= 0; above--) {
                        const aboveIndex = above * width + col;
                        if (squares[aboveIndex].dataset.type !== undefined && squares[aboveIndex].dataset.type !== "") {
                            squares[index].dataset.type = squares[aboveIndex].dataset.type;
                            squares[index].style.backgroundColor = squares[aboveIndex].style.backgroundColor;

                            squares[aboveIndex].dataset.type = "";
                            squares[aboveIndex].style.backgroundColor = "transparent";
                            break;
                        }
                    }
                    
                    if (!squares[index].dataset.type && squares[index].dataset.type !== 0) {
                        const randomType = Math.floor(Math.random() * allColors.length);
                        squares[index].dataset.type = randomType;
                        squares[index].style.backgroundColor = allColors[randomType];
                    }
                }
            }
        }

        setTimeout(() => {
            if (!checkMatches()) {
                if (!hasValidMoves()) {
                    // Если нет ходов, но линия ещё не собрана — не конец игры
                    // Просто перемешиваем поле
                    setTimeout(() => {
                        for (let i = 0; i < squares.length; i++) {
                            const randomType = Math.floor(Math.random() * allColors.length);
                            squares[i].dataset.type = randomType;
                            squares[i].style.backgroundColor = allColors[randomType];
                        }
                        checkMatches();
                    }, 300);
                }
            }
        }, 200);
    }

    function hasValidMoves() {
        for (let i = 0; i < squares.length; i++) {
            if (i % width < width - 1 && testSwap(i, i + 1)) return true;
            if (i < width * (width - 1) && testSwap(i, i + width)) return true;
        }
        return false;
    }

    function testSwap(index1, index2) {
        const type1 = squares[index1].dataset.type;
        const type2 = squares[index2].dataset.type;
        
        squares[index1].dataset.type = type2;
        squares[index2].dataset.type = type1;
        
        let matchFound = false;
        
        const row1 = Math.floor(index1 / width);
        const col1 = index1 % width;
        if (col1 <= width - 3) {
            if (squares[index1].dataset.type !== undefined &&
                squares[index1].dataset.type === squares[index1 + 1].dataset.type &&
                squares[index1].dataset.type === squares[index1 + 2].dataset.type) {
                matchFound = true;
            }
        }
        if (col1 >= 2) {
            if (squares[index1].dataset.type !== undefined &&
                squares[index1].dataset.type === squares[index1 - 1].dataset.type &&
                squares[index1].dataset.type === squares[index1 - 2].dataset.type) {
                matchFound = true;
            }
        }
        
        squares[index1].dataset.type = type1;
        squares[index2].dataset.type = type2;
        
        return matchFound;
    }

    // Смена линии в выпадающем списке
    lineSelect.addEventListener("change", (e) => {
        currentLine = e.target.value;
        renderStationsList(currentLine);
        
        // Проверяем, может эта линия уже собрана?
        if (isLineComplete(currentLine)) {
            alert(`🎉 Линия ${lineSelect.selectedOptions[0].textContent} уже полностью собрана! Можешь выбрать другую.`);
        }
    });

    restartBtn.addEventListener("click", () => {
        initAllCollectedStations();
        renderStationsList(currentLine);
        createBoard();
    });

    // Инициализация
    initAllCollectedStations();
    renderStationsList(currentLine);
    createBoard();
});