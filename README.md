# News Admin

Админ-панель новостного сайта на **React**, **Vite**, **Redux Toolkit (RTK)**, **Ant Design**, **Tailwind CSS** и **TipTap**.

## Стек

- React 19 + TypeScript + Vite 8
- Redux Toolkit + React Redux
- React Router 7
- Ant Design 6 (локаль `ru_RU`)
- Tailwind CSS 4 (`@tailwindcss/vite`)
- TipTap (редактор в формате JSON, как в API aina)

## Запуск

```bash
cd ~/Desktop/news-admin
nvm use 20   # рекомендуется Node 20+
npm install
npm run dev
```

Откройте адрес из консоли (обычно `http://localhost:5173`).

**Вход (пока без бэкенда):** `admin` / `admin`. Реальный JWT: `VITE_MOCK_AUTH=false` в `.env`.

В dev запросы к `/api/*` проксируются на `http://localhost:8080` (см. `vite.config.ts` и `.env.example`).

## Структура

```
src/
  app/          — store, typed hooks
  components/   — RichTextEditor (TipTap)
  api/          — RTK Query (aina API)
  features/     — auth slice (JWT)
  layouts/      — AdminLayout
  pages/        — Login, Dashboard, News, Categories
  router/       — маршруты и защита
```

## API

Интеграция с **aina API** (категории, новости, публикация, auth). Типы и эндпоинты — в `src/api/`.

## Следующие шаги

- Загрузка изображений на сервер / S3 (вместо URL обложки)
- Загрузка картинок файлом (сейчас только URL в тексте и обложке)
- Обработка конфликтов (409 slug / название категории)
