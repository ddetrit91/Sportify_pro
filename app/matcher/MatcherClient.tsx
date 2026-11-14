"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, ArrowRight, ArrowLeft, Send, Check, Loader2, MapPin, Flame, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { Club } from "@/lib/types";
import { BookingModal } from "@/components/BookingModal";

const cleanAiText = (txt?: string) => {
  if (!txt) return "";
  return txt
    .replace(/^[ \t]*\*+[ \t]+/gm, "• ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\*+/g, "");
};

export function MatcherClient({ clubs }: { clubs: Club[] }) {
  const [mode, setMode] = useState<"quiz" | "chat">("quiz");

  // Quiz state
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: "",
    experience: "",
    sportType: "",
    budget: "",
    timeOfDay: "Вечер после 18:30",
  });
  const [result, setResult] = useState<{
    reply: string;
    club: Club;
    matchScore: number;
  } | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingClub, setBookingClub] = useState<Club | null>(null);

  // Chat state
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Здравствуйте! Я персональный спортивный консультант SPOTIFY в Ташкенте. Задайте любой вопрос: например, с чего начать новичку с больной поясницей или где в Ташкенте лучшие падел-корты.",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const goals = [
    { id: "g1", title: "Сбросить вес и подтянуть рельеф", icon: "🔥", desc: "Высокое сжигание калорий, кардио, интервалы" },
    { id: "g2", title: "Ликвидировать стресс и перезагрузиться", icon: "🥊", desc: "Ударная нагрузка, выплеск адреналина" },
    { id: "g3", title: "Здоровая спина и королевская осанка", icon: "🧘", desc: "Пилатес на реформерах, йога, бассейн" },
    { id: "g4", title: "Драйв, азарт и новые знакомства", icon: "🎾", desc: "Падел-теннис, сквош, парные игры" },
  ];

  const handleGoalSelect = (g: string) => {
    setAnswers((p) => ({ ...p, goal: g }));
    setStep(2);
  };

  const handleExpSelect = (exp: string) => {
    setAnswers((p) => ({ ...p, experience: exp }));
    setStep(3);
  };

  const handleSportSelect = (sp: string) => {
    setAnswers((p) => ({ ...p, sportType: sp }));
    setStep(4);
  };

  const handleFinishQuiz = async (b: string) => {
    const updated = { ...answers, budget: b };
    setAnswers(updated);
    setIsSynthesizing(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizData: updated }),
      });
      const data = await res.json();

      let targetClub = clubs[0];
      if (updated.sportType.includes("Бокс")) targetClub = clubs.find((c) => c.id === "club-2") || clubs[0];
      else if (updated.sportType.includes("Плавание")) targetClub = clubs.find((c) => c.id === "club-3") || clubs[0];
      else if (updated.sportType.includes("Падел")) targetClub = clubs.find((c) => c.id === "club-4") || clubs[0];
      else if (updated.sportType.includes("Пилатес")) targetClub = clubs.find((c) => c.id === "club-5") || clubs[0];
      else if (updated.sportType.includes("Скалолазание")) targetClub = clubs.find((c) => c.id === "club-6") || clubs[0];

      setResult({
        reply: data.reply || "Мы подобрали идеальную персонализированную программу тренировок!",
        club: targetClub,
        matchScore: 98.4,
      });
      setStep(5);
    } catch (e) {
      setStep(5);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name,
          phone: leadForm.phone,
          sportInterest: answers.sportType || "AI Matcher результат",
          clubName: result?.club?.name,
          clubId: result?.club?.id,
          source: "matcher",
          aiSummary: `AI Matcher. Цель: ${answers.goal}. Уровень: ${answers.experience}. Бюджет: ${answers.budget}.`,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChat = async () => {
    if (!inputMsg.trim() || isAiThinking) return;
    const userMsg = { role: "user" as const, content: inputMsg };
    setMessages((p) => [...p, userMsg]);
    setInputMsg("");
    setIsAiThinking(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: messages.slice(-4) }),
      });
      const data = await res.json();
      setMessages((p) => [
        ...p,
        { role: "assistant", content: data.reply || "Готов помочь подобрать клуб!" },
      ]);
    } catch (e) {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Произошла сетевая заминка, но вы можете выбрать клуб из каталога!" },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="pt-36 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
          <span className="telemetry-chip text-white/80">SPORTIFY NEURAL SYNTHESIZER // V3.2</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
          AI Sport Matcher
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Интеллектуальная система синтеза подходящей дисциплины и лучшего клуба Ташкента.
        </p>

        {/* Mode Toggle */}
        <div className="mt-8 inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setMode("quiz")}
            className={`px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              mode === "quiz" ? "bg-[#d4ff00] text-black font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Пошаговый AI-Синтезатор
          </button>
          <button
            onClick={() => setMode("chat")}
            className={`px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              mode === "chat" ? "bg-[#d4ff00] text-black font-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Живой AI-Диалог
          </button>
        </div>
      </div>

      {mode === "quiz" ? (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card p-6 sm:p-10 shadow-2xl">
          {step < 5 && (
            <div className="mb-8">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>ЭТАП {step} ИЗ 4</span>
                <span>{step * 25}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4ff00] transition-all duration-300"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  Какая главная цель ваших тренировок?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleGoalSelect(g.title)}
                      className="p-5 rounded-2xl border border-white/10 bg-black/40 hover:border-[#d4ff00] text-left transition-all group flex items-start gap-4"
                    >
                      <span className="text-3xl p-2 rounded-xl bg-white/5">{g.icon}</span>
                      <div>
                        <div className="font-bold text-white group-hover:text-[#d4ff00] text-sm">
                          {g.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{g.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(1)} className="p-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    Ваш текущий уровень физической подготовки
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "e1", t: "Абсолютный новичок", d: "Никогда не занимался или пауза более 2 лет" },
                    { id: "e2", t: "Любитель", d: "Занимаюсь 1-2 раза в неделю, знаю основы" },
                    { id: "e3", t: "Опытный атлет", d: "Регулярные тяжелые тренировки 3+ раз в неделю" },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => handleExpSelect(exp.t)}
                      className="w-full p-5 rounded-2xl border border-white/10 bg-black/40 hover:border-[#d4ff00] text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-white group-hover:text-[#d4ff00] text-sm">{exp.t}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{exp.d}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#d4ff00]" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(2)} className="p-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    Какая атмосфера вам ближе?
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { t: "Падел & Теннис", icon: "🎾" },
                    { t: "Бокс & Тайский бокс", icon: "🥊" },
                    { t: "Кроссфит & Сила", icon: "⚡" },
                    { t: "Реформер-пилатес", icon: "🧘" },
                    { t: "Бассейн & Плавание", icon: "🏊" },
                    { t: "Скалолазание", icon: "🧗" },
                  ].map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSportSelect(sp.t)}
                      className="p-5 rounded-2xl border border-white/10 bg-black/40 hover:border-[#d4ff00] text-center transition-all group flex flex-col items-center"
                    >
                      <span className="text-3xl mb-2">{sp.icon}</span>
                      <span className="font-bold text-xs text-white group-hover:text-[#d4ff00]">{sp.t}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(3)} className="p-2 text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    Комфортный ежемесячный бюджет
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { t: "До 800 000 UZS / месяц", d: "Базовый абонемент и групповые занятия" },
                    { t: "До 1 400 000 UZS / месяц", d: "Премиум зал с бассейном, спа и парковкой" },
                    { t: "Без ограничений", d: "Индивидуальные тренировки и максимальный сервис" },
                  ].map((b, idx) => (
                    <button
                      key={idx}
                      disabled={isSynthesizing}
                      onClick={() => handleFinishQuiz(b.t)}
                      className="w-full p-5 rounded-2xl border border-white/10 bg-black/40 hover:border-[#d4ff00] text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-white group-hover:text-[#d4ff00] text-sm">{b.t}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{b.d}</div>
                      </div>
                      {isSynthesizing ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#d4ff00]" />
                      ) : (
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-[#d4ff00]" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="telemetry-chip text-[#d4ff00]">ВЕРДИКТ НЕЙРОСЕТИ</span>
                    <span className="px-2.5 py-1 rounded bg-[#d4ff00] text-black font-mono font-bold text-xs">
                      {result?.matchScore}% MATCH
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {cleanAiText(result?.reply)}
                  </p>
                </div>

                {/* Recommended Club Mini Card */}
                {result?.club && (
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="telemetry-chip text-slate-400">РЕКОМЕНДУЕМЫЙ КЛУБ:</span>
                      <h4 className="text-xl font-black uppercase text-white">{result.club.name}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{result.club.metro} • Пробное: {result.club.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${Number(result.club.priceTrial).toLocaleString("ru-RU")} UZS`}</p>
                    </div>
                    <button
                      onClick={() => setBookingClub(result.club)}
                      className="px-5 py-3 rounded-xl bg-[#d4ff00] text-black font-black text-xs uppercase shrink-0"
                    >
                      Записаться 0 UZS
                    </button>
                  </div>
                )}

                {/* Form */}
                {!isSuccess ? (
                  <form onSubmit={submitLead} className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-lg font-bold text-white">
                      Закрепить бесплатное пробное занятие со скидкой
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Ваше имя"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none focus:border-[#d4ff00]"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Телефон / Telegram"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none focus:border-[#d4ff00]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#d4ff00] text-black font-black text-xs uppercase tracking-wider"
                    >
                      Подтвердить заявку
                    </button>
                  </form>
                ) : (
                  <div className="p-6 rounded-2xl bg-white/5 text-center text-[#d4ff00] font-mono text-xs">
                    ✓ Заявка успешно сохранена! Менеджер свяжется с вами в течение 10 минут.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card p-6 sm:p-8 flex flex-col h-[580px] shadow-2xl">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    m.role === "user" ? "bg-[#d4ff00] text-black font-semibold" : "bg-white/5 border border-white/10 text-slate-200"
                  }`}
                >
                  {cleanAiText(m.content)}
                </div>
              </div>
            ))}
            {isAiThinking && (
              <div className="text-xs text-[#d4ff00] font-mono flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI анализирует биометрию и клубы Ташкента...</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-2 border-t border-white/10">
            <input
              type="text"
              placeholder="Спросите AI-консультанта о любом виде спорта..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]"
            />
            <button
              onClick={handleSendChat}
              disabled={isAiThinking || !inputMsg.trim()}
              className="p-3 rounded-xl bg-[#d4ff00] text-black"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <BookingModal
        club={bookingClub}
        isOpen={!!bookingClub}
        onClose={() => setBookingClub(null)}
      />
    </div>
  );
}
