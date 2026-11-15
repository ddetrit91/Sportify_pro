import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getLeads, updateLead } from "@/lib/storage";
import { dbUpdateLead, getDb } from "@/lib/db";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error(`⚠️ Stripe Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // Fallback для локальной разработки / тестов без сконфигурированного CLI webhook-secret
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    // Обработка событий оплаты
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      const isPaid = session.payment_status === "paid";
      const leadId = session.metadata?.leadId;
      const passCode = session.metadata?.passCode;
      const amountUzs = session.metadata?.amountUzs ? Number(session.metadata.amountUzs) : 850000;

      if (isPaid && leadId) {
        // Обновляем заказ как оплаченный
        updateLead(leadId, {
          status: "enrolled",
          notes: `[Оплата подтверждена через Stripe Webhook (${event.type}). Session: ${session.id}]`,
        });

        if (getDb()) {
          try {
            await dbUpdateLead(leadId, {
              status: "enrolled",
              notes: `[Оплата подтверждена через Stripe Webhook (${event.type}). Session: ${session.id}]`,
            });
          } catch (dbErr) {
            console.warn("Neon DB update warning in webhook:", dbErr);
          }
        }

        // Отправляем менеджеру в Telegram уведомление об успешной оплате
        const allLeads = getLeads();
        const found = allLeads.find((l) => l.id === leadId);
        if (found) {
          found.status = "enrolled";
          found.paymentMethod = "stripe";
          found.amountUzs = amountUzs;
          await sendTelegramNotification(found);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook handler exception:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
