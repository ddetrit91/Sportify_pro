import { getClubs } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingTerminalClient } from "./BookingTerminalClient";

export const metadata = {
  title: "Онлайн-запись и бронирование в Ташкенте // SPORTIFY",
  description: "Оформите электронный пропуск на пробную тренировку за 0 UZS в любой сертифицированный клуб Ташкента.",
};

export default function BookingPage() {
  const clubs = getClubs();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      <BookingTerminalClient clubs={clubs} />
      <Footer />
    </main>
  );
}
