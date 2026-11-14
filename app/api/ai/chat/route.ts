import { NextRequest, NextResponse } from "next/server";
import { getClubs } from "@/lib/storage";

/**
 * Очищает текст ответа искусственного интеллекта от артефактов Markdown (звездочек).
 * Полностью устраняет «**жирный текст**», списки со звездочками «* пункт» и любые случайные звездочки,
 * делая текст естественным, аккуратным и приятным для чтения живым языком.
 */
function cleanAiFormatting(rawText: string): string {
  if (!rawText) return "";

  let cleaned = rawText;

  // 1. Заменяем маркеры списков со звездочками (* пункт, ** пункт) на аккуратные буллеты
  cleaned = cleaned.replace(/^[ \t]*\*+[ \t]+/gm, "• ");

  // 2. Убираем двойные звездочки (**текст** -> текст)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1");

  // 3. Убираем одинарные звездочки (*текст* -> текст)
  cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1");

  // 4. Убираем любые оставшиеся одиночные или сдвоенные звездочки
  cleaned = cleaned.replace(/\*+/g, "");

  // 5. Заменяем хэштеги Markdown заголовков (### Заголовок -> Заголовок)
  cleaned = cleaned.replace(/^[ \t]*#{1,6}[ \t]+/gm, "");

  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], quizData } = body;

    if (!message && !quizData) {
      return NextResponse.json(
        { success: false, error: "Сообщение не может быть пустым" },
        { status: 400 }
      );
    }

    const clubs = getClubs();
    const clubsContext = clubs
      .map(
        (c) =>
          `• ${c.name} (${c.categoryName}, ${c.metro}): от ${Number(c.priceMonthly).toLocaleString("ru-RU")} UZS/мес, пробное ${
            c.priceTrial === 0 ? "0 UZS (Бесплатно)" : Number(c.priceTrial).toLocaleString("ru-RU") + " UZS"
          }. Теги: ${c.tags.join(", ")}`
      )
      .join("\n");

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

    let aiReply = "";
    let recommendedClubId: string | undefined = undefined;

    // 1. Попытка вызвать живой Gemini API, если ключ задан
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const systemPrompt = `Ты — персональный спортивный AI-консультант и ментор экосистемы "SPORTIFY" в Ташкенте (Узбекистан).
Твоя миссия — сделать спорт доступнее в Ташкенте, вдохновить пользователя и подобрать идеальную активность и клуб под его цели, уровень и бюджет.
Всегда общайся на понятном, энергичном и дружелюбном русском языке.
Все цены указывай строго в узбекских сумах (UZS). Никаких рублей или знаков ₽!
Телефоны и контакты для Ташкента: +998 (71) 200-77-90.
Мягко подводи пользователя к записи на первое бесплатное пробное занятие (0 UZS), напоминая, что первый шаг самый важный.

ПРАВИЛА ОФОРМЛЕНИЯ ТЕКСТА (СТРОГО):
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать звездочки (*) в тексте ответа! Не ставь звездочки перед предложениями, не пиши жирный текст со звездочками (**слово**), не используй звездочки в списках (* пункт).
- Для оформления списков используй понятные эмодзи (•, 📍, ⚡, 🥊, 🏊, 🎾, 🔥, 🧘) или дефис (-).
- Названия клубов пиши обычными словами или выделяй кавычками «...».
- Пиши живым, естественным и чистым языком, как заботливый профессиональный тренер в мессенджере.

Доступные клубы-партнеры платформы SPORTIFY в Ташкенте:
${clubsContext}

Если пользователь описывает свои цели, порекомендуй конкретное направление и клуб из списка выше.`;

        const contents = [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "Понял! Я готов помогать клиентам подбирать спорт и рекомендовать клубы SPORTIFY без звездочек и с красивым форматированием." }],
          },
          ...history.map((h: any) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          })),
          {
            role: "user",
            parts: [
              {
                text: quizData
                  ? `Пользователь заполнил спортивный профиль:
Цель: ${quizData.goal}
Уровень подготовки: ${quizData.experience}
Интерес к спорту: ${quizData.sportType}
Предпочитаемая локация: ${quizData.location}
Желаемый бюджет: ${quizData.budget}

Сформируй персональный вдохновляющий план и порекомендуй лучший клуб из каталога без звездочек в тексте.`
                  : message,
              },
            ],
          },
        ];

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      } catch (geminiError) {
        console.warn("Gemini API call error, falling back to smart engine:", geminiError);
      }
    }

    // 2. Умный автономный экспертный движок (если ключ не задан или ошибка запроса)
    if (!aiReply) {
      const lower = (message || "").toLowerCase();
      const goal = (quizData?.goal || "").toLowerCase();
      const sport = (quizData?.sportType || "").toLowerCase();

      if (quizData) {
        // Ответ на квиз
        if (goal.includes("похудение") || sport.includes("фитнес")) {
          recommendedClubId = "club-1";
          aiReply = `Отличный выбор цели! Для эффективного снижения веса и тонуса мышц в Ташкенте идеально подойдут интервальные тренировки и кроссфит с сертифицированным наставником.
🔥 Мы рекомендуем флагманский клуб «Apex Performance» (ул. Нукусская, Мирабадский р-н). Здесь мощнейшая зона функционального тренинга и зона восстановления. Пробное занятие бесплатно (0 UZS)!`;
        } else if (goal.includes("стресс") || sport.includes("бокс") || sport.includes("единоборства")) {
          recommendedClubId = "club-2";
          aiReply = `Единоборства — лучший способ полностью перезагрузить голову после рабочего дня, укрепить дух и научиться самообороне.
🥊 Наш главный выбор в Ташкенте — «Buka Boxing Gym» (ул. Абая, Шайхантахурский р-н). Топовые тренеры, бережный подход к технике для новичков и драйвовая бойцовская атмосфера. Пробное занятие 0 UZS!`;
        } else if (goal.includes("спина") || goal.includes("гибкость") || sport.includes("йога")) {
          recommendedClubId = "club-5";
          aiReply = `Забота о спине и осанке — лучшая инвестиция в здоровье. Пилатес на реформерах снимает зажимы и формирует ровную осанку без опасных осевых нагрузок.
🧘 Рекомендуем студию «Prana Pilates & Reformer» (пр-т Мустакиллик, Мирзо-Улугбекский р-н). Пробная тренировка бесплатная (0 UZS), вам предоставят персонального наставника.`;
        } else if (sport.includes("плавание") || goal.includes("выносливость")) {
          recommendedClubId = "club-3";
          aiReply = `Плавание гармонично развивает все группы мышц, укрепляет сердечно-сосудистую систему и бережёт суставы.
🏊 Идеальный выбор в столице — «Aquaterra Swim & Wellness» (ул. Бабура, Яккасарайский р-н) с олимпийской 50-метровой чашей и многоступенчатой очисткой воды. Пробный визит 0 UZS!`;
        } else if (sport.includes("теннис") || sport.includes("падел")) {
          recommendedClubId = "club-4";
          aiReply = `Падел и теннис — это главный мировой тренд, драйв, тактика и мощный заряд позитива!
🎾 Рекомендуем «Padel Arena Tashkent» (Юнусабадский р-н, м. Шахристан). Крытые панорамные корты с климат-контролем. Первое вводное занятие 0 UZS!`;
        } else {
          recommendedClubId = "club-1";
          aiReply = `На основе вашего спортивного профиля мы подобрали универсальную программу активностей в Ташкенте для мягкого и уверенного старта.
⚡ Рекомендуем начать с «Apex Performance» на Нукусской — современный клуб с бесплатным пробным занятием (0 UZS) и персональным планом!`;
        }
      } else {
        // Ответ на диалог в чате
        if (lower.includes("плаван") || lower.includes("бассейн")) {
          recommendedClubId = "club-3";
          aiReply = `Плавание — потрясающий выбор для здоровья спины и выносливости! В Ташкенте подключен топовый комплекс «Aquaterra Swim & Wellness» (ул. Бабура) с 50м олимпийской чашей. Хотите забронировать бесплатный пробный визит (0 UZS)?`;
        } else if (lower.includes("бокс") || lower.includes("драться") || lower.includes("единоборств")) {
          recommendedClubId = "club-2";
          aiReply = `Для единоборств в Ташкенте у нас есть легендарный клуб «Buka Boxing Gym» (ул. Абая). Группы как для абсолютных новичков «с нуля», так и для продвинутых атлетов. Пробная тренировка бесплатна (0 UZS). Оформить пропуск?`;
        } else if (lower.includes("йог") || lower.includes("пилатес") || lower.includes("спин") || lower.includes("осанк")) {
          recommendedClubId = "club-5";
          aiReply = `Если хочется снять напряжение в спине и обрести легкость — советую «Prana Pilates & Reformer» (пр-т Мустакиллик). Реформеры бережно вытягивают позвоночник. Первое вводное занятие бесплатное (0 UZS)!`;
        } else if (lower.includes("теннис") || lower.includes("падел")) {
          recommendedClubId = "club-4";
          aiReply = `Падел-теннис в Ташкенте стремительно набирает популярность! В «Padel Arena Tashkent» (Юнусабад) великолепные панорамные корты и классное комьюнити. Забронировать бесплатный вводный слот?`;
        } else if (lower.includes("цен") || lower.includes("стоим") || lower.includes("скидк") || lower.includes("абонемент")) {
          aiReply = `Абонементы в партнерских клубах SPORTIFY в Ташкенте начинаются от 750 000 UZS в месяц, а при первой записи через наш сервис вводное занятие предоставляется бесплатно (0 UZS). Какой район Ташкента или вид спорта вам ближе?`;
        } else if (lower.includes("новичок") || lower.includes("с чего начать") || lower.includes("боюсь")) {
          aiReply = `Не переживайте, более 70% наших пользователей в Ташкенте начинают спорт с нуля! AI-система подбирает залы только с бережным отношением к новичкам и вводным инструктажем. Пройдите наш быстрый квиз прямо сейчас!`;
        } else {
          aiReply = `Здравствуйте! Я персональный AI-консультант SPORTIFY в Ташкенте ⚡ Помогаю найти вид спорта по душе, сравнить цены и условия в лучших клубах столицы. Какая у вас главная цель (похудение, здоровая спина, выносливость, антистресс) или какой спорт вам интересен?`;
        }
      }
    }

    // Всегда очищаем ответ перед возвратом клиенту
    const finalCleanReply = cleanAiFormatting(aiReply);

    return NextResponse.json({
      success: true,
      reply: finalCleanReply,
      recommendedClubId,
    });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Ошибка работы AI-помощника",
        reply: "Извините, произошла заминка в AI-модуле. Но наши консультанты готовы помочь — оставьте заявку в форме ниже!",
      },
      { status: 500 }
    );
  }
}
