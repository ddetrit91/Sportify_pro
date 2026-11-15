import fs from "fs";
import path from "path";
import { Lead } from "./types";

interface TelegramSendResult {
  success: boolean;
  message?: string;
  error?: string;
  skipped?: boolean;
}

export async function sendTelegramNotification(
  lead: Lead,
  receiptFilePath?: string,
  receiptMimeType?: string
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log(
      `[TELEGRAM] Токен или Chat ID не заданы в .env.local. Уведомление о заявке #${lead.id} сохранено локально.`
    );
    return {
      success: false,
      skipped: true,
      message: "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены в .env.local",
    };
  }

  const sourceLabels: Record<string, string> = {
    quiz: "Интерактивный AI-Квиз",
    catalog: "Каталог клубов (кнопка Записаться)",
    landing_form: "Главная форма лендинга",
    ai_chat: "AI-Консультант чата",
  };

  const formattedDate = new Date(lead.createdAt).toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const planLabel =
    lead.planType === "membership"
      ? `💎 Месячный абонемент (${lead.amountUzs ? Number(lead.amountUzs).toLocaleString("ru-RU") + " UZS" : lead.budget || "Тариф клуба"})`
      : `🟢 Бесплатный вводный визит (0 UZS)`;

  const paymentLabel =
    lead.paymentMethod === "click_payme"
      ? `📲 Перевод Click / Payme ${receiptFilePath ? "📎 [ЧЕК ПРИКРЕПЛЕН]" : ""}`
      : lead.paymentMethod === "stripe"
      ? `💳 Онлайн-оплата картой (Stripe)`
      : `🎫 Бесплатный пропуск (0 UZS)`;

  const passCodeLabel = lead.passCode || `SPT-${new Date().getFullYear()}-${lead.id.slice(-4)}`;

  const captionText = `
⚡ <b>НОВАЯ ЗАЯВКА И ОПЛАТА // SPORTIFY</b>
━━━━━━━━━━━━━━━━━━
🎫 <b>ПРОПУСК:</b> <code>#${escapeHtml(passCodeLabel)}</code>
👤 <b>Клиент:</b> ${escapeHtml(lead.name)}
📞 <b>Телефон:</b> <code>${escapeHtml(lead.phone)}</code>
🏆 <b>Спорт / Направление:</b> ${escapeHtml(lead.sportInterest || "Не указано")}
📍 <b>Клуб:</b> ${escapeHtml(lead.clubName || "Не выбран (подбор)")}
💳 <b>Тариф:</b> ${escapeHtml(planLabel)}
💰 <b>Оплата:</b> ${escapeHtml(paymentLabel)}
🌐 <b>Язык:</b> ${lead.language === "uz" ? "🇺🇿 O'zbekcha" : "🇷🇺 Русский"}
🕒 <b>Время:</b> ${formattedDate} (Ташкент)

💡 <b>Детали бронирования:</b>
<i>${escapeHtml(lead.aiSummary || "Прямая запись на тренировку")}</i>
━━━━━━━━━━━━━━━━━━
📊 <i>ID: ${lead.id} | Статус: ${lead.status.toUpperCase()}</i>
`.trim();

  try {
    // 1. Если прикреплен файл чека (картинка или PDF)
    if (receiptFilePath && fs.existsSync(receiptFilePath)) {
      const fileBuffer = fs.readFileSync(receiptFilePath);
      const filename = path.basename(receiptFilePath);
      const isPdf =
        receiptMimeType === "application/pdf" ||
        filename.toLowerCase().endsWith(".pdf");

      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", captionText);
      formData.append("parse_mode", "HTML");

      const blob = new Blob([fileBuffer], {
        type: isPdf ? "application/pdf" : receiptMimeType || "image/jpeg",
      });

      if (isPdf) {
        formData.append("document", blob, filename);
        const url = `https://api.telegram.org/bot${token}/sendDocument`;
        const response = await fetch(url, { method: "POST", body: formData });
        const data = await response.json();
        if (response.ok && data.ok) {
          return { success: true, message: "Чек (PDF) успешно отправлен в Telegram" };
        }
      } else {
        formData.append("photo", blob, filename);
        const url = `https://api.telegram.org/bot${token}/sendPhoto`;
        const response = await fetch(url, { method: "POST", body: formData });
        const data = await response.json();
        if (response.ok && data.ok) {
          return { success: true, message: "Чек (Фото) успешно отправлен в Telegram" };
        }
      }
    }

    // 2. Стандартная отправка текстового сообщения (если чека нет или отправка фото дала сбой)
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: captionText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.error("[TELEGRAM ERROR]:", data);
      return {
        success: false,
        error: data.description || "Ошибка отправки в Telegram API",
      };
    }

    return {
      success: true,
      message: "Уведомление успешно доставлено в Telegram",
    };
  } catch (err: any) {
    console.error("[TELEGRAM EXCEPTION]:", err);
    return {
      success: false,
      error: err.message || "Сетевая ошибка при обращении к Telegram",
    };
  }
}

export async function sendTelegramTestMessage(): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      success: false,
      skipped: true,
      error: "Укажите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env.local",
    };
  }

  const text = `
⚡ <b>SPOTIFY — ТЕСТОВОЕ УВЕДОМЛЕНИЕ</b>
━━━━━━━━━━━━━━━━━━
Интеграция с Telegram успешно настроена и активна!
Все новые заявки, оплаты Click/Payme и чеки будут мгновенно поступать в этот чат.
🕒 <i>Время проверки: ${new Date().toLocaleTimeString("ru-RU")}</i>
`.trim();

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      return { success: false, error: data.description || "Ошибка Telegram API" };
    }
    return { success: true, message: "Тестовое сообщение успешно отправлено!" };
  } catch (err: any) {
    return { success: false, error: err.message || "Ошибка подключения к Telegram" };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
