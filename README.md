# Система бронирования отелей

Веб-приложение для бронирования отелей на React, TypeScript и Apollo Client. Подключается к GraphQL API и позволяет просматривать отели, номера и управлять бронированиями.

## Технологии

- **React 18** - UI библиотека с поддержкой Suspense и lazy loading
- **TypeScript** - типизация для надежности кода
- **Apollo Client** - работа с GraphQL API, кэширование данных
- **React Router v6** - декларативная маршрутизация
- **Vite** - быстрая сборка и dev-сервер
- **Vitest** - тестовый раннер
- **React Testing Library** - тестирование компонентов
- **MSW** - мокирование GraphQL запросов в тестах
- **ESLint** - проверка качества кода

## Структура проекта

```
src/
├── apollo/              # Настройка Apollo Client
│   └── client.ts        # Конфигурация клиента с InMemoryCache
├── components/          # React компоненты
│   ├── __tests__/      # Тесты компонентов
│   ├── BookingForm.tsx        # Форма создания бронирования
│   ├── BookingList.tsx         # Список бронирований номера
│   ├── ErrorBoundary.tsx      # Обработка ошибок рендеринга
│   ├── HotelCard.tsx          # Карточка отеля
│   ├── HotelList.tsx          # Список отелей с поиском
│   ├── RoomCard.tsx           # Карточка номера
│   ├── RoomFilters.tsx         # Фильтры номеров (тип, цена)
│   ├── RoomList.tsx           # Список номеров отеля
│   ├── Toast.tsx              # Контейнер toast-уведомлений
│   ├── UnavailableDates.tsx   # Недоступные даты номера
│   ├── UserBookings.tsx       # Бронирования пользователя
│   ├── UserProfileCard.tsx    # Карточка профиля пользователя
│   └── UserProfileModal.tsx   # Модальное окно редактирования профиля
├── context/            # Глобальное состояние (Context API)
│   ├── __tests__/     # Тесты контекстов
│   ├── ToastContext.tsx        # Управление toast-уведомлениями
│   └── UserContext.tsx        # Управление данными пользователя (localStorage)
├── graphql/            # GraphQL запросы и мутации
│   ├── queries.ts      # GET_HOTELS, GET_HOTEL, GET_ROOMS, GET_ROOMS_BY_HOTEL, CHECK_AVAILABILITY
│   └── mutations.ts    # CREATE_BOOKING, CANCEL_BOOKING
├── pages/              # Страницы приложения (lazy loaded)
│   ├── HomePage.tsx           # Главная страница со списком отелей
│   ├── HotelPage.tsx          # Страница отеля с номерами
│   ├── BookingPage.tsx        # Страница создания бронирования
│   └── BookingsViewPage.tsx   # Страница просмотра бронирований
├── services/           # Бизнес-логика (Service Layer Pattern)
│   ├── __tests__/     # Тесты сервисов
│   ├── HotelService.ts        # Работа с отелями и номерами
│   └── BookingService.ts      # Работа с бронированиями
├── test/               # Тестовые утилиты и моки
│   ├── mocks/
│   │   └── handlers.ts        # MSW handlers для GraphQL
│   ├── setup.ts               # Настройка Vitest и MSW
│   └── test-utils.tsx         # Обертка render с провайдерами
├── types/              # TypeScript интерфейсы
│   └── index.ts       # Hotel, Room, Booking, AvailabilityResult, CreateBookingInput
├── utils/              # Утилиты
│   └── images.ts      # Функции для получения изображений отелей/номеров
├── App.tsx             # Корневой компонент с провайдерами и роутингом
├── main.tsx            # Точка входа
├── App.css             # Глобальные стили приложения
└── index.css           # Базовые стили
```

## Установка и запуск

### Установка зависимостей

```bash
npm install
```

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173` (порт по умолчанию для Vite).

### Сборка для продакшена

```bash
npm run build
npm run preview
```

### Проверка кода

```bash
npm run lint
```

### Тестирование

Запуск тестов:
```bash
npm test
```

Запуск тестов в watch режиме:
```bash
npm test
# Нажмите 'a' для запуска всех тестов
```

Запуск тестов с UI:
```bash
npm run test:ui
```

Запуск тестов с покрытием:
```bash
npm run test:coverage
```

## Подключение к серверу

Приложение работает с GraphQL сервером на `http://localhost:4001/graphql`. Прокси настроен в `vite.config.ts`, так что запросы идут через `/graphql`.

