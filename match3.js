document.addEventListener("DOMContentLoaded", () => {
    const width = 5;
    const board = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart");
    const scoreElement = document.getElementById("score");
    const lineSelect = document.getElementById("line-select");
    const stationsListDiv = document.getElementById("stations-list");

    // Цвета линий метро
    const lineColors = {
        sokolnicheskaya: "#e74c3c",   // красная
        zamoskvoretskaya: "#2ecc71",  // зелёная
        arbatsko_pokrovskaya: "#3498db", // синяя
        filyovskaya: "#5dade2",        // голубая
        koltsevaya: "#8e44ad"         // коричневая/фиолетовая
    };

    // Станции пяти линий московского метро
    const metroStations = {
        sokolnicheskaya: [
            "Бульвар Рокоссовского", "Черкизовская", "Преображенская площадь", "Сокольники", "Красносельская",
            "Комсомольская", "Красные Ворота", "Чистые пруды", "Лубянка", "Охотный Ряд",
            "Библиотека им. Ленина", "Кропоткинская", "Парк культуры", "Фрунзенская", "Спортивная",
            "Воробьёвы горы", "Университет", "Проспект Вернадского", "Юго-Западная", "Тропарёво",
            "Румянцево", "Саларьево", "Филатов Луг", "Прокшино", "Ольховая",
            "Коммунарка"
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
    let collectedStations = {};

    // Инициализация собранных станций
    function initCollectedStations(line) {
        collectedStations[line] = {};
        metroStations[line].forEach(station => {
            collectedStations[line][station] = false;
        });
    }

    // Отрисовка списка станций с галочками
    function renderStationsList(line) {
        if (!collectedStations[line]) {
            initCollectedStations(line);
        }

        stationsListDiv.innerHTML = "";
        const stations = metroStations[line];

        stations.forEach(station => {
            const isChecked = collectedStations[line][station] || false;
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

    // Отметить станцию как собранную
    function markStationCollected(line, stationName) {
        if (collectedStations[line] && collectedStations[line][stationName] === false) {
            collectedStations[line][stationName] = true;
            renderStationsList(line);
        }
    }

    // Получить случайную станцию текущей линии
    function getRandomStation(line) {
        const stations = metroStations[line];
        return stations[Math.floor(Math.random() * stations.length)];
    }

    function createBoard() {
        board.innerHTML = "";
        squares = [];
        score = 0;
        scoreElement.textContent = "0";

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.classList.add("cell");

            // Случайная станция текущей линии
            const stationName = getRandomStation(currentLine);
            square.dataset.station = stationName;
            square.style.backgroundColor = lineColors[currentLine];
            square.style.opacity = "0.8";

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
        const station1 = square1.dataset.station;
        const station2 = square2.dataset.station;
        const color1 = square1.style.backgroundColor;
        const color2 = square2.style.backgroundColor;

        square1.dataset.station = station2;
        square2.dataset.station = station1;
        square1.style.backgroundColor = color2;
        square2.style.backgroundColor = color1;
    }

    function checkMatches(silent = false) {
        let matched = false;

        // Горизонтальные совпадения
        for (let i = 0; i < width * width; i++) {
            if (i % width <= width - 3) {
                const station = squares[i].dataset.station;
                if (
                    station &&
                    squares[i + 1].dataset.station === station &&
                    squares[i + 2].dataset.station === station
                ) {
                    markStationCollected(currentLine, station);
                    
                    squares[i].dataset.station = "";
                    squares[i + 1].dataset.station = "";
                    squares[i + 2].dataset.station = "";
                    squares[i].style.backgroundColor = "transparent";
                    squares[i + 1].style.backgroundColor = "transparent";
                    squares[i + 2].style.backgroundColor = "transparent";
                    
                    matched = true;
                    if (!silent) score += 10;
                }
            }
        }

        // Вертикальные совпадения
        for (let i = 0; i < width * (width - 2); i++) {
            const station = squares[i].dataset.station;
            if (
                station &&
                squares[i + width].dataset.station === station &&
                squares[i + width * 2].dataset.station === station
            ) {
                markStationCollected(currentLine, station);
                
                squares[i].dataset.station = "";
                squares[i + width].dataset.station = "";
                squares[i + width * 2].dataset.station = "";
                squares[i].style.backgroundColor = "transparent";
                squares[i + width].style.backgroundColor = "transparent";
                squares[i + width * 2].style.backgroundColor = "transparent";
                
                matched = true;
                if (!silent) score += 10;
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
                
                if (!squares[index].dataset.station) {
                    for (let above = row - 1; above >= 0; above--) {
                        const aboveIndex = above * width + col;
                        if (squares[aboveIndex].dataset.station) {
                            squares[index].dataset.station = squares[aboveIndex].dataset.station;
                            squares[index].style.backgroundColor = squares[aboveIndex].style.backgroundColor;
                            
                            squares[aboveIndex].dataset.station = "";
                            squares[aboveIndex].style.backgroundColor = "transparent";
                            break;
                        }
                    }
                    
                    if (!squares[index].dataset.station) {
                        const newStation = getRandomStation(currentLine);
                        squares[index].dataset.station = newStation;
                        squares[index].style.backgroundColor = lineColors[currentLine];
                    }
                }
            }
        }

        setTimeout(() => {
            if (!checkMatches()) {
                if (!hasValidMoves()) {
                    setTimeout(() => {
                        alert(`🚇 Игра окончена! Твой счёт: ${score}\nОтличная работа!`);
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
        const station1 = squares[index1].dataset.station;
        const station2 = squares[index2].dataset.station;
        
        squares[index1].dataset.station = station2;
        squares[index2].dataset.station = station1;
        
        let matchFound = false;
        
        // Проверка горизонтальных совпадений
        const row1 = Math.floor(index1 / width);
        const col1 = index1 % width;
        if (col1 <= width - 3) {
            if (squares[index1].dataset.station && 
                squares[index1].dataset.station === squares[index1 + 1].dataset.station &&
                squares[index1].dataset.station === squares[index1 + 2].dataset.station) {
                matchFound = true;
            }
        }
        if (col1 >= 2) {
            if (squares[index1].dataset.station &&
                squares[index1].dataset.station === squares[index1 - 1].dataset.station &&
                squares[index1].dataset.station === squares[index1 - 2].dataset.station) {
                matchFound = true;
            }
        }
        
        squares[index1].dataset.station = station1;
        squares[index2].dataset.station = station2;
        
        return matchFound;
    }

    // Смена линии метро
    lineSelect.addEventListener("change", (e) => {
        currentLine = e.target.value;
        
        if (!collectedStations[currentLine]) {
            initCollectedStations(currentLine);
        }
        
        renderStationsList(currentLine);
        createBoard();
    });

    restartBtn.addEventListener("click", () => {
        initCollectedStations(currentLine);
        renderStationsList(currentLine);
        createBoard();
    });

    // Инициализация первой линии
    initCollectedStations(currentLine);
    renderStationsList(currentLine);
    createBoard();
});