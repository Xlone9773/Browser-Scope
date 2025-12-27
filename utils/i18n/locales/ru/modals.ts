
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
            license: "Лицензия MIT"
        }
    },
    updates: [
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
    close: "Закрыть"
  },
  scoreModal: {
    score_details_title: "Детали оценки отпечатка",
    tracking_potential: "Риск отслеживания",
    score_explanation: "Эта оценка представляет вероятность уникальной идентификации вашей текущей браузерной среды. Чем выше балл, тем уникальнее отпечаток вашего устройства и тем легче сайтам отслеживать вас.",
    contributing_factors: "Влияющие факторы",
    close: "Закрыть",
    factors: {
        canvas_hash: "Canvas Hash",
        webgl_hash: "WebGL Hash",
        hardware_concurrency: "Данные о железе",
        user_agent: "Сложность User Agent",
        resolution: "Разрешение экрана",
        audio_context: "Аудио отпечаток",
        battery_status: "API Батареи",
        locale_time: "Часовой пояс и Язык"
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
        desc_res_unique: "Нестандартное разрешение экрана.",
        desc_audio_unique: "Характеристики аудио оборудования могут быть идентифицированы.",
        desc_battery_unique: "API батареи раскрывает точный уровень заряда.",
        desc_battery_generic: "API батареи недоступен или возвращает общие значения.",
        desc_locale_unique: "Комбинация часового пояса и языка помогает в идентификации."
    }
  },
  fingerprintModal: {
    title: "Генератор Отпечатков",
    desc: "Генерация и анализ отпечатков браузера",
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
    close: "Закрыть"
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
    storage_test: "IOPS Базы данных"
  },
  graphicsModal: {
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
  }
};
