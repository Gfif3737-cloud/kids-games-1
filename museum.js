document.addEventListener("DOMContentLoaded", () => {
    // Загружаем артефакты из localStorage
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
            { name: "Вагон типа А", year: 1935, desc: "Первый серийный вагон. Деревянные скамьи, кожаные ремни. Вмещал 180 человек. Ходил до 1975 года.", icon: "🚃" },
            { name: "Вагон типа Б", year: 1937, desc: "Модернизированная версия. Появились мягкие диваны. Первый с пневматическими дверями.", icon: "🚋" },
            { name: "Вагон типа Г", year: 1940, desc: "Цельнометаллический. Прозвали «широколобым» за форму кабины. Работал до 1983 года.", icon: "🚞" },
            { name: "Вагон типа Д", year: 1955, desc: "Тот самый «синий вагон» из песни. С люстрами и мягкими диванами.", icon: "🚆" },
            { name: "Вагон типа Е", year: 1960, desc: "Первый с тиристорным управлением. Автоматические двери.", icon: "🚇" },
            { name: "Вагон типа Еж", year: 1970, desc: "Прозвали «ёжик» за характерный звук. Работает до сих пор.", icon: "🦔" },
            { name: "Вагон типа Номерной", year: 1980, desc: "Самый массовый (>5000 вагонов). «Рабочая лошадка» метро.", icon: "🔢" },
            { name: "Вагон типа Яуза", year: 1991, desc: "Первый российский вагон нового поколения. Асинхронный двигатель.", icon: "🌊" },
            { name: "Вагон типа Русич", year: 2003, desc: "Широкий, проходной. С кондиционерами.", icon: "🇷🇺" },
            { name: "Вагон Москва-2020", year: 2020, desc: "Самый современный. USB-зарядки, информационные табло.", icon: "🏙️" }
        ],
        stations: [
            { name: "Сокольники (1935)", year: 1935, desc: "Первая станция. Открыта 15 мая в 7 утра.", icon: "🏛️" },
            { name: "Кропоткинская (1938)", year: 1938, desc: "Изначально называлась «Дворец Советов».", icon: "🏛️" },
            { name: "Маяковская (1938)", year: 1938, desc: "Во время войны здесь был бомбоубежище.", icon: "🏛️" },
            { name: "Площадь Революции (1940)", year: 1940, desc: "Скульптуры отливали в блокадном Ленинграде.", icon: "🏛️" },
            { name: "Новокузнецкая (1943)", year: 1943, desc: "Построена в войну. Скамьи из мрамора.", icon: "🏛️" },
            { name: "Комсомольская (1952)", year: 1952, desc: "Самая роскошная. Снимали в кино.", icon: "🏛️" },
            { name: "Арбатская (1953)", year: 1953, desc: "Самая длинная колонная станция. 250 метров.", icon: "🏛️" },
            { name: "ВДНХ (1958)", year: 1958, desc: "Изначально «ВСХВ». Вестибюль украшали скульптуры.", icon: "🏛️" },
            { name: "Университет (1959)", year: 1959, desc: "Самая глубокая на тот момент (26 м).", icon: "🏛️" },
            { name: "Парк культуры (1960)", year: 1960, desc: "Название писали через дефис: «Паркъ культуры».", icon: "🏛️" },
            { name: "Киевская (1954)", year: 1954, desc: "Мозаики посвящены дружбе Украины и России.", icon: "🏛️" },
            { name: "Красные ворота (1935)", year: 1935, desc: "Названа в честь триумфальной арки.", icon: "🏛️" },
            { name: "Чистые пруды (1940)", year: 1940, desc: "До 1990 называлась «Кировская».", icon: "🏛️" },
            { name: "Лубянка (1947)", year: 1947, desc: "Под станцией секретные бункеры НКВД.", icon: "🏛️" },
            { name: "Библиотека имени Ленина (1935)", year: 1935, desc: "Самая старая станция глубокого заложения.", icon: "🏛️" }
        ],
        tickets: [
            { name: "Первый билет", year: 1935, desc: "Картонный, стоил 50 копеек.", icon: "🎫" },
            { name: "Жетон «Метро»", year: 1961, desc: "Монетовидный, 5 копеек. Работал 30 лет.", icon: "🪙" },
            { name: "Билет на 5 поездок", year: 1970, desc: "Картонный, с отрывными корешками.", icon: "🎟️" },
            { name: "Проездной на месяц", year: 1980, desc: "Красная книжечка. С фотографией.", icon: "📕" },
            { name: "Карточка «четыре поездки»", year: 1992, desc: "Пластиковая, магнитная. Первая в России.", icon: "💳" },
            { name: "Жетон «Юбилейный»", year: 1985, desc: "С гербом Москвы. Коллекционный.", icon: "🪙" },
            { name: "Социальная карта москвича", year: 2001, desc: "Первая бесконтактная.", icon: "💳" },
            { name: "Тройка (первая)", year: 2013, desc: "Самая популярная карта России.", icon: "3️⃣" }
        ]
    };

    // Иконки для категорий
    const categoryIcons = {
        wagons: "🚃",
        stations: "🏛️",
        tickets: "🎫",
        interiors: "🕰️",
        uniforms: "👕",
        equipment: "🔧",
        construction: "🚧",
        bonus: "🎁"
    };

    let currentCategory = "wagons";

    // Элементы
    const categoryBtns = document.querySelectorAll(".category-btn");
    const container = document.getElementById("artifacts-container");
    const totalSpan = document.getElementById("total-collected");
    const modal = document.getElementById("artifact-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalYear = document.getElementById("modal-year");
    const modalDesc = document.getElementById("modal-desc");
    const modalStatus = document.getElementById("modal-status");
    const closeBtn = document.querySelector(".close-btn");

    // Подсчёт общего количества
    function countTotal() {
        let total = 0;
        for (let cat in artifacts) {
            total += artifacts[cat].filter(v => v).length;
        }
        totalSpan.textContent = total;
    }

    // Рендер категории
    function renderCategory(category) {
        container.innerHTML = "";
        const data = artifactsData[category];
        const obtained = artifacts[category];
        
        data.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "artifact-card" + (obtained[index] ? "" : " locked");
            
            card.innerHTML = `
                <div class="artifact-icon">${item.icon || categoryIcons[category]}</div>
                <div class="artifact-name">${item.name}</div>
                <div class="artifact-year">${item.year}</div>
            `;
            
            if (obtained[index]) {
                card.addEventListener("click", () => showModal(item, true));
            } else {
                card.addEventListener("click", () => showModal(item, false));
            }
            
            container.appendChild(card);
        });
    }

    // Показать модальное окно
    function showModal(item, obtained) {
        modalTitle.textContent = item.name;
        modalYear.textContent = `Год: ${item.year}`;
        modalDesc.textContent = item.desc;
        modalStatus.textContent = obtained ? "✅ ПОЛУЧЕНО" : "🔒 ЕЩЁ НЕ ПОЛУЧЕНО";
        modalStatus.style.background = obtained ? "#4a2c00" : "#5a3a2a";
        modal.style.display = "block";
    }

    // Переключение категорий
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            categoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            renderCategory(currentCategory);
        });
    });

    // Закрытие модального окна
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Инициализация
    countTotal();
    renderCategory("wagons");
});