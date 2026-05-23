# Frontend

Frontend-часть проекта создана на React через [Create React App](https://github.com/facebook/create-react-app).

## Доступные команды

Команды нужно запускать из папки `frontend`.

### `npm start`

Запускает приложение в режиме разработки.
Откройте [http://localhost:3000](http://localhost:3000), чтобы посмотреть его в браузере.

Страница будет автоматически обновляться при изменениях.
Ошибки lint также выводятся в консоль.

### `npm test`

Запускает тесты в интерактивном watch-режиме.
Подробнее: [документация Create React App по тестам](https://facebook.github.io/create-react-app/docs/running-tests).

### `npm run build`

Собирает production-версию приложения в папку `build`.
React собирается в production-режиме, а итоговые файлы оптимизируются для загрузки в браузере.

Итоговая сборка минифицирована, а имена файлов содержат хэши.
После этого приложение готово к деплою.

Подробнее: [документация Create React App по деплою](https://facebook.github.io/create-react-app/docs/deployment).

### `npm run eject`

**Внимание: это необратимая операция. После `eject` вернуться назад нельзя.**

Если стандартной настройки сборщика недостаточно, можно выполнить `eject`. Команда удалит единую зависимость сборки и перенесет конфигурационные файлы прямо в проект.

В проект будут скопированы настройки и зависимости webpack, Babel, ESLint и других инструментов. Все команды, кроме `eject`, продолжат работать, но будут использовать локально скопированные скрипты.

Обычно `eject` не нужен: стандартной конфигурации Create React App достаточно для небольших и средних проектов.

## Дополнительная информация

Подробнее можно прочитать в [документации Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Для изучения React используйте [документацию React](https://reactjs.org/).

### Разделение кода

Раздел документации: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Анализ размера сборки

Раздел документации: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Progressive Web App

Раздел документации: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Расширенная конфигурация

Раздел документации: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Деплой

Раздел документации: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` не может минифицировать сборку

Раздел документации: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
