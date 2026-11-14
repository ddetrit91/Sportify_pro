# Current Project State: SPORTIFY

- **Активный этап:** 
  1. Реализована система движущихся 3D-фигур в фоне ниже Hero (`CinematicSportsAtmosphere.tsx`): вращающиеся 3D-икосаэдры, двойные гиро-кольца, парящие октаэдры, динамическая 3D-волна топографического рельефа и созвездия кинетических частиц.
  2. Полностью адаптирована Светлая тема (Light Mode): устранены все чёрные блоки (Bento Card 6 переведена на чистый светлый градиент, AI Quiz Step 1 и все карточки страниц `/clubs`, `/sports`, `/matcher`, `/booking`, `/dashboard`, `/admin` адаптированы под светлую гамму).
  3. 3D Canvas автоматически реагирует на переключение темы (неоновые цвета в тёмной теме, стильные графитовые и лаймовые контуры в светлой).
  4. Hero Section сохранён на 100% нетронутым (4K YouTube видео, консоль, поиск).
  5. Плавающий бейдж «Умный ИИ-помощник» размещён над карточкой Hero (`-top-12 right-2 sm:right-6 pointer-events-none`) с 0% перекрытия.
- **Интеграции:**
  - **Типографика:** `Unbounded` (заголовки), `Manrope` (основной текст), `Golos_Text` (телеметрия, адреса, теги, расписания).
  - **Темы:** Dark Void (`#08090b`) и Light Editorial Gallery (`#f8fafc` / `#ffffff`) с мгновенным переключением в шапке и сохранением в localStorage.
  - **Neon Lakebase Postgres:** Проект `long-flower-54714792` (branch `production`), драйвер `@neondatabase/serverless`, авто-инициализация таблицы `leads`.
  - **Neon Object Storage:** S3-совместимый бакет `assets`, архивация заявок `leads/{id}.json`, драйвер `@aws-sdk/client-s3`.
  - **Telegram Bot:** `@Sportify_Pro_bot` (ID: 9134793691) отправляет лиды в супергруппу `SPORTIFY_pro` (ID: -1003950074060).
  - **Google Gemini API:** Модель `gemini-3.5-flash-lite` с двухуровневой очисткой Markdown-звездочек.
- **Локализация:** г. Ташкент, валюта: UZS, телефон: +998 (71) 200-77-90.
- **Сборка и тесты:** Next.js 16.4.6, `npm run build` exits 0 (26/26 static routes generated, 0 TS errors).
- **GitHub:** Репозиторий `https://github.com/ddetrit91/Sportify_pro.git` (ветка `main`, актуальный коммит синхронизирован).
