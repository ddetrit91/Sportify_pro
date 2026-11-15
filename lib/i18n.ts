"use client";

import { useState, useEffect } from "react";

export type Language = "ru" | "uz";

export const translations = {
  ru: {
    // Navigation & Header
    navClubs: "Клубы Ташкента",
    navSports: "Виды спорта",
    navAiMatcher: "AI Matcher",
    navAdvantages: "Преимущества",
    navReviews: "Отзывы",
    navFaq: "FAQ",
    navBookTrial: "Записаться 0 UZS",
    navTicker1: "SPORTIFY LIVE // ТАШКЕНТ: 18 СЛОТОВ ОТКРЫТО СЕГОДНЯ",
    navTicker2: "ПЕРВАЯ ТРЕНИРОВКА 0 UZS (БЕСПЛАТНО)",

    // Plan selection
    planTitle: "Выберите тариф визита",
    planTrial: "Пробное занятие",
    planTrialPrice: "0 UZS",
    planTrialDesc: "Знакомство с клубом, фитнес-тест и персональный инструктаж",
    planTrialBadge: "Бесплатно",

    planMembership: "Месячный абонемент",
    planMembershipBadge: "Хит",
    planMembershipDesc: "Полный безлимитный доступ, групповые программы и сауна",

    // Payment methods
    paymentMethodTitle: "Способ оплаты",
    paymentClickPayme: "Перевод Click / Payme",
    paymentClickPaymeDesc: "Мгновенный перевод по номеру карты с загрузкой чека",
    paymentStripe: "Банковская карта (Stripe)",
    paymentStripeDesc: "Visa, Mastercard, Uzcard с мгновенным онлайн-списанием",

    // Transfer details
    transferCardTitle: "Реквизиты для оплаты через Click или Payme:",
    transferCardNum: "8600 4501 9283 7140",
    transferRecipient: "Получатель: ООО «SPORTIFY FITNESS TASHKENT»",
    transferBank: "Банк: Капиталбанк Ташкент",
    transferCopy: "Скопировать",
    transferCopied: "Скопировано!",
    transferAmountLabel: "Сумма к оплате:",

    // Receipt upload
    receiptUploadTitle: "Прикрепите чек об оплате (Скриншот или PDF): *",
    receiptUploadPrompt: "Нажмите для выбора файла или перетащите сюда",
    receiptUploadFormats: "Поддерживаются JPG, PNG, WebP или PDF (до 15 МБ)",
    receiptChangeFile: "Заменить файл",

    // Form inputs
    clientNameLabel: "Ваше имя: *",
    clientNamePlaceholder: "Сардор",
    clientPhoneLabel: "Телефон / Telegram (+998): *",
    clientPhonePlaceholder: "+998 (90) 123-45-67",
    visitDateLabel: "Дата визита:",
    visitTimeLabel: "Слот времени:",
    timeMorning: "08:00 - Утренний слот",
    timeDay: "12:30 - Дневной слот",
    timeEvening: "19:00 - Вечерний слот",
    timeLate: "20:30 - Поздний слот",
    sportLabel: "Дисциплина:",
    districtLabel: "Район Ташкента:",
    notesLabel: "Комментарий или ограничения (опционально):",
    notesPlaceholder: "Например: удобны тренировки после 19:00, болит поясница",

    // Stripe simulated card inputs
    stripeCardNumber: "Номер карты:",
    stripeCardExp: "ММ/ГГ:",
    stripeCardCvc: "CVC / CVV:",

    // Buttons & Submission
    btnSubmitTrial: "Подтвердить бронирование (0 UZS)",
    btnSubmitPaid: "Подтвердить оплату и получить VIP-пропуск",
    btnSubmitting: "Оформление пропуска...",
    securityNotice: "Ваши данные защищены сквозным шифрованием. Без спама и звонков.",

    // VIP Pass / Success
    passSuccessTitle: "VIP-ПРОПУСК АКТИВИРОВАН",
    passSuccessSubtitle: "Предъявите этот цифровой пропуск на ресепшене клуба",
    passIdLabel: "ПРОПУСК // ID",
    passAthleteLabel: "АТЛЕТ",
    passClubLabel: "КЛУБ / НАПРАВЛЕНИЕ",
    passStatusActive: "АКТИВЕН // ПОДТВЕРЖДЕН",
    passValidDays: "Действителен 7 дней",
    passDownloadBtn: "Сохранить пропуск (QR-код)",
    passCloseBtn: "Отлично, закрыть",
    passAnotherBtn: "Оформить еще один пропуск",
    passSavedPrompt: "QR-пропуск успешно сохранен на ваше устройство!",

    // Error messages
    errRequiredFields: "Пожалуйста, заполните имя и номер телефона (+998)",
    errReceiptRequired: "Пожалуйста, прикрепите фото или PDF чека об оплате",
    errNetwork: "Ошибка связи с сервером. Пожалуйста, попробуйте еще раз.",
  },
  uz: {
    // Navigation & Header
    navClubs: "Toshkent klublari",
    navSports: "Sport turlari",
    navAiMatcher: "AI Matcher",
    navAdvantages: "Afzalliklar",
    navReviews: "Fikrlar",
    navFaq: "FAQ",
    navBookTrial: "Yozilish 0 UZS",
    navTicker1: "SPORTIFY LIVE // TOSHKENT: BUGUN 18 TA SLOT OCHIQ",
    navTicker2: "BIRINCHI MASHG'ULOT 0 UZS (BEPUL)",

    // Plan selection
    planTitle: "Tashrif tarifini tanlang",
    planTrial: "Sinov mashg'uloti",
    planTrialPrice: "0 UZS",
    planTrialDesc: "Klub bilan tanishuv, fitnes-test va shaxsiy murabbiy ko'rigi",
    planTrialBadge: "Bepul",

    planMembership: "Oylik abonement",
    planMembershipBadge: "Ommabop",
    planMembershipDesc: "Cheksiz kirish, guruh mashg'ulotlari va sauna",

    // Payment methods
    paymentMethodTitle: "To'lov usuli",
    paymentClickPayme: "Click / Payme o'tkazmasi",
    paymentClickPaymeDesc: "Karta raqamiga tezkor to'lov va to'lov chekini yuklash",
    paymentStripe: "Bank kartasi (Stripe)",
    paymentStripeDesc: "Visa, Mastercard, Uzcard orqali to'g'ridan-to'g'ri to'lov",

    // Transfer details
    transferCardTitle: "Click yoki Payme orqali to'lov uchun rekvizitlar:",
    transferCardNum: "8600 4501 9283 7140",
    transferRecipient: "Qabul qiluvchi: «SPORTIFY FITNESS TASHKENT» MChJ",
    transferBank: "Bank: Kapitalbank Toshkent",
    transferCopy: "Nusxa olish",
    transferCopied: "Nusxa olindi!",
    transferAmountLabel: "To'lov miqdori:",

    // Receipt upload
    receiptUploadTitle: "To'lov chekini biriktiring (Skrinshot yoki PDF): *",
    receiptUploadPrompt: "Faylni tanlash uchun bosing yoki bu yerga tashlang",
    receiptUploadFormats: "JPG, PNG, WebP yoki PDF formatlar (15 MB gacha)",
    receiptChangeFile: "Faylni almashtirish",

    // Form inputs
    clientNameLabel: "Ismingiz: *",
    clientNamePlaceholder: "Sardor",
    clientPhoneLabel: "Telefon raqamingiz / Telegram (+998): *",
    clientPhonePlaceholder: "+998 (90) 123-45-67",
    visitDateLabel: "Tashrif sanasi:",
    visitTimeLabel: "Vaqt oralig'i:",
    timeMorning: "08:00 - Ertalabki slot",
    timeDay: "12:30 - Kunduzgi slot",
    timeEvening: "19:00 - Kechki slot",
    timeLate: "20:30 - Kechiktirilgan slot",
    sportLabel: "Sport yo'nalishi:",
    districtLabel: "Toshkent tumani:",
    notesLabel: "Izoh yoki cheklovlar (ixtiyoriy):",
    notesPlaceholder: "Masalan: soat 19:00 dan keyin qulay, belda og'riq bor",

    // Stripe simulated card inputs
    stripeCardNumber: "Karta raqami:",
    stripeCardExp: "OO/YY:",
    stripeCardCvc: "CVC / CVV:",

    // Buttons & Submission
    btnSubmitTrial: "Band qilishni tasdiqlash (0 UZS)",
    btnSubmitPaid: "To'lovni tasdiqlash va VIP-ruxsatnomani olish",
    btnSubmitting: "Ruxsatnoma rasmiylashtirilmoqda...",
    securityNotice: "Ma'lumotlaringiz xavfsiz himoyalangan. Spamsiz va keraksiz qo'ng'iroqlarsiz.",

    // VIP Pass / Success
    passSuccessTitle: "VIP-RUXSATNOMA FAOLLASHTIRILDI",
    passSuccessSubtitle: "Ushbu raqamli ruxsatnomani klub retsepsiyasida ko'rsating",
    passIdLabel: "RUXSATNOMA // ID",
    passAthleteLabel: "SPORTCHI",
    passClubLabel: "KLUB / YO'NALISH",
    passStatusActive: "FAOL // TASDIQLANGAN",
    passValidDays: "7 kun davomida amal qiladi",
    passDownloadBtn: "Ruxsatnomani saqlash (QR-kod)",
    passCloseBtn: "A'lo, yopish",
    passAnotherBtn: "Yana bitta ruxsatnoma olish",
    passSavedPrompt: "QR-ruxsatnoma qurilmangizga muvaffaqiyatli saqlandi!",

    // Error messages
    errRequiredFields: "Iltimos, ismingiz va telefon raqamingizni (+998) kiriting",
    errReceiptRequired: "Iltimos, to'lov cheki fotosurati yoki PDF faylini biriktiring",
    errNetwork: "Server bilan aloqada xatolik. Qaytadan urinib ko'ring.",
  },
};

export function useLanguage() {
  const [lang, setLangState] = useState<Language>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("sportify-lang") as Language;
    if (saved === "ru" || saved === "uz") {
      setLangState(saved);
    }

    const handleLangChange = () => {
      const current = localStorage.getItem("sportify-lang") as Language;
      if (current === "ru" || current === "uz") {
        setLangState(current);
      }
    };

    window.addEventListener("sportify-lang-change", handleLangChange);
    return () => window.removeEventListener("sportify-lang-change", handleLangChange);
  }, []);

  const setLang = (newLang: Language) => {
    localStorage.setItem("sportify-lang", newLang);
    setLangState(newLang);
    window.dispatchEvent(new Event("sportify-lang-change"));
  };

  const t = (key: keyof typeof translations.ru): string => {
    return translations[lang]?.[key] || translations.ru[key] || key;
  };

  return { lang, setLang, t };
}
