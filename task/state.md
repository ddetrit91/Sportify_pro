# Current Project State: SPORTIFY

- **Активный этап:** Выполнены все доработки по визуальным скриншотам пользователя: устранено наложение плавающего бейджа в Hero, внедрен шрифт Golos Text + Manrope вместо JetBrains Mono, и реализована 100% поддержка Светлой и Тёмной тем во всех компонентах.
- **Интеграции:**
  - **Типографика:** `Unbounded` (заголовки), `Manrope` (основной текст), `Golos_Text` (телеметрия, адреса, теги, расписания).
  - **Темы:** Dark Void (`#08090b`) и Light Editorial Gallery (`#f8fafc` / `#ffffff`) с мгновенным переключением в шапке и сохранением в localStorage.
  - **Neon Lakebase Postgres:** Проект `long-flower-54714792` (branch `production`), драйвер `@neondatabase/serverless`, авто-инициализация таблицы `leads`.
  - **Neon Object Storage:** S3-совместимый бакет `assets`, архивация заявок `leads/{id}.json`, драйвер `@aws-sdk/client-s3`.
  - **Telegram Bot:** `@Sportify_Pro_bot` (ID: 9134793691) отправляет лиды в супергруппу `SPORTIFY_pro` (ID: -1003950074060).
  - **Google Gemini API:** Модель `gemini-3.5-flash-lite` с двухуровневой очисткой Markdown-звездочек.
- **Локализация:** г. Ташкент, валюта: UZS, телефон: +998 (71) 200-77-90.
- **Сборка и тесты:** Next.js 16.4.6, `npm run build` exits 0 (25/25 static routes generated, 0 TS errors).
- **GitHub:** Репозиторий `https://github.com/ddetrit91/Sportify_pro.git` синхронизирован (коммит `0ec56ca`).
