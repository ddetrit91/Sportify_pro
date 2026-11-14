import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLead, updateLead, deleteLead } from "@/lib/storage";
import { dbGetLeads, dbSaveLead, dbUpdateLead, dbDeleteLead, getDb } from "@/lib/db";
import { uploadToStorage, deleteFromStorage } from "@/lib/storage-s3";
import { sendTelegramNotification } from "@/lib/telegram";
import { Lead, LeadStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    // 1. Попытка прочитать из Neon Postgres
    if (getDb()) {
      try {
        const pgLeads = await dbGetLeads();
        return NextResponse.json({
          success: true,
          source: "neon_postgres",
          leads: pgLeads,
        });
      } catch (dbErr) {
        console.warn("Neon Postgres read error, falling back to local file:", dbErr);
      }
    }

    // 2. Fallback на локальный файл
    const leads = getLeads();
    return NextResponse.json({
      success: true,
      source: "local_json",
      leads,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, sportInterest, clubId, clubName, budget, source, aiSummary, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Имя и номер телефона обязательны" },
        { status: 400 }
      );
    }

    // Создаем объект лида
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newLead: Lead = {
      id: leadId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      sportInterest: sportInterest ? String(sportInterest).trim() : undefined,
      clubId: clubId ? String(clubId).trim() : undefined,
      clubName: clubName ? String(clubName).trim() : undefined,
      budget: budget ? String(budget).trim() : undefined,
      source: source || "landing_form",
      aiSummary: aiSummary ? String(aiSummary).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // 1. Сохраняем в Neon Postgres
    let pgSaved = false;
    if (getDb()) {
      try {
        await dbSaveLead(newLead);
        pgSaved = true;
      } catch (dbErr) {
        console.error("Neon Postgres insert error:", dbErr);
      }
    }

    // 2. Архивируем в Neon Object Storage (S3 bucket 'assets')
    let s3Saved = false;
    try {
      s3Saved = await uploadToStorage(
        `leads/${newLead.id}.json`,
        JSON.stringify(newLead, null, 2),
        "application/json"
      );
    } catch (s3Err) {
      console.warn("Neon Object Storage archive notice:", s3Err);
    }

    // 3. Сохраняем в локальный файл для оффлайн-совместимости
    try {
      saveLead(newLead);
    } catch (fileErr) {
      console.warn("Local storage write notice:", fileErr);
    }

    // 4. Отправляем моментальное уведомление в Telegram
    const telegramResult = await sendTelegramNotification(newLead);

    return NextResponse.json({
      success: true,
      lead: newLead,
      storage: {
        neonPostgres: pgSaved,
        neonObjectStorage: s3Saved,
      },
      telegram: telegramResult,
    });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка при сохранении заявки" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID заявки обязателен" },
        { status: 400 }
      );
    }

    // 1. Обновляем в Neon Postgres
    if (getDb()) {
      try {
        await dbUpdateLead(id, { status: status as LeadStatus, notes });
      } catch (dbErr) {
        console.error("Neon Postgres update error:", dbErr);
      }
    }

    // 2. Обновляем в локальном файле
    const updated = updateLead(id, { status, notes });

    return NextResponse.json({
      success: true,
      lead: updated || { id, status, notes },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка обновления заявки" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID заявки обязателен" },
        { status: 400 }
      );
    }

    // 1. Удаляем из Neon Postgres
    if (getDb()) {
      try {
        await dbDeleteLead(id);
      } catch (dbErr) {
        console.error("Neon Postgres delete error:", dbErr);
      }
    }

    // 2. Удаляем из Neon Object Storage
    try {
      await deleteFromStorage(`leads/${id}.json`);
    } catch (s3Err) {
      console.warn("Neon S3 delete notice:", s3Err);
    }

    // 3. Удаляем из локального файла
    const deleted = deleteLead(id);

    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка удаления" },
      { status: 500 }
    );
  }
}
