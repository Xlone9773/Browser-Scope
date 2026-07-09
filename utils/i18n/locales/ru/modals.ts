
export const modals = {
  aboutModal: {
    title: "О BrowserScope",
    desc: "BrowserScope - это комплексный инструмент обнаружения, работающий полностью в браузере. Он не собирает никаких личных данных пользователей на сервер, все вычисления выполняются локально. Предназначен для помощи разработчикам и пользователям в понимании реальных возможностей браузера, характеристик отпечатков и системной среды.",
    version: "Текущая версия",
    latest_update: "Последнее обновление",
    history: "История обновлений",
    features: {
        privacy: {
            title: "Приватность прежде всего",
            desc: "100% выполнение на клиенте. Никакого сбора данных. Ваш отпечаток остается на устройстве."
        },
        tech: {
            title: "Передовые технологии",
            desc: "Работает на WebGPU, WebNN и WASM для тестирования новейших возможностей браузера."
        },
        deepScan: {
            title: "Глубокое сканирование",
            desc: "Анализирует 100+ аппаратных и программных сигналов для генерации высокоэнтропийных идентификаторов."
        },
        stack: {
            title: "Стек инноваций"
        },
        openSource: {
            title: "Открытый код",
            license: "Лицензия MIT",
            viewLicense: "Просмотреть лицензию",
            hideLicense: "Скрыть лицензию",
            downloadLicense: "Скачать лицензию",
            licenseTitle: "Лицензия на ПО (MIT)",
            licenseText: `Лицензия MIT

Copyright (c) 2026 BrowserScope Contributors

Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемого «Программное обеспечение»), безвозмездно использовать Программное обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, слияние, публикацию, распространение, сублицензирование и/или продажу копий Программного обеспечения, а также право разрешать делать это лицам, которым предоставляется данное Программное обеспечение, при соблюдении следующих условий:

Указанное выше уведомление об авторских правах и данные условия лицензии должны быть включены во все копии или значимые части Программного обеспечения.

ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ, НО НЕ ОГРАНИЧИВАЯСЬ ГАРАНТИЯМИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ КОНКРЕТНЫМ ЦЕЛЯМ И ОТСУТСТВИЯ НАРУШЕНИЙ ПРАВ. НИ В КОЕМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО КАКИМ-ЛИБО ИСКАМ, ЗА УЩЕРБ ИЛИ ПО ИНЫМ ОБЯЗАТЕЛЬСТВАМ, ВНЕ ЗАВИСИМОСТИ ОТ ДЕЙСТВИЯ ДОГОВОРА, ГРАЖДАНСКОГО ПРАВОНАРУШЕНИЯ ИЛИ ИНОГО СЛУЧАЯ, ВОЗНИКАЮЩИХ ИЗ-ЗА, ВНЕ ИЛИ В СВЯЗИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ ИЛИ ИСПОЛЬЗОВАНИЕМ ИЛИ ИНЫМИ ДЕЙСТВИЯМИ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.`
        }
    },
    updates: [
        {
            version: "2.0.0",
            date: "2026-05-03",
            changes: [
                "🚀 Полное обновление архитектуры и пользовательского опыта",
                "Исправлен критический сбой загрузки vConsole (идеальная работа DevTools)",
                "Улучшен интерфейс: замена нативных уведомлений на современную систему",
                "Добавлены настраиваемые кнопки действий и иконки для уведомлений",
                "Улучшена и исправлена совместимость во многих средах"
            ]
        },
        {
            version: "1.7.0",
            date: "2024-05-01",
            changes: ["Добавлен бенчмарк WebGPU Ray Tracing", "Улучшено обнаружение GPU"]
        },
        {
            version: "1.6.0",
            date: "2024-04-12",
            changes: ["Added Real Network Speed Test (Cloudflare)", "Added I18n Dynamic Translations", "Enhanced Intl support"]
        },
        {
            version: "1.5.0",
            date: "2024-04-05",
            changes: ["Added Developer Tools (Console/Inspector)", "Enhanced Codec Matrix (HDR/Dolby/Bit-depth)", "Added IP Source Selection", "Floating Window Support"]
        },
        {
            version: "1.4.0",
            date: "2024-03-25",
            changes: ["Added Vision Capabilities (Barcode/QR)", "Added CPU/GPU Mapping Update"]
        },
        {
            version: "1.3.0",
            date: "2024-03-20",
            changes: ["Added Hardware Tools (Pressure/Video)", "Optimized mobile layout", "Added Russian support"]
        },
        {
            version: "1.2.0",
            date: "2024-03-15",
            changes: ["Added Network Tools (WebRTC/DNS/Proto)", "Added Gamut & HDR tests", "Improved fingerprint scoring"]
        },
        {
            version: "1.1.0",
            date: "2024-03-10",
            changes: ["Added AI Playground", "Bluetooth & Gamepad support", "Added Settings panel"]
        }
    ],
    close: "Закрыть"
  },
  sensorModal: {
    sensor_title: "Датчики устройства",
    sensor_permission_desc: "Требуется ваше разрешение для доступа к данным датчиков устройства (например, гироскопа).",
    sensor_allow: "Разрешить доступ",
    accelerometer: "Акселерометр",
    gyroscope: "Гироскоп",
    magnetometer: "Магнитометр",
    ambient_light: "Окружающий свет",
    linear_accel: "Линейное ускорение",
    gravity: "Гравитация",
    abs_orientation: "Абсолютная ориентация",
    xaxis: "Ось X",
    yaxis: "Ось Y",
    zaxis: "Ось Z",
    alpha: "Альфа (Alpha)",
    beta: "Бета (Beta)",
    gamma: "Гамма (Gamma)",
    dark: "Темно",
    room: "Комната",
    bright: "Ярко",
    sensor_unavailable: "Датчик недоступен.",
    data_source_desc: "Данные предоставляются API DeviceMotion, DeviceOrientation и Generic Sensor.",
    close: "Закрыть"
  },
  scoreModal: {
    score_details_title: "Детали оценки отпечатка",
    tracking_potential: "Риск отслеживания",
    score_explanation: "Эта оценка представляет вероятность уникальной идентификации вашей текущей браузерной среды. Чем выше балл, тем уникальнее отпечаток вашего устройства и тем легче сайтам отслеживать вас.",
    contributing_factors: "Влияющие факторы",
    value_label: "Значение",
    close: "Закрыть",
    categories: {
        hardware: "Аппаратное обеспечение",
        browser: "Браузер",
        network: "Сеть",
        media: "Медиа",
        screen: "Экран"
    },
    factors: {
        canvas_hash: "Canvas Hash",
        webgl_hash: "WebGL Hash",
        hardware_concurrency: "Данные о железе",
        user_agent: "Сложность User Agent",
        resolution: "Разрешение экрана",
        audio_context: "Аудио отпечаток",
        battery_status: "API Батареи",
        locale_time: "Часовой пояс и Язык",
        gpu_renderer: "GPU Рендерер",
        webrtc_leak: "Утечка WebRTC",
        screen_advanced: "Расширенный экран",
        drm_support: "Поддержка DRM",
        touch_support: "Поддержка тача"
    },
    values: {
        val_unique: "Уникальное/Редкое",
        val_generic: "Общее/Частое",
        val_specific: "Слишком специфично",
        val_readable: "Читаемо",
        val_protected: "Защищено/Скрыто"
    },
    descriptions: {
        desc_canvas_unique: "Результат рендеринга Canvas обладает высокой уникальностью.",
        desc_canvas_generic: "Canvas вернул общее или защищенное значение.",
        desc_webgl_unique: "Функции рендеринга GPU уникальны.",
        desc_webgl_generic: "WebGL защищен или заблокирован.",
        desc_hardware_unique: "Редкое сочетание CPU/Памяти.",
        desc_hardware_generic: "Распространенная конфигурация оборудования.",
        desc_ua_unique: "Строка UA содержит слишком много специфичной информации.",
        desc_ua_ch: "Client Hints раскрывают конкретную модель устройства.",
        desc_res_unique: "Нестандартное разрешение экрана.",
        desc_audio_unique: "Характеристики аудио оборудования могут быть идентифицированы.",
        desc_battery_unique: "API батареи раскрывает точный уровень заряда.",
        desc_battery_generic: "API батареи недоступен или возвращает общие значения.",
        desc_locale_unique: "Комбинация часового пояса и языка помогает в идентификации.",
        desc_gpu_unique: "Раскрыта точная модель видеокарты.",
        desc_webrtc_leak: "Реальный локальный или публичный IP утек через WebRTC.",
        desc_webrtc_safe: "Обработка IP в WebRTC обфусцирована или отключена.",
        desc_screen_advanced: "Комбинация глубины цвета, HDR и DPR уникальна.",
        desc_drm_unique: "Поддерживаемые системы DRM сужают круг OS/Браузера."
    }
  },
  fingerprintModal: {
    title: "Генератор Отпечатков",
    desc: "Генерация и анализ отпечатков браузера",
    tab_v5: "FingerprintJS v5",
    tab_v4: "FingerprintJS v4",
    tab_v2: "FingerprintJS v2",
    tab_fonts: "Детектор Шрифтов",
    salt_label: "Пользовательская Соль (Шум)",
    font_detect_desc: "Определение списка установленных в системе шрифтов",
    visitor_id: "ID Посетителя (Hash)",
    time_taken: "Затрачено времени",
    generating: "Генерация...",
    components_label: "Компоненты отпечатка",
    select_all: "Выбрать все",
    deselect_all: "Снять выделение",
    font_list_title: "Обнаруженные шрифты",
    copy: "Копировать ID",
    copied: "Скопировано",
    regenerate: "Перегенерировать",
    close: "Закрыть",
    font_count: "Количество",
    complex_obj: "[Сложный объект]",
    no_components: "Компоненты не загружены",
    active_source: "Активный источник данных",
    items_included: "элементов включено",
    error_loading: "Ошибка загрузки библиотеки"
  },
  benchmarkModal: {
    title: "Бенчмарк производительности",
    start_btn: "Запустить полный тест",
    running: "Выполнение теста...",
    score: "Общий балл",
    cpu_test: "CPU (Простые числа)",
    math_test: "Математические операции",
    memory_test: "Пропускная способность памяти",
    dom_test: "Операции с DOM",
    gpu_test: "Рендеринг Canvas",
    storage_test: "IOPS Базы данных",
    worker_status: "Web Worker активен (Многопоточность)"
  },
  graphicsModal: {
    supported_features: "Поддерживаемые возможности",
    no_params_found: "Не найдено параметров по запросу: ",
    title: "Графические лимиты и функции",
    tab_webgl: "Лимиты WebGL",
    tab_webgpu: "Лимиты WebGPU",
    tab_features: "Функции",
    loading: "Запрос возможностей GPU...",
    not_supported: "WebGPU не поддерживается в этом браузере.",
    copy: "Копировать отчет",
    search: "Поиск параметров..."
  },
  speechModal: {
    title: "Исследование синтеза речи",
    lang_filter: "Фильтр по языку",
    play: "Играть",
    default: "По умолчанию",
    local: "Локальный",
    remote: "Удаленный",
    no_voices: "Голоса не найдены. Убедитесь, что ваша система поддерживает синтез речи.",
    loading: "Загрузка голосов..."
  },
  storageBenchmark: {
    title: "Бенчмарк Хранилища Pro",
    start: "Начать тест",
    stop: "Стоп",
    target_label: "Цель",
    size_label: "Размер данных",
    chunk_size: "Размер блока",
    opfs: "OPFS (Файловая система)",
    idb: "IndexedDB (База данных)",
    cache: "Cache API (Кэш)",
    write: "Запись",
    read: "Чтение",
    mbps: "МБ/с",
    iops: "IOPS",
    results: "Результаты",
    warning: "Этот тест записывает временные данные на диск. Они будут удалены автоматически, но убедитесь в наличии свободного места.",
    latency: "Задержка (Сред./Пик)",
    export_csv: "Экспорт CSV",
    clear_logs: "Очистить логи",
    chunk_size_64: "64 КБ (Высокий IOPS)",
    chunk_size_256: "256 КБ",
    chunk_size_1024: "1 МБ (Сбалансировано)",
    chunk_size_4096: "4 МБ (Высокая пропускная способность)",
    table_time: "Время",
    table_target: "Цель",
    table_op: "Тип",
    table_chunk: "Блок",
    table_speed: "Скорость",
    table_latency: "Задержка (Сред./Пик)",
    op_read: "Чтение",
    op_write: "Запись",
    worker_status: "Выделенный Web Worker активен (Включен быстрый синхронный IO)"
  },
  heatmap: {
    title: "Мониторинг качества сети",
    start: "Быстрое сканирование",
    stop: "Стоп",
    region: "Регион",
    latency: "Задержка (RTT)",
    status: "Статус",
    status_pending: "Ожидание",
    status_error: "Ошибка/Таймаут",
    desc: "Нажмите на узел, чтобы войти в режим детального отслеживания качества связи (симуляция MTR).",
    back: "Вернуться к карте",
    mtr_title: "Трассировка качества",
    packet_loss: "Потеря пакетов",
    jitter: "Джиттер",
    avg_latency: "Ср. Задержка",
    current: "Текущая",
    samples: "Семплы",
    regions: {
        us_east: "США Восток (С. Вирджиния)",
        us_west: "США Запад (Калифорния)",
        ca_central: "Канада (Монреаль)",
        sa_brazil: "Бразилия (Сан-Паулу)",
        sa_chile: "Чили (Сантьяго)",
        eu_uk: "Великобритания (Лондон)",
        eu_ger: "Германия (Франкфурт)",
        eu_fr: "Франция (Париж)",
        eu_se: "Швеция (Стокгольм)",
        ap_india: "Индия (Мумбаи)",
        ap_sg: "Сингапур",
        ap_jp: "Япония (Токио)",
        ap_kr: "Южная Корея (Сеул)",
        ap_au: "Австралия (Сидней)",
        cn_sh: "Китай (Шанхай)",
        cn_hk: "Китай (Гонконг)",
        cn_tw: "Китай (Тайбэй)",
        af_sa: "Южная Африка (Кейптаун)"
    }
  },
  aiPlayground: {
    title: "AI Песочница",
    desc: "Запуск легковесных AI моделей (DistilBERT) локально в браузере. Данные не отправляются на сервер.",
    select_task: "Выберите задачу",
    perf_metrics: "Метрики",
    tasks: {
        sentiment: {
            title: "Анализ тональности",
            desc: "Определение эмоций (DistilBERT)",
            input: "Введите текст на английском...",
            btn: "Анализ"
        },
        generation: {
            title: "Генерация текста",
            desc: "Автодополнение текста (DistilGPT2)",
            input: "Начните предложение...",
            btn: "Генерировать"
        },
        translation: {
            title: "Перевод",
            desc: "Англ -> Нем/Франц (T5-Small)",
            input: "Введите текст для перевода...",
            btn: "Перевести"
        }
    },
    status: {
        loading_model: "Загрузка весов модели...",
        ready: "Модель готова",
        computing: "Вычисление...",
        idle: "Ожидание"
    },
    metrics: {
        time_load: "Время загрузки",
        time_inference: "Время инференса",
        device: "Устройство"
    },
    result_label: "Результат анализа",
    confidence: "Уверенность",
    btn_load: "Загрузить модель"
  },
  rayTracing: {
    title: "GPU Трассировка лучей",
    start: "Начать тест",
    stop: "Стоп",
    fps: "FPS",
    spp: "Сэмплов на пиксель",
    bounces: "Отскоки",
    resolution: "Разрешение",
    error_webgpu: "WebGPU не поддерживается в этом браузере. Используйте Chrome 113+ или Edge.",
    desc: "Бенчмарк трассировки путей в реальном времени на базе WebGPU Compute Shaders.",
    controls: "Материалы",
    roughness: "Шероховатость",
    metalness: "Металличность",
    color: "Цвет сферы",
    reset: "Сброс камеры"
  },
  "extensionsModal": {
    "title": "Инвентаризация расширений",
    "note_strong": "Примечание:",
    "note_text": "По соображениям конфиденциальности браузеры не предоставляют API для просмотра установленных расширений. Этот инструмент использует эвристику (например, обнаружение внедренных переменных или DOM) для поиска популярных расширений. Это не полный список ваших расширений.",
    "no_extensions": "Известных расширений не найдено.",
    "detected": "Обнаружено",
    "categories": {
      "Development": "Разработка",
      "Crypto": "Криптовайты",
      "Shopping": "Покупки",
      "Productivity": "Продуктивность",
      "Utility": "Утилиты"
    },
    "names": {
      "react-devtools": "React DevTools",
      "vue-devtools": "Vue.js devtools",
      "redux-devtools": "Redux DevTools",
      "apollo-devtools": "Apollo Client Devtools",
      "ember-inspector": "Ember Inspector",
      "metamask": "MetaMask",
      "phantom": "Phantom",
      "binance": "Binance Wallet",
      "coinbase": "Coinbase Wallet",
      "brave-wallet": "Brave Wallet",
      "sui-wallet": "Sui Wallet",
      "honey": "Honey",
      "grammarly": "Grammarly",
      "darkreader": "Dark Reader"
    },
    "descs": {
      "react-devtools": "Официальное расширение отладки React",
      "vue-devtools": "Официальное расширение отладки Vue",
      "redux-devtools": "Отладка состояния Redux",
      "apollo-devtools": "Отладка GraphQL",
      "ember-inspector": "Отладка Ember",
      "metamask": "Web3 кошелек Ethereum",
      "phantom": "Web3 кошелек Solana",
      "binance": "Web3 кошелек Binance",
      "coinbase": "Web3 кошелек Coinbase",
      "brave-wallet": "Встроенный кошелек Brave",
      "sui-wallet": "Web3 кошелек Sui",
      "honey": "Автоматические купоны",
      "grammarly": "Помощник по написанию текстов",
      "darkreader": "Темная тема для сайтов"
    }
  }
,
  "ja3Modal": {
    "title": "Отпечаток SSL/TLS (JA3/JA4)",
    "desc_title": "Снятие отпечатков TLS Client Hello",
    "desc": "Во время рукопожатия HTTPS браузер отправляет сообщение Client Hello, содержащее поддерживаемые наборы шифров, расширения TLS и т.д. JA3/JA4 использует эти характеристики TCP/TLS для точной идентификации реального браузерного движка или обнаружения ботов, прокси-серверов и поддельных пользовательских агентов.",
    "fetching": "Анализ рукопожатия TLS...",
    "retry": "Повторить",
    "ja3_title": "Отпечаток JA3",
    "ja3_hash": "Хэш JA3 (MD5)",
    "ja3_string": "Строка JA3 (Исходная)",
    "ja3n_title": "Отпечаток JA3N",
    "ja3n_hash": "Хэш JA3N (MD5)",
    "ja3n_string": "Строка JA3N (Исходная)",
    "server_ua": "User-Agent, обнаруженный сервером"
  },
  "attributionsModal": {
    "title": "Лицензии и благодарности (Attributions)",
    "subtitle": "Документирование сторонних библиотек с открытым исходным кодом, фреймворков и шрифтов, которые делают работу аналитической панели BrowserScope возможной.",
    "search_placeholder": "Поиск библиотек, пакетов или шрифтов...",
    "tab_all": "Все активы",
    "tab_libraries": "Библиотеки и пакеты",
    "tab_fonts": "Типографика и шрифты",
    "view_license": "Показать текст лицензии",
    "hide_license": "Скрыть текст лицензии",
    "license_type": "Лицензия",
    "role_label": "Роль и интеграция",
    "visit_site": "Перейти в репозиторий",
    "empty_search": "Не найдено результатов по запросу \"{query}\"",
    "font_role": "Шрифты высокой четкости для интерфейса пользователя, разметки, заголовков и визуализации данных.",
    "lib_role_react": "Современный реактивный движок рендеринга и архитектура состояния для модульных интерактивных виджетов.",
    "lib_role_fingerprint": "Многопоколенные движки идентификации посетителей для расчета энтропии и проверки согласованности устройств.",
    "lib_role_transformers": "Фреймворк нейронного вывода в браузере на базе WebAssembly для запуска локальных моделей ИИ на CPU/GPU клиента.",
    "lib_role_lucide": "Четкие масштабируемые векторные SVG-иконки интерфейса.",
    "lib_role_motion": "Плавная анимация макета элементов, входов и переходов с аппаратным ускорением.",
    "lib_role_screenshot": "Высокоточное рендеринг активных деревьев DOM на холсте для генерации экспортируемых отчетов со скриншотами.",
    "lib_role_jspdf": "Многопоточная компиляция PDF-документов на стороне клиента.",
    "lib_role_devtools": "Оптимизированные для мобильных устройств консоли вывода логов браузера и инспектора элементов.",
    "lib_role_pwa": "Кэширование ресурсов в режиме offline-first и управление клиентами Service Worker.",
    "lib_role_server": "Маршрутизация API сервера Express, ограничение частоты запросов и защита заголовков HTTP.",
    "lib_role_charts": "Адаптивные интерактивные диаграммы, датчики, графики и визуализация сетевой телеметрии.",
    "close": "Закрыть"
  },
  "keyboardShortcutsModal": {
    "title": "Горячие клавиши",
    "desc": "Используйте глобальные горячие клавиши для значительного повышения эффективности работы.",
    "categories": {
      "general": "Общие действия",
      "navigation": "Навигация и тесты",
      "export": "Экспорт данных"
    },
    "keys": {
      "theme": "Переключение темы (Тёмная / Светлая)",
      "refresh": "Пересканировать и обновить данные",
      "help": "Открыть / закрыть справку",
      "close": "Закрыть текущее окно",
      "settings": "Открыть настройки",
      "benchmark": "Запустить тест производительности",
      "ai": "Войти в AI Лабораторию (Playground)",
      "network": "Сетевые утилиты (Ping/Порты)",
      "display": "Тесты монитора",
      "hardware": "Расширенные тесты оборудования",
      "translate": "Google Переводчик",
      "exportJson": "Экспорт в JSON",
      "exportPdf": "Экспорт отчёта в PDF",
      "exportImage": "Экспорт скриншота панели",
      "esc": "Esc",
      "alt": "Alt",
      "shift": "Shift"
    }
  }

};
