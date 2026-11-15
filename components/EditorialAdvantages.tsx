"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { TiltCard } from "./motion/TiltCard";
import { CounterNumber } from "./motion/CounterNumber";

export function EditorialAdvantages() {
  const pillars = [
    {
      num: "01",
      title: "НИКАКИХ КАБАЛЬНЫХ ГОДОВЫХ КАРТ",
      desc: "Забудьте о покупке дорогих годовых карт за 12 000 000 UZS, которые сгорают без пользы. В SPORTIFY вы платите помесячно или за разовые визиты и свободно меняете клубы между Мирабадским, Юнусабадским и Чиланзарским районами.",
    },
    {
      num: "02",
      title: "ИНСПЕКЦИЯ 100% КЛУБОВ И ТРЕНЕРОВ",
      desc: "Каждый зал проходит аудит: многоступенчатая озоновая очистка воды в бассейнах, высота потолков от 6 метров, оригинальное американское и европейское оборудование (Rogue, Eleiko, Balanced Body) и дипломированные мастера спорта Узбекистана.",
    },
    {
      num: "03",
      title: "AI-МАТЧИНГ С УЧЕТОМ БИОМЕТРИИ",
      desc: "Нейросеть учитывает сидячую офисную работу, состояние позвоночника, суставов и уровень стресса в течение дня, подбирая нагрузку без риска травм и перетренированности.",
    },
    {
      num: "04",
      title: "ОНЛАЙН-ЗАПИСЬ ЗА 10 СЕКУНД БЕЗ ЗВОНКОВ",
      desc: "Никаких назойливых звонков от менеджеров отделов продаж. Бронирование слота происходит онлайн в один клик с моментальным подтверждением в Telegram.",
    },
  ];

  return (
    <section id="advantages" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Protected Liquid Glass Statement Card with Volt Rim */}
          <div className="lg:col-span-5 space-y-6 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#08090b]/65 backdrop-blur-xl border border-slate-200/90 dark:border-[#d4ff00]/25 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_25px_-5px_rgba(212,255,0,0.12)] before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/70 dark:before:via-[#d4ff00]/80 before:to-transparent relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-[#d4ff00]/30 bg-white/80 dark:bg-[#d4ff00]/10 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-[#d4ff00]" />
              <span className="telemetry-chip text-slate-800 dark:text-[#d4ff00]">СТАНДАРТЫ SPORTIFY // ТАШКЕНТ</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-[1.08]">
              Новая культура спорта:{" "}
              <span className="text-lime-600 dark:text-[#d4ff00]">
                без рутины и навязывания.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Мы объединили ведущие клубы Ташкента в единую цифровую сеть, сняв барьеры: неопределенность выбора, боязнь травм и лишние затраты.
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">АКТИВНЫХ АТЛЕТОВ В ТАШКЕНТЕ:</span>
                <span className="text-slate-950 dark:text-white font-bold">
                  <CounterNumber value={12400} suffix="+" />
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">СРЕДНИЙ РЕЙТИНГ КЛУБОВ:</span>
                <span className="text-lime-600 dark:text-[#d4ff00] font-bold">4.94 ★</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">ПЕРВАЯ ТРЕНИРОВКА:</span>
                <span className="text-lime-600 dark:text-[#d4ff00] font-bold">0 UZS (БЕСПЛАТНО)</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-600 dark:text-[#d4ff00] hover:text-black dark:hover:text-white transition-colors group"
              >
                <span>Забронировать пробный визит (0 UZS)</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Clean, Spacious 2x2 Editorial Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {pillars.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="h-full"
              >
                <TiltCard maxTilt={5} glareOpacity={0.2} className="h-full rounded-3xl">
                  <div className="relative h-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-[#d4ff00]/20 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-xl hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 group shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.12)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.3)] before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/50 dark:before:via-[#d4ff00]/60 before:to-transparent overflow-hidden flex flex-col justify-between">
                    <div>
                      {/* Top Bar: Athletic Large Number & Radar Dot */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-display text-3xl sm:text-4xl font-black text-lime-600 dark:text-[#d4ff00] group-hover:scale-105 transition-transform">
                          {item.num}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse shadow-[0_0_8px_#d4ff00]" />
                      </div>

                      {/* Main Title */}
                      <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-950 dark:text-white mb-2.5 leading-snug">
                        {item.title}
                      </h3>

                      {/* Paragraph Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
