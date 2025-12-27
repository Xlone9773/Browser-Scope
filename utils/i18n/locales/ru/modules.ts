
export const modules = {
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

  base64Tool: {
    title: "Base64 Данные",
    desc: "Сырые данные отпечатка",
    copy: "Копировать все",
    close: "Закрыть"
  },

  imageDetails: {
    dimensions: "Размеры",
    size: "Размер"
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
  },

  midiModal: {
    title: "Web MIDI Студия",
    no_inputs: "MIDI устройства ввода не найдены. Подключите устройство.",
    inputs: "Устройства ввода",
    outputs: "Устройства вывода",
    log: "Лог сигналов",
    clear: "Очистить",
    octave: "Октава",
    waveform: "Волна",
    sine: "Синус",
    square: "Квадрат",
    sawtooth: "Пила",
    triangle: "Треугольник",
    velocity: "Вел",
    note: "Нота"
  }
};
