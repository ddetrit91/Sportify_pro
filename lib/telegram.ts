import { Lead } from "./types";

interface TelegramSendResult {
  success: boolean;
  message?: string;
  error?: string;
  skipped?: boolean;
}

export async function sendTelegramNotification(lead: Lead): Promise<TelegramSendResult> {
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
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const text = `
🔥 <b>НОВАЯ ЗАЯВКА В SPOTIFY!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${escapeHtml(lead.name)}
📞 <b>Телефон:</b> <code>${escapeHtml(lead.phone)}</code>
🏆 <b>Направление:</b> ${escapeHtml(lead.sportInterest || "Не указано")}
📍 <b>Клуб:</b> ${escapeHtml(lead.clubName || "Не выбран (подбор)")}
💰 <b>Бюджет:</b> ${escapeHtml(lead.budget || "Не указан")}
🎯 <b>Источник:</b> ${escapeHtml(sourceLabels[lead.source] || lead.source)}
🕒 <b>Время:</b> ${formattedDate} МСК

💡 <b>AI-Профиль / Детали:</b>
<i>${escapeHtml(lead.aiSummary || "Прямая заявка без расширенного опроса")}</i>
━━━━━━━━━━━━━━━━━━
📊 <i>Статус: Новая | ID: ${lead.id}</i>
`.trim();

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
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
Все новые заявки с лендинга и AI-квиза будут мгновенно поступать в этот чат.
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
