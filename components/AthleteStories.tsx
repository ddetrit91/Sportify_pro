"use client";

import { motion } from "framer-motion";
import { Star, Trophy, Quote, Activity, CheckCircle2 } from "lucide-react";

export function AthleteStories() {
  const stories = [
    {
      id: 1,
      name: "Сардор Рахимов",
      role: "Senior Tech Lead, IT Park",
      discipline: "Реформер-пилатес & Бассейн",
      club: "Prana Pilates Mustakillik",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      metric: "0 болей в спине",
      metricLabel: "спустя 3 недели тренировок",
      quote:
        "После 10 часов в кресле за кодом поясница не давала покоя. AI SPORTIFY подобрал реформеры на Мустакиллик. Первое пробное занятие (0 UZS) сняло зажимы, тренер поставил дыхание. Теперь спина ровная, а продуктивность выросла в разы.",
      stats: { sessions: 28, weeks: 12 },
    },
    {
      id: 2,
      name: "Мадина Юсупова",
      role: "Brand Director, Tashkent City",
      discipline: "Падел & Большой теннис",
      club: "Padel Arena Yunusabad",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
      metric: "-7.4 кг",
      metricLabel: "и финал любительского кубка",
      quote:
        "Тренажерка всегда казалась скучной рутиной. В падел на Юнусабаде влюбилась с первой же подачи: драйв, крутое комьюнити, а калории горят молниеносно. Через SPORTIFY нашла постоянную партнершу по корту прямо у офиса.",
      stats: { sessions: 34, weeks: 14 },
    },
    {
      id: 3,
      name: "Джасур Махмудов",
      role: "Founder E-commerce",
      discipline: "Бокс & Силовой тренинг",
      club: "Buka Boxing Gym (ул. Абая)",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
      metric: "100% фокус",
      metricLabel: "полная ликвидация выгорания",
      quote:
        "В 32 года впервые пришел в Buka Boxing на Абая. Тренеры ставят филигранную технику и защиту. Полтора часа интенсивной работы на снарядах напрочь выбивают рабочие тревоги из головы лучше любых медитаций.",
      stats: { sessions: 42, weeks: 16 },
    },
  ];

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-void/80 text-white border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-3">
              <Activity className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-white/80">ATHLETE COMMUNITY STORIES</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Реальные истории <span className="text-[#d4ff00]">атлетов Ташкента</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md font-normal leading-relaxed">
            Более 14 800 жителей Ташкента нашли свой спорт со SPORTIFY и тренируются в топовых клубах столицы.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0.9, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl border border-white/10 bg-void-card p-6 sm:p-7 flex flex-col justify-between group hover:border-[#d4ff00]/40 transition-all shadow-xl"
            >
              <div>
                {/* User Portrait & Credentials */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/20 shrink-0">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">
                      {story.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{story.role}</p>
                    <span className="text-[11px] text-[#d4ff00] font-bold block mt-0.5">
                      {story.discipline}
                    </span>
                  </div>
                </div>

                {/* Key Metric Highlight */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-5 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-white block">
                      {story.metric}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {story.metricLabel}
                    </span>
                  </div>
                  <div className="text-right text-xs font-semibold text-slate-400">
                    <div>{story.stats.sessions} тренировок</div>
                    <div className="text-[#d4ff00] font-bold">100% регулярность</div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{story.quote}"
                </p>
              </div>

              {/* Footer: Club verified badge */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00]" />
                  {story.club}
                </span>
                <span className="text-amber-400 font-bold">5.0 ★</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
