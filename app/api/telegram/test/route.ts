import { NextResponse } from "next/server";
import { sendTelegramTestMessage } from "@/lib/telegram";

export async function POST() {
  try {
    const result = await sendTelegramTestMessage();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка отправки тестового сообщения" },
      { status: 500 }
    );
  }
}
