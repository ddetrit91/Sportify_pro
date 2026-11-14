# SPORTIFY — Спортивная экосистема Ташкента // AI подбор и бронирование

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6_Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.5_Flash_Lite-4285f4?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![Telegram](https://img.shields.io/badge/Telegram_Bot-API-229ed9?style=for-the-badge&logo=telegram)](https://core.telegram.org/bots/api)

> Высокотехнологичная спортивная платформа для поиска, интеллектуального подбора и онлайн-бронирования премиальных спортивных клубов, студий и кортов в г. Ташкент (Узбекистан).

---

## ⚡ Особенности платформы

- **AI-консультант и спортивный ментор:**
  - Живой чат на базе Google Gemini API (`gemini-3.5-flash-lite`) с персонализированными спортивными рекомендациями по Ташкенту.
  - Пошаговый 4-этапный квиз (Цели -> Опыт -> Вид спорта -> Бюджет в UZS -> Моментальный расчет и бронь бесплатного вводного занятия за 0 UZS).
  - Плавающий виджет «ИИ-помощник» в правом нижнем углу экрана для консультации из любой точки сайта.
  - Двухуровневая очистка ответов ИИ от артефактов Markdown для естественного общения в стиле Telegram.
- **Hero-секция с зацикленным 4K видеопотоком:**
  - Фоновое воспроизведение YouTube видеопотоков (бег в гору, трейлраннинг, экстремальные активности).
  - Автоматическая ротация случайного видео при обновлении страницы.
  - Адаптивное центрирование и масштабирование без черных полос.
  - Прелоадер с индикацией маршрута и интерактивный HUD-переключатель видеопотоков.
- **3D кинетический атлетический фон:**
  - Процедурный Canvas 3D-рельеф с динамической топографической сеткой.
  - Неоновые частицы (Volt `#d4ff00` и Cyan `#00f0ff`) со связями-созвездиями и мягким интерактивным следованием за курсором.
- **Процедурный эмбиент-звук (Web Audio API):**
  - Синтезированный низкочастотный звук концентрации и фокуса (55/110 Гц суб-бас с дыханием фильтра).
  - Не требует загрузки внешних аудиофайлов, стартует мгновенно без задержек.
  - Анимированный неоновый эквалайзер в шапке сайта с возможностью включения/выключения в один клик.
- **Строгая локализация под Ташкент:**
  - Все цены строго в узбекских сумах (UZS) с акцентом на бесплатные пробные тренировки (0 UZS).
  - Топовые локации Ташкента: Мирабадский, Яккасарайский, Юнусабадский, Шайхантахурский и Чиланзарский районы.
  - Узбекские номера телефонов: `+998 (71) 200-77-90` с валидацией ввода.
- **Мгновенная интеграция с Telegram:**
  - Все заявки и бронирования мгновенно передаются через Telegram Bot API в координаторскую супергруппу.
  - Локальная база лидов с сохранением в `/data/leads.json`.
- **Панель администратора (`/admin`):**
  - Управление статусами лидов (новый, в обработке, подтвержден, отклонен).
  - Быстрый звонок, заметки координатора и проверка статуса Telegram бота.

---

## 🛠 Технологический стек

- **Фреймворк:** [Next.js 16.4.6](https://nextjs.org/) (App Router, Turbopack)
- **Библиотека интерфейса:** [React 19](https://react.dev/)
- **Стилизация:** [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
- **Анимации:** [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Иконки:** [Lucide React](https://lucide.dev/)
- **Типографика:** `Unbounded` (атлетический дисплейный гротеск) + `Manrope` (современный гротеск высокой читаемости)
- **ИИ-интеграция:** Google Gemini API (v1beta REST)
- **Уведомления:** Telegram Bot API (HTTPS Webhooks / direct calls)

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/ddetrit91/Sportify_pro.git
cd Sportify_pro
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Скопируйте файл примера:

```bash
cp .env.local.example .env.local
```

Заполните переменные в `.env.local`:

```env
# Google Gemini API (бесплатный ключ на https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite

# Telegram Bot (создается через @BotFather)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_group_or_chat_id

# Пароль от админки (/admin)
ADMIN_PASSWORD=admin123
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### 5. Сборка для продакшна

```bash
npm run build
npm run start
```

---

## 📁 Структура проекта

```text
├── app/
│   ├── api/
│   │   ├── ai/chat/route.ts      # API эндпоинт ИИ-консультанта (Gemini + очистка Markdown)
│   │   ├── leads/route.ts        # Прием заявок, сохранение и отправка в Telegram
│   │   └── telegram/test/route.ts# Проверка статуса Telegram бота
│   ├── admin/page.tsx            # Панель управления лидами
│   ├── booking/page.tsx          # Терминал оформления электронного пропуска
│   ├── clubs/                    # Каталог клубов и страницы [id]
│   ├── matcher/page.tsx          # Полноэкранный AI Matcher
│   ├── sports/                   # Каталог видов спорта и страницы [slug]
│   ├── layout.tsx                # Корневой лэйаут, шрифты Unbounded & Manrope
│   └── page.tsx                  # Главный high-converting single-page лендинг
├── components/
│   ├── Athletic3DBackground.tsx  # Процедурный 3D Canvas фон с топографической волной
│   ├── AmbientSoundController.tsx# Процедурный Web Audio контроллер эмбиент-звука
│   ├── FloatingAiWidget.tsx      # Плавающий виджет «ИИ-помощник» в правом нижнем углу
│   ├── HeroSection.tsx           # Hero с рандомизированным 4K видеопотоком
│   ├── AIQuizSection.tsx         # Пошаговый квиз с фотокарточками и живой чат
│   ├── FeaturedClubsSection.tsx  # Каталог клубов Ташкента с ценами в UZS
│   ├── TrendingSportsBento.tsx   # Bento Grid спортивных направлений
│   ├── FinalBookingTerminal.tsx  # Финальная форма записи за 0 UZS
│   └── Header.tsx / Footer.tsx   # Навигация, темы и контакты в Ташкенте
├── data/
│   ├── clubs.json                # Локации, цены и расписания залов Ташкента
│   ├── sports.json               # База видов спорта и калорийности
│   └── leads.json                # Хранилище заявок
├── memory/                       # Архитектурная память проекта
└── task/                         # Карта сайта, спринты и текущее состояние
```

---

## 🔒 Безопасность

Файлы с секретами (`.env`, `.env.local`, `.env.*.local`) строго исключены через `.gitignore` и никогда не попадают в репозиторий. Всегда используйте `.env.local.example` как шаблон для развертывания на сервере или в облаке (Vercel, Railway, Coolify).

---

## 📄 Лицензия

MIT License © 2026 SPORTIFY Ecosystem.
