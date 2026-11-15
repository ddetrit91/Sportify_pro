# Current Project State: SPORTIFY

- **Активный этап (Этап 27: Редизайн под «Жидкое стекло» (Liquid Glass) и фирменный неоновый кант (Volt Rim)):**
  1. **Архитектура жидкого стекла (`Liquid Glass & Volt Rim`):**
     - Устранена излишняя матовость/глухота: подложки переведены в полупрозрачное тёмное жидкое стекло (`dark:bg-[#08090b]/65` и `dark:bg-[#0c0e14]/75` с `backdrop-blur-xl`), в котором кинетические линии фона мягко преломляются без ухудшения читаемости текста (в точности как на скриншоте пользователя с Buka Fight Academy).
     - Все белые верхние полосы (`via-white/30`) заменены на яркий фирменный неоновый луч Volt (`before:via-[#d4ff00]/70`).
     - Рамки карточек и заголовочных консолей окрашены в неоновый Volt (`dark:border-[#d4ff00]/25`) с мягким ореолом свечения `shadow-[...,0_0_25px_-5px_rgba(212,255,0,0.12)]`.
  2. **Навигационный бар (`components/Header.tsx`):**
     - Все ссылки навигационной капсулы зафиксированы строго в один ряд с помощью `whitespace-nowrap shrink-0`.
  2. **Секция стандартов и преимуществ (`components/EditorialAdvantages.tsx`):**
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