Перед запуском убедитесь, что бэкенд запущен:
```bash
# В директории Backend
npm run dev
```

## Архитектура и паттерны

### Реализованные паттерны

1. **Service Layer Pattern** - бизнес-логика вынесена в сервисы (`HotelService`, `BookingService`)
2. **Component-Based Architecture** - модульные и переиспользуемые компоненты
3. **Separation of Concerns** - четкое разделение на типы, сервисы, компоненты, страницы
4. **Context API Pattern** - глобальное состояние через React Context (`UserContext`, `ToastContext`)
5. **Error Boundary** - обработка ошибок рендеринга на уровне приложения
6. **Lazy Loading** - код-сплиттинг страниц через `React.lazy()` и `Suspense`
7. **Custom Hooks** - `useUser()`, `useToast()` для работы с контекстами

### Структура компонентов

- **Presentational Components** - `HotelCard`, `RoomCard` (отображают данные)
- **Container Components** - `HotelList`, `RoomList` (управляют состоянием и данными)
- **Page Components** - `HomePage`, `HotelPage` (композиция контейнеров и презентационных компонентов)

## Основной функционал

### Список отелей

На главной странице отображается список всех отелей с поиском по названию, адресу и описанию. Каждая карточка показывает базовую информацию, изображение и количество номеров.

**Компоненты:** `HomePage`, `HotelList`, `HotelCard`

**Особенности:**
- Поиск в реальном времени
- Динамические изображения через утилиту `getHotelImage()`
- Фоновое изображение в заголовке

### Просмотр номеров

На странице отеля показываются все номера с возможностью фильтрации по типу и цене. Можно перейти к бронированию или посмотреть существующие брони.

**Компоненты:** `HotelPage`, `RoomList`, `RoomCard`, `RoomFilters`

**Особенности:**
- Фильтрация по типу номера
- Фильтрация по диапазону цен
- Сортировка номеров

### Создание бронирования

Форма для создания бронирования с валидацией дат. Перед созданием можно проверить доступность номера. Данные пользователя автоматически подставляются из профиля.

**Компоненты:** `BookingPage`, `BookingForm`, `UnavailableDates`, `UserBookings`

**Особенности:**
- Автозаполнение из профиля пользователя
- Проверка доступности перед созданием
- Валидация дат (checkIn < checkOut)
- Toast-уведомления об успехе/ошибке
- Автоматическое обновление списка бронирований без перезагрузки страницы

### Просмотр и отмена броней

Можно посмотреть все бронирования номера на указанный период и отменить активные бронирования.

**Компоненты:** `BookingsViewPage`, `BookingList`, `UserBookings`

**Особенности:**
- Фильтрация по email пользователя
- Отображение только активных бронирований
- Возможность отмены своих бронирований

### Профиль пользователя

Данные пользователя сохраняются в `localStorage`. Есть модальное окно для редактирования профиля, данные автоматически подставляются в формы.

**Компоненты:** `UserProfileCard`, `UserProfileModal`

**Особенности:**
- Персистентность данных в localStorage
- Модальное окно для редактирования
- Автоматическое использование данных в формах

## GraphQL запросы и мутации

### Queries

**GET_HOTELS** - получение всех отелей с номерами
```graphql
query GetHotels {
  hotels {
    id
    name
    address
    description
    rooms { ... }
  }
}
```

**GET_HOTEL** - получение отеля по ID
```graphql
query GetHotel($id: ID!) {
  hotel(id: $id) { ... }
}
```

**GET_ROOMS** - получение всех номеров
```graphql
query GetRooms {
  rooms { ... }
}
```

**GET_ROOMS_BY_HOTEL** - получение номеров конкретного отеля
```graphql
query GetRoomsByHotel($hotelId: ID!) {
  roomsByHotel(hotelId: $hotelId) { ... }
}
```

**CHECK_AVAILABILITY** - проверка доступности номера на период
```graphql
query CheckAvailability($roomId: ID!, $checkIn: String!, $checkOut: String!) {
  checkAvailability(roomId: $roomId, checkIn: $checkIn, checkOut: $checkOut) {
    available
    conflictingBookings { ... }
  }
}
```

### Mutations

**CREATE_BOOKING** - создание бронирования
```graphql
mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    id
    guestName
    guestEmail
    checkIn
    checkOut
    roomId
    isActive
    createdAt
  }
}
```

**CANCEL_BOOKING** - отмена бронирования
```graphql
mutation CancelBooking($id: ID!) {
  cancelBooking(id: $id) {
    id
    isActive
  }
}
```

