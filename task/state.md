# Current Project State: SPORTIFY

- **Активный этап:** Подключена облачная платформа Neon: Lakebase Postgres 18.7 и Object Storage S3 (бакет `assets`). Настроен эндпоинт `/api/neon/health`, гибридная синхронизация заявок (`lib/db.ts` + `lib/storage-s3.ts`), и визуальный статус-монитор в `/admin`.
- **Интеграции:**
  - **Neon Lakebase Postgres:** Проект `long-flower-54714792` (branch `production`), драйвер `@neondatabase/serverless`, авто-инициализация таблицы `leads`.
  - **Neon Object Storage:** S3-совместимый бакет `assets`, архивация заявок `leads/{id}.json`, драйвер `@aws-sdk/client-s3` (forcePathStyle: true).
  - **Telegram Bot:** `@Sportify_Pro_bot` (ID: 9134793691) успешно подключен и отправляет лиды в супергруппу `SPORTIFY_pro` (ID: -1003950074060).
  - **Google Gemini API:** Модель `gemini-3.5-flash-lite` полностью активна с двухуровневой очисткой Markdown-звездочек.
- **Локализация:** г. Ташкент (Мирабадский, Яккасарайский, Юнусабадский, Шайхантахурский, Чиланзарский р-ны), валюта: UZS, телефон: +998 (71) 200-77-90.
- **Сборка и тесты:** Next.js 16.4.6 (React 19, Turbopack), `npm run build` exits 0 (25/25 static routes generated, 0 TS errors).
- **Сервер:** `http://localhost:3000` активен. Панель администратора: `/admin` (пароль `admin123`).
