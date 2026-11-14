"use client";

import { useState } from "react";
import { X, Check, Loader2, Sparkles, MapPin, Calendar, Clock, ShieldCheck, Flame } from "lucide-react";
import confetti from "canvas-confetti";
import { Club } from "@/lib/types";

interface BookingModalProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ club, isOpen, onClose }: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00 - Вечерний слот");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !club) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          sportInterest: club.categoryName,
          clubId: club.id,
          clubName: club.name,
          budget: `Пробное: ${club.priceTrial === 0 ? "0 UZS (Бесплатно)" : Number(club.priceTrial).toLocaleString("ru-RU") + " UZS"}`,
          source: "catalog",
          aiSummary: `Бронирование в "${club.name}" (${club.metro}, Ташкент). Желаемая дата: ${date || "Ближайшая"}, время: ${time}. Пропуск подтвержден.`,
          bookingDate: date,
          bookingTime: time,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#d4ff00", "#ffffff", "#00e5ff"],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setName("");
    setPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-void-card border border-white/15 text-white shadow-2xl overflow-hidden">
        {/* Subtle Volt Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4ff00]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 text-[#d4ff00] telemetry-chip mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ОНЛАЙН-РЕЗЕРВИРОВАНИЕ СЛОТА</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Запись в {club.name}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium mt-1 mb-6">
              <span className="flex items-center gap-1 text-white">
                <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
                {club.metro}
              </span>
              <span>•</span>
              <span className="text-[#d4ff00] font-bold">
                Вводный визит: {club.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${Number(club.priceTrial).toLocaleString("ru-RU")} UZS`}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="telemetry-chip text-slate-300 block mb-1.5">
                  Ваше имя: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Сардор"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-[#d4ff00]/60 transition-colors font-medium"
                />
              </div>

              <div>
                <label className="telemetry-chip text-slate-300 block mb-1.5">
                  Номер телефона / Telegram (+998): *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 (90) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-[#d4ff00]/60 transition-colors font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="telemetry-chip text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#d4ff00]" />
                    Дата визита
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]/60 font-medium"
                  />
                </div>
                <div>
                  <label className="telemetry-chip text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4ff00]" />
                    Слот времени
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]/60 font-medium"
                  >
                    <option className="bg-black">08:00 - Утренний слот</option>
                    <option className="bg-black">12:30 - Дневной слот</option>
                    <option className="bg-black">19:00 - Вечерний слот</option>
                    <option className="bg-black">20:30 - Поздний слот</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Подтвердить бронирование (0 UZS)</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Бронирование бесплатное. QR-пропуск придет в Telegram.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4ff00] text-black flex items-center justify-center shadow-xl shadow-[#d4ff00]/40">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              Слот зарезервирован!
            </h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Вы успешно записаны в <b>{club.name}</b>. Наш координатор свяжется с вами по номеру{" "}
              <b>{phone}</b> для отправки электронного пропуска и инструктажа.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs uppercase"
            >
              Отлично, закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
