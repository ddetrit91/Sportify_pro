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
    <main className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      <DashboardClient clubs={clubs} />
      <Footer />
    </main>
  );
}
