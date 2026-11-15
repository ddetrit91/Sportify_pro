"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Sparkles, Activity } from "lucide-react";
import { Sport } from "@/lib/types";
import { TiltCard } from "./motion/TiltCard";
import { BorderBeam } from "./motion/BorderBeam";
import { CounterNumber } from "./motion/CounterNumber";
import { MagneticButton } from "./motion/MagneticButton";
import { VelocityParallax } from "./motion/ScrollVelocityEffects";

interface TrendingSportsBentoProps {
  sports: Sport[];
}

export function TrendingSportsBento({ sports }: TrendingSportsBentoProps) {
  return (
    <section id="sports" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="relative space-y-3">
            {/* Soft Ambient Radial Shadow: gracefully dims background kinetic lines without any harsh borders */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-8 -inset-y-6 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_rgba(248,250,252,0.9)_0%,_rgba(248,250,252,0.6)_50%,_transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(7,8,10,0.92)_0%,_rgba(7,8,10,0.65)_55%,_transparent_100%)] blur-2xl pointer-events-none -z-10"
            />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-[#d4ff00]/30 bg-white/80 dark:bg-[#d4ff00]/10 backdrop-blur-sm shadow-sm">
              <Activity className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-slate-800 dark:text-[#d4ff00]">ДИСЦИПЛИНЫ ТАШКЕНТА // 2026</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              Популярные виды спорта <span className="text-[#d4ff00]">в Ташкенте</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Исследуйте ключевые спортивные направления с доказанной эффективностью. Узнайте энергозатраты и выберите подходящий клуб для первого бесплатного визита.
            </p>
          </div>

          <a
            href="#clubs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-[#d4ff00]/30 hover:border-[#d4ff00] bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-[#d4ff00]/15 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-[#d4ff00] transition-all self-start md:self-end shadow-sm backdrop-blur-sm shrink-0"
          >
            <span>Смотреть все локации</span>
            <ArrowUpRight className="w-4 h-4 text-[#d4ff00]" />
          </a>
        </div>

        {/* Bento Grid with 3D Mouse Tilt & Kinetic Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Padel (Large 2x2 Feature) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-2 h-full"
          >
            <TiltCard maxTilt={4} glareOpacity={0.2} className="rounded-3xl">
              <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#d4ff00]/25 group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-sm shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.15)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.35)] hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent before:z-20">
                <img
                  src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1200&auto=format&fit=crop"
                  alt="Padel Tennis Tashkent"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Top Bar with Velocity Parallax */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-[#d4ff00] text-black font-black text-xs uppercase tracking-wider shadow-sm">
                    №1 ТРЕНД ТАШКЕНТА
                  </span>
                  <VelocityParallax speed={0.1}>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-sm">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <CounterNumber value={650} suffix=" KCAL/H" />
                    </div>
                  </VelocityParallax>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-3">
                  <span className="telemetry-chip text-[#d4ff00] block">
                    РАКЕТОЧНЫЙ СПОРТ // ПАДЕЛ & ТЕННИС
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Падел & Большой теннис
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md line-clamp-2">
                    Самый динамичный парный спорт с низким порогом входа в Юнусабаде. Идеален для драйва, новых знакомств и мощного кардио.
                  </p>
                  <div className="pt-2">
                    <a
                      href="#booking"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4ff00] hover:text-white transition-colors"
                    >
                      <span>Забронировать корт за 0 UZS →</span>
                    </a>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 2: Boxing (1 col, high intensity) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <TiltCard maxTilt={5} glareOpacity={0.2} className="rounded-3xl">
              <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#d4ff00]/25 group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-7 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-sm shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.15)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.35)] hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent before:z-20">
                <img
                  src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=900&auto=format&fit=crop"
                  alt="Boxing Training Tashkent"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    УЗБЕКСКАЯ ШКОЛА
                  </span>
                  <VelocityParallax speed={0.1}>
                    <span className="text-xs font-bold text-white/90">
                      <CounterNumber value={850} suffix=" KCAL" />
                    </span>
                  </VelocityParallax>
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="telemetry-chip text-red-400 block">ЕДИНОБОРСТВА</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    Бокс & Тайский бокс
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Академия Buka на Абая: постановка нокаутирующего удара и полная разгрузка разума.
                  </p>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#d4ff00] transition-colors pt-1"
                  >
                    <span>Записаться</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 3: Reformer Pilates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <TiltCard maxTilt={5} glareOpacity={0.2} className="rounded-3xl">
              <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#d4ff00]/25 group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-7 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-sm shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.15)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.35)] hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent before:z-20">
                <img
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=900&auto=format&fit=crop"
                  alt="Pilates Reformer Tashkent"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-slate-950 text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    ЗДОРОВАЯ СПИНА
                  </span>
                  <VelocityParallax speed={0.1}>
                    <span className="text-xs font-bold text-white/90">
                      <CounterNumber value={420} suffix=" KCAL" />
                    </span>
                  </VelocityParallax>
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="telemetry-chip text-emerald-400 block">BODY & MIND</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    Реформер-пилатес
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    Студия на Мустакиллик: вытяжение позвоночника и идеальная осанка на реформерах.
                  </p>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#d4ff00] transition-colors pt-1"
                  >
                    <span>Записаться</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 4: Olympic Swimming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <TiltCard maxTilt={5} glareOpacity={0.2} className="rounded-3xl">
              <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#d4ff00]/25 group min-h-[320px] flex flex-col justify-between p-6 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-sm shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.15)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.35)] hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent before:z-20">
                <img
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=900&auto=format&fit=crop"
                  alt="Olympic Swimming Tashkent"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 flex justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/90 text-slate-950 text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    50М БАССЕЙН
                  </span>
                  <VelocityParallax speed={0.1}>
                    <span className="text-xs font-bold text-white/90">
                      <CounterNumber value={680} suffix=" KCAL" />
                    </span>
                  </VelocityParallax>
                </div>

                <div className="relative z-10 space-y-1.5">
                  <span className="telemetry-chip text-cyan-400 block">ВОДНЫЙ СПОРТ</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Плавание & Водный спа
                  </h3>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#d4ff00] transition-colors pt-1"
                  >
                    <span>Записаться на Бабура →</span>
                  </a>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 5: Bouldering */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="h-full"
          >
            <TiltCard maxTilt={5} glareOpacity={0.2} className="rounded-3xl">
              <div className="relative h-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#d4ff00]/25 group min-h-[320px] flex flex-col justify-between p-6 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-sm shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.15)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.35)] hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent before:z-20">
                <img
                  src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=900&auto=format&fit=crop"
                  alt="Bouldering Climbing Tashkent"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10 flex justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    ВЫСОТА 14М
                  </span>
                  <VelocityParallax speed={0.1}>
                    <span className="text-xs font-bold text-white/90">
                      <CounterNumber value={620} suffix=" KCAL" />
                    </span>
                  </VelocityParallax>
                </div>

                <div className="relative z-10 space-y-1.5">
                  <span className="telemetry-chip text-amber-400 block">ЭКСТРИМ & СИЛА</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">
                    Скалодром на Новза
                  </h3>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#d4ff00] transition-colors pt-1"
                  >
                    <span>Записаться в Чиланзар →</span>
                  </a>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 6: AI Matcher Interactive Teaser (Spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 h-full"
          >
            <TiltCard maxTilt={3} glareOpacity={0.18} className="rounded-3xl">
              <div className="relative h-full rounded-3xl overflow-hidden border border-lime-500/30 dark:border-[#d4ff00]/40 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-lime-50/95 via-white/95 to-slate-100/95 dark:from-[#12161b]/95 dark:via-[#0d1014]/90 dark:to-black/95 backdrop-blur-sm shadow-[0_16px_50px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.3)] hover:border-[#d4ff00]/80 transition-all duration-300 before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent before:z-20">
                {/* Circulating Laser Border Beam for AI */}
                <BorderBeam duration={6} borderWidth={1.5} colorFrom="#d4ff00" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 dark:bg-[#d4ff00]/10 border border-lime-500/30 dark:border-[#d4ff00]/30 text-lime-700 dark:text-[#d4ff00] text-xs font-semibold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SPORTIFY NEURAL MATCHER</span>
                  </div>
                  <span className="telemetry-chip text-slate-500 dark:text-slate-400">
                    ACCURACY: <CounterNumber value={99.4} decimals={1} suffix="%" />
                  </span>
                </div>

                <div className="my-6 space-y-2 relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                    Не знаешь, что выбрать в Ташкенте?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg font-normal leading-relaxed">
                    Запусти интеллектуальный AI-синтезатор: нейросеть учтет уровень стресса, район Ташкента и бюджет, порекомендовав идеальный зал за 60 секунд.
                  </p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <MagneticButton>
                    <a
                      href="#ai-matcher"
                      className="px-6 py-3 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_20px_rgba(212,255,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_28px_rgba(212,255,0,0.55)] transition-all active:scale-95"
                    >
                      <span>Запустить AI-подбор</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </MagneticButton>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
