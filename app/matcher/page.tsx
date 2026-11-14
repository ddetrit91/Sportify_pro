import { getClubs } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatcherClient } from "./MatcherClient";

export const metadata = {
  title: "AI Sport Matcher // Интеллектуальный синтезатор спорта в Ташкенте",
  description: "Персональный AI-подбор тренировок и клубов Ташкента на основе биометрических и психологических параметров.",
};

export default function MatcherPage() {
  const clubs = getClubs();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />
      <MatcherClient clubs={clubs} />
      <Footer />
    </main>
  );
}
