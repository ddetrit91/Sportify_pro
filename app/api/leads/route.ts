import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLead, updateLead, deleteLead } from "@/lib/storage";
import { sendTelegramNotification } from "@/lib/telegram";

export async function GET(request: NextRequest) {
  try {
    const leads = getLeads();
    return NextResponse.json({ success: true, leads });
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

    const lead = saveLead({
      name: String(name).trim(),
      phone: String(phone).trim(),
      sportInterest: sportInterest ? String(sportInterest).trim() : undefined,
      clubId: clubId ? String(clubId).trim() : undefined,
      clubName: clubName ? String(clubName).trim() : undefined,
      budget: budget ? String(budget).trim() : undefined,
      source: source || "landing_form",
      aiSummary: aiSummary ? String(aiSummary).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
    });

    // Асинхронно отправляем в Telegram
    const telegramResult = await sendTelegramNotification(lead);

    return NextResponse.json({
      success: true,
      lead,
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

    const updated = updateLead(id, { status, notes });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead: updated });
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

    const deleted = deleteLead(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка удаления" },
      { status: 500 }
    );
  }
}
