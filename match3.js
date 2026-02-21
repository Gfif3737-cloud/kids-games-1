document.addEventListener("DOMContentLoaded", () => {
    // ==================== СИСТЕМА АВТОРИЗАЦИИ ====================
    const loginContainer = document.getElementById("login-container");
    const gameContainer = document.getElementById("game-container");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const userDisplay = document.getElementById("user-display");
    
    // Хранилище пользователей
    let users = JSON.parse(localStorage.getItem("metro_users")) || {};
    
    // Текущий пользователь
    let currentUser = JSON.parse(localStorage.getItem("metro_current_user")) || null;
    
    // ==================== СИСТЕМА АРТЕФАКТОВ ====================
    let artifacts = JSON.parse(localStorage.getItem("metro_artifacts")) || {
        wagons: [false, false, false, false, false, false, false, false, false, false],
        stations: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        tickets: [false, false, false, false, false, false, false, false],
        interiors: [false, false, false, false, false, false, false, false, false, false, false, false],
        uniforms: [false, false, false, false, false, false],
        equipment: [false, false, false, false, false, false, false, false, false],
        construction: [false, false, false, false, false, false, false],
        bonus: [false, false, false]
    };

    // Данные артефактов
    const artifactsData = {
        wagons: [
            { name: "Вагон типа А", year: 1935, desc: "Первый серийный вагон. Деревянные скамьи, кожаные ремни. Вмещал 180 человек. Ходил до 1975 года." },
            { name: "Вагон типа Б", year: 1937, desc: "Модернизированная версия. Появились мягкие диваны. Первый с пневматическими дверями." },
            { name: "Вагон типа Г", year: 1940, desc: "Цельнометаллический. Прозвали «широколобым» за форму кабины. Работал до 1983 года." },
            { name: "Вагон типа Д", year: 1955, desc: "Тот самый «синий вагон» из песни. С люстрами и мягкими диванами. Тёплый и уютный." },
            { name: "Вагон типа Е", year: 1960, desc: "Первый с тиристорным управлением. Автоматические двери. Максимальная скорость 90 км/ч." },
            { name: "Вагон типа Еж", year: 1970, desc: "Усиленная версия. Прозвали «ёжик» за характерный звук. Работает до сих пор на некоторых линиях." },
            { name: "Вагон типа Номерной", year: 1980, desc: "Самый массовый (>5000 вагонов). Простая и надёжная конструкция. «Рабочая лошадка» метро." },
            { name: "Вагон типа Яуза", year: 1991, desc: "Первый российский вагон нового поколения. Асинхронный двигатель. Редкий, выпущено мало." },
            { name: "Вагон типа Русич", year: 2003, desc: "Широкий, проходной. С кондиционерами. Специально для Бутовской линии." },
            { name: "Вагон Москва-2020", year: 2020, desc: "Самый современный. USB-зарядки, информационные табло, бесшумный." }
        ],
        stations: [
            { name: "Сокольники (1935)", year: 1935, desc: "Первая станция. Открыта 15 мая в 7 утра. Колонны облицованы жёлтым крымским мрамором." },
            { name: "Кропоткинская (1938)", year: 1938, desc: "Изначально называлась «Дворец Советов». Должна была стать вестибюлем грандиозного дворца." },
            { name: "Маяковская (1938)", year: 1938, desc: "Во время войны здесь был бомбоубежище. В 1941 году Сталин выступал в вестибюле." },
            { name: "Площадь Революции (1940)", year: 1940, desc: "Скульптуры отливали в блокадном Ленинграде. Собака у пограничника отполирована до блеска — примета." },
            { name: "Новокузнецкая (1943)", year: 1943, desc: "Построена в войну. Скамьи из мрамора, своды как в древнеримских термах." },
            { name: "Комсомольская (1952)", year: 1952, desc: "Самая роскошная. Потолочные мозаики, люстры. Снимали в кино «Москва слезам не верит»." },
            { name: "Арбатская (1953)", year: 1953, desc: "Самая длинная колонная станция. 250 метров. Во время стройки обрушился грунт, погибли рабочие." },
            { name: "ВДНХ (1958)", year: 1958, desc: "Изначально «ВСХВ». Вестибюль украшали скульптуры рабочих и колхозников." },
            { name: "Университет (1959)", year: 1959, desc: "Самая глубокая на тот момент (26 м). Эскалатор длиной 120 метров." },
            { name: "Парк культуры (1960)", year: 1960, desc: "Название писали через дефис: «Паркъ культуры». В 1960-х убрали." },
            { name: "Киевская (1954)", year: 1954, desc: "Мозаики посвящены дружбе Украины и России. Каждая — отдельное панно." },
            { name: "Красные ворота (1935)", year: 1935, desc: "Названа в честь триумфальной арки. Арку снесли в 1927, имя осталось." },
            { name: "Чистые пруды (1940)", year: 1940, desc: "До 1990 называлась «Кировская». Турникеты были только на вход, выходили без контроля." },
            { name: "Лубянка (1947)", year: 1947, desc: "Под станцией секретные бункеры НКВД. Ходят легенды о подземных этажах." },
            { name: "Библиотека имени Ленина (1935)", year: 1935, desc: "Самая старая станция глубокого заложения. Переходы узкие, как в старом доме." }
        ],
        tickets: [
            { name: "Первый билет", year: 1935, desc: "Картонный, стоил 50 копеек. Контролёр компостировал дыроколом." },
            { name: "Жетон «Метро»", year: 1961, desc: "Монетовидный, 5 копеек. Работал 30 лет. Иногда принимали автоматы с газировкой." },
            { name: "Билет на 5 поездок", year: 1970, desc: "Картонный, с отрывными корешками. Каждый корешок — одна поездка." },
            { name: "Проездной на месяц", year: 1980, desc: "Красная книжечка. С фотографией и печатью. Без фото недействителен." },
            { name: "Карточка «четыре поездки»", year: 1992, desc: "Пластиковая, магнитная. Первая в России. Часто размагничивалась." },
            { name: "Жетон «Юбилейный»", year: 1985, desc: "Выпущен к 50-летию метро. С гербом Москвы. Коллекционный." },
            { name: "Социальная карта москвича", year: 2001, desc: "Первая бесконтактная. Для льготников. Технология будущего." },
            { name: "Тройка (первая)", year: 2013, desc: "Назвали в честь трёх видов транспорта. Самая популярная карта России." }
        ]
    };

    // ==================== ПОЛНЫЕ ДАННЫЕ УРОВНЕЙ ====================
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
                { id: "kaluzhsko_rizhskaya", name: "Калужско-Рижская", color: "#FFD700", stations: [
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
            name: "Новые линии",
            lines: [
                { id: "lublinsko_dmitrovskaya", name: "Люблинско-Дмитровская", color: "#00CED1", stations: [
                    "Физтех", "Лианозово", "Яхромская", "Селигерская", "Верхние Лихоборы",
                    "Окружная", "Петровско-Разумовская", "Фонвизинская", "Бутырская", "Марьина Роща",
                    "Достоевская", "Трубная", "Сретенский бульвар", "Чкаловская", "Римская",
                    "Крестьянская застава", "Дубровка", "Кожуховская", "Печатники", "Волжская",
                    "Люблино", "Братиславская", "Марьино", "Борисово", "Шипиловская",
                    "Зябликово"
                ]},
                { id: "bolshaya_koltsevaya", name: "Большая кольцевая", color: "#FF1493", stations: [
                    "Деловой центр", "Шелепиха", "Хорошёвская", "ЦСКА", "Петровский парк",
                    "Савёловская", "Марьина Роща", "Рижская", "Сокольники", "Электрозаводская",
                    "Лефортово", "Авиамоторная", "Нижегородская", "Текстильщики", "Печатники",
                    "Нагатинский Затон", "Кленовый бульвар", "Каширская", "Варшавская", "Каховская",
                    "Зюзино", "Воронцовская", "Новаторская", "Проспект Вернадского", "Мичуринский проспект",
                    "Аминьевская", "Давыдково", "Можайская"
                ]},
                { id: "butovskaya", name: "Бутовская", color: "#B0C4DE", stations: [
                    "Битцевский парк", "Лесопарковая", "Улица Старокачаловская", "Улица Скобелевская", "Бульвар Адмирала Ушакова",
                    "Улица Горчакова", "Бунинская аллея"
                ]},
                { id: "troitskaya", name: "Троицкая", color: "#DA70D6", stations: [
                    "ЗИЛ", "Крымская", "Академическая", "Вавиловская", "Новаторская",
                    "Университет Дружбы Народов", "Генерала Тюленева", "Тютчевская", "Корниловская", "Коммунарка",
                    "Новомосковская", "Сосенки", "Летово", "Десна", "Кедровая",
                    "Ватутинки", "Троицк"
                ]},
                { id: "mck", name: "МЦК", color: "#FF6347", stations: [
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
        level4: {
            name: "МЦД",
            lines: [
                { id: "mcd1", name: "МЦД-1", color: "#e67e22", stations: [
                    "Одинцово", "Баковка", "Сколково", "Немчиновка", "Сетунь",
                    "Рабочий Посёлок", "Кунцевская", "Фили", "Тестовская", "Беговая",
                    "Белорусская", "Савёловская", "Тимирязевская", "Окружная", "Дегунино",
                    "Бескудниково", "Лианозово", "Марк", "Новодачная", "Долгопрудная",
                    "Водники", "Хлебниково", "Шереметьевская", "Лобня"
                ]},
                { id: "mcd2", name: "МЦД-2", color: "#FF69B4", stations: [
                    "Нахабино", "Аникеевка", "Опалиха", "Красногорская", "Павшино",
                    "Пенягино", "Волоколамская", "Трикотажная", "Тушинская", "Щукинская",
                    "Стрешнево", "Красный Балтиец", "Гражданская", "Дмитровская", "Марьина Роща",
                    "Рижская", "Каланчёвская", "Курская", "Москва-Товарная", "Калитники",
                    "Текстильщики", "Люблино", "Перерва", "Курьяново", "Москворечье",
                    "Царицыно", "Покровское", "Красный Строитель", "Битца", "Бутово",
                    "Щербинка", "Остафьево", "Силикатная", "Подольск"
                ]},
                { id: "mcd3", name: "МЦД-3", color: "#4169E1", stations: [
                    "Крюково", "Малино", "Фирсановка", "Сходня", "Подрезково",
                    "Новоподрезково", "Молжаниново", "Химки", "Левобережная", "Ховрино",
                    "Грачёвская", "Моссельмаш", "Лихоборы", "Петровско-Разумовская", "Останкино",
                    "Рижская", "Митьково", "Электрозаводская", "Сортировочная", "Авиамоторная",
                    "Андроновка", "Перово", "Плющево", "Вешняки", "Выхино",
                    "Косино", "Ухтомская", "Люберцы", "Панки", "Томилино",
                    "Красково", "Малаховка", "Удельная", "Быково", "Ильинская",
                    "Отдых", "Кратово", "Есенинская", "Фабричная", "Раменское"
                ]},
                { id: "mcd4", name: "МЦД-4", color: "#32CD32", stations: [
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

    // ==================== ПЕРЕМЕННЫЕ ИГРЫ ====================
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

    let squares = [];
    let firstSelected = null;
    let currentLevel = "level1";
    let currentLineId = "sokolnicheskaya";
    let lineScore = 0;
    let totalScore = 0;
    let isDropping = false;
    
    // Прогресс сбора станций
    let collectedStations = {};
    
    // Прогресс пользователя
    let userProgress = {};

    // ==================== ФУНКЦИИ АВТОРИЗАЦИИ ====================
    
    function updateUI() {
        if (currentUser) {
            loginContainer.style.display = "none";
            gameContainer.style.display = "block";
            userDisplay.textContent = `👤 ${currentUser}`;
            loadUserProgress();
        } else {
            loginContainer.style.display = "block";
            gameContainer.style.display = "none";
        }
    }
    
    function register() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            alert("Введите имя и пароль!");
            return;
        }
        
        if (users[username]) {
            alert("Пользователь уже существует!");
            return;
        }
        
        users[username] = {
            password: password,
            progress: {
                level1: { unlocked: true, completed: false },
                level2: { unlocked: false, completed: false },
                level3: { unlocked: false, completed: false },
                level4: { unlocked: false, completed: false }
            },
            collectedStations: {}
        };
        
        localStorage.setItem("metro_users", JSON.stringify(users));
        alert("Регистрация успешна! Теперь войдите.");
    }
    
    function login() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            alert("Введите имя и пароль!");
            return;
        }
        
        if (!users[username] || users[username].password !== password) {
            alert("Неверное имя или пароль!");
            return;
        }
        
        currentUser = username;
        localStorage.setItem("metro_current_user", JSON.stringify(currentUser));
        updateUI();
    }
    
    function logout() {
        currentUser = null;
        localStorage.removeItem("metro_current_user");
        updateUI();
    }
    
    function loadUserProgress() {
        if (currentUser && users[currentUser]) {
            userProgress = users[currentUser].progress;
            collectedStations = users[currentUser].collectedStations || {};
            updateLevelsDisplay();
            initCurrentLevelProgress();
        }
    }
    
    function saveProgress() {
        if (currentUser) {
            users[currentUser].progress = userProgress;
            users[currentUser].collectedStations = collectedStations;
            localStorage.setItem("metro_users", JSON.stringify(users));
        }
    }
    
    // ==================== ФУНКЦИЯ ВЫДАЧИ АРТЕФАКТА ====================
    function giveArtifactForLevel(levelId) {
        let artifactGiven = false;
        let artifactName = "";
        
        switch(levelId) {
            case "level1":
                if (!artifacts.wagons[0]) {
                    artifacts.wagons[0] = true;
                    artifactGiven = true;
                    artifactName = artifactsData.wagons[0].name + " (" + artifactsData.wagons[0].year + ")";
                }
                break;
            case "level2":
                if (!artifacts.wagons[1]) {
                    artifacts.wagons[1] = true;
                    artifactGiven = true;
                    artifactName = artifactsData.wagons[1].name + " (" + artifactsData.wagons[1].year + ")";
                }
                break;
            case "level3":
                if (!artifacts.stations[0]) {
                    artifacts.stations[0] = true;
                    artifactGiven = true;
                    artifactName = artifactsData.stations[0].name;
                }
                break;
            case "level4":
                if (!artifacts.tickets[0]) {
                    artifacts.tickets[0] = true;
                    artifactGiven = true;
                    artifactName = artifactsData.tickets[0].name + " (" + artifactsData.tickets[0].year + ")";
                }
                break;
        }
        
        if (artifactGiven) {
            localStorage.setItem("metro_artifacts", JSON.stringify(artifacts));
            setTimeout(() => {
                alert(`🏛️ ПОЛУЧЕН АРТЕФАКТ!\n\n${artifactName}\n\nЗагляни в Музей метро!`);
            }, 500);
        }
    }

    // ==================== ОБНОВЛЕНИЕ УРОВНЕЙ ====================
    
    function updateLevelsDisplay() {
        const options = levelSelect.options;
        
        for (let i = 0; i < options.length; i++) {
            const levelId = options[i].value;
            const level = levels[levelId];
            
            if (userProgress[levelId]?.unlocked) {
                options[i].disabled = false;
                options[i].textContent = `✅ ${level.name}`;
            } else {
                options[i].disabled = true;
                options[i].textContent = `🔒 ${level.name} (закрыто)`;
            }
            
            if (userProgress[levelId]?.completed) {
                options[i].textContent += ` ✓`;
            }
        }
    }
    
    function completeLevel(levelId) {
        if (userProgress[levelId]) {
            userProgress[levelId].completed = true;
            
            const levelOrder = ["level1", "level2", "level3", "level4"];
            const currentIndex = levelOrder.indexOf(levelId);
            
            if (currentIndex < levelOrder.length - 1) {
                const nextLevel = levelOrder[currentIndex + 1];
                userProgress[nextLevel].unlocked = true;
            }
            
            saveProgress();
            updateLevelsDisplay();
            
            // Выдаём артефакт за прохождение уровня
            giveArtifactForLevel(levelId);
        }
    }

    // ==================== ИНИЦИАЛИЗАЦИЯ ПРОГРЕССА ====================
    
    function initCurrentLevelProgress() {
        if (!collectedStations[currentLevel]) {
            collectedStations[currentLevel] = {};
            levels[currentLevel].lines.forEach(line => {
                collectedStations[currentLevel][line.id] = {};
                line.stations.forEach(station => {
                    collectedStations[currentLevel][line.id][station] = false;
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
            const collected = collectedStations[currentLevel]?.[line.id] || {};
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
            const collected = collectedStations[currentLevel]?.[line.id] || {};
            return stations.filter(s => collected[s]).length === stations.length;
        }).length;
        
        levelProgressElement.textContent = `${completedLines}/${level.lines.length} линий`;
        
        // Проверяем, не пройден ли уровень целиком
        if (completedLines === level.lines.length && !userProgress[currentLevel]?.completed) {
            completeLevel(currentLevel);
        }
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
            if (!collectedStations[currentLevel]) collectedStations[currentLevel] = {};
            if (!collectedStations[currentLevel][line.id]) collectedStations[currentLevel][line.id] = {};
            collectedStations[currentLevel][line.id][randomStation] = true;
            
            if (line.id === currentLineId) {
                renderStationsList();
            }
            
            renderLinesStatus();
            saveProgress();

            const isLineComplete = line.stations.every(
                s => collectedStations[currentLevel]?.[line.id]?.[s]
            );
            
            if (isLineComplete) {
                setTimeout(() => {
                    alert(`🎉 ЛИНИЯ СОБРАНА! Ты полностью собрал линию ${line.name}!`);
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
                const matchColor = findAnyMatchColor();
                if (matchColor) {
                    markStationByColor(matchColor);
                    lineScore += 10;
                    totalScore += 10;
                    lineScoreElement.textContent = lineScore;
                    totalScoreElement.textContent = totalScore;
                }
                
                removeMatchesAndDrop();
            } else {
                swapSquares(firstSelected, square);
            }
        }

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
            setTimeout(dropSquares, 200);
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
            removeAllMatches();
        }, 200);
    }

    // ==================== СЛУШАТЕЛИ СОБЫТИЙ ====================
    
    registerBtn.addEventListener("click", register);
    loginBtn.addEventListener("click", login);
    logoutBtn.addEventListener("click", logout);
    
    levelSelect.addEventListener("change", (e) => {
        currentLevel = e.target.value;
        initCurrentLevelProgress();
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
        initCurrentLevelProgress();
        renderStationsList();
        renderLinesStatus();
        createBoard();
        totalScore = 0;
        totalScoreElement.textContent = "0";
    });

    // ==================== ЗАПУСК ====================
    updateUI();
    
    if (currentUser) {
        loadUserProgress();
        initCurrentLevelProgress();
        updateLineSelect();
        renderStationsList();
        renderLinesStatus();
        createBoard();
    }
});