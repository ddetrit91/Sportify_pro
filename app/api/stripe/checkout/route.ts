import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { saveLead } from "@/lib/storage";
import { dbSaveLead, getDb } from "@/lib/db";
import { uploadToStorage } from "@/lib/storage-s3";
import { Lead } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      clubId,
      clubName,
      sportInterest,
      amountUzs = 850000,
      language = "ru",
      bookingDate,
      bookingTime,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Имя и номер телефона (+998) обязательны" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "STRIPE_SECRET_KEY не настроен на сервере" },
        { status: 500 }
      );
    }

    // Determine host origin for redirect URLs
    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "http://localhost:3000";

    // Generate unique Pass Code for this customer
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const passCode = `SPT-2026-${randomSuffix}`;

    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newLead: Lead = {
      id: leadId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      clubId: clubId ? String(clubId).trim() : undefined,
      clubName: clubName ? String(clubName).trim() : undefined,
      sportInterest: sportInterest ? String(sportInterest).trim() : undefined,
      budget: `${Number(amountUzs).toLocaleString("ru-RU")} UZS (Stripe Онлайн)`,
      source: "catalog",
      aiSummary: `Онлайн-оплата абонемента через Stripe Checkout. Клуб: "${clubName || "Не указан"}". Дата: ${bookingDate || "Ближайшая"}. Слот: ${bookingTime || "19:00"}.`,
      status: "new",
      planType: "membership",
      paymentMethod: "stripe",
      paymentStatus: "pending",
      amountUzs: Number(amountUzs),
      language: language === "uz" ? "uz" : "ru",
      passCode,
      bookingDate,
      bookingTime,
      createdAt: new Date().toISOString(),
    };

    // Save lead in local storage and Neon Postgres
    if (getDb()) {
      try {
        await dbSaveLead(newLead);
      } catch (dbErr) {
        console.warn("Neon DB save warning during Stripe init:", dbErr);
      }
    }

    try {
      saveLead(newLead);
    } catch (saveErr) {
      console.warn("Local storage save warning during Stripe init:", saveErr);
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "uzs",
            product_data: {
              name: `SPORTIFY // ${clubName || "VIP Клубный абонемент"}`,
              description: `Персональный абонемент #${passCode} (${name}, ${phone}) — Ташкент`,
            },
            unit_amount: Math.round(Number(amountUzs) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        leadId: newLead.id,
        passCode: newLead.passCode || passCode,
        name: newLead.name,
        phone: newLead.phone,
        clubName: newLead.clubName || "",
        sportInterest: newLead.sportInterest || "",
        amountUzs: String(amountUzs),
        language: newLead.language || "ru",
        bookingDate: bookingDate || "",
        bookingTime: bookingTime || "",
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel?pass_code=${passCode}`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      passCode,
      leadId: newLead.id,
    });
  } catch (error: any) {
    console.error("Stripe Checkout Session error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Ошибка при создании сессии Stripe Checkout",
      },
      { status: 500 }
    );
  }
}
