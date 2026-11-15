# Current Project State: SPORTIFY

- **Активный этап (Этап 24: Чистая типографика секции «Преимущества» и защищённый контраст текста):**
  1. **Секция стандартов и преимуществ (`components/EditorialAdvantages.tsx`):**
     - **Защита левой колонки (Манифест):** Помещена в плотный матовый стеклянный контейнер (`bg-white/90 dark:bg-[#080b12]/90 backdrop-blur-2xl border dark:border-white/12`). Фоновые кинетические линии больше не пересекают и не затрудняют чтение заголовка «НОВАЯ КУЛЬТУРА СПОРТА: БЕЗ РУТИНЫ И НАВЯЗЫВАНИЯ» и метрик (12 400+ атлетов, 4.94 рейтинг, 0 UZS пробный визит).
     - **Премиальный редизайн карточек 01–04:** Удалены тесные бейджи с многоточием и переносы в 2 строки. Каждая карточка оформлена в журнальном спортивном стиле: крупный неоновый номер `01`–`04` (`#d4ff00`), пульсирующий радарный маяк `Sonar Ping`, чистый белый заголовок капсом, просторный текст описания, 3D Tilt и динамический световой блик мыши.
  2. **Непрерывный кинетический фон (`components/CinematicSportsAtmosphere.tsx`):**
     - Восстановлен живой, динамичный поток из 460 линий энергии Genomines (Volt, Cyan, Emerald) со скользящими кинетическими искрами.
  3. **Навигационный бар (`components/Header.tsx`):**
     - Яркая капсула «AI Matcher» (`#d4ff00` с черным текстом и иконкой искр).
     - Спортивный стиль: зеркальный скос стекла, неоновый логотип, пилюля `ЭМБИЕНТ ЗВУК`, магнитная кнопка `ЗАПИСАТЬСЯ 0 UZS →`.
  4. **7 эффектов Motion & Haptic Design (2026):**
     - 3D Tilt (`TiltCard.tsx`), Border Beam (`BorderBeam.tsx`), Kinetic Telemetry (`CounterNumber.tsx`), Magnetic Buttons (`MagneticButton.tsx`), Sonar Ping (`SonarPing.tsx`), Scroll Velocity Blur (`ScrollVelocityEffects.tsx`), Tactile Haptics (`lib/haptics.ts`).
  5. **Hero Section:** На 100% сохранен (4K YouTube видео, HUD, консоль).
- **Интеграции:**
  - **Типографика:** `Unbounded` (заголовки), `Manrope` (основной текст), `Golos_Text` (телеметрия, адреса, теги, расписания).
  - **Темы:** Dark Void (`#08090b`) и Light Editorial Gallery (`#f8fafc` / `#ffffff`) с мгновенным переключением в шапке и сохранением в localStorage.
  - **Neon Lakebase Postgres:** Проект `long-flower-54714792` (branch `production`), драйвер `@neondatabase/serverless`, авто-инициализация таблицы `leads`.
  - **Neon Object Storage:** S3-совместимый бакет `assets`, архивация заявок `leads/{id}.json`, драйвер `@aws-sdk/client-s3`.
  - **Telegram Bot:** `@Sportify_Pro_bot` (ID: 9134793691) отправляет лиды в супергруппу `SPORTIFY_pro` (ID: -1003950074060).
  - **Google Gemini API:** Модель `gemini-3.5-flash-lite` с двухуровневой очисткой Markdown-звездочек.
- **Локализация:** г. Ташкент, валюта: UZS, телефон: +998 (71) 200-77-90.
- **Сборка и тесты:** Next.js 16.4.6, `npm run build` exits 0 (26/26 static routes generated, 0 TS errors).
- **GitHub:** Репозиторий `https://github.com/ddetrit91/Sportify_pro.git` (ветка `main`).
