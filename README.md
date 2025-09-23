# Booking App - Backend & Frontend Integration

Это приложение для бронирования отелей с полной интеграцией между бэкендом и фронтендом.

## Структура проекта

```
booking/
├── server/          # Backend (Node.js + Express + MongoDB)
├── client/          # Frontend (React + TypeScript + Vite)
└── appM/           # Mobile App (React Native)
```

## Возможности

### Backend

- **Модели данных**: Отели, номера, отзывы, резервации, пользователи
- **API эндпоинты**: CRUD операции для всех сущностей
- **Аутентификация**: JWT токены, роли пользователей
- **Валидация**: Zod схемы для валидации данных
- **Агрегация**: Автоматический пересчет рейтингов отелей

### Frontend

- **Страница отеля**: Детальная информация, галерея, отзывы
- **Система отзывов**: Создание, просмотр, фильтрация отзывов
- **Выбор номеров**: Фильтрация по типу, сортировка, детальная информация
- **Интеграция с API**: Полная интеграция с бэкендом

## Установка и запуск

### 1. Backend

```bash
cd server
npm install
```

Создайте файл `.env` в папке `server`:

```env
MONGODB_URI=mongodb://localhost:27017/booking
JWT_SECRET=your-secret-key
PORT=3000
```

Запустите сервер:

```bash
npm run dev
```

Заполните базу данных тестовыми данными:

```bash
npm run seed
```

### 2. Frontend

```bash
cd client
npm install
```

Создайте файл `.env` в папке `client`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Запустите клиент:

```bash
npm run dev
```

## API Endpoints

### Hotels

- `GET /api/hotels` - Получить список отелей
- `GET /api/hotels/:id` - Получить отель по ID
- `POST /api/hotels` - Создать отель (требует аутентификации)
- `PUT /api/hotels/:id` - Обновить отель (требует аутентификации)
- `DELETE /api/hotels/:id` - Удалить отель (требует аутентификации)

### Reviews

- `GET /api/reviews/hotel/:hotelId` - Получить отзывы отеля
- `POST /api/reviews/hotel/:hotelId` - Создать отзыв (требует аутентификации)
- `PATCH /api/reviews/:id` - Обновить отзыв (требует аутентификации)
- `DELETE /api/reviews/:id` - Удалить отзыв (требует аутентификации)
- `POST /api/reviews/:id/helpful` - Голосовать за полезность отзыва
- `POST /api/reviews/:id/report` - Пожаловаться на отзыв
- `GET /api/reviews/hotel/:hotelId/stats` - Получить статистику отзывов

### Reservations

- `GET /api/reservations` - Получить резервации
- `POST /api/reservations` - Создать резервацию (требует аутентификации)
- `PATCH /api/reservations/:id` - Обновить резервацию (требует аутентификации)
- `PATCH /api/reservations/:id/check-in` - Заселение (требует аутентификации)
- `PATCH /api/reservations/:id/check-out` - Выселение (требует аутентификации)

## Модели данных

### Hotel

- Основная информация: название, адрес, звезды, описание
- Обзор: информация о ценах, активности, удобствах
- Особенности: идеально для, оценка локации, номера с
- Удобства: детальная категоризация по типам
- Отзывы: сводка рейтингов по категориям
- Окружение: достопримечательности, рестораны, транспорт
- Вопросы путешественников

### Room

- Тип и категория номера
- Вместимость и размеры
- Ценообразование и политики
- Особые возможности (балкон, вид на море, джакузи и т.д.)
- Доступность номеров

### Review

- Основная информация: рейтинг, комментарий
- Информация о госте: имя, страна, инициалы
- Детальные рейтинги по категориям
- Метаданные: тип отзыва, верификация, голоса
- Детали пребывания: дата, тип номера, тип путешествия
- Ответ отеля на отзыв

### Reservation

- Детали номера и гостей
- Даты заезда/выезда
- Ценообразование с разбивкой
- Информация о гостях и детях
- Специальные запросы
- Процесс заселения/выселения
- Отслеживание отзывов

## Технологии

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **JWT** - Authentication

### Frontend

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Разработка

### Добавление новых полей

1. Обновите модель в `server/src/models/`
2. Обновите типы в `server/src/types/`
3. Обновите типы в `client/src/types/`
4. Обновите API функции в `client/src/lib/api.ts`
5. Обновите компоненты фронтенда

### Добавление новых API endpoints

1. Создайте контроллер в `server/src/controller/`
2. Добавьте роуты в `server/src/routes/`
3. Подключите роуты в `server/server.ts`
4. Добавьте API функции в `client/src/lib/api.ts`

## Тестирование

Запустите тестовые данные:

```bash
cd server
npm run seed
```

Это создаст:

- Тестового пользователя
- Отель "Royal Coral Eilat" с 16 типами номеров
- Примеры отзывов
- Полную структуру данных

## Деплой

### Backend

1. Соберите проект: `npm run build`
2. Запустите: `npm start`

### Frontend

1. Соберите проект: `npm run build`
2. Разместите файлы в веб-сервере

## Лицензия

MIT
