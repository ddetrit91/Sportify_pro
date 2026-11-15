"use client";

import { motion } from "framer-motion";
import { Star, Quote, Activity, Check, MapPin, Zap, Flame, ShieldCheck } from "lucide-react";
import { TiltCard } from "./motion/TiltCard";
import { CounterNumber } from "./motion/CounterNumber";

export function AthleteStories() {
  const stories = [
    {
      id: 1,
      name: "Сардор Рахимов",
      role: "Senior Tech Lead, IT Park",
      discipline: "Реформер-пилатес & Бассейн",
      club: "Prana Pilates Mustakillik",
      location: "м. Мустакиллик",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      metric: "0 болей в спине",
      metricLabel: "спустя 3 недели тренировок",
      quote:
        "После 10 часов в кресле за кодом поясница не давала покоя. AI SPORTIFY подобрал реформеры на Мустакиллик. Первое пробное занятие (0 UZS) сняло зажимы, тренер поставил дыхание. Теперь спина ровная, а продуктивность выросла в разы.",
      stats: { sessions: 28, regularity: "100% регулярность" },
      tag: "ЗДОРОВЬЕ & ОСАНКА",
    },
    {
      id: 2,
      name: "Мадина Юсупова",
      role: "Brand Director, Tashkent City",
      discipline: "Падел & Большой теннис",
      club: "Padel Arena Yunusabad",
      location: "Юнусабад, 4-й квартал",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
      metric: "-7.4 кг",
      metricLabel: "и финал любительского кубка",
      quote:
        "Тренажерка всегда казалась скучной рутиной. В падел на Юнусабаде влюбилась с первой же подачи: драйв, крутое комьюнити, а калории горят молниеносно. Через SPORTIFY нашла постоянную партнершу по корту прямо у офиса.",
      stats: { sessions: 34, regularity: "100% регулярность" },
      tag: "ФОРМА & КАРДИО",
    },
    {
      id: 3,
      name: "Джасур Махмудов",
      role: "Founder E-commerce",
      discipline: "Бокс & Силовой тренинг",
      club: "Buka Boxing Gym",
      location: "ул. Абая, м. Пахтакор",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
      metric: "100% фокус",
      metricLabel: "полная ликвидация выгорания",
      quote:
        "В 32 года впервые пришел в Buka Boxing на Абая. Тренеры ставят филигранную технику и защиту. Полтора часа интенсивной работы на снарядах напрочь выбивают рабочие тревоги из головы лучше любых медитаций.",
      stats: { sessions: 42, regularity: "100% регулярность" },
      tag: "СИЛА & АНТИСТРЕСС",
    },
  ];

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="relative">
            {/* Soft Ambient Radial Shadow: gracefully dims background kinetic lines without any harsh borders */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-8 -inset-y-6 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_rgba(248,250,252,0.9)_0%,_rgba(248,250,252,0.6)_50%,_transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(7,8,10,0.92)_0%,_rgba(7,8,10,0.65)_55%,_transparent_100%)] blur-2xl pointer-events-none -z-10"
            />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-[#d4ff00]/30 bg-white/80 dark:bg-[#d4ff00]/10 mb-3 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-slate-800 dark:text-[#d4ff00]">ATHLETE COMMUNITY STORIES // LIVE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-[1.1] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              Реальные истории <span className="text-[#d4ff00]">атлетов Ташкента</span>
            </h2>
          </div>

          {/* Subtitle Telemetry Pod */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#0c0e14]/75 border border-slate-200 dark:border-[#d4ff00]/25 max-w-md shrink-0 shadow-sm backdrop-blur-sm">
            <p className="text-sm text-slate-900 dark:text-white font-medium leading-relaxed">
              Более{" "}
              <span className="text-lime-600 dark:text-[#d4ff00] font-black underline decoration-[#d4ff00]/40 underline-offset-4">
                <CounterNumber value={14800} /> жителей Ташкента
              </span>{" "}
              нашли свой спорт со SPORTIFY и тренируются в топовых клубах столицы.
            </p>
          </div>
        </div>

        {/* Premium Athlete Cards Grid with 3D Mouse Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="h-full"
            >
              <TiltCard maxTilt={5} glareOpacity={0.2} className="rounded-3xl">
                <div className="relative h-full rounded-3xl border border-slate-200/90 dark:border-[#d4ff00]/25 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-sm p-6 sm:p-7 flex flex-col justify-between group hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.12)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.3)] before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent overflow-hidden">
                  {/* Luxury Background Watermark Quote Icon */}
                  <Quote className="w-16 h-16 text-slate-200/60 dark:text-white/[0.03] absolute -top-2 right-4 pointer-events-none group-hover:text-[#d4ff00]/10 transition-colors" />

                  <div>
                    {/* Top Badge Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                        <Zap className="w-3 h-3 text-lime-600 dark:text-[#d4ff00]" />
                        <span>{story.tag}</span>
                      </span>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-500 dark:text-amber-400 text-xs font-black">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                        <span>5.0</span>
                      </div>
                    </div>

                    {/* User Portrait & Credentials */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-slate-200 dark:ring-white/20 group-hover:ring-[#d4ff00]/70 transition-all shrink-0 shadow-md">
                        <img
                          src={story.image}
                          alt={story.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Verified Athlete Micro-Badge */}
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-tl-lg bg-[#d4ff00] text-slate-950 flex items-center justify-center shadow-sm">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-display font-black text-slate-950 dark:text-white text-base sm:text-lg leading-snug truncate">
                          {story.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          {story.role}
                        </p>
                        <span className="text-[11px] text-lime-700 dark:text-[#d4ff00] font-extrabold block truncate mt-0.5">
                          {story.discipline}
                        </span>
                      </div>
                    </div>

                    {/* Key Metric Highlight Box (Sports Telemetry Console) */}
                    <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50/80 dark:from-white/[0.08] dark:to-white/[0.02] border border-slate-200/90 dark:border-white/10 mb-5 relative overflow-hidden group-hover:border-[#d4ff00]/40 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xl sm:text-2xl font-black font-display text-slate-950 dark:text-white block uppercase tracking-tight">
                            {story.metric}
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-0.5 block">
                            {story.metricLabel}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                            <CounterNumber value={story.stats.sessions} /> тренировок
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-lime-700 dark:text-[#d4ff00] font-black uppercase tracking-wider mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
                            <span>{story.stats.regularity}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quote with Enhanced Typography */}
                    <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      «{story.quote}»
                    </p>
                  </div>

                  {/* Card Footer: Verified Club & Location */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-900 dark:text-white truncate">
                      <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-[#d4ff00] shrink-0" />
                      <span className="truncate">{story.club}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#d4ff00]" />
                      <span>{story.location}</span>
                    </span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
