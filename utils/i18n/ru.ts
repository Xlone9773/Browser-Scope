
import { Translation } from './types';
import { en } from './en';

export const ru: Translation = {
  ...en, // Fallback to EN

  loading: "Сканирование возможностей системы...",
  title: "BrowserScope",
  subtitle: "Подробный анализ среды вашего браузера, аппаратных возможностей и поддерживаемых веб-API.",
  refresh: "Обновить анализ",
  footer: "Данные определяются локально в вашем браузере. Личные данные не сохраняются.",
  
  sections: {
    system: "Система и ПО",
    hardware: "Оборудование и Графика",
    display: "Дисплей и Экран",
    network: "Сеть и Соединение",
    storage_loc: "Память и Локализация",
    media_sup: "Медиа возможности",
    user_agent: "User Agent",
    features: "Веб-API",
    permissions: "Разрешения",
    pwa: "PWA Функции",
    fingerprints: "Отпечатки и Отслеживание",
    security: "Конфиденциальность и Безопасность"
  },
  
  labels: {
    ...en.labels,
    os: "Операционная система",
    platform: "Платформа",
    browser: "Браузер",
    language: "Язык",
    pref_langs: "Предпочитаемые языки",
    cookies: "Cookies включены",
    dnt: "Do Not Track",
    
    cpu: "Ядра CPU",
    memory: "Память устройства",
    gpu_vendor: "Поставщик GPU",
    gpu_renderer: "Рендерер GPU",
    max_texture: "Макс. размер текстуры",
    audio_rate: "Частота дискретизации аудио",
    audio_latency: "Задержка аудио",
    battery: "Уровень заряда",
    charging: "Зарядка",
    touch: "Точки касания",
    
    resolution: "Разрешение экрана",
    refresh_rate: "Частота обновления",
    avail_size: "Доступный размер",
    window_size: "Размер окна",
    pixel_ratio: "Плотность пикселей",
    color_depth: "Глубина цвета",
    orientation: "Ориентация",
    dark_mode: "Темная тема",
    color_gamut: "Цветовой охват",
    hdr: "Поддержка HDR",
    display_mode: "Режим дисплея",
    
    online: "Статус сети",
    conn_type: "Тип соединения",
    downlink: "Скорость загрузки",
    rtt: "Задержка (RTT)",
    save_data: "Экономия трафика",
    
    timezone: "Часовой пояс",
    locale: "Локаль",
    calendar: "Календарь",
    storage_quota: "Квота хранилища",
    storage_usage: "Использовано",
    storage_persisted: "Постоянное хранилище",
    
    video_codecs: "Видео кодеки",
    audio_codecs: "Аудио кодеки",

    camera_permission: "Доступ к камере",

    fp_score: "Оценка отпечатка",
    canvas_hash: "Canvas Хэш",
    webgl_hash: "WebGL Хэш",

    perm_notif: "Уведомления",
    perm_midi: "MIDI доступ",
    perm_geo: "Геолокация",
    geo_lat: "Широта",
    geo_long: "Долгота",
    geo_acc: "Точность",
    media_devices: "Медиа устройства",
    perm_camera: "Камера",
    perm_mic: "Микрофон"
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
    theme_light: "Светлая тема",
    theme_dark: "Темная тема",
    about: "О программе",
    export_json: "Экспорт JSON",
    open_sensors: "Датчики",
    view_details: "Подробнее",
    view_base64: "См. Base64",
    view_extensions: "Расширения",
    copy: "Копировать",
    copied: "Скопировано!"
  },

  status: {
    idle: "Не проверено",
    granted: "Разрешено",
    denied: "Запрещено",
    prompt: "Запрос",
    error: "Ошибка"
  },

  features: {
    serviceWorker: "Service Worker",
    bgSync: "Фоновая синхронизация",
    pushApi: "Push API",
    notification: "API Уведомлений",
    appBadges: "Бейджи приложения",
    webgpu: "WebGPU",
    webxr: "WebXR (VR/AR)",
    webauthn: "WebAuthn",
    bluetooth: "Web Bluetooth",
    usb: "Web USB",
    payment: "Payment Request",
    nfc: "Web NFC",
    wakeLock: "Блокировка экрана (Wake Lock)",
    fsAccess: "Доступ к файловой системе",
    broadcast: "Broadcast Channel",
    webShare: "Web Share API",
    clipboard: "Буфер обмена",
    pip: "Картинка в картинке",
    geo: "Геолокация",
    wasm: "Web Assembly",
    webCodecs: "Web Codecs",
    compression: "Потоки сжатия",
    webTransport: "Web Transport",
    eyeDropper: "Пипетка (EyeDropper)",
    accelerometer: "Акселерометр",
    gyroscope: "Гироскоп",
    ambientLight: "Датчик освещенности"
  },
  
  featureDescs: {
    serviceWorker: "Оффлайн возможности и PWA",
    bgSync: "Отложенные действия при появлении сети",
    pushApi: "Получение пуш-уведомлений",
    notification: "Системные уведомления",
    appBadges: "Установка бейджей на иконку",
    webgpu: "Графический API следующего поколения",
    webxr: "Возможности VR и AR",
    webauthn: "Беспарольная аутентификация",
    bluetooth: "Подключение к Bluetooth устройствам",
    usb: "Подключение к USB устройствам",
    payment: "Нативная обработка платежей",
    nfc: "Ближняя бесконтактная связь",
    wakeLock: "Предотвращение затемнения экрана",
    fsAccess: "Чтение/запись локальных файлов",
    broadcast: "Обмен данными между вкладками",
    webShare: "Нативный диалог 'Поделиться'",
    clipboard: "Асинхронный доступ к буферу",
    pip: "Плавающее видео окно",
    geo: "Доступ к местоположению пользователя",
    wasm: "Высокопроизводительный бинарный код",
    webCodecs: "Низкоуровневая обработка медиа",
    compression: "Нативное сжатие GZIP/Deflate",
    webTransport: "Двунаправленная потоковая передача",
    eyeDropper: "Системный выбор цвета",
    accelerometer: "Датчик движения",
    gyroscope: "Датчик ориентации",
    ambientLight: "Датчик уровня света"
  },

  cameraTool: {
    title: "Камера",
    btn_open: "Открыть камеру",
    no_devices: "Камеры не найдены",
    permission_denied: "Доступ к камере запрещен",
    error_hardware: "Ошибка оборудования камеры",
    error_generic: "Ошибка доступа к камере",
    error_mic: "Ошибка микрофона",
    select_device: "Выбор устройства",
    current_res: "Текущее разр.",
    max_res: "Макс. разр.",
    mirror: "Зеркало",
    take_photo: "Сделать фото",
    start_record: "Запись",
    stop_record: "Стоп",
    retake: "Переснять",
    download_photo: "Скачать фото",
    download_video: "Скачать видео"
  },

  audioTool: {
    title: "Диктофон",
    btn_open: "Открыть диктофон",
    listening: "Слушаю...",
    start_record: "Старт",
    stop_record: "Стоп",
    download: "Скачать",
    details_size: "Размер",
    details_rate: "Частота",
    details_type: "Формат",
    close: "Закрыть",
    error_mic: "Ошибка доступа к микрофону"
  },

  webglTool: {
    title: "Расширения WebGL",
    count: "поддерживаемых расширений",
    search_placeholder: "Поиск расширений...",
    close: "Закрыть"
  },

  base64Tool: {
    title: "Данные Base64",
    desc: "Сырые данные сгенерированного изображения отпечатка",
    copy: "Копировать в буфер",
    close: "Закрыть"
  },

  imageDetails: {
    dimensions: "Размеры",
    size: "Объем"
  },

  aboutModal: {
    title: "О BrowserScope",
    desc: "BrowserScope — это комплексный инструмент анализа браузера, предназначенный для проверки возможностей вашей системы и уникальности цифрового отпечатка.",
    version: "Версия",
    changelog: "История изменений",
    latest_update: "Добавлено определение возможностей камеры и аудио, подробный просмотр расширений WebGL и диагностика датчиков.",
    close: "Закрыть"
  },

  sensorModal: {
    sensor_title: "Датчики устройства",
    sensor_permission_desc: "Требуется разрешение для доступа к датчикам движения.",
    sensor_allow: "Разрешить доступ",
    accelerometer: "Акселерометр",
    gyroscope: "Гироскоп",
    close: "Закрыть"
  },

  scoreModal: {
    score_details_title: "Детали оценки отпечатка",
    tracking_potential: "Риск отслеживания",
    score_explanation: "Более высокий балл означает, что сайтам доступно больше уникальных идентификационных данных, что повышает риск отслеживания.",
    contributing_factors: "Влияющие факторы",
    close: "Закрыть",

    factors: {
      canvas_hash: "Canvas отпечаток",
      webgl_hash: "WebGL отпечаток",
      hardware_concurrency: "Аппаратные данные (CPU/RAM)",
      user_agent: "User Agent",
      resolution: "Разрешение экрана",
      audio_context: "Аудио контекст",
      battery_status: "Статус батареи",
      locale_time: "Локаль и время"
    },
    values: {
      val_unique: "Уникальный",
      val_generic: "Общий",
      val_specific: "Специфичный",
      val_readable: "Доступно",
      val_protected: "Защищено",
      val_unknown: "Неизвестно"
    },
    descriptions: {
      desc_canvas_unique: "Различия в рендеринге Canvas раскрывают стек GPU/драйверов.",
      desc_canvas_generic: "Отпечаток Canvas не удался или заблокирован.",
      desc_webgl_unique: "Отчет WebGL раскрывает конкретное графическое оборудование.",
      desc_webgl_generic: "Отпечаток WebGL не удался или заблокирован.",
      desc_hardware_unique: "Количество ядер CPU и память устройства являются идентифицирующими факторами.",
      desc_hardware_generic: "Детали оборудования частично скрыты.",
      desc_ua_unique: "Подробная строка User Agent раскрывает версию браузера и ОС.",
      desc_res_unique: "Размеры экрана в сочетании с размером окна создают уникальный след.",
      desc_audio_unique: "Частота дискретизации и задержка аудиооборудования.",
      desc_battery_unique: "API батареи позволяет отслеживать пользователей между сессиями.",
      desc_battery_generic: "Статус батареи скрыт или не поддерживается.",
      desc_locale_unique: "Настройки часового пояса и языка сужают местоположение."
    }
  }
};