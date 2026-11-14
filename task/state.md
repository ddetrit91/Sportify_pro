# Current Project State: SPORTIFY

- **Активный этап:** 
  1. Реализована органическая кинетическая система фоновых потоков в стиле **Genomines.com** (`CinematicSportsAtmosphere.tsx`): 500+ стримлайнов, многооктавный Curl Noise (бездивергентные гидродинамические уравнения), мощная биолюминесцентная артерия River Core с неоновым ореолом (phosphor bloom), интерактивный магнитный вихрь курсора мыши и динамический параллакс при скролле.
  2. Полная адаптация под оба визуальных режима (Dark / Light):
     - **Dark Mode:** глубокий графитовый фон `#07080a` с неоновыми лаймовыми (`#d4ff00`) и бирюзовыми (`#00f0ff`) энергетическими токами.
     - **Light Mode:** ультра-чистый журнальный фон `#f8fafc` / `#ffffff` с графитовыми контурами и изумрудными акцентами (`#15803d` / `#16a34a`). Все блоки идеально контрастны, чёрные блоки отсутствуют.
  3. Hero Section сохранён на 100% нетронутым (4K YouTube видео, консоль, поиск).
  4. Плавающий бейдж «Умный ИИ-помощник» размещён над карточкой Hero (`-top-12 right-2 sm:right-6 pointer-events-none`) с 0% перекрытия текста или кнопок.
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
