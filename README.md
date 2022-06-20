# Worstka
Шаблон проекта для быстрого старта

## Версия окружения
Проект работает как минимум с `Node.js v16.13.2`

## Структура папок и файлов
```
├── dist/
│   ├── css/
│   ├── fonts/
│   ├── img/
│   ├── js/
│   ├── media/
│   └── index.html
|
└── src/                              # Исходники проекта
    ├── favicon/                      #
    ├── fonts/                        #
    ├── img/                          #
    ├── mocks/                        #
    ├── styles/                       #
    │   ├── pure/                     #
    │   └── preprocessed/             #
    ├── js/                           #
    │   ├── pure/                     #
    │   └── webpack/                  #
    └── templates/                    #
        ├── includes/                 #
        ├── pages/                    #
        ├── base.html                 # Базовый шаблон, от которого наследуются шаблоны страниц
```

## TODO
- разобраться с динамическим подхватом скриптов для вебпака

## JS
- `src/js/pure` — скрипты, не требующие сборки, копируются в директорию готового проекта "как есть"
- `src/js/webpack` — скрипты, собираемые вебпаком

## Стили
- `src/styles/pure` — css, не требующий препроцессинга (стили сторонних библиотек), копируются в директорию готового проекта "как есть"
- `src/styles/preprocessed` — стили, обрабатываемые препроцессором

## Моки
Можно описать данные в `src/mocks/index.js`, чтобы затем использовать их в контексте шаблонов, например:
```js
// src/mocks/index.js

module.exports = {
  navigation: [
    { title: 'About', path: '/about.html' },
    { title: 'Contacts', path: '/contacts.html' },
  ],
};
```

```html
<!-- src/templates/includes/header.html -->

<nav>
  {% for navItem in navigation %}
    <a href="{{ navItem.path }}">{{ navItem.title }}</a>
  {% endfor %}
</nav>
```

```html
<!-- dist/index.html -->

<nav>
  <a href="/about.html">About</a>
  <a href="/contacts.html">Contacts</a>
</nav>
```

## Пути к ассетам
Пути к ассетам (изображениям, шрифтам и пр.) в стилях/скриптах необходимо указывать относительно расположения файла в директории `dist`. Например, 
```css
.block {
  background-image: url('../img/picture.png');
}
```
