
// ... existing imports
import { Translation } from './types';

export const ru: Translation = {
  // ... existing code ...
  meta: {
    title: "BrowserScope",
    subtitle: "Комплексный инструмент для глубокого анализа отпечатков и возможностей браузера",
    footer: "BrowserScope - Инструмент анализа возможностей браузера",
  },
  // ... existing common ...
  common: {
    loading: "Сканирование возможностей системы...",
    loading_steps: [
        "Инициализация среды...",
        "Определение возможностей графики и GPU...",
        "Анализ состояния сети...",
        "Проверка безопасности и конфиденциальности...",
        "Оценка производительности AI...",
        "Формирование отчета..."
    ],
    refresh: "Обновить данные",
    actions: {
        start: "Старт",
        stop: "Стоп",
        close: "Закрыть",
        copy: "Копировать",
        copied: "Скопировано",
        download: "Скачать",
        view_details: "Подробнее",
        check: "Проверить",
        open: "Открыть",
        reset: "Сброс",
        export: "Экспорт JSON"
    }
  },
  // ... existing settings ...
  settings: {
    title: "Настройки",
    nav: {
        general: "Общие",
        network: "Сетевые утилиты",
        display: "Экран",
        storage: "Хранилище",
        resources: "Ресурсы",
        developer: "Разработчик",
        modules: "Модули"
    },
    general: {
        simpleMode: {
            title: "Упрощенный режим",
            desc: "Скрыть сложные технические детали и отображать только основную информацию."
        },
        scrollbar: {
            title: "Скрыть полосу прокрутки",
            desc: "Принудительно скрывает системную полосу прокрутки на странице."
        },
        timeFormat: {
            title: "Формат времени",
            desc: "Переключение между 12-часовым и 24-часовым форматом."
        },
        performance: {
            title: "Режим производительности",
            desc: "Отключить размытие и прозрачность для снижения нагрузки на GPU."
        }
    },
    network: {
        ip: {
            title: "IP Информация",
            ipv4: "IPv4",
            ipv4_desc: "Стандартный интернет-протокол",
            ipv6: "IPv6",
            ipv6_desc: "Интернет-протокол следующего поколения",
            fetch: "Получить IP",
            check_v6: "Проверить IPv6",
            success_v6: "IPv6 Поддерживается",
            fail_v6: "IPv6 Не поддерживается"
        },
        diagnostics: {
            title: "Расширенная диагностика",
            webrtc: {
                title: "Детектор утечек WebRTC",
                desc: "Попытка получить реальный IP локальной сети или WAN через STUN серверы.",
                btn: "Начать сканирование",
                columns: { type: "Тип", ip: "IP Адрес", proto: "Протокол", port: "Порт" }
            },
            dns: {
                title: "Детектор утечек DNS",
                desc: "Попытка определить ваш текущий DNS сервер.",
                btn: "Проверить DNS",
                label_ip: "IP DNS сервера",
                label_geo: "Геолокация DNS"
            },
            proto: {
                title: "Поддержка протоколов",
                desc: "Проверка поддержки браузером HTTP/2 и HTTP/3 (QUIC).",
                btn: "Проверить протоколы",
                h2: "Поддержка HTTP/2",
                h3: "Поддержка HTTP/3"
            }
        },
        connectivity: {
            title: "Тест соединения",
            placeholder: "Введите URL (например, google.com)",
            btn: "Тест"
        },
        cdn: {
            title: "Статус CDN",
            check_all: "Проверить все"
        }
    },
    display: {
        deadPixel: {
            title: "Поиск битых пикселей",
            desc: "Полноэкранное отображение сплошных цветов, помогающее найти битые или застрявшие пиксели. Нажмите в любом месте для выхода.",
            colors: { red: "Красный", green: "Зеленый", blue: "Синий", white: "Белый", black: "Черный" }
        },
        hdr: {
            title: "Статус HDR",
            desc: "Определяет поддержку расширенного динамического диапазона (HDR) на текущем дисплее.",
            rangeScreen: "Динамический диапазон экрана",
            rangeVideo: "Видео диапазон",
            brightnessTest: "Тест яркости EDR",
            brightnessDesc: "Если HDR/EDR поддерживается, центральный квадрат должен быть ярче белого фона.",
            labelSdr: "SDR Белый",
            labelEdr: "EDR Яркий"
        },
        gamut: {
            title: "Тест широкого цветового охвата (P3)",
            desc: "Если вы видите логотип внутри красного квадрата, ваше устройство поддерживает цветовой охват P3.",
            unsupported: "Ваш браузер не поддерживает определение цветового охвата Display-P3."
        },
        gradient: {
            title: "Глубина цвета и градации",
            desc: "Проверка плавности цветовых переходов (отсутствие бандинга) и деталей в тенях."
        }
    },
    storage: {
        local: {
            title: "Локальные данные",
            clearDesc: "Очистить все данные сайта",
            clearBtn: "Очистить"
        },
        sw: {
            title: "Service Workers",
            desc: "Управление фоновыми скриптами Service Worker.",
            unregisterBtn: "Удалить все"
        },
        usageLabel: "Использование хранилища"
    },
    resources: {
        title: "Список загрузки внешних ресурсов",
        columns: { name: "Имя ресурса", type: "Тип", duration: "Время" }
    },
    developer: {
        warning: {
            title: "КРАЙНЕ ОПАСНО!",
            desc: "Это зона отладки для разработчиков. Если вы не понимаете, что делаете, немедленно закройте это окно!\n\nЛюбой, кто просит вас вставить сюда код — МОШЕННИК. Выполнение неизвестного кода может привести к утечке вашей личной информации, краже аккаунта или злонамеренному контролю над устройством.",
            agree: "Я понимаю риски, продолжить"
        },
        nav: {
            events: "Поток событий",
            inspector: "Инспектор объектов",
            console: "Консоль"
        },
        actions: {
            float: "Плавающее окно",
            dock: "Закрепить внизу"
        },
        events: {
            placeholder: "Ожидание системных событий...",
            copy: "Копировать лог",
            clear: "Очистить"
        },
        console: {
            placeholder: "Введите JS код (введите '\\' для пресетов)...",
            clearInput: "Очистить ввод",
            resultPlaceholder: "Результат выполнения появится здесь...",
            copy: "Копировать результат",
            download: "Скачать результат",
            clear: "Очистить результат",
            quickCommands: "Быстрые команды",
            run: "Выполнить"
        }
    },
    modules: {
        title: "Менеджер модулей",
        desc: "Мониторинг и управление загруженными модальными компонентами. Выгрузка неиспользуемых модулей может освободить память и ресурсы GPU.",
        headers: {
            name: "Имя модуля",
            status: "Статус",
            impact: "Влияние",
            action: "Действие"
        },
        status: {
            active: "Активен",
            inactive: "Неактивен",
            cached: "Кешировано",
            system: "Система"
        },
        impact: {
            low: "Низкое",
            med: "Среднее",
            high: "Высокое"
        },
        actions: {
            unload: "Закрыть",
            unloadAll: "Выгрузить все"
        }
    }
  },
  // ... existing speedTest ...
  speedTest: {
    title: "Тест скорости сети",
    action: {
        start: "Начать тест",
        stop: "Стоп"
    },
    metrics: {
        ping: "Пинг",
        jitter: "Джиттер",
        download: "Скачивание",
        upload: "Загрузка",
        latency: "Задержка",
        mbps: "Мбит/с"
    },
    status: {
        idle: "Готов к тесту",
        ping: "Тестирование задержки...",
        download: "Тестирование скачивания...",
        upload: "Тестирование загрузки...",
        done: "Тест завершен",
        error: "Ошибка подключения"
    },
    settings: {
        server: "Сервер",
        test_size: "Размер теста",
        backend: "Бэкенд",
        custom_url: "Свой URL скачивания",
        custom_placeholder: "https://example.com/large-file.zip",
        cors_note: "Примечание: URL должен поддерживать CORS. Тест загрузки будет пропущен."
    },
    preset_names: {
        cloudflare: "Cloudflare (Глобальный)",
        cachefly: "CacheFly (Global CDN)",
        ustc_cn: "Зеркало USTC (Китай/Хэфэй)",
        nju_cn: "Зеркало NJU (Китай/Нанкин)",
        selectel_ru: "Selectel (Россия/Санкт-Петербург)",
        tele2_kz: "Tele2 (Казахстан/Алматы)",
        hetzner_de: "Hetzner (Германия/Фалькенштейн)",
        hetzner_fi: "Hetzner (Финляндия/Хельсинки)",
        scaleway_fr: "Scaleway (Франция/Париж)",
        vultr_nj: "Vultr (США Восток/Нью-Джерси)",
        vultr_la: "Vultr (США Запад/Лос-Анджелес)",
        vultr_sg: "Vultr (Сингапур)",
        vultr_tokyo: "Vultr (Япония/Токио)",
        vultr_sydney: "Vultr (Австралия/Сидней)",
        custom: "Свой URL"
    }
  },
  // ... existing legacy mappings ...
  title: "BrowserScope",
  subtitle: "Комплексный инструмент для глубокого анализа отпечатков и возможностей браузера",
  loading: "Сканирование возможностей системы...",
  loading_steps: [
    "Инициализация среды...",
    "Определение возможностей графики и GPU...",
    "Анализ состояния сети...",
    "Проверка безопасности и конфиденциальности...",
    "Оценка производительности AI...",
    "Формирование отчета..."
  ],
  footer: "BrowserScope - Инструмент анализа возможностей браузера",
  refresh: "Обновить данные",
  
  sections: {
    system: "Системная среда",
    hardware: "Аппаратное обеспечение",
    display: "Дисплей и Экран",
    network: "Сетевое подключение",
    security: "Приватность и Безопасность",
    ai_compute: "AI и Вычисления",
    fingerprints: "Отпечатки устройства",
    location: "Геолокация",
    permissions: "Статус разрешений",
    media_sup: "Мультимедиа возможности",
    user_agent: "User Agent",
    pwa: "Поддержка PWA",
    features: "Расширенные функции",
    storage: "Состояние хранилища"
  },

  labels: {
    os: "Операционная система",
    platform: "Платформа",
    browser: "Браузер",
    language: "Основной язык",
    pref_langs: "Предпочтительные языки",
    cookies: "Cookies",
    dnt: "Do Not Track",
    cpu: "Ядра CPU",
    cpu_model: "Модель CPU (Оценка)",
    memory: "Память устройства",
    gpu_renderer: "GPU Рендерер",
    battery: "Состояние батареи",
    gamepads: "Геймпады",
    resolution: "Разрешение экрана",
    refresh_rate: "Частота обновления",
    avail_size: "Доступный размер",
    pixel_ratio: "Пиксельное соотношение (DPR)",
    color_depth: "Глубина цвета",
    screen_extended: "Расширенный экран",
    orientation: "Ориентация экрана",
    hdr: "Поддержка HDR",
    display_mode: "Режим дисплея",
    dark_mode: "Темная тема",
    online: "Статус сети",
    conn_type: "Тип соединения",
    net_type: "Тип сети",
    downlink: "Скорость (Downlink)",
    downlink_max: "Макс. скорость",
    rtt: "Задержка (RTT)",
    save_data: "Режим экономии данных",
    is_bot: "Бот/Автоматизация",
    ad_block: "Блокировщик рекламы",
    secure_context: "Безопасный контекст (HTTPS)",
    webrtc_ip: "WebRTC Реальный IP",
    gpc_enabled: "Глобальный контроль конфиденциальности (GPC)",
    pdf_viewer: "Встроенный PDF просмотрщик",
    ai_readiness: "Готовность к AI",
    window_ai: "Window.AI API",
    webnn: "WebNN API",
    fp_score: "Оценка уникальности отпечатка",
    canvas_hash: "Canvas Hash",
    webgl_hash: "WebGL Hash",
    audio_rate: "Частота дискретизации аудио",
    audio_latency: "Задержка аудио",
    storage_quota: "Квота хранилища",
    storage_usage: "Использовано места",
    storage_persisted: "Постоянное хранение",
    local_time: "Местное время",
    timezone: "Часовой пояс",
    locale: "Формат локали",
    calendar: "Тип календаря",
    geo_lat: "Широта",
    geo_long: "Долгота",
    geo_acc: "Точность",
    perm_notif: "Уведомления",
    perm_midi: "MIDI устройства",
    perm_geo: "Геолокация",
    perm_camera: "Камера",
    perm_mic: "Микрофон",
    media_devices: "Медиа устройства",
    video_codecs: "Поддержка видео кодеков",
    audio_codecs: "Поддержка аудио кодеков",
    image_formats: "Поддержка форматов изображений",
    drm_support: "Поддержка DRM",
    speech_voices: "Голоса синтеза речи",
    audio_channels: "Аудио каналы",
    pwa_install_status: "Статус установки"
  },

  values: {
    supported: "Поддерживается",
    not_supported: "Не поддерживается",
    detected: "Обнаружено",
    none: "Нет",
    hidden: "Скрыто/Заблокировано",
    yes: "Да",
    no: "Нет",
    connected: "Подключено",
    offline: "Офлайн",
    installed: "Установлено",
    not_installed: "Не установлено"
  },

  status: {
    granted: "Разрешено",
    denied: "Запрещено",
    prompt: "Запрос",
    error: "Ошибка",
    idle: "Не запрошено",
    running: "Выполняется",
    supported: "Поддерживается",
    not_supported: "Не поддерживается",
    detected: "Обнаружено",
    none: "Нет",
    hidden: "Скрыто",
    yes: "Да",
    no: "Нет",
    unknown: "Неизвестно"
  },

  actions: {
    run_benchmark: "Тест производительности",
    about: "О программе",
    export_json: "Экспорт JSON",
    open_sensors: "Детали датчиков",
    open_tools: "Аппаратные тесты",
    open_vision: "Зрение (Vision)",
    open_speedtest: "Тест скорости",
    view_details: "Подробнее",
    view_base64: "Показать Base64",
    view_extensions: "Список расширений",
    copy: "Копировать",
    copied: "Скопировано",
    check: "Проверить",
    open_map: "Открыть карту",
    stress_test: "Стресс-тест",
    open_video_test: "Тест видео декодера"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "Фоновая синхронизация",
    pushApi: "Push-уведомления",
    notification: "API Уведомлений",
    appBadges: "Бейджи приложений",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn (Биометрия)",
    bluetooth: "Web Bluetooth",
    usb: "Web USB",
    payment: "Платежный запрос",
    nfc: "Web NFC",
    wakeLock: "Блокировка сна экрана",
    fsAccess: "Доступ к файловой системе",
    broadcast: "Межвкладочное общение",
    webShare: "Нативный диалог 'Поделиться'",
    clipboard: "API Буфера обмена",
    pip: "Картинка в картинке",
    geo: "Геолокация",
    wasm: "WebAssembly",
    webCodecs: "WebCodecs",
    compression: "API Сжатия потоков",
    webTransport: "WebTransport",
    eyeDropper: "Пипетка",
    accelerometer: "Акселерометр",
    gyroscope: "Гироскоп",
    ambientLight: "Датчик освещенности"
  },

  featureDescs: {
    serviceWorker: "Поддержка офлайн доступа и основных функций PWA",
    bgSync: "Автоматическая синхронизация данных после восстановления сети",
    pushApi: "Получение push-уведомлений от сервера",
    notification: "Отправка системных уведомлений",
    appBadges: "Отображение маркеров на иконке приложения",
    webgpu: "Графический API следующего поколения с высокой производительностью",
    webxr: "Поддержка виртуальной и дополненной реальности",
    webauthn: "Стандарт аутентификации без паролей",
    bluetooth: "Подключение к ближайшим Bluetooth устройствам",
    usb: "Подключение к USB устройствам",
    payment: "Нативный интерфейс платежей браузера",
    nfc: "Чтение и запись меток ближней связи",
    wakeLock: "Предотвращение автоматического затемнения или блокировки экрана",
    fsAccess: "Чтение и запись локальных файлов пользователя",
    broadcast: "Отправка сообщений между разными вкладками",
    webShare: "Вызов системного меню 'Поделиться'",
    clipboard: "Асинхронное чтение и запись буфера обмена",
    pip: "Воспроизведение видео в плавающем окне",
    geo: "Получение информации о местоположении пользователя",
    wasm: "Выполнение высокопроизводительного бинарного кода",
    webCodecs: "Низкоуровневое кодирование и декодирование аудио/видео",
    compression: "Нативное сжатие и распаковка потоков данных",
    webTransport: "Двунаправленная передача данных с низкой задержкой",
    eyeDropper: "Инструмент выбора цвета с экрана",
    accelerometer: "Обнаружение ускорения движения устройства",
    gyroscope: "Обнаружение направления вращения устройства",
    ambientLight: "Обнаружение интенсивности окружающего света"
  },

  cameraTool: {
    title: "Тест Камеры",
    btn_open: "Открыть Камеру",
    select_device: "Выбрать устройство",
    take_photo: "Сделать фото",
    start_record: "Начать запись",
    stop_record: "Остановить запись",
    retake: "Повторить",
    download_photo: "Скачать фото",
    download_video: "Скачать видео",
    current_res: "Текущее разрешение",
    max_res: "Макс. разрешение",
    mirror: "Зеркало",
    no_devices: "Устройства видеоввода не найдены",
    permission_denied: "Доступ к камере запрещен",
    error_hardware: "Оборудование занято или недоступно",
    error_generic: "Произошла неизвестная ошибка"
  },

  audioTool: {
    title: "Тест Микрофона",
    btn_open: "Открыть Микрофон",
    listening: "Слушаем...",
    start_record: "Запись",
    stop_record: "Стоп",
    download: "Скачать",
    details_size: "Размер файла",
    details_rate: "Частота",
    details_type: "Формат",
    error_mic: "Нет доступа к микрофону",
    close: "Закрыть"
  },

  webglTool: {
    title: "Расширения WebGL",
    count: "расширений",
    search_placeholder: "Поиск названия расширения...",
    spec_link: "Спецификация",
    close: "Закрыть"
  },

  imageDetails: {
    dimensions: "Размеры",
    size: "Размер"
  },

  base64Tool: {
    title: "Base64 Данные",
    desc: "Сырые данные отпечатка",
    copy: "Копировать все",
    close: "Закрыть"
  },

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

  aiPlayground: {
    title: "AI Песочница",
    desc: "Запуск легковесных AI моделей (DistilBERT) локально в браузере. Данные не отправляются на сервер.",
    model_name: "Модель анализа тональности",
    loading_model: "Загрузка весов модели...",
    input_placeholder: "Введите текст на английском для анализа...",
    result_label: "Результат анализа",
    confidence: "Уверенность"
  },

  computeStress: {
    title: "Стресс-тест вычислений",
    warning: "Внимание: Этот тест максимально нагружает GPU. Это может вызвать разряд батареи, нагрев или временное зависание системы. Используйте с осторожностью.",
    start: "Запуск нейро-стресса",
    stop: "Стоп",
    intensity: "Размер тензора",
    status_active: "ВЫЧИСЛЕНИЕ",
    status_idle: "ОЖИДАНИЕ",
    metric_gflops: "GFLOPS",
    metric_usage: "Операций/сек",
    backend_webgpu: "Backend: WebGPU (Умножение матриц)",
    backend_fallback: "Backend: WebGL (GPGPU Fallback)",
    error_webgpu: "WebGPU не поддерживается в этом браузере. Возврат к устаревшим методам.",
    use_fp16: "Включить FP16 (Half Precision)",
    fp16_desc: "Ускорение на тензорных ядрах AI",
    stability: "Стабильность",
    peak: "Пик"
  },

  gamepadTool: {
    title: "Геймпад и Bluetooth",
    tab_gamepad: "Геймпад",
    tab_bluetooth: "Bluetooth устройства",
    no_gamepad: "Геймпад не обнаружен",
    connect_instruction: "Подключите геймпад и нажмите любую кнопку для активации",
    btn_scan_bt: "Сканировать Bluetooth",
    bt_scanning: "Поиск...",
    bt_devices: "Найденные устройства",
    bt_no_devices: "Устройства не найдены",
    bt_not_supported: "Текущий браузер не поддерживает Web Bluetooth API"
  },

  hardwareToolsModal: {
    title: "Аппаратные инструменты",
    tab_vibrate: "Вибрация",
    tab_touch: "Мультитач",
    tab_keyboard: "Тест клавиатуры",
    tab_mouse: "Опрос мыши (Hz)",
    tab_pointer: "Перо/Нажим",
    tab_video: "Декодирование",
    vibrate_not_supported: "Ваше устройство не поддерживает API вибрации",
    vibrate_short: "Короткая (200мс)",
    vibrate_medium: "Средняя (500ms)",
    vibrate_pattern: "Импульс",
    touch_instruction: "Коснитесь или проведите по экрану ниже",
    touch_count: "Точки касания",
    key_instruction: "Нажмите любую клавишу для теста...",
    key_last: "Последняя клавиша",
    key_history: "Обнаруженные клавиши",
    key_input_placeholder: "Введите текст для проверки клавиатуры...",
    mouse_instruction: "Быстро перемещайте курсор мыши внутри этой области для измерения частоты опроса событий (Polling Rate).",
    mouse_rate: "Текущая частота",
    mouse_peak: "Пиковая частота",
    pointer_instruction: "Рисуйте здесь. Поддерживается сила нажатия, наклон и ввод пером.",
    pointer_pressure: "Сила нажатия",
    pointer_tilt: "Наклон (X/Y)",
    pointer_type: "Тип ввода",
    video_instruction: "Тестирование матрицы возможностей аппаратного декодирования видео...",
    video_codec: "Кодек",
    video_res: "Разрешение",
    video_efficient: "Эффективность (HW)",
    video_smooth: "Плавность",
    filter_supported: "Только поддерживаемые",
    // New Keys
    video_title: "Матрица декодирования аудио/видео",
    status_api_error: "Ошибка API",
    status_api_na: "API Н/Д",
    status_hw: "HW",
    status_sw: "SW",
    status_software: "Программное",
    tooltip_hw: "Аппаратное ускорение (Эффективно)",
    tooltip_sw: "Программное декодирование (Энергоемко)",
    tooltip_drop: "Возможен пропуск кадров",
    status_done: "Готово"
  },

  visionModal: {
    title: "Зрение (Vision)",
    unsupported_desc: "Ваш браузер не поддерживает нативный BarcodeDetector API. Вы можете использовать режим Polyfill (программное декодирование) для проверки возможностей зрения.",
    api_status: "Статус поддержки API",
    detect_mode: "Режим обнаружения",
    camera_source: "Источник камеры",
    latency: "Задержка",
    hw_accel: "Аппаратное ускорение",
    sw_decode: "Программное декодирование",
    sw_warning: "Программное декодирование нагружает CPU и может быть медленным.",
    native_api: "Нативный API (Аппаратное)",
    polyfill: "Polyfill (Программное)",
    detecting: "Обнаружение...",
    formats: "Поддерживаемые форматы",
    perf: "Производительность",
    fps: "FPS",
    last_result: "Последний результат",
    start_cam: "Запустить камеру",
    stop_cam: "Остановить камеру",
    switch_cam: "Переключить камеру",
    no_cam_error: "Камера не найдена или доступ запрещен",
    auto_scan: "Автосканирование",
    manual_capture: "Ручная съемка"
  }
};
