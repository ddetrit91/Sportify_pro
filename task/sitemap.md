# Sitemap & Route Map: SPORTIFY Digital Ecosystem (Tashkent, Uzbekistan)

## 1. Frontend & Client Routes
| Route / Anchor | File Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Public | **Флагманский single-page лендинг Ташкента**: Hero с зацикленным рандомизированным YouTube видеофоном, телеметрией Ташкента (+998), Bento-сеткой дисциплин, клубами столицы, AI Matcher, преимуществами, отзывами, FAQ и терминалом бронирования (0 UZS) |
| `/#sports` | `components/TrendingSportsBento.tsx` | Public | Bento-каталог спортивных дисциплин (Падел, Бокс, Кроссфит, Реформер-пилатес, Олимпийский бассейн, Скалолазание) |
| `/#clubs` | `components/FeaturedClubsSection.tsx` | Public | Премиальные спортклубы Ташкента (Apex Nukusskaya, Buka Boxing Abaya, Aquaterra Babura, Padel Arena Yunusabad, Prana Pilates Mustakillik, Climbing Hub Chilonzor) с ценами в UZS |
| `/#ai-matcher` | `components/AIQuizSection.tsx` | Public | Интерактивный 4-шаговый визуальный квиз и AI-консультант (подбор по биометрии, целям и бюджету) |
| `/#advantages` | `components/EditorialAdvantages.tsx` | Public | Редакционные преимущества SPORTIFY (0 UZS пробное, единая подписка, Telegram QR-пропуск) |
| `/#reviews` | `components/AthleteStories.tsx` | Public | Истории атлетов Ташкента (IT Park, Tashkent City, Buka Boxing) |
| `/#faq` | `components/InteractiveFaq.tsx` | Public | Интерактивный аккордеон с правилами сервиса и ответами на вопросы |
| `/#booking` | `components/FinalBookingTerminal.tsx` | Public | Терминал прямого онлайн-резервирования с маской +998 и районами Ташкента |
| `/sports` | `app/sports/page.tsx` | Public | Полный каталог видов спорта с фильтрацией по энергозатратам и мышечным группам |
| `/sports/[slug]` | `app/sports/[slug]/page.tsx` | Public | Детальная страница дисциплины с физиологией, экипировкой и клубами Ташкента |
| `/clubs` | `app/clubs/page.tsx` | Public | Каталог спортивных клубов Ташкента с фильтрами по районам и бесплатным пробным слотам |
| `/clubs/[id]` | `app/clubs/[id]/page.tsx` | Public | Профиль спортивного клуба: фотогалерея, расписание, удобства и форма бронирования |
| `/matcher` | `app/matcher/page.tsx` | Public | Полноэкранный AI Sport Matcher + живой диалог с консультантом на базе Gemini |
| `/booking` | `app/booking/page.tsx` | Public | Расширенный терминал онлайн-резервирования слотов за 0 UZS |
| `/dashboard` | `app/dashboard/page.tsx` | Member / Demo | Личный кабинет атлета: предстоящие тренировки, QR-пропуск, баланс тренировок |
| `/admin` | `app/admin/page.tsx` | Protected (Env: ADMIN_PASSWORD) | Executive админ-панель: KPI-метрики, воронка лидов, мониторинг Neon Cloud, интеграция с Telegram Bot API, экспорт в CSV |

## 2. Backend & API Routes
| Endpoint | Method | File Path | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/admin/login` | `POST` | `app/api/admin/login/route.ts` | Безопасная серверная валидация пароля администратора без раскрытия секрета на клиенте |
| `/api/leads` | `POST` | `app/api/leads/route.ts` | Приём новой заявки с сайта, бронирования или квиза, сохранение в базу и мгновенная отправка в Telegram |
| `/api/leads` | `GET` | `app/api/leads/route.ts` | Получение списка всех заявок с фильтрацией по статусу для админки |
| `/api/leads` | `PATCH` | `app/api/leads/route.ts` | Обновление статуса заявки или заметок менеджера |
| `/api/leads` | `DELETE` | `app/api/leads/route.ts` | Удаление заявки из базы данных |
| `/api/ai/chat` | `POST` | `app/api/ai/chat/route.ts` | Диалоговый AI-консультант на базе Gemini с базой клубов Ташкента и ценами в UZS |
| `/api/telegram/test` | `POST` | `app/api/telegram/test/route.ts` | Проверка связи и отправка тестового уведомления в Telegram через админку |
| `/api/neon/health` | `GET` | `app/api/neon/health/route.ts` | Проверка состояния подключения Neon Postgres & Object Storage |
