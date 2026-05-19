# SPA-приложение для учета и обработки инцидентов безопасности

Лабораторная работа №1 по дисциплине «Технологии и методы программирования».

Тема: «SPA-приложение для учета и обработки инцидентов безопасности в спортивных сооружениях и на мероприятиях».

## Стек

- React через Create React App
- react-router-dom
- axios
- Node.js + Express
- PostgreSQL
- REST API + JSON

JWT, OAuth, Redux, Docker и WebSocket не используются. Для учебной авторизации используется серверный session-token.

## Роли RBAC

В проекте используется простая учебная RBAC-модель:

- `guest` — неавторизованный пользователь. Может открыть главную страницу, страницу входа и детальную страницу инцидента только для просмотра.
- `operator` — оператор безопасности. Может смотреть список, детали, пользоваться поиском и фильтрами, менять статус инцидента.
- `admin` — администратор. Может создавать, редактировать, удалять инциденты и управлять пользователями.

После входа frontend хранит в `localStorage` логин, роль для отображения интерфейса и session-token. Защищенные backend-операции проверяют роль по токену из заголовка `Authorization: Bearer <token>`, а не доверяют роли из браузера.

## Тестовые пользователи

- `admin / admin123 / admin`
- `operator / operator123 / operator`

Гость не входит в систему и работает без учетной записи.

## Структура проекта

```text
./
  frontend/
    src/
      api/
        api.js
        authApi.js
        incidentsApi.js
        usersApi.js
      components/
        IncidentCard.jsx
        Loader.jsx
        Navbar.jsx
        ProtectedRoute.jsx
      pages/
        LoginPage.jsx
        IncidentsPage.jsx
        IncidentDetailPage.jsx
        IncidentFormPage.jsx
        UsersPage.jsx
  backend/
    controllers/
      authController.js
      incidentController.js
      userController.js
    middleware/
      authMiddleware.js
    routes/
      authRoutes.js
      incidentRoutes.js
      userRoutes.js
    db.js
    index.js
    init-db.js
    smoke-test.js
  database/
    init.sql
```

## PostgreSQL

Таблица `users`:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  login TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guest', 'operator', 'admin'))
);
```

Таблица `incidents`:

```sql
CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  zone TEXT NOT NULL,
  threat_level TEXT NOT NULL,
  status TEXT NOT NULL,
  operator_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

В `database/init.sql` добавлены 18 инцидентов для проверки динамической прокрутки.

## REST API

- `POST /api/auth/login` — учебный вход
- `GET /api/incidents?limit=5&offset=0` — список с пагинацией
- `GET /api/incidents/:id` — детальная информация
- `POST /api/incidents` — создание, только `admin`, нужен `Authorization: Bearer <token>`
- `PUT /api/incidents/:id` — полное редактирование, только `admin`, нужен `Authorization: Bearer <token>`
- `PATCH /api/incidents/:id/status` — изменение статуса, `operator` и `admin`, нужен `Authorization: Bearer <token>`
- `DELETE /api/incidents/:id` — удаление, только `admin`, нужен `Authorization: Bearer <token>`
- `GET /api/users` — список пользователей, только `admin`, нужен `Authorization: Bearer <token>`
- `POST /api/users` — создание пользователя, только `admin`, нужен `Authorization: Bearer <token>`
- `PUT /api/users/:id` — редактирование пользователя, только `admin`, нужен `Authorization: Bearer <token>`
- `DELETE /api/users/:id` — удаление пользователя, только `admin`, нужен `Authorization: Bearer <token>`

## SPA-маршруты

- `/login` — вход
- `/` — список инцидентов
- `/detail/:id` — детальная страница
- `/add` — добавление инцидента, только `admin`
- `/edit/:id` — редактирование инцидента, только `admin`
- `/admin/users` — меню администратора для управления пользователями

## Динамическая прокрутка

Главная страница загружает инциденты партиями по 5 записей:

```text
GET /api/incidents?limit=5&offset=0
GET /api/incidents?limit=5&offset=5
```

Для подгрузки используется `IntersectionObserver`.

## Запуск

Инициализация базы:

```bash
cd backend
npm.cmd run init-db
```

Запуск backend:

```bash
cd backend
npm.cmd start
```

Запуск frontend:

```bash
cd frontend
npm.cmd start
```

Если стандартные порты заняты:

```bash
cd backend
$env:PORT='5053'; npm.cmd start
```

```bash
cd frontend
$env:PORT='3003'; $env:REACT_APP_API_URL='http://localhost:5053/api'; npm.cmd start
```

## Проверка

```bash
cd backend
npm.cmd run smoke
```

Smoke-test проверяет вход, список с пагинацией, создание и удаление инцидента, изменение статуса оператором и управление пользователями администратором.
