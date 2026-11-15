"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check, Loader2, ShieldCheck, Gift, CheckCircle2, QrCode } from "lucide-react";
import confetti from "canvas-confetti";
import { BorderBeam } from "./motion/BorderBeam";
import { MagneticButton } from "./motion/MagneticButton";
import { haptic } from "@/lib/haptics";

export function FinalBookingTerminal() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    sportInterest: "Падел & Большой теннис",
    district: "Мирабадский р-н (ул. Нукусская / Шевченко)",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sportOptions = [
    "Падел & Большой теннис",
    "Бокс & Тайский бокс",
    "Реформер-пилатес & Йога",
    "Олимпийский бассейн 50м",
    "Кроссфит & Силовой зал",
    "Скалолазание & Боулдеринг",
  ];

  const districtOptions = [
    "Мирабадский р-н (ул. Нукусская / Шевченко)",
    "Яккасарайский р-н (ул. Бабура / Ш. Руставели)",
    "Шайхантахурский р-н (Tashkent City / м. Пахтакор)",
    "Юнусабадский р-н (м. Шахристан / Бодомзор)",
    "Мирзо-Улугбекский р-н (м. Буюк Ипак Йули)",
    "Чиланзарский р-н (м. Чиланзар / Новза)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage("Укажите имя и номер телефона (+998) для оформления пропуска");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          sportInterest: formData.sportInterest,
          budget: "Бесплатный электронный пропуск (0 UZS)",
          source: "landing_form",
          aiSummary: `Терминал бронирования Ташкент. Район: ${formData.district}. Пожелания: ${formData.notes || "Не указаны"}. Электронный пропуск оформлен.`,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        haptic.success();
        setIsSuccess(true);
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#d4ff00", "#ffffff", "#00e5ff"],
        });
      } else {
        setErrorMessage(data.error || "Не удалось сохранить заявку. Попробуйте еще раз.");
      }
    } catch (err: any) {
      setErrorMessage("Сетевая ошибка при обращении к серверу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      {/* Background volt light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/20 bg-white/90 dark:bg-[#0c0e14]/90 backdrop-blur-2xl p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9)] before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/25 before:to-transparent overflow-hidden text-slate-900 dark:text-white">
          {/* Laser Tracing Perimeter Beam */}
          <BorderBeam duration={8} borderWidth={1.5} colorFrom="#d4ff00" />
          {/* Subtle volt top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4ff00] via-lime-400 to-[#d4ff00]" />

          {!isSuccess ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Offer Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 dark:bg-[#d4ff00]/10 border border-lime-500/30 dark:border-[#d4ff00]/30 text-lime-700 dark:text-[#d4ff00] text-xs font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>СПЕЦПРЕДЛОЖЕНИЕ ДНЯ // 0 UZS</span>
                </div>

                <h3 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-[1.05]">
                  Активируй свой{" "}
                  <span className="text-lime-600 dark:text-[#d4ff00]">пропуск</span> в любой клуб
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Оставьте контакты: система мгновенно зарезервирует бесплатный вводный слот (60–90 мин) в Ташкенте у топ-тренера и зафиксирует клубные привилегии.
                </p>

                <div className="space-y-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-[#d4ff00] shrink-0" />
                    <span>Электронный QR-пропуск в Telegram / SMS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-[#d4ff00] shrink-0" />
                    <span>Персональный инструктаж мастера спорта</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-[#d4ff00] shrink-0" />
                    <span>Без звонков и навязчивых предложений</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Terminal Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5">
                        Ваше имя:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Сардор"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#d4ff00] transition-colors font-medium"
                      />
                    </div>

                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5">
                        Телефон / Telegram (+998):
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+998 (90) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#d4ff00] transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5">
                        Дисциплина:
                      </label>
                      <select
                        value={formData.sportInterest}
                        onChange={(e) => setFormData({ ...formData, sportInterest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-[#d4ff00]"
                      >
                        {sportOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-black text-slate-900 dark:text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5">
                        Район Ташкента:
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-[#d4ff00]"
                      >
                        {districtOptions.map((dist) => (
                          <option key={dist} value={dist} className="bg-white dark:bg-black text-slate-900 dark:text-white">
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5">
                      Комментарий или ограничения (опционально):
                    </label>
                    <input
                      type="text"
                      placeholder="Например: удобны тренировки после 19:00, болит поясница"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#d4ff00]"
                    />
                  </div>

                  <div className="pt-2">
                    <MagneticButton className="w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(212,255,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_30px_rgba(212,255,0,0.55),inset_0_1px_2px_rgba(255,255,255,0.8)] transition-all active:scale-95"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-slate-950" />
                            <span>Получить бесплатный пропуск (0 UZS)</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </MagneticButton>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center pt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-[#d4ff00]" />
                    <span>Бронирование бесплатное. Ваши данные защищены.</span>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-4 max-w-lg mx-auto"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4ff00] text-black flex items-center justify-center shadow-xl shadow-[#d4ff00]/40">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
                Пропуск успешно оформлен!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Спасибо, <b>{formData.name}</b>! Электронный пропуск на <b>{formData.sportInterest}</b> отправлен в обработку. Наш координатор свяжется с вами по номеру <b>{formData.phone}</b> в течение 10 минут.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: "", phone: "", sportInterest: "Падел & Большой теннис", district: "Мирабадский р-н (ул. Нукусская / Шевченко)", notes: "" });
                }}
                className="mt-4 px-6 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Оформить еще один пропуск
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