Все запросы и мутации находятся в `src/graphql/queries.ts` и `src/graphql/mutations.ts`.

## Маршруты

- `/` - главная страница со списком отелей
- `/hotel/:id` - страница отеля с номерами
- `/room/:roomId/book` - создание бронирования
- `/room/:roomId/bookings` - просмотр бронирований

Все страницы загружаются лениво (lazy loading) для оптимизации начальной загрузки.

## Типы данных

Основные интерфейсы определены в `src/types/index.ts`:

- **Hotel** - отель (id, name, address, description, rooms)
- **Room** - номер (id, number, type, price, hotelId)
- **Booking** - бронирование (id, guestName, guestEmail, checkIn, checkOut, roomId, isActive, createdAt)
- **AvailabilityResult** - результат проверки доступности (available, conflictingBookings)
- **CreateBookingInput** - входные данные для создания бронирования

## Сервисы

### HotelService

Работа с отелями и номерами:
- `getAllHotels()` - получение всех отелей
- `getHotelById(id)` - получение отеля по ID
- `getAllRooms()` - получение всех номеров
- `getRoomsByHotelId(hotelId)` - получение номеров отеля

### BookingService

Работа с бронированиями:
- `checkAvailability(roomId, checkIn, checkOut)` - проверка доступности
- `createBooking(input)` - создание бронирования
- `cancelBooking(id)` - отмена бронирования

Все сервисы используют Apollo Client для выполнения GraphQL запросов.

## Обработка ошибок

Ошибки обрабатываются на нескольких уровнях:

1. **ErrorBoundary** - перехватывает ошибки рендеринга компонентов и отображает fallback UI
2. **Apollo Client** - автоматически обрабатывает GraphQL ошибки через `errorPolicy: 'all'`
3. **Компоненты** - локальная обработка ошибок через состояние `error` из хуков
4. **Валидация форм** - клиентская валидация перед отправкой
5. **Toast-уведомления** - пользовательские уведомления об ошибках и успешных операциях

## Кэширование

Apollo Client использует `InMemoryCache`:
- **cache-first** для отелей и номеров (данные редко меняются)
- **network-only** для проверки доступности (нужны актуальные данные)

Кэш автоматически обновляется после мутаций. Вместо `window.location.reload()` используется механизм обновления через `refreshKey` для перерендеринга компонентов с актуальными данными.

## Стилизация

Стили организованы по компонентам - каждый компонент имеет свой CSS файл. Глобальные стили в `index.css` и `App.css`.

**Цветовая схема:**
- Синий: `#1976d2` (основной)
- Зеленый: `#2e7d32` (успех)
- Красный: `#d32f2f` (ошибка)
- Фон: `#f5f5f5` (светлый фон)
- Акцент: `#673ab7` (фиолетовый)

**Особенности:**
- Адаптивный дизайн (mobile-first)
- Работает на десктопе, планшете и мобильных устройствах
- Плавные переходы и анимации
- Toast-уведомления с анимацией появления/исчезновения

## Производительность

### Оптимизации

1. **Lazy Loading** - страницы загружаются по требованию через `React.lazy()` и `Suspense`
2. **Code Splitting** - автоматическое разделение кода на чанки
3. **Apollo Cache** - кэширование GraphQL запросов
4. **Оптимизированные изображения** - использование утилиты для динамической загрузки

### Загрузка страниц

- Начальная загрузка: только главная страница
- Остальные страницы загружаются при переходе
- Fallback UI во время загрузки: "Загрузка..."

## Безопасность

- Валидация данных на клиенте
- TypeScript для предотвращения ошибок типов
- Обработка ошибок на всех уровнях
- Безопасное хранение данных пользователя в localStorage (только имя и email)

## Тестирование

Проект использует **Vitest** и **React Testing Library** для тестирования.

### Структура тестов

Тесты находятся рядом с тестируемыми файлами:
- `src/components/__tests__/` - тесты компонентов
- `src/services/__tests__/` - тесты сервисов
- `src/context/__tests__/` - тесты контекстов

### Текущее покрытие

- ✅ **BookingService** - 4 теста (проверка доступности, создание/отмена бронирования)
- ✅ **ErrorBoundary** - 3 теста (обработка ошибок, fallback UI)
- ✅ **HotelCard** - 5 тестов (отображение, навигация, изображения)
- ✅ **UserContext** - 4 теста (сохранение в localStorage, установка/удаление пользователя)
- ⏸️ **BookingForm** - 3 теста (временно пропущены, требуют MockedProvider)

**Итого:** 16 тестов проходят, 3 пропущены

### Написание тестов

Пример теста компонента:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('отображает контент', () => {
    render(<MyComponent />);
    expect(screen.getByText('Текст')).toBeInTheDocument();
  });
});
```

### Тестовые утилиты

В `src/test/test-utils.tsx` находится обертка `render`, которая автоматически оборачивает компоненты в необходимые провайдеры:
- `ApolloProvider` - для GraphQL запросов
- `BrowserRouter` - для навигации
- `UserProvider` - для контекста пользователя
- `ToastProvider` - для toast-уведомлений

### Моки

GraphQL запросы мокируются через **MSW (Mock Service Worker)**:
- Настройка в `src/test/setup.ts`
- Handlers в `src/test/mocks/handlers.ts`
- Автоматический запуск/остановка сервера в тестах

## CI/CD

Проект использует **GitHub Actions** для автоматической проверки кода при каждом push и pull request.

### Что проверяется

1. **Lint** - проверка кода через ESLint
2. **Type Check** - проверка TypeScript типов
3. **Test** - запуск всех тестов через Vitest
4. **Build** - сборка проекта для проверки отсутствия ошибок сборки

### Workflow файл

Конфигурация находится в `.github/workflows/ci.yml` и запускается автоматически при:
- Push в ветки `main` и `develop`
- Создании Pull Request в эти ветки

### Локальный запуск CI проверок

Все проверки можно запустить локально одной командой:

```bash
npm run ci
```

Или по отдельности:
```bash
npm run lint        # Проверка кода
npm run type-check  # Проверка типов
npm test -- --run   # Запуск тестов
npm run build       # Сборка проекта
```

### Кэширование

GitHub Actions автоматически кэширует `node_modules` для ускорения сборок.

### Статус сборки

Статус CI можно проверить в GitHub:
- На странице репозитория (бейдж статуса)
- В разделе "Actions"
- В Pull Request (чекбоксы проверок)

## Утилиты

### images.ts

Функции для работы с изображениями:
- `getHotelImage(hotelId)` - получение изображения отеля по ID
- `getRoomImage(roomId)` - получение изображения номера по ID
- `getHeaderBackground(id?)` - получение фонового изображения для заголовка

Изображения хранятся в `public/images/` и выбираются по модулю от ID.

## Как добавить новый функционал

### Новый компонент

1. Создай файл в `src/components/`
2. Добавь CSS файл с тем же именем
3. Экспортируй компонент
4. Используй в нужной странице
5. Добавь тесты в `__tests__/`

### Новый GraphQL запрос

1. Добавь запрос в `src/graphql/queries.ts` или `mutations.ts`
2. Используй `gql` для создания запроса
3. Примени в компоненте через `useQuery` или `useMutation`
4. Добавь обработку ошибок и загрузки

### Новый сервис

1. Создай класс в `src/services/`
2. Используй `apolloClient` для запросов
3. Экспортируй методы
4. Добавь тесты в `__tests__/`

### Новая страница

1. Создай компонент в `src/pages/`
2. Добавь CSS файл
3. Добавь маршрут в `src/App.tsx` с lazy loading:
   ```typescript
   const NewPage = lazy(() => import('./pages/NewPage').then(module => ({ default: module.NewPage })));
   ```
4. Используй `useParams` для параметров маршрута

### Новый контекст

1. Создай файл в `src/context/`
2. Используй `createContext` и `useContext`
3. Создай Provider компонент
4. Добавь в `App.tsx` или `test-utils.tsx`
5. Создай кастомный хук для использования

## Зависимости

### Основные

- `react`, `react-dom` ^18.2.0
- `@apollo/client` ^3.8.10
- `graphql` ^16.8.1
- `react-router-dom` ^6.21.1

### Dev зависимости

- `vite` ^5.0.8
- `typescript` ^5.2.2
- `vitest` ^1.0.4
- `@testing-library/react` ^14.1.2
- `@testing-library/user-event` ^14.5.1
- `@testing-library/jest-dom` ^6.1.5
- `jsdom` ^23.0.1 (для тестов)
- `eslint` и плагины

## Совместимость

- **Node.js** 16+ (рекомендуется 18+)
- **Современные браузеры** (Chrome, Firefox, Safari, Edge последних версий)
- **TypeScript** 5.2+



