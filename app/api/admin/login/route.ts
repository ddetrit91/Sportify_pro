import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || "Sportify_2026_Pro!";

    if (password && password === expectedPassword) {
      return NextResponse.json({ success: true, message: "Авторизация успешна" });
    }

    return NextResponse.json(
      { success: false, error: "Неверный пароль администратора. Попробуйте снова." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Ошибка при обработке запроса" },
      { status: 500 }
    );
  }
}
