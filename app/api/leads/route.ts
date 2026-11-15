import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { getLeads, saveLead, updateLead, deleteLead } from "@/lib/storage";
import { dbGetLeads, dbSaveLead, dbUpdateLead, dbDeleteLead, getDb } from "@/lib/db";
import { uploadToStorage, deleteFromStorage } from "@/lib/storage-s3";
import { sendTelegramNotification } from "@/lib/telegram";
import { Lead, LeadStatus, PlanType, PaymentMethod } from "@/lib/types";

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
    const contentType = request.headers.get("content-type") || "";

    let name = "";
    let phone = "";
    let sportInterest: string | undefined;
    let clubId: string | undefined;
    let clubName: string | undefined;
    let budget: string | undefined;
    let source: any = "landing_form";
    let aiSummary: string | undefined;
    let notes: string | undefined;
    let bookingDate: string | undefined;
    let bookingTime: string | undefined;
    let planType: PlanType = "trial";
    let paymentMethod: PaymentMethod | undefined;
    let amountUzs: number | undefined;
    let language: "ru" | "uz" = "ru";

    let savedReceiptPath: string | undefined;
    let receiptUrl: string | undefined;
    let receiptName: string | undefined;
    let receiptMimeType: string | undefined;

    // Генерируем уникальный ID пропуска, чтобы клиенты никогда не смешивались
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const passCode = `SPT-2026-${randomSuffix}`;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = String(formData.get("name") || "").trim();
      phone = String(formData.get("phone") || "").trim();
      sportInterest = (formData.get("sportInterest") as string) || undefined;
      clubId = (formData.get("clubId") as string) || undefined;
      clubName = (formData.get("clubName") as string) || undefined;
      budget = (formData.get("budget") as string) || undefined;
      source = (formData.get("source") as any) || "landing_form";
      aiSummary = (formData.get("aiSummary") as string) || undefined;
      notes = (formData.get("notes") as string) || undefined;
      bookingDate = (formData.get("bookingDate") as string) || undefined;
      bookingTime = (formData.get("bookingTime") as string) || undefined;
      planType = ((formData.get("planType") as string) === "membership" ? "membership" : "trial");
      paymentMethod = (formData.get("paymentMethod") as PaymentMethod) || (planType === "trial" ? "free" : "click_payme");
      
      const parsedAmount = formData.get("amountUzs");
      if (parsedAmount) {
        amountUzs = Number(parsedAmount);
      }
      
      const langVal = formData.get("language") as string;
      if (langVal === "uz" || langVal === "ru") {
        language = langVal;
      }

      // Обработка файла чека
      const receiptFile = formData.get("receipt") as File | null;
      if (receiptFile && typeof receiptFile === "object" && "arrayBuffer" in receiptFile && receiptFile.size > 0) {
        receiptName = receiptFile.name;
        receiptMimeType = receiptFile.type || "image/jpeg";

        const bytes = await receiptFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 1. Создаем Base64 Data URL (если размер до 12 МБ), чтобы чек 100% открывался в админке на Vercel
        if (buffer.length < 12 * 1024 * 1024) {
          receiptUrl = `data:${receiptMimeType};base64,${buffer.toString("base64")}`;
        }

        // 2. Временное сохранение в гарантированно доступной директории os.tmpdir() (на Vercel это /tmp)
        // Это необходимо для чтения sendTelegramNotification при отправке фото/документа в бота
        const ext = path.extname(receiptFile.name) || (receiptFile.type === "application/pdf" ? ".pdf" : ".jpg");
        const safeBase = path.basename(receiptFile.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
        const savedFileName = `receipt_${passCode}_${Date.now()}_${safeBase}${ext}`;

        try {
          const tmpDir = path.join(os.tmpdir(), "sportify_receipts");
          if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
          }
          savedReceiptPath = path.join(tmpDir, savedFileName);
          fs.writeFileSync(savedReceiptPath, buffer);
        } catch (tmpErr) {
          console.warn("Temp receipt write notice in /tmp:", tmpErr);
        }

        // 3. Попытка сохранить в public/uploads/receipts (для локальной разработки, на Vercel EROFS подавляется)
        try {
          const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const localPath = path.join(uploadDir, savedFileName);
          fs.writeFileSync(localPath, buffer);
          if (!receiptUrl) {
            receiptUrl = `/uploads/receipts/${savedFileName}`;
          }
        } catch (fsErr) {
          // Подавляем EROFS на Vercel
          console.warn("Read-only filesystem detected on Vercel; using Data URL / S3.");
        }

        // 4. Архивация чека в Neon Object Storage (S3 bucket 'assets')
        try {
          const s3Key = `receipts/${passCode}_${Date.now()}_${safeBase}${ext}`;
          const s3UploadedUrl = await uploadToStorage(s3Key, buffer, receiptMimeType);
          if (s3UploadedUrl && typeof s3UploadedUrl === "string") {
            receiptUrl = s3UploadedUrl;
          }
        } catch (s3Err) {
          console.warn("Neon S3 receipt upload notice:", s3Err);
        }
      }
    } else {
      const body = await request.json();
      name = String(body.name || "").trim();
      phone = String(body.phone || "").trim();
      sportInterest = body.sportInterest ? String(body.sportInterest).trim() : undefined;
      clubId = body.clubId ? String(body.clubId).trim() : undefined;
      clubName = body.clubName ? String(body.clubName).trim() : undefined;
      budget = body.budget ? String(body.budget).trim() : undefined;
      source = body.source || "landing_form";
      aiSummary = body.aiSummary ? String(body.aiSummary).trim() : undefined;
      notes = body.notes ? String(body.notes).trim() : undefined;
      bookingDate = body.bookingDate ? String(body.bookingDate).trim() : undefined;
      bookingTime = body.bookingTime ? String(body.bookingTime).trim() : undefined;
      planType = body.planType === "membership" ? "membership" : "trial";
      paymentMethod = body.paymentMethod || (planType === "trial" ? "free" : "click_payme");
      amountUzs = body.amountUzs ? Number(body.amountUzs) : undefined;
      language = body.language === "uz" ? "uz" : "ru";
      receiptUrl = body.receiptUrl || undefined;
      receiptName = body.receiptName || undefined;
    }

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Имя и номер телефона обязательны" },
        { status: 400 }
      );
    }

    // Создаем объект лида с персональным passCode
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newLead: Lead = {
      id: leadId,
      name,
      phone,
      sportInterest,
      clubId,
      clubName,
      budget: budget || (planType === "trial" ? "0 UZS (Бесплатный визит)" : `${amountUzs ? Number(amountUzs).toLocaleString("ru-RU") : "850 000"} UZS (Абонемент)`),
      source,
      aiSummary,
      notes,
      bookingDate,
      bookingTime,
      planType,
      paymentMethod,
      receiptUrl,
      receiptName,
      passCode,
      amountUzs: amountUzs || (planType === "trial" ? 0 : 850000),
      language,
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

    // 4. Отправляем моментальное уведомление в Telegram (с файлом чека при наличии)
    const telegramResult = await sendTelegramNotification(newLead, savedReceiptPath, receiptMimeType);

    return NextResponse.json({
      success: true,
      lead: newLead,
      passCode: newLead.passCode,
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
