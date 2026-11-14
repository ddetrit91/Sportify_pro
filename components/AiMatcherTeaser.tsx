"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Flame, ShieldCheck, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";
import { BookingModal } from "./BookingModal";
import { Club } from "@/lib/types";

export function AiMatcherTeaser({ clubs }: { clubs: Club[] }) {
  const [goal, setGoal] = useState("stress");
  const [stressLevel, setStressLevel] = useState(8);
  const [experience, setExperience] = useState("beginner");
  const [isMatching, setIsMatching] = useState(false);
  const [bookingClub, setBookingClub] = useState<Club | null>(null);

  const goals = [
    { id: "stress", label: "🥊 Снять стресс & Выплеск энергии", sport: "Бокс Buka Academy (Абая)", clubId: "club-2" },
    { id: "back", label: "🧘 Здоровая спина & Осанка", sport: "Реформер-пилатес Prana (Мустакиллик)", clubId: "club-5" },
    { id: "fatburn", label: "🔥 Похудение & Рельеф", sport: "Кроссфит Apex Performance (Нукусская)", clubId: "club-1" },
    { id: "social", label: "🎾 Драйв & Знакомства", sport: "Падел & Теннис Arena (Юнусабад)", clubId: "club-4" },
    { id: "swim", label: "🏊 Выносливость без травм", sport: "Бассейн 50м Aquaterra (Бабура)", clubId: "club-3" },
  ];

  const currentGoal = goals.find((g) => g.id === goal) || goals[0];
  const matchedClub = clubs.find((c) => c.id === currentGoal.clubId) || clubs[0];

  const handleGoalChange = (newGoal: string) => {
    setIsMatching(true);
    setGoal(newGoal);
    setTimeout(() => setIsMatching(false), 250);
  };

  return (
    <section id="ai-matcher" className="py-24 relative overflow-hidden bg-void-pure text-white border-y border-white/10">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d4ff00]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
            <span className="telemetry-chip text-white/80">NEURAL ENGINE // TASHKENT SPORT SYNTHESIZER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            AI Sport Matcher <span className="text-[#d4ff00]">в Ташкенте</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Настройте ключевые параметры — нейросеть мгновенно рассчитает наиболее эффективную дисциплину и клуб поблизости.
          </p>
        </div>

        {/* Synthesizer Console Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column: Parameter Sliders & Goal Toggles */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-void-card p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Goal Selector */}
            <div className="space-y-3">
              <label className="telemetry-chip text-[#d4ff00] block">
                01. ГЛАВНЫЙ ЗАПРОС ТЕЛА И РАЗУМА:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGoalChange(g.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      goal === g.id
                        ? "border-[#d4ff00] bg-[#d4ff00]/15 text-white shadow-sm"
                        : "border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30"
                    }`}
                  >
                    <span>{g.label}</span>
                    {goal === g.id && <span className="w-2 h-2 rounded-full bg-[#d4ff00]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level Slider */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="telemetry-chip text-slate-400">02. ТЕКУЩИЙ УРОВЕНЬ НАПРЯЖЕНИЯ / СТРЕССА:</span>
                <span className="font-mono font-bold text-[#d4ff00]">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4ff00]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Спокойный ритм</span>
                <span>Высокая перегрузка / стресс</span>
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="telemetry-chip text-slate-400 block">03. ВАШ СПОРТИВНЫЙ ОПЫТ:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "beginner", label: "Новичок с нуля" },
                  { id: "intermediate", label: "Любитель" },
                  { id: "advanced", label: "Атлет со стажем" },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                      experience === exp.id
                        ? "bg-[#d4ff00] text-black font-black"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Note */}
            <div className="pt-2 text-xs text-slate-400 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4ff00]" />
              <span>Учитываются локации Ташкента и сертификация залов</span>
            </div>
          </div>

          {/* Right Column: Live Calculated Match Card */}
          <div className="lg:col-span-5 relative">
            <motion.div
              animate={{ opacity: isMatching ? 0.6 : 1, scale: isMatching ? 0.98 : 1 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-[#d4ff00]/40 bg-void-card p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Top Match Tag */}
              <div className="flex items-center justify-between">
                <span className="telemetry-chip text-[#d4ff00] block">
                  РЕЗУЛЬТАТ AI-СИНТЕЗА
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#d4ff00] text-black font-mono font-black text-xs">
                  98.9% MATCH
                </span>
              </div>

              {/* Matched Sport Preview */}
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">
                  Рекомендуемое направление:
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
                  {currentGoal.sport}
                </h3>
              </div>

              {/* Matched Club Card Mini */}
              {matchedClub && (
                <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                  <div className="relative h-36 w-full">
                    <img
                      src={matchedClub.image}
                      alt={matchedClub.name}
                      className="w-full h-full object-cover filter brightness-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-mono">
                      {matchedClub.metro}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-white text-base">{matchedClub.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{matchedClub.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Первое занятие:</span>
                      <span className="text-[#d4ff00] font-bold">
                        {matchedClub.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${matchedClub.priceTrial.toLocaleString("ru-RU")} UZS`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setBookingClub(matchedClub)}
                  className="w-full py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all active:scale-95"
                >
                  <span>Записаться в этот клуб (0 UZS)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BookingModal
        club={bookingClub}
        isOpen={!!bookingClub}
        onClose={() => setBookingClub(null)}
      />
    </section>
  );
}
