import { getSports, getClubs } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArrowUpRight, Flame, Activity, Sparkles, Filter } from "lucide-react";

export const metadata = {
  title: "Каталог видов спорта // SPORTIFY",
  description: "Исследуйте спортивные дисциплины Ташкента: физиология, энергозатраты, экипировка и лучшие клубы для тренировок.",
};

export default function SportsCatalogPage() {
  const sports = getSports();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />

      <div className="pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Page Hero */}
        <div className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
            <Activity className="w-3.5 h-3.5 text-[#d4ff00]" />
            <span className="telemetry-chip text-white/80">ДИСЦИПЛИНЫ // ФИЗИОЛОГИЯ И КОРТЫ</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Каталог видов спорта <span className="text-[#d4ff00]">в Ташкенте</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl font-normal">
            Изучите энергозатраты, целевые мышечные группы, необходимую экипировку и лучшие локации для каждого направления.
          </p>
        </div>

        {/* Sports Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport) => (
            <div
              key={sport.id}
              className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card overflow-hidden group hover:border-[#d4ff00]/40 transition-all flex flex-col justify-between shadow-2xl"
            >
              <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                <img
                  src={sport.heroImage}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{sport.calorieBurnPerHour} KCAL/H</span>
                </div>

                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[#d4ff00] text-xs font-mono font-bold">
                  {sport.intensity}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="telemetry-chip text-[#d4ff00] block mb-0.5">
                    {sport.category.toUpperCase()}
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight">
                    {sport.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {sport.tagline}
                </p>

                {/* Target Muscles */}
                <div>
                  <span className="telemetry-chip text-slate-500 block mb-1">
                    ЦЕЛЕВЫЕ МЫШЦЫ:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sport.targetMuscles.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Средняя цена: <b className="text-white">{sport.averagePrice}</b>
                  </span>

                  <Link
                    href={`/sports/${sport.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Подробнее</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
