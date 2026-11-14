import { notFound } from "next/navigation";
import Link from "next/link";
import { getSportBySlug, getClubs, getSports } from "@/lib/storage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Flame, MapPin, ShieldCheck, Star, Activity, Sparkles } from "lucide-react";

interface SportDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sports = getSports();
  return sports.map((s) => ({ slug: s.slug }));
}

export default async function SportDetailPage({ params }: SportDetailPageProps) {
  const { slug } = await params;
  const sport = getSportBySlug(slug);

  if (!sport) {
    notFound();
  }

  const allClubs = getClubs();
  const relatedClubs = allClubs.filter((c) =>
    sport.relatedClubIds.includes(c.id) || c.category === sport.category
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-16">
        {/* Breadcrumb Back Link */}
        <div>
          <Link
            href="/sports"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-[#d4ff00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться в каталог дисциплин</span>
          </Link>
        </div>

        {/* Hero Section of the Sport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
              <Activity className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-white/80">ДИСЦИПЛИНА // {sport.category.toUpperCase()}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]">
              {sport.name}
            </h1>

            <p className="text-lg text-slate-300 font-normal leading-relaxed">
              {sport.tagline}
            </p>

            {/* Telemetry Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
              <div>
                <span className="telemetry-chip text-slate-500 block">КАЛОРИИ</span>
                <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {sport.calorieBurnPerHour} ккал/ч
                </span>
              </div>
              <div>
                <span className="telemetry-chip text-slate-500 block">ИНТЕНСИВНОСТЬ</span>
                <span className="text-lg font-black text-[#d4ff00]">{sport.intensity}</span>
              </div>
              <div>
                <span className="telemetry-chip text-slate-500 block">СРЕДНИЙ ЧЕК</span>
                <span className="text-lg font-black text-white">{sport.averagePrice}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#clubs-list"
                className="px-6 py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all"
              >
                <span>Выбрать клуб и корт</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/matcher"
                className="px-6 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-mono uppercase tracking-wider flex items-center gap-2"
              >
                <span>Проверить через AI Matcher</span>
                <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
              </Link>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-white/15 h-[420px] shadow-2xl relative">
              <img
                src={sport.heroImage}
                alt={sport.name}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-athletic border border-white/10">
                <span className="telemetry-chip text-[#d4ff00] block">РЕКОМЕНДАЦИЯ СПЕЦИАЛИСТОВ</span>
                <p className="text-xs text-slate-300 mt-1">{sport.whoIsItFor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Gear Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card space-y-4">
            <span className="telemetry-chip text-[#d4ff00] block">ФИЗИОЛОГИЯ И ПОЛЬЗА</span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              Что развивают тренировки
            </h3>
            <ul className="space-y-3 pt-2 text-sm text-slate-300">
              {sport.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card space-y-4">
            <span className="telemetry-chip text-white block">ЭКИПИРОВКА И ПОДГОТОВКА</span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              Что взять с собой
            </h3>
            <ul className="space-y-3 pt-2 text-sm text-slate-300">
              {sport.requiredGear.map((g, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-mono text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] shrink-0 mt-2" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-white/5 text-xs text-slate-400 font-mono">
              💡 Напоминаем: в клубах SPOTIFY профессиональный инвентарь (ракетки, перчатки, полотенца) выдается на первом визите бесплатно.
            </div>
          </div>
        </div>

        {/* Related Clubs Section */}
        <div id="clubs-list" className="space-y-8 pt-8 border-t border-white/10">
          <div>
            <span className="telemetry-chip text-[#d4ff00] block">АКТУАЛЬНЫЕ ПЛОЩАДКИ // ТАШКЕНТ</span>
            <h3 className="text-3xl font-black uppercase tracking-tight text-white">
              Где заниматься направлением «{sport.name}»
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedClubs.map((club) => (
              <div
                key={club.id}
                className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card overflow-hidden group hover:border-[#d4ff00]/40 transition-all flex flex-col justify-between shadow-2xl"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-85"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-mono text-white">
                    <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
                    <span>{club.metro}</span>
                  </div>
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold font-mono">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{club.rating}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-black uppercase tracking-tight text-white">
                    {club.name}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{club.description}</p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="telemetry-chip text-slate-500 block">ПРОБНОЕ</span>
                      <span className="text-sm font-black text-[#d4ff00] font-mono">
                        {club.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${club.priceTrial.toLocaleString("ru-RU")} UZS`}
                      </span>
                    </div>

                    <Link
                      href={`/clubs/${club.id}`}
                      className="px-4 py-2 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>Расписание</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
