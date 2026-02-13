document.addEventListener("DOMContentLoaded", () => {
    const width = 5;
    const board = document.getElementById("game-board");
    const restartBtn = document.getElementById("restart");
    const scoreElement = document.getElementById("score");
    const lineSelect = document.getElementById("line-select");
    const stationsListDiv = document.getElementById("stations-list");

    // 5 ЦВЕТОВ ЛИНИЙ МЕТРО
    const lineColors = {
        sokolnicheskaya: "#e74c3c",   // 🔴 красная
        zamoskvoretskaya: "#2ecc71",  // 🟢 зелёная
        arbatsko_pokrovskaya: "#00008B", // 🔵 тёмно-синий
        filyovskaya: "#87CEEB",        // 💙 светло-голубой
        koltsevaya: "#8B4513"          // 🟤 коричневая
    };

    const colorToLine = {
        "#e74c3c": "sokolnicheskaya",
        "#2ecc71": "zamoskvoretskaya",
        "#00008B": "arbatsko_pokrovskaya",
        "#87CEEB": "filyovskaya",
        "#8B4513": "koltsevaya"
    };

    const lineDisplayNames = {
        sokolnicheskaya: "Сокольническая (красная)",
        zamoskvoretskaya: "Замоскворецкая (зелёная)",
        arbatsko_pokrovskaya: "Арбатско-Покровская (синяя)",
        filyovskaya: "Филёвская (голубая)",
        koltsevaya: "Кольцевая (коричневая)"
    };

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
    let collectedStations = {};

    function initAllCollectedStations() {
        for (let line in metroStations) {
            collectedStations[line] = {};
            metroStations[line].forEach(station => {
                collectedStations[line][station] = false;
            });
        }
    }

    function isLineComplete(line) {
        const stations = metroStations[line];
        for (let station of stations) {
            if (!collectedStations[line]?.[station]) return false;
        }
        return true;
    }

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

    function markStationByColor(color) {
        const line = colorToLine[color];
        if (!line || !metroStations[line]) return;

        const availableStations = metroStations[line].filter(
            station => !collectedStations[line]?.[station]
        );

        if (availableStations.length > 0) {
            const randomStation = availableStations[Math.floor(Math.random() * availableStations.length)];
            collectedStations[line][randomStation] = true;
            
            if (line === currentLine) {
                renderStationsList(currentLine);
            }

            if (isLineComplete(line)) {
                setTimeout(() => {
                    alert(`🎉 ЛИНИЯ СОБРАНА! Ты полностью собрал линию ${lineDisplayNames[line]}!`);
                }, 300);
            }
        }
    }

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

    // Создание поля с гарантией хотя бы одной тройки
    function createBoard() {
        board.innerHTML = "";
        squares = [];
        score = 0;
        scoreElement.textContent = "0";

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.classList.add("cell");
            square.setAttribute("data-id", i);
            board.appendChild(square);
            squares.push(square);
            square.addEventListener("click", () => selectSquare(square));
        }

        // Генерируем поле, пока не появится хотя бы одна тройка
        do {
            for (let i = 0; i < squares.length; i++) {
                const randomColor = Object.values(lineColors)[Math.floor(Math.random() * 5)];
                squares[i].dataset.color = randomColor;
                squares[i].style.backgroundColor = randomColor;
            }
        } while (!hasAnyMatches());
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
                // Пробуем обменять
                swapSquares(firstSelected, square);

                // Проверяем, появилась ли тройка
                if (hasAnyMatches()) {
                    // Если да — начисляем очки и станцию
                    const matchColor = findAnyMatchColor();
                    if (matchColor) {
                        markStationByColor(matchColor);
                        score += 10;
                        scoreElement.textContent = score;
                    }
                    
                    // Удаляем тройки и запускаем падение
                    removeMatchesAndDrop();
                } else {
                    // Если тройки нет — меняем обратно
                    swapSquares(firstSelected, square);
                }
            }

            firstSelected.style.border = "none";
            firstSelected.style.boxShadow = "none";
            firstSelected = null;
        }
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
                        const randomColor = Object.values(lineColors)[Math.floor(Math.random() * 5)];
                        squares[index].dataset.color = randomColor;
                        squares[index].style.backgroundColor = randomColor;
                    }
                }
            }
        }

        // После падения проверяем, есть ли тройки
        setTimeout(() => {
            if (!hasAnyMatches()) {
                // Если троек нет — добавляем принудительно, чтобы игра не застопорилась
                forceOneMatch();
            }
        }, 200);
    }

    // Гарантированно создаёт одну тройку на поле, если их нет
    function forceOneMatch() {
        // Пробуем создать тройку обменом соседних клеток
        for (let i = 0; i < squares.length; i++) {
            if (i % width < width - 1) {
                // Пробуем горизонтальный обмен
                swapSquares(squares[i], squares[i + 1]);
                if (hasAnyMatches()) {
                    // Если получилось — отлично, оставляем
                    return;
                } else {
                    // Если нет — меняем обратно
                    swapSquares(squares[i], squares[i + 1]);
                }
            }
            
            if (i < width * (width - 1)) {
                // Пробуем вертикальный обмен
                swapSquares(squares[i], squares[i + width]);
                if (hasAnyMatches()) {
                    return;
                } else {
                    swapSquares(squares[i], squares[i + width]);
                }
            }
        }
        
        // Если ничего не вышло — просто перегенерируем поле
        for (let i = 0; i < squares.length; i++) {
            const randomColor = Object.values(lineColors)[Math.floor(Math.random() * 5)];
            squares[i].dataset.color = randomColor;
            squares[i].style.backgroundColor = randomColor;
        }
        
        // Проверяем, есть ли тройки
        if (!hasAnyMatches()) {
            // Если нет — рекурсивно пробуем снова
            forceOneMatch();
        }
    }

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

    initAllCollectedStations();
    renderStationsList(currentLine);
    createBoard();
});