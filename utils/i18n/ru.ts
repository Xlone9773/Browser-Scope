import { Translation } from './types';

export const ru: Translation = {
  loading: "Сканирование возможностей системы...",
  title: "BrowserScope",
  subtitle: "Детальный анализ окружения браузера, аппаратных возможностей и поддерживаемых Web API.",
  refresh: "Обновить",
  footer: "Данные определяются локально в вашем браузере. Личная информация не сохраняется.",
  
  sections: {
    system: "Система и ПО",
    hardware: "Оборудование и Графика",
    display: "Дисплей и Экран",
    network: "Сеть и Подключение",
    storage_loc: "Хранилище и Локализация",
    media_sup: "Мультимедиа",
    user_agent: "User Agent",
    fingerprints: "Цифровой отпечаток",
    features: "Возможности Web API",
    pwa: "PWA и Оффлайн",
    permissions: "Разрешения"
  },
  
  labels: {
    os: "Операционная система",
    platform: "Платформа",
    browser: "Браузер",
    language: "Язык",
    pref_langs: "Список языков",
    cookies: "Cookies включены",
    dnt: "Do Not Track",
    
    cpu: "Ядра ЦП",
    memory: "Память устройства",
    gpu_vendor: "Производитель GPU",
    gpu_renderer: "Рендерер GPU",
    max_texture: "Макс. размер текстуры",
    audio_rate: "Частота дискретизации аудио",
    battery: "Уровень заряда",
    charging: "Зарядка",
    touch: "Точки касания",
    canvas_hash: "Canvas Hash",
    webgl_hash: "WebGL Hash",
    audio_latency: "Задержка аудио",
    fp_score: "Оценка уникальности",
    
    resolution: "Разрешение экрана",
    refresh_rate: "Частота обновления (Гц)",
    avail_size: "Доступный размер",
    window_size: "Размер окна",
    pixel_ratio: "Плотность пикселей (DPR)",
    color_depth: "Глубина цвета",
    orientation: "Ориентация",
    dark_mode: "Темная тема",
    color_gamut: "Цветовой охват",
    hdr: "Поддержка HDR",
    display_mode: "Режим отображения",
    
    online: "Статус сети",
    conn_type: "Тип подключения",
    downlink: "Скорость скачивания",
    rtt: "Задержка (RTT)",
    save_data: "Экономия трафика",
    
    timezone: "Часовой пояс",
    locale: "Локаль",
    calendar: "Календарь",
    storage_quota: "Квота хранилища",
    storage_usage: "Использовано",
    storage_persisted: "Постоянное хранилище",
    
    video_codecs: "Видеокодеки",
    audio_codecs: "Аудиокодеки",

    media_devices: "Медиа устройства",
    perm_camera: "Камера",
    perm_mic: "Микрофон",
    perm_geo: "Геолокация",
    perm_notif: "Уведомления",
    perm_midi: "MIDI устройства",

    geo_lat: "Широта",
    geo_long: "Долгота",
    geo_acc: "Точность (м)"
  },
  
  values: {
    connected: "Подключено",
    offline: "Оффлайн",
    supported: "Поддерживается",
    not_supported: "Не поддерживается",
    yes: "Да",
    no: "Нет",
    unknown: "Неизвестно"
  },

  actions: {
    check: "Проверить",
    export_json: "Экспорт JSON",
    view_extensions: "Список расширений",
    view_base64: "Base64",
    view_details: "Подробнее",
    open_sensors: "Открыть датчики",
    copy: "Копировать",
    copied: "Скопировано",
    zoom: "Увеличить",
    theme_dark: "Темная",
    theme_light: "Светлая",
    about: "О приложении"
  },

  status: {
    idle: "Не проверено",
    granted: "Разрешено",
    denied: "Запрещено",
    prompt: "Спросить",
    error: "Ошибка"
  },

  cameraTool: {
    title: "Инструмент Камеры",
    btn_open: "Открыть камеру",
    select_device: "Выбрать устройство",
    no_devices: "Видеоустройства не найдены",
    take_photo: "Сделать фото",
    start_record: "Запись видео",
    stop_record: "Стоп",
    mirror: "Зеркало",
    retake: "Переснять",
    download_photo: "Скачать фото",
    download_video: "Скачать видео",
    close: "Закрыть",
    current_res: "Текущее разрешение",
    max_res: "Макс. разрешение (WebRTC)",
    permission_denied: "Доступ к камере запрещен",
    error_hardware: "Камера используется или ошибка оборудования",
    error_generic: "Ошибка доступа к камере"
  },

  audioTool: {
    title: "Аудиорекордер",
    btn_open: "Открыть рекордер",
    start_record: "Запись звука",
    stop_record: "Остановить запись",
    download: "Скачать аудио",
    close: "Закрыть",
    listening: "Слушаю...",
    error_mic: "Доступ к микрофону запрещен или ошибка",
    details_size: "Размер",
    details_rate: "Частота",
    details_type: "Формат"
  },

  webglTool: {
    title: "Расширения WebGL",
    count: "Расширения",
    search_placeholder: "Поиск...",
    close: "Закрыть"
  },

  base64Tool: {
    title: "Base64 Данные Canvas",
    desc: "Сырые данные отпечатка Canvas.",
    copy: "Копировать Base64",
    close: "Закрыть"
  },

  aboutModal: {
    title: "О BrowserScope",
    version: "Версия",
    desc: "Легкий, ориентированный на конфиденциальность инструмент для быстрой проверки возможностей браузера, оборудования и состояния сети.",
    changelog: "Список изменений",
    latest_update: "Добавлено обнаружение частоты обновления, статус постоянного хранилища и API датчиков.",
    close: "Закрыть"
  },

  sensorModal: {
    sensor_title: "Данные датчиков в реальном времени",
    accelerometer: "Акселерометр",
    gyroscope: "Гироскоп",
    sensor_permission_desc: "Для этой функции требуется доступ к датчикам движения устройства. Пожалуйста, разрешите доступ для продолжения.",
    sensor_allow: "Разрешить доступ",
    close: "Закрыть"
  },

  scoreModal: {
    score_details_title: "Детали оценки отпечатка",
    tracking_potential: "Риск отслеживания",
    score_explanation: "Более высокий балл означает, что сайтам доступно больше уникальных идентификационных данных, что повышает риск отслеживания.",
    contributing_factors: "Влияющие факторы",
    close: "Закрыть"
  },

  imageDetails: {
    dimensions: "Размеры",
    size: "Размер файла"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "Фоновая синхронизация",
    pushApi: "Push API",
    notification: "Уведомления",
    appBadges: "Бейджи приложений",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn",
    bluetooth: "Web Bluetooth",
    usb: "Web USB",
    payment: "Payment Request",
    nfc: "Web NFC",
    wakeLock: "Блокировка экрана",
    fsAccess: "Доступ к файловой системе",
    broadcast: "Broadcast Channel",
    webShare: "Web Share API",
    clipboard: "Буфер обмена",
    pip: "Картинка в картинке",
    geo: "Геолокация",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs",
    compression: "Сжатие потоков",
    webTransport: "Web Transport",
    eyeDropper: "Пипетка (EyeDropper)",
    accelerometer: "Акселерометр",
    gyroscope: "Гироскоп",
    ambientLight: "Датчик освещенности",
  },
  
  featureDescs: {
    serviceWorker: "Оффлайн режим и PWA",
    bgSync: "Синхронизация при появлении сети",
    pushApi: "Получение push-уведомлений",
    notification: "Системные уведомления",
    appBadges: "Метки на иконке приложения",
    webgpu: "Графический API нового поколения",
    webxr: "Виртуальная и дополненная реальность",
    webauthn: "Беспарольная аутентификация",
    bluetooth: "Подключение к Bluetooth устройствам",
    usb: "Подключение к USB устройствам",
    payment: "Нативная обработка платежей",
    nfc: "Ближняя бесконтактная связь",
    wakeLock: "Предотвращение затемнения экрана",
    fsAccess: "Чтение/запись локальных файлов",
    broadcast: "Обмен данными между вкладками",
    webShare: "Нативный диалог 'Поделиться'",
    clipboard: "Асинхронный доступ к буферу обмена",
    pip: "Плавающее окно видео",
    geo: "Доступ к местоположению пользователя",
    wasm: "Высокопроизводительный бинарный код",
    webCodecs: "Низкоуровневая обработка медиа",
    compression: "Нативное сжатие GZIP/Deflate",
    webTransport: "Двунаправленная потоковая передача",
    eyeDropper: "Системный выбор цвета",
    accelerometer: "Датчик движения (Поддержка API)",
    gyroscope: "Датчик ориентации (Поддержка API)",
    ambientLight: "Датчик уровня света (Поддержка API)",
  }
};