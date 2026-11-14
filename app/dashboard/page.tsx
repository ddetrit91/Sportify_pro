import { getClubs } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DashboardClient } from "./DashboardClient";

export const metadata = {
  title: "Личный кабинет атлета // SPORTIFY",
  description: "Управление бронированиями, электронный пропуск с QR, история тренировок и статистика активности.",
};

export default function DashboardPage() {
  const clubs = getClubs();

  return (
    <main className="min-h-screen bg-void text-white flex flex-col">
      <Header />
      <DashboardClient clubs={clubs} />
      <Footer />
    </main>
  );
}
