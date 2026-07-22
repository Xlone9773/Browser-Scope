
export const settings = {
  settings: {
    title: "Настройки",
    nav: {
        general: "Общие",
        appearance: "Внешний вид",
        network: "Сетевые утилиты",
        display: "Экран",
        storage: "Хранилище",
        resources: "Сетевые запросы",
        developer: "Разработчик",
        modules: "Модули",
        versions: "Версии и обновления"
    },
    general: {
        fontSettings: {
            title: "Настройка шрифтов",
            desc: "Настройте шрифты для основного содержимого и заголовков модальных окон.",
            bodyFont: "Шрифт основного текста",
            bodyFontDesc: "Изменяет шрифт для текста отчетов, таблиц и основного интерфейса.",
            modalTitleFont: "Шрифт заголовка модального окна",
            modalTitleFontDesc: "Изменяет шрифт для всех диалогов и заголовков модальных окон.",
            codeFont: "Моноширинный шрифт/Шрифт кода",
            codeFontDesc: "Изменяет моноширинный шрифт для блоков кода, терминалов и переменных.",
            defaultFont: "Системный по умолчанию (Inter)",
            defaultCodeFont: "Системный моноширинный по умолчанию",
            mismatchError: "Выбранный шрифт не поддерживает ваш текущий язык интерфейса ({lang}). Смена заблокирована.",
            mismatchTitle: "Шрифт не поддерживает язык",
            fontNames: {
                googlesansflex: "Google Sans Flex",
                notosans: "Noto Sans",
                roboto: "Roboto Regular",
                harmonyossanssc: "HarmonyOS Sans SC",
                misans: "MiSans",
                smileysans: "Smiley Sans Oblique (得意黑)",
                zcoolxiaowei: "ZCOOL XiaoWei",
                sawarabigothic: "Sawarabi Gothic",
                notosanssc: "Noto Sans SC",
                notosanstc: "Noto Sans TC",
                notosansjp: "Noto Sans JP",
                jetbrainsmono: "JetBrains Mono",
                firacode: "Fira Code",
                robotomono: "Roboto Mono",
                sourcecodepro: "Source Code Pro",
                geist: "Geist"
            }
        },
        showTabs: {
            title: "Показать вкладки навигации",
            desc: "Отображать вкладки над содержимым для фильтрации элементов. Автоматически скрывается, если пусто."
        },
        showSearch: {
        
        
            title: "Включить строку поиска",
        
        
            desc: "Отображать строку поиска над панелью вкладок для быстрой фильтрации категорий панели инструментов и содержимого карт."
        
        
        },
        
        
        
        searchScope: {
            title: "Область поиска",
            desc: "Выберите, где должен осуществляться поиск ключевых слов.",
            options: {
                all: "Везде",
                category: "Категория",
                title: "Заголовок",
                value: "Значение"
            }
        },
        searchMode: {
            title: "Режим поиска",
            desc: "Выберите между нечетким и точным совпадением.",
            options: {
                fuzzy: "Нечеткий",
                exact: "Точный"
            }
        },simpleMode: {
            title: "Упрощенный режим",
            desc: "Скрыть сложные технические детали и отображать только основную информацию."
        },
        scrollbar: {
            title: "Скрыть полосу прокрутки (Главная)",
            desc: "Скрывает полосу прокрутки только на главной странице."
        },
        globalScrollbar: {
            title: "Скрыть все полосы прокрутки",
            desc: "Глобально скрывает все полосы прокрутки, включая модальные окна."
        },
        themeColor: {
            title: "Цвет темы",
            desc: "Выберите основной цвет темы для приложения."
        },
        animationStyle: {
            title: "Стиль анимации",
            desc: "Выберите стиль анимации появления элементов UI.",
            options: {
                slideUp: "Скольжение вверх",
                fade: "Появление",
                flyIn: "Вылет",
                zoom: "Увеличение"
            }
        },
        timeFormat: {
            title: "Формат времени",
            desc: "Переключение между 12-часовым и 24-часовым форматом."
        },
        performance: {
            title: "Отключить размытие",
            desc: "Отключает эффекты размытия и прозрачности для повышения плавности UI."
        },
        animations: {
            title: "Отключить анимацию",
            desc: "Выключить все переходы страниц и анимацию загрузки."
        },
        fastAnimations: {
            title: "Быстрые переходы",
            desc: "Ускорение всех переходов (наведение, развертывание и т.д.)."
        },
        collapseHeader: {
            title: "Свернуть заголовок",
            desc: "Использовать свернутое меню для действий в заголовке на ПК."
        },
        cardVisibility: {
            title: "Настройка отображения",
            desc: "Скройте определенные карточки или группы, если они вам не нужны."
        },
        
        restoreNotifications: {
            title: "Восстановить уведомления",
            desc: "Вернуть все ранее закрытые карточки уведомлений в верхней части панели управления.",
            button: "Восстановить все",
            empty: "Нет закрытых уведомлений"
        },
        quickSummaryVisibility: {
            title: "Краткая сводка",
            desc: "Вернуть виджет краткой сводки в верхней части панели, содержащий показатели безопасности.",
            restoreBtn: "Восстановить",
            activeState: "Отображается"
        },udpBypass: {
            title: "Включить UDP Proxy (Обход CORS)",
            desc: "Использование API сопоставления UDP для запроса сетевых инструментов с полным обходом любых CORS-блокировок.",
            unsupportedEnv: "Не поддерживается в текущей среде выполнения",
            checkingUdp: "Проверка поддержки UDP...",
            recheckUdp: "Перепроверить",
            limitationsTitle: "Ограничения",
            limitationsList: [
                "Задержка прокси-сервера: все запросы маршрутизируются через промежуточные узлы, что увеличивает задержку.",
                "Скрытие реального IP: конечные узлы видят IP-адрес облачного прокси, а не ваш реальный домашний или офисный IP.",
                "Географическое несовпадение: зависит от физического расположения прокси-сервера, возможны региональные погрешности.",
                "Ограничение частоты: частые сетевые сканирования могут активировать защиту от спама и ограничение трафика на прокси-узлах."
            ],
            pros: "Не требует настройки, работает мгновенно в поддерживаемых виртуальных средах.",
            cons: "Более высокая задержка, маскирует реальный IP, зависит от сервера, возможны ограничения частоты.",
            prosLabel: "Преимущества",
            consLabel: "Недостатки"
        },
        userscriptBypass: {
            title: "Обход CORS через Tampermonkey (Локальное подключение)",
            desc: "Выполняйте сетевую диагностику и определение TLS-отпечатков непосредственно из вашего реального браузера, полностью обходя ограничения CORS. Требует установки нашего скрипта для Tampermonkey. Безопасно, быстро и без посредников.",
            recommended: "Рекомендуется",
            statusActive: "Скрипт активен и подключен",
            statusInactive: "Скрипт не обнаружен или не установлен",
            installGuide: "Руководство по установке",
            copyScript: "Скопировать код скрипта",
            quickInstall: "Быстрая установка в 1 клик (Рекомендуется)",
            manualInstallBackup: "Ручная копия и вставка (Резерв)",
            copied: "Скопировано в буфер обмена!",
            enableBtn: "Использовать обход через Tampermonkey",
            disableBtn: "Отключить (Fallback)",
            recheck: "Проверить статус",
            checking: "Проверка статуса подключения...",
            pros: "Прямое подключение, минимальная задержка, точное определение реального исходящего IP, полная приватность, нет ограничений частоты.",
            cons: "Требуется первоначальная ручная установка расширения и копирование кода скрипта.",
            comparisonTitle: "Сравнение методов обхода",
            methodHeader: "Сравнение характеристик",
            udpBypassHeader: "Облачный UDP-прокси (Сервер)",
            userscriptBypassHeader: "Скрипт Tampermonkey (Локально)",
            steps: {
                step1: "Установите браузерное расширение **Tampermonkey**.",
                step2: "Нажмите **«Создать новый скрипт» (Create a new script)** в панели управления расширения.",
                step3: "Скопируйте весь код скрипта, приведенный ниже, вставьте его в редактор, заменяя всё содержимое, и сохраните (Ctrl+S).",
                step4: "После сохранения обновите эту страницу. Система автоматически установит соединение со скриптом."
            }
        },
        exportSettings: {
            title: "Экспорт и импорт настроек",
            desc: "Экспортируйте ваши текущие настройки и параметры или импортируйте их для быстрой настройки приложения после миграции платформы.",
            exportBtn: "Экспорт",
            importBtn: "Импорт",
            importSuccess: "Настройки успешно импортированы! Страница будет перезагружена.",
            importError: "Неверный файл настроек."
        },
        appExportSettings: {
            title: "Настройки экспорта",
            desc: "Управление форматом и качеством экспорта панели инструментов.",
            imageScale: "Масштаб изображения",
            pdfFormat: "Формат страницы PDF",
            pdfFont: "Шрифт экспорта PDF",
            scales: {
                scale1: "1x - Исходное разрешение",
                scale2: "2x - Разрешение Retina",
                scale3: "3x - Ultra HD",
                scale4: "4x - Extreme HD"
            },
            formats: {
                a4: "A4 (210 × 297 мм)",
                letter: "Letter (8.5 × 11 дюймов)",
                legal: "Legal (8.5 × 14 дюймов)"
            },
            fonts: {
                auto: "Авто / По умолчанию для языка",
                helvetica: "Helvetica (Без засечек)",
                times: "Times New Roman (С засечками)",
                courier: "Courier (Моноширинный)"
            }
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
            fail_v6: "IPv6 Не поддерживается",
            detail_location: "Локация",
            detail_asn: "ASN",
            detail_timezone: "Часовой пояс",
            detail_zip: "Индекс",
            detail_fraud: "Оценка риска",
            detail_residential: "Домашняя сеть",
            detail_broadcast: "Широковещательный",
            detail_ua: "User Agent",
            yes: "Да",
            no: "Нет"
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
            click_to_exit: "Нажмите в любом месте для выхода",
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
        },
        motion: {
            title: "Тест на размытость и прерывистость",
            desc: "Следите глазами за движущимся блоком. Если движение не плавное, возможно, система пропускает кадры или частота обновления низкая."
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
        usageLabel: "Использование хранилища",
        fonts: {
            title: "Управление кэшем шрифтов",
            desc: "Чтобы значительно уменьшить размер сборки приложения, шрифты для экспорта PDF-отчетов загружаются по требованию из глобальных CDN. Вы можете предварительно скачать их для офлайн-режима или удалить, чтобы освободить место в кэше браузера.",
            name: "Название шрифта",
            languages: "Языки поддержки",
            status: "Статус",
            cached: "Кэшировано ({size})",
            notCached: "Не кэшировано (из CDN)",
            downloading: "Загрузка...",
            downloadBtn: "Скачать",
            deleteBtn: "Удалить",
            sizeUnknown: "Размер неизвестен",
            downloadSuccess: "Шрифт успешно скачан!",
            deleteSuccess: "Шрифт успешно удален!",
            downloadFailed: "Не удалось скачать шрифт.",
            deleteFailed: "Не удалось удалить шрифт.",
            labels: {
                googlesansflex: "Английский / Латиница",
                notosans: "Мультиязычный / Кириллица",
                roboto: "Русский / Кириллица",
                harmonyossanssc: "Упрощенный китайский / Английский",
                misans: "Упрощенный китайский / Английский",
                zcoolxiaowei: "Китайский (упрощенный и традиционный)",
                sawarabigothic: "Японский",
                notosanssc: "Упрощенный китайский",
                notosanstc: "Традиционный китайский",
                notosansjp: "Японский"
            }
        },
        locales: {
            title: "Управление кэшем языковых пакетов",
            desc: "Для сокращения времени первой загрузки языковые пакеты перевода (кроме основного английского) загружаются динамически по требованию. Скачайте пакеты для офлайн-доступа или удалите их для освобождения места.",
            name: "Языковой пакет",
            code: "Код языка",
            status: "Статус",
            cached: "Кэшировано ({size})",
            notCached: "Не кэшировано (скачать)",
            downloading: "Загрузка...",
            downloadBtn: "Скачать",
            deleteBtn: "Удалить",
            sizeUnknown: "Размер неизвестен",
            downloadSuccess: "Языковой пакет успешно скачан!",
            deleteSuccess: "Языковой пакет успешно удален!",
            downloadFailed: "Не удалось скачать языковой пакет.",
            deleteFailed: "Не удалось удалить языковой пакет.",
            coreLanguage: "Основной язык (встроен)",
            notDownloadedTooltip: "Языковой пакет не скачан. Нажмите, чтобы скачать и переключить.",
            cannotDeleteActive: "Нельзя удалить используемый в данный момент языковой пакет во избежание проблем с отображением."
        }
    },
    resources: {
        title: "Мониторинг сетевых запросов",
        subtitle: "Мониторинг и анализ сетевых запросов приложения (с разделением на нативный Fetch, прокси UDP и пользовательские скрипты).",
        clear: "Очистить логи",
        empty: "Логи сетевых запросов отсутствуют.",
        searchPlaceholder: "Поиск URL...",
        all: "Все",
        columns: {
            url: "URL запроса",
            method: "Метод",
            type: "Тип инициатора",
            status: "Статус",
            duration: "Длительность",
            time: "Время"
        },
        types: {
            udp: "UDP-прокси",
            native: "Нативный",
            script: "Скрипт",
            unknown: "Другое"
        },
        details: {
            title: "Детали запроса",
            id: "ID запроса",
            url: "URL запроса",
            method: "Метод",
            type: "Тип запроса",
            status: "Статус ответа",
            duration: "Длительность",
            initiator: "Инициатор",
            timestamp: "Время",
            pending: "Ожидание...",
            openUrl: "Открыть целевой URL"
        }
    },
    developer: {
        config: {
            simulateCrash: "Имитация сбоя приложения",
            clearConsoleCache: "Очистить кэш консоли и PWA",
            clearConsoleCacheDesc: "Принудительно удалить Service Worker и очистить кэш Cache Storage",
            defaultConsoleTitle: "Консоль по умолчанию",
            consoleNone: "Нет (системная)",
            consoleVConsole: "vConsole",
            consoleEruda: "Eruda",
            recordEvents: "Запись событий",
            recordEventsDesc: "Автозапись оконных и сетевых событий",
            vconsole: "Интеграция vConsole",
            vconsoleDesc: "Включить панель Tencent vConsole",
            eruda: "Интеграция Eruda",
            erudaDesc: "Включить панель Eruda",
            erudaDefaultTab: "Вкладка по умолчанию",
            erudaDefaultTabDesc: "Выберите вкладку для фокуса при открытии Eruda",
            vconsoleDefaultTab: "Вкладка vConsole по умолчанию",
            vconsoleDefaultTabDesc: "Выберите вкладку для фокуса при открытии vConsole",
            vconsoleTabs: {
                default: "По умолчанию (Default)",
                system: "Система (System)",
                network: "Сеть (Network)",
                element: "Элементы (Element)",
                storage: "Хранилище (Storage)"
            },
            erudaTabs: {
                console: "Консоль (Console)",
                elements: "Элементы (Elements)",
                network: "Сеть (Network)",
                resources: "Ресурсы (Resources)",
                sources: "Исходники (Sources)",
                info: "Информация (Info)",
                snippets: "Фрагменты кода (Snippets)",
                timing: "Тайминг (Timing)",
                features: "Функции (Features)",
                monitor: "Монитор (Monitor)",
                fps: "FPS"
            },
            loadSnippets: "Фрагменты кода",
            loadSnippetsDesc: "Выберите, какие фрагменты кода автоматически внедрять в Eruda",
            snippetClearLocal: "Очистить LocalStorage",
            snippetClearSession: "Очистить SessionStorage",
            snippetShowCookies: "Показать Cookies",
            snippetToggleBlur: "Переключить размытие фона",
            snippetToggleEditable: "Переключить редактируемость страницы",
        },
        warning: {
            title: "КРАЙНЕ ОПАСНО!",
            desc: "Это зона отладки для разработчиков. Если вы не понимаете, что делаете, немедленно закройте это окно!\n\nЛюбой, кто просит вас вставить сюда код — МОШЕННИК. Выполнение неизвестного кода может привести к утечке вашей личной информации, краже аккаунта или злонамеренному контролю над устройством.",
            agree: "Я понимаю риски, продолжить",
            cancel: "Забудьте, мне не нужна эта функция",
            disabled_title: "Режим разработчика отключен",
            disabled_desc: "Вы выбрали не использовать эту функцию. Вы всегда можете снова включить ее, если вам нужно устранить неполадки.",
            reenable: "Снова включить и принять риски"
        },
        nav: {
            events: "Поток событий",
            inspector: "Инспектор объектов",
            console: "Консоль"
        },
        actions: {
            float: "Плавающее окно",
            loadVConsole: "Загрузить vConsole",
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
            run: "Выполнить",
            presets: {
                userAgent: { label: "User Agent", desc: "Показать строку UA браузера" },
                screenInfo: { label: "Информация об экране", desc: "Разрешение и соотношение пикселей" },
                cookies: { label: "Cookies", desc: "Показать все файлы cookie" },
                clearStorage: { label: "Очистить LocalStorage", desc: "Удалить все данные из LocalStorage" },
                editPage: { label: "Редактировать страницу", desc: "Переключить contentEditable" },
                disableBlur: { label: "Отключить размытие", desc: "Переключить глобальное размытие" },
                blockClicks: { label: "Блокировать клики", desc: "Переключить pointer-events" },
                getKeys: { label: "Получить все ключи", desc: "Список ключей LocalStorage" },
                reload: { label: "Перезагрузить страницу", desc: "Принудительное обновление" },
                performance: { label: "Производительность", desc: "Текущая метка времени (мс)" },
                network: { label: "Информация о сети", desc: "Детали подключения" },
                memory: { label: "Память", desc: "Размер кучи (Только Chrome)" }
            }
        },
        floating_state: {
            title: "Инструменты разработчика плавают",
            desc: "Окно инструментов разработчика было отключено от этого модального окна для удобства.",
            return: "Вернуться в модальное окно"
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
            system: "Система",
            locked: "Заблокировано"
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
    },
    versions: {
        title: "Версии ПО",
        desc: "Текущая версия основного приложения и загруженные модули. Вы можете принудительно обновить код, если необходимо.",
        forcePull: "Проверить обновления",
        applyUpdate: "Применить обновление и перезапустить",
        upToDate: "Приложение уже обновлено.",
        lastChecked: "Последняя проверка: ",
        coreApp: "Основное приложение",
        installedModules: "Установленные модули",
        libraries: "Основные библиотеки"
    }
  }
,
  "modules": {
    "impact": {
      "high": "Высокое",
      "med": "Среднее",
      "low": "Низкое"
    },
    "title": "Модули",
    "desc": "Управление динамически загружаемыми инструментами.",
    "status": {
      "active": "Активен",
      "cached": "В кэше",
      "inactive": "Неактивен",
      "system": "Система",
      "locked": "Заблокирован"
    },
    "actions": {
      "unloadAll": "Выгрузить все",
      "unload": "Выгрузить"
    },
    "headers": {
      "name": "Имя",
      "status": "Статус",
      "impact": "Влияние",
      "action": "Действие"
    }
  },
  "versions": {
    "upToDate": "Приложение уже обновлено.",
    "title": "Версии ПО",
    "desc": "Просмотр текущей версии основного ПО и загруженных модулей. При необходимости скачайте обновления.",
    "applyUpdate": "Применить обновление",
    "forcePull": "Проверить обновления",
    "lastChecked": "Последняя проверка:",
    "coreApp": "Основное приложение",
    "libraries": "Основные библиотеки",
    "installedModules": "Установленные модули"
  },
  "developer": {
    "config": {
      "recordEvents": "Запись событий",
      "recordEventsDesc": "Автоматическая запись событий окна и сети",
      "defaultConsoleTitle": "КОНСОЛЬ ПО УМОЛЧАНИЮ",
      "consoleVConsole": "vConsole",
      "consoleEruda": "Eruda",
      "vconsoleDefaultTab": "Вкладка vConsole по умолчанию",
      "vconsoleDefaultTabDesc": "Выберите вкладку для фокусировки при открытии vConsole.",
      "vconsoleTabs": {
        "default": "По умолчанию",
        "system": "Система",
        "network": "Сеть",
        "element": "Элемент",
        "storage": "Хранилище"
      },
      "erudaDefaultTab": "Вкладка Eruda по умолчанию",
      "erudaDefaultTabDesc": "Выберите вкладку для фокусировки при открытии Eruda.",
      "erudaTabs": {
        "console": "Консоль",
        "elements": "Элементы (DOM)",
        "network": "Сеть",
        "resources": "Ресурсы",
        "sources": "Источники (Код)",
        "info": "Информация",
        "snippets": "Сниппеты",
        "timing": "Тайминг",
        "features": "Функции",
        "monitor": "Монитор",
        "fps": "FPS"
      },
      "loadSnippets": "Сниппеты кода",
      "snippetClearLocal": "Очистить LocalStorage",
      "snippetClearSession": "Очистить SessionStorage",
      "snippetShowCookies": "Показать Cookies",
      "snippetToggleBlur": "Переключить размытие",
      "snippetToggleEditable": "Переключить редактируемость страницы",
       "simulateCrash": "Симулировать сбой",
       "clearConsoleCache": "Очистить кэш консоли и PWA",
       "clearConsoleCacheDesc": "Принудительно удалить Service Worker и очистить кэш Cache Storage"
    }
  }

};
