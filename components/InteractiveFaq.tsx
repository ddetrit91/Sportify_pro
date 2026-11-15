"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { haptic } from "@/lib/haptics";

export function InteractiveFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Как устроен сервис и почему первое занятие бесплатное (0 UZS)?",
      a: "SPORTIFY — партнерская платформа прямых бронирований в Ташкенте. Спортклубы предоставляют нам эксклюзивные бесплатные слоты для новых клиентов, чтобы вы могли оценить атмосферу, чистоту и квалификацию тренера без покупки дорогого абонемента. Если вам не понравится — вы ничего не платите.",
    },
    {
      q: "Как нейросеть подбирает спорт под биометрию?",
      a: "Наш AI-алгоритм учитывает физиологические ограничения (состояние суставов, шеи, поясницы), текущий уровень кортизола (стресс), цели (похудение, сила, снятие напряжения) и желаемый график. На основе 14 параметров система подбирает клубы и тренеров, специализирующихся на вашем типе нагрузки.",
    },
    {
      q: "Нужно ли покупать годовую карту клуба?",
      a: "Нет. Мы категорически против навязывания годовых карт. Вы можете заниматься по гибким помесячным тарифам или оплачивать разовые блоки тренировок. Если вы захотите сменить бокс на бассейн или падел-теннис — баланс переносится без штрафов.",
    },
    {
      q: "Как подтверждается бронирование тренировки?",
      a: "После выбора времени в форме онлайн-записи слот мгновенно резервируется в клубной CRM-системе. Вам в Telegram и по SMS приходит электронный пропуск с QR-кодом, схемой проезда, контактами тренера и памяткой о форме.",
    },
    {
      q: "Что необходимо взять с собой на первое пробное занятие?",
      a: "Только базовую спортивную форму (шорты/леггинсы, футболка, чистые кроссовки). Специализированное оборудование (падел-ракетки, боксерские перчатки, полотенца) во всех клубах SPORTIFY выдается на вводном занятии бесплатно.",
    },
  ];

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-lime-600 dark:text-[#d4ff00]" />
            <span className="telemetry-chip text-slate-700 dark:text-white/80">FAQ & ПРАВИЛА ПЛАТФОРМЫ</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-tight">
            Часто задаваемые вопросы
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Всё о бронировании, бесплатных пробных слотах и гарантиях SPORTIFY.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-[#0c0e14]/85 backdrop-blur-2xl overflow-hidden transition-all duration-300 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] hover:border-[#d4ff00]/60 dark:hover:border-[#d4ff00]/70 hover:-translate-y-1 hover:shadow-[0_16px_45px_-10px_rgba(212,255,0,0.18)] before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/20 before:to-transparent"
              >
                <button
                  onClick={() => {
                    haptic.click();
                    setOpenIndex(isOpen ? null : idx);
                  }}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-black uppercase tracking-tight text-base sm:text-lg text-slate-900 dark:text-white hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-lime-600 dark:text-[#d4ff00] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4 font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
