import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getLeads, updateLead } from "@/lib/storage";
import { dbGetLeads, dbUpdateLead, getDb } from "@/lib/db";
import { sendTelegramNotification } from "@/lib/telegram";
import { Lead } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Параметр session_id обязателен" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "STRIPE_SECRET_KEY не настроен" },
        { status: 500 }
      );
    }

    // ВАЖНО: Запрашиваем фактический статус сессии напрямую у серверов Stripe!
    // Не доверяем клиентскому редиректу.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const isPaid = session.payment_status === "paid";
    const leadId = session.metadata?.leadId;
    const passCode = session.metadata?.passCode || "SPT-2026-VIP";
    const name = session.metadata?.name || "Атлет";
    const clubName = session.metadata?.clubName || "Премиум Клуб Ташкента";
    const sportInterest = session.metadata?.sportInterest || "Абонемент";
    const amountUzs = session.metadata?.amountUzs ? Number(session.metadata.amountUzs) : 850000;
    const bookingDate = session.metadata?.bookingDate;
    const bookingTime = session.metadata?.bookingTime;

    if (isPaid && leadId) {
      // Обновляем статус лида на 'enrolled' (оплачен)
      try {
        updateLead(leadId, {
          status: "enrolled",
          notes: `[Оплачено картой через Stripe Checkout. Session: ${session.id}]`,
        });

        if (getDb()) {
          await dbUpdateLead(leadId, {
            status: "enrolled",
            notes: `[Оплачено картой через Stripe Checkout. Session: ${session.id}]`,
          });
        }

        // Находим актуальный объект лида для Telegram
        const allLeads = getLeads();
        const foundLead = allLeads.find((l) => l.id === leadId);

        if (foundLead) {
          foundLead.status = "enrolled";
          foundLead.paymentMethod = "stripe";
          foundLead.amountUzs = amountUzs;
          await sendTelegramNotification(foundLead);
        }
      } catch (updErr) {
        console.warn("Notice updating lead status after Stripe verification:", updErr);
      }
    }

    return NextResponse.json({
      success: true,
      paid: isPaid,
      paymentStatus: session.payment_status,
      passCode,
      name,
      clubName,
      sportInterest,
      amountUzs,
      date: bookingDate,
      timeSlot: bookingTime,
      customerEmail: session.customer_details?.email,
    });
  } catch (error: any) {
    console.error("Stripe Session verification error:", error);
    return NextResponse.json(
      {
        success: false,
        paid: false,
        error: error.message || "Ошибка при верификации платежа в Stripe",
      },
      { status: 500 }
    );
  }
}
