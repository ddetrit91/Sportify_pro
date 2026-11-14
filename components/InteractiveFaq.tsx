"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

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
    <section id="faq" className="py-24 relative overflow-hidden bg-void/80 text-white backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4ff00]" />
            <span className="telemetry-chip text-white/80">FAQ & ПРАВИЛА ПЛАТФОРМЫ</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Часто задаваемые вопросы
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Всё о бронировании, бесплатных пробных слотах и гарантиях SPORTIFY.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-void-card overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-black uppercase tracking-tight text-base sm:text-lg text-white hover:text-[#d4ff00] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#d4ff00] shrink-0 transition-transform duration-300 ${
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
                      <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4 font-normal">
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
