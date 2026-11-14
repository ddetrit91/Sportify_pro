import { getClubs } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClubsDirectoryClient } from "./ClubsDirectoryClient";

export const metadata = {
  title: "Каталог спортивных клубов Ташкента // SPORTIFY",
  description: "Проверенные фитнес-клубы, корты для падел-тенниса, бойцовские залы и бассейны Ташкента с онлайн-записью за 0 UZS.",
};

export default function ClubsPage() {
  const clubs = getClubs();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      <ClubsDirectoryClient initialClubs={clubs} />
      <Footer />
    </main>
  );
}
