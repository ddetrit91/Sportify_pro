# Current Project State: SPORTIFY

- **Активный этап:** 
  1. Реализована многослойная кинематографичная спортивная атмосфера `CinematicSportsAtmosphere.tsx` строго ниже Hero (спортивные chiaroscuro-пластины, объемные Neon Lime авроры, скоростные дуги треков, параллакс скролла и интерактивное освещение).
  2. Hero Section оставлен на 100% нетронутым (4K YouTube стрим, поиск, консоль, бегущая строка).
  3. Плавающий бейдж «Умный ИИ-помощник» в Hero перенесен в верхнюю зону (`-top-12 right-2 sm:right-6 pointer-events-none`) — полностью исключено любое перекрытие кнопок или текста (0% overlap).
  4. Полноценно настроена Светлая тема (Light Mode): динамический градиент и фон `bg-slate-100 dark:bg-[#060709]`, чистая архитектурная графика без черных артефактов.
- **Интеграции:**
  - **Типографика:** `Unbounded` (заголовки), `Manrope` (основной текст), `Golos_Text` (телеметрия, адреса, теги, расписания).
  - **Темы:** Dark Void (`#08090b`) и Light Editorial Gallery (`#f8fafc` / `#ffffff`) с мгновенным переключением в шапке и сохранением в localStorage.
  - **Neon Lakebase Postgres:** Проект `long-flower-54714792` (branch `production`), драйвер `@neondatabase/serverless`, авто-инициализация таблицы `leads`.
  - **Neon Object Storage:** S3-совместимый бакет `assets`, архивация заявок `leads/{id}.json`, драйвер `@aws-sdk/client-s3`.
  - **Telegram Bot:** `@Sportify_Pro_bot` (ID: 9134793691) отправляет лиды в супергруппу `SPORTIFY_pro` (ID: -1003950074060).
  - **Google Gemini API:** Модель `gemini-3.5-flash-lite` с двухуровневой очисткой Markdown-звездочек.
- **Локализация:** г. Ташкент, валюта: UZS, телефон: +998 (71) 200-77-90.
- **Сборка и тесты:** Next.js 16.4.6, `npm run build` exits 0 (26/26 static routes generated, 0 TS errors).
- **GitHub:** Репозиторий `https://github.com/ddetrit91/Sportify_pro.git`.
