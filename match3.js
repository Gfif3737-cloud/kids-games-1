document.addEventListener("DOMContentLoaded", () => {
    const width = 5;
    const board = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart");
    const scoreElement = document.getElementById("score");
    const lineSelect = document.getElementById("line-select");
    const stationsListDiv = document.getElementById("stations-list");

    // 5 ЦВЕТОВ ЛИНИЙ МЕТРО (точно как в реальности)
    const lineColors = {
        sokolnicheskaya: "#e74c3c",   // 🔴 красная
        zamoskvoretskaya: "#2ecc71",  // 🟢 зелёная
        arbatsko_pokrovskaya: "#3498db", // 🔵 синяя
        filyovskaya: "#5dade2",        // 💙 голубая
        koltsevaya: "#8B4513"          // 🟤 коричневая (Кольцевая)
    };

    // Соответствие цветов и ключей линий
    const colorToLine = {
        "#e74c3c": "sokolnicheskaya",
        "#2ecc71": "zamoskvoretskaya",
        "#3498db": "arbatsko_pokrovskaya",
        "#5dade2": "filyovskaya",
        "#8B4513": "koltsevaya"
    };

    // Названия линий для отображения
    const lineDisplayNames = {
        sokolnicheskaya: "Сокольническая (красная)",
        zamoskvoretskaya: "Замоскворецкая (зелёная)",
        arbatsko_pokrovskaya: "Арбатско-Покровская (синяя)",
        filyovskaya: "Филёвская (голубая)",
        koltsevaya: "Кольцевая (коричневая)"
    };

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

    // Отметить станцию по цвету (какой цвет совпал — той линии и добавляем)
    function markStationByColor(color) {
        const line = colorToLine[color];
        if (!line || !metroStations[line]) return;

        // Находим ещё не собранные станции этой линии
        const availableStations = metroStations[line].filter(
            station => !collectedStations[line]?.[station]
        );

        if (availableStations.length > 0) {
            const randomStation = availableStations[Math.floor(Math.random() * availableStations.length)];
            collectedStations[line][randomStation] = true;
            
            // Если сейчас выбрана эта линия — обновляем отображение
            if (line === currentLine) {
                renderStationsList(currentLine);
            }

            // Проверяем, не собрана ли полностью эта линия
            if (isLineComplete(line)) {
                setTimeout(() => {
                    alert(`🎉 ЛИНИЯ СОБРАНА! Ты полностью собрал линию ${lineDisplayNames[line]}!`);
                }, 300);
            }
        }
    }

    // Создание игрового поля (только 5 цветов линий)
    function createBoard() {
        board.innerHTML = "";
        squares = [];
        score = 0;
        scoreElement.textContent = "0";

        // Создаём поле, гарантируя наличие возможных ходов
        do {
            for (let i = 0; i < width * width; i++) {
                if (squares[i]) {
                    // Если клетка уже существует, обновляем её цвет
                    const randomColor = Object.values(lineColors)[Math.floor(Math.random() * 5)];
                    squares[i].dataset.color = randomColor;
                    squares[i].style.backgroundColor = randomColor;
                } else {
                    // Создаём новую клетку
                    const square = document.createElement("div");
                    square.classList.add("cell");

                    const randomColor = Object.values(lineColors)[Math.floor(Math.random() * 5)];
                    square.dataset.color = randomColor;
                    square.style.backgroundColor = randomColor;

                    square.setAttribute("data-id", i);
                    board.appendChild(square);
                    squares.push(square);

                    square.addEventListener("click", () => selectSquare(square));
                }
            }
        } while (!hasAnyMatches()); // Перемешиваем, пока не появится хотя бы одно совпадение
    }

    // Проверка, есть ли хоть одно совпадение на поле
    function hasAnyMatches() {
        // Горизонтальные
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const color = squares[i].dataset.color;
                if (color && squares[i + 1].dataset.color === color && squares[i + 2].dataset.color === color) {
                    return true;
                }
            }
        }
        // Вертикальные
        for (let i = 0; i < width * (width - 2); i++) {
            const color = squares[i].dataset.color;
            if (color && squares[i + width].dataset.color === color && squares[i + width * 2].dataset.color === color) {
                return true;
            }
        }
        return false;
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
        const color1 = square1.dataset.color;
        const color2 = square2.dataset.color;

        square1.dataset.color = color2;
        square2.dataset.color = color1;
        square1.style.backgroundColor = color2;
        square2.style.backgroundColor = color1;
    }

    function checkMatches(silent = false) {
        let matched = false;

        // Горизонтальные совпадения
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const color = squares[i].dataset.color;
                if (
                    color &&
                    squares[i + 1].dataset.color === color &&
                    squares[i + 2].dataset.color === color
                ) {
                    // Отмечаем станцию по цвету
                    if (!silent) {
                        markStationByColor(color);
                        score += 10;
                    }

                    // Удаляем тройку
                    squares[i].dataset.color = "";
                    squares[i + 1].dataset.color = "";
                    squares[i + 2].dataset.color = "";
                    squares[i].style.backgroundColor = "transparent";
                    squares[i + 1].style.backgroundColor = "transparent";
                    squares[i + 2].style.backgroundColor = "transparent";
                    
                    matched = true;
                }
            }
        }

        // Вертикальные совпадения
        for (let i = 0; i < width * (width - 2); i++) {
            const color = squares[i].dataset.color;
            if (
                color &&
                squares[i + width].dataset.color === color &&
                squares[i + width * 2].dataset.color === color
            ) {
                if (!silent) {
                    markStationByColor(color);
                    score += 10;
                }

                squares[i].dataset.color = "";
                squares[i + width].dataset.color = "";
                squares[i + width * 2].dataset.color = "";
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
                        const randomColor = Object.values(lineColors)[Math.floor(Math.random() * 5)];
                        squares[index].dataset.color = randomColor;
                        squares[index].style.backgroundColor = randomColor;
                    }
                }
            }
        }

        setTimeout(() => {
            if (!checkMatches()) {
                // Если нет совпадений после падения — принудительно создаём новые
                forceMatches();
            }
        }, 200);
    }

    // Функция, гарантирующая наличие ходов
    function forceMatches() {
        // Пробуем найти пару, которую можно поменять для создания тройки
        for (let i = 0; i < squares.length; i++) {
            if (i % width < width - 1) {
                if (wouldCreateMatch(i, i + 1)) {
                    swapSquares(squares[i], squares[i + 1]);
                    checkMatches();
                    return;
                }
            }
            if (i < width * (width - 1)) {
                if (wouldCreateMatch(i, i + width)) {
                    swapSquares(squares[i], squares[i + width]);
                    checkMatches();
                    return;
                }
            }
        }
        
        // Если ничего не нашли — просто перемешиваем поле
        shuffleBoard();
    }

    // Проверка, создаст ли обмен совпадение
    function wouldCreateMatch(index1, index2) {
        const color1 = squares[index1].dataset.color;
        const color2 = squares[index2].dataset.color;
        
        // Временно меняем
        squares[index1].dataset.color = color2;
        squares[index2].dataset.color = color1;
        
        let wouldMatch = false;
        
        // Проверяем горизонтальные вокруг index1
        const row = Math.floor(index1 / width);
        const col = index1 % width;
        
        if (col <= width - 3) {
            if (squares[index1].dataset.color === squares[index1 + 1].dataset.color &&
                squares[index1].dataset.color === squares[index1 + 2].dataset.color) {
                wouldMatch = true;
            }
        }
        if (col >= 2) {
            if (squares[index1].dataset.color === squares[index1 - 1].dataset.color &&
                squares[index1].dataset.color === squares[index1 - 2].dataset.color) {
                wouldMatch = true;
            }
        }
        
        // Возвращаем обратно
        squares[index1].dataset.color = color1;
        squares[index2].dataset.color = color2;
        
        return wouldMatch;
    }

    // Полное перемешивание поля
    function shuffleBoard() {
        for (let i = 0; i < squares.length; i++) {
            const randomColor = Object.values(lineColors)[Math.floor(Math.random() * 5)];
            squares[i].dataset.color = randomColor;
            squares[i].style.backgroundColor = randomColor;
        }
        
        // Проверяем, появились ли совпадения
        setTimeout(() => {
            if (!checkMatches()) {
                // Если всё ещё нет — рекурсивно перемешиваем ещё раз
                shuffleBoard();
            }
        }, 50);
    }

    // Смена линии в выпадающем списке
    lineSelect.addEventListener("change", (e) => {
        currentLine = e.target.value;
        renderStationsList(currentLine);
        
        if (isLineComplete(currentLine)) {
            alert(`🎉 Линия ${lineDisplayNames[currentLine]} уже полностью собрана! Можешь выбрать другую.`);
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