# Worstka

## Структура папок и файлов
```
├── dist/                             # Готовый проект
│   ├── css/                          # Стили
│   ├── fonts/                        # Шрифты
│   ├── img/                          # Статические изображения
│   ├── js/                           # Скрипты
│   |   ├── jquery-3.2.1.min.js       # Jquery 3
│   │   └── app.js                    # Главный скрипт
│   ├── media/                        # Медиа файлы (удаляется на этапе интеграции с бекендом)
│   └── index.html                    # Страница
|
└── src/                              # Исходники проекта
    ├── _data/                        # Данные
    │   └── _global.json              # Фейковая база данных
    ├── _styles/                      # Стили
    |   ├── blocks/                   # Уникальные блоки
    |   ├── header/                   # Хедер
    |   │   └── header.scss           # 
    |   ├── footer/                   # Футер
    |   │   └── footer.scss           # 
    |   ├── fonts.scss/               # Шрифты
    |   ├── layout.scss/              # Сетка
    |   ├── mixins.scss/              # Примеси
    |   ├── normalize.scss/           # normalize.css v7.0.0 с минимальными изменениями
    |   ├── tags.scss/                # Расширение нормалайза
    |   ├── utils.scss/               # Универсальные вспомогательные стили
    |   ├── variables.styl            # Переменные
    |   └── main.scss/                # Главный стилевой файл (все импорты здесь)
    └── _templates/                   # Шаблоны
        ├── includes/                 # Инклуды
        │   ├── header.html           # Хедер
        ├── └── footer.html           # Футер
        ├── layout/                   # Шаблоны для наследования
        |   └── base.html             # Базовый шаблон
        └── index.html/               # Шаблон главной страницы
```