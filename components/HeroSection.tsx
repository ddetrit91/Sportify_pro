"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, MapPin, Search, CheckCircle2, ShieldCheck, Flame, Star, Zap, Activity } from "lucide-react";
import { HeroVideoBackground } from "./HeroVideoBackground";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickPills = [
    { label: "🎾 Падел Юнусабад", tag: "падел" },
    { label: "🥊 Бокс Buka", tag: "бокс" },
    { label: "🏊 Бассейн 50м Бабура", tag: "бассейн" },
    { label: "🧘 Реформер Мустакиллик", tag: "пилатес" },
    { label: "⚡ Кроссфит Apex", tag: "кроссфит" },
  ];

  return (
    <section className="relative min-h-[95vh] pt-36 pb-20 overflow-hidden text-white flex flex-col justify-center bg-[#08090b]">
      {/* Background YouTube Video Engine with Random Mountain Running / Athletics Stream */}
      <HeroVideoBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Console */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Telemetry Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
              <span className="telemetry-chip text-white/90">
                TASHKENT ATHLETIC ECOSYSTEM // V3.2
              </span>
            </motion.div>

            {/* Massive Athletic Heading with modern Unbounded typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]"
            >
              Управляй своей{" "}
              <span className="text-[#d4ff00] underline decoration-[#d4ff00]/40 underline-offset-8">
                энергией.
              </span>{" "}
              Найди спорт будущего в Ташкенте.
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-base sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-sm"
            >
              Платформа прямого онлайн-доступа к лучшим спортивным клубам и кортам Ташкента. Умный ИИ-помощник подберёт идеальный вид спорта и клуб под твою цель за 60 секунд. Первое пробное занятие — <b>0 UZS</b>.
            </motion.p>

            {/* Fast-Search Console */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="p-2 sm:p-2.5 rounded-2xl glass-athletic border border-white/20 shadow-2xl space-y-2.5 bg-black/70 backdrop-blur-xl"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Найти клуб или район (Падел Юнусабад, Бокс Абая, Бассейн)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-[#d4ff00]/80 transition-colors"
                  />
                </div>
                <a
                  href="#clubs"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all shrink-0 active:scale-95"
                >
                  <span>Смотреть клубы</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Quick Direction Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-medium text-slate-300">
                <span className="shrink-0 font-semibold uppercase text-[10px] text-slate-400">Популярно в Ташкенте:</span>
                {quickPills.map((pill) => (
                  <a
                    key={pill.tag}
                    href="#clubs"
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-[#d4ff00]/60 text-slate-200 hover:text-white whitespace-nowrap transition-colors"
                  >
                    {pill.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Bottom Actions & Trust Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4ff00]" />
                <span className="font-semibold text-white">Первая тренировка 0 UZS</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4ff00]" />
                <span className="font-semibold text-white">Сертифицированные клубы Ташкента</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#d4ff00]" />
                <span className="font-semibold text-white">Бронь слота за 10 секунд</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Athletic Glass Telemetry HUD (allows background video to shine through) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-6 sm:p-7 bg-black/50 backdrop-blur-xl space-y-6"
            >
              {/* Header Telemetry */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-ping" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    ТАШКЕНТ // LIVE РАСПИСАНИЕ
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                  <span>4.95 / 5.0</span>
                </div>
              </div>

              {/* Spotlight Club Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="telemetry-chip text-[#d4ff00] block text-[10px]">
                      РЕКОМЕНДАЦИЯ ДНЯ // БОКС & ФИТНЕС
                    </span>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      Buka Fight Academy
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#d4ff00]" />
                      м. Пахтакор, ул. Абая
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#d4ff00] text-black font-black text-[11px] uppercase tracking-wider shrink-0">
                    0 UZS
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 font-medium">
                  <span>Абонемент от:</span>
                  <span className="text-[#d4ff00] font-bold">950 000 UZS / мес</span>
                </div>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-display font-black text-lg text-white block">45+</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Залов в ТШК</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-display font-black text-lg text-[#d4ff00] block">0 UZS</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Пробное</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-display font-black text-lg text-white block">99.4%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Точность</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href="#ai-matcher"
                  className="w-full py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/20 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Подобрать через AI Квиз</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#clubs"
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <span>Все 45+ клубов Ташкента</span>
                </a>
              </div>
            </motion.div>

            {/* Overlapping Floating Stat Chip */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="hidden sm:flex absolute -bottom-5 -left-6 p-3.5 rounded-2xl glass-athletic border border-[#d4ff00]/40 shadow-2xl items-center gap-3 bg-black/90 backdrop-blur-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-[#d4ff00]/20 flex items-center justify-center text-[#d4ff00]">
                <Flame className="w-5 h-5 fill-[#d4ff00]" />
              </div>
              <div>
                <span className="telemetry-chip text-slate-400 block text-[9px]">AI ПОДБОР</span>
                <span className="text-xs font-black text-white">Умный ИИ-помощник</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Infinite Athletic Marquee Strip */}
      <div className="mt-16 border-y border-white/10 bg-black/80 py-3.5 overflow-hidden w-full relative z-10">
        <div className="flex whitespace-nowrap animate-marquee gap-8 items-center text-xs font-semibold uppercase tracking-wider text-slate-300">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
                ПАДЕЛ ТАШКЕНТ
              </span>
              <span>•</span>
              <span className="text-[#d4ff00] font-bold">УЗБЕКСКАЯ ШКОЛА БОКСА</span>
              <span>•</span>
              <span className="text-white font-bold">РЕФОРМЕР-ПИЛАТЕС МУСТАКИЛЛИК</span>
              <span>•</span>
              <span>ОЛИМПИЙСКИЙ БАССЕЙН 50М БАБУРА</span>
              <span>•</span>
              <span className="text-[#d4ff00] font-bold">КРОССФИТ ROGUE НУКУССКАЯ</span>
              <span>•</span>
              <span>СКАЛОЛАЗАНИЕ ЧИЛАНЗАР</span>
              <span>•</span>
              <span className="text-white font-bold">ПЕРВАЯ ТРЕНИРОВКА 0 UZS</span>
              <span>•</span>
              <span>БРОНИРОВАНИЕ ОНЛАЙН В 1 КЛИК</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}