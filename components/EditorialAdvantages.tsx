"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeartPulse, RefreshCw, Sparkles, Check, ArrowUpRight } from "lucide-react";

export function EditorialAdvantages() {
  const pillars = [
    {
      num: "01",
      title: "НИКАКИХ КАБАЛЬНЫХ ГОДОВЫХ КАРТ",
      tagline: "Свобода передвижения по Ташкенту",
      desc: "Забудьте о покупке дорогих годовых карт за 12 000 000 UZS, которые сгорают без пользы. В SPORTIFY вы платите помесячно или за разовые визиты и свободно меняете клубы между Мирабадским, Юнусабадским и Чиланзарским районами.",
    },
    {
      num: "02",
      title: "ИНСПЕКЦИЯ 100% КЛУБОВ И ТРЕНЕРОВ",
      tagline: "Только сертифицированные пространства",
      desc: "Каждый зал проходит аудит: многоступенчатая озоновая очистка воды в бассейнах, высота потолков от 6 метров, оригинальное американское и европейское оборудование (Rogue, Eleiko, Balanced Body) и дипломированные мастера спорта Узбекистана.",
    },
    {
      num: "03",
      title: "AI-МАТЧИНГ С УЧЕТОМ БИОМЕТРИИ",
      tagline: "Спорт в удовольствие, а не на износ",
      desc: "Нейросеть учитывает сидячую офисную работу, состояние позвоночника, суставов и уровень стресса в течение дня, подбирая нагрузку без риска травм и перетренированности.",
    },
    {
      num: "04",
      title: "ОНЛАЙН-ЗАПИСЬ ЗА 10 СЕКУНД БЕЗ ЗВОНКОВ",
      tagline: "Zero-spam гарантия платформы",
      desc: "Никаких назойливых звонков от менеджеров отделов продаж. Бронирование слота происходит онлайн в один клик с моментальным подтверждением в Telegram.",
    },
  ];

  return (
    <section id="advantages" className="py-24 relative overflow-hidden bg-void/80 text-white backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Sticky Editorial Statement */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-white/80">СТАНДАРТЫ SPORTIFY // ТАШКЕНТ</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-[1.05]">
              Новая культура спорта:{" "}
              <span className="text-[#d4ff00]">
                без рутины и навязывания.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Мы объединили ведущие клубы Ташкента в единую цифровую сеть, сняв барьеры: неопределенность выбора, боязнь травм и лишние затраты.
            </p>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">АКТИВНЫХ АТЛЕТОВ В ТАШКЕНТЕ:</span>
                <span className="text-white font-bold">12 400+</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">СРЕДНИЙ РЕЙТИНГ КЛУБОВ:</span>
                <span className="text-[#d4ff00] font-bold">4.94 ★</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">ПЕРВАЯ ТРЕНИРОВКА:</span>
                <span className="text-[#d4ff00] font-bold">0 UZS (БЕСПЛАТНО)</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d4ff00] hover:text-white transition-colors"
              >
                <span>Забронировать пробный визит (0 UZS) →</span>
              </a>
            </div>
          </div>

          {/* Right Column: Numbered Editorial Cards */}
          <div className="lg:col-span-7 space-y-8">
            {pillars.map((item) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl border border-white/10 bg-void-card hover:border-[#d4ff00]/40 transition-all group shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-display text-3xl sm:text-4xl font-black text-[#d4ff00]/80 group-hover:text-[#d4ff00] transition-colors">
                    {item.num}
                  </span>
                  <span className="telemetry-chip text-slate-500">
                    {item.tagline}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
