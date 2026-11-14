"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Flame, Sparkles, Activity } from "lucide-react";
import { Sport } from "@/lib/types";

interface TrendingSportsBentoProps {
  sports: Sport[];
}

export function TrendingSportsBento({ sports }: TrendingSportsBentoProps) {
  return (
    <section id="sports" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5">
              <Activity className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-slate-700 dark:text-white/80">ДИСЦИПЛИНЫ ТАШКЕНТА // 2026</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-tight">
              Популярные виды спорта <span className="text-[#d4ff00]">в Ташкенте</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Исследуйте ключевые спортивные направления с доказанной эффективностью. Узнайте энергозатраты и выберите подходящий клуб для первого бесплатного визита.
            </p>
          </div>

          <a
            href="#clubs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-white/10 hover:border-[#d4ff00] bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all self-start md:self-end shadow-sm"
          >
            <span>Смотреть все локации</span>
            <ArrowUpRight className="w-4 h-4 text-[#d4ff00]" />
          </a>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Padel (Large 2x2 Feature) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-2 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-void-card shadow-xl dark:shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1200&auto=format&fit=crop"
              alt="Padel Tennis Tashkent"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-[#d4ff00] text-black font-black text-xs uppercase tracking-wider">
                №1 ТРЕНД ТАШКЕНТА
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>650 KCAL/H</span>
              </div>
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
          </motion.div>

          {/* Card 2: Boxing (1 col, high intensity) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-void-card shadow-xl dark:shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=900&auto=format&fit=crop"
              alt="Boxing Training Tashkent"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[10px] uppercase font-bold tracking-wider">
                УЗБЕКСКАЯ ШКОЛА
              </span>
              <span className="text-xs font-bold text-white/90">850 KCAL</span>
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
          </motion.div>

          {/* Card 3: Reformer Pilates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-void-card shadow-xl dark:shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=900&auto=format&fit=crop"
              alt="Pilates Reformer Tashkent"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-slate-950 text-[10px] uppercase font-bold tracking-wider">
                ЗДОРОВАЯ СПИНА
              </span>
              <span className="text-xs font-bold text-white/90">420 KCAL</span>
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
          </motion.div>

          {/* Card 4: Olympic Swimming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group min-h-[320px] flex flex-col justify-between p-6 bg-white dark:bg-void-card shadow-xl dark:shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=900&auto=format&fit=crop"
              alt="Olympic Swimming Tashkent"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/90 text-slate-950 text-[10px] uppercase font-bold tracking-wider">
                50М БАССЕЙН
              </span>
              <span className="text-xs font-bold text-white/90">680 KCAL</span>
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
          </motion.div>

          {/* Card 5: Bouldering */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 group min-h-[320px] flex flex-col justify-between p-6 bg-white dark:bg-void-card shadow-xl dark:shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=900&auto=format&fit=crop"
              alt="Bouldering Climbing Tashkent"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-[10px] uppercase font-bold tracking-wider">
                ВЫСОТА 14М
              </span>
              <span className="text-xs font-bold text-white/90">620 KCAL</span>
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
          </motion.div>

          {/* Card 6: AI Matcher Interactive Teaser (Spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 relative rounded-3xl overflow-hidden border border-[#d4ff00]/40 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#12161b] via-[#0d1014] to-black shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SPORTIFY NEURAL MATCHER</span>
              </div>
              <span className="telemetry-chip text-slate-500">ACCURACY: 99.4%</span>
            </div>

            <div className="my-6 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Не знаешь, что выбрать в Ташкенте?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
                Запусти интеллектуальный AI-синтезатор: нейросеть учтет уровень стресса, район Ташкента и бюджет, порекомендовав идеальный зал за 60 секунд.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#ai-matcher"
                className="px-6 py-3 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4ff00]/20 transition-all active:scale-95"
              >
                <span>Запустить AI-подбор</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
