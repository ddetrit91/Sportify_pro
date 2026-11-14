"use client";

import { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, QrCode, ArrowRight, Loader2, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { Club } from "@/lib/types";

export function BookingTerminalClient({ clubs }: { clubs: Club[] }) {
  const [selectedClubId, setSelectedClubId] = useState(clubs[0]?.id || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("19:00 - 20:30 (Вечер)");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const activeClub = clubs.find((c) => c.id === selectedClubId) || clubs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Укажите ваше имя и контактный телефон");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          sportInterest: activeClub.categoryName,
          clubId: activeClub.id,
          clubName: activeClub.name,
          budget: `Бронирование слота: ${activeClub.priceTrial === 0 ? "0 UZS" : Number(activeClub.priceTrial).toLocaleString("ru-RU") + " UZS"}`,
          source: "catalog",
          aiSummary: `Терминал бронирования. Выбран клуб: "${activeClub.name}" (${activeClub.metro}). Дата: ${date || "Ближайшая"}, слот: ${timeSlot}. Пожелания: ${notes || "Нет"}.`,
          bookingDate: date,
          bookingTime: timeSlot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#d4ff00", "#ffffff", "#00e5ff"],
        });
      } else {
        setErrorMessage(data.error || "Не удалось забронировать слот. Попробуйте еще раз.");
      }
    } catch (err: any) {
      setErrorMessage("Сетевая ошибка при бронировании.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-36 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* Title */}
      <div className="mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
          <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
          <span className="telemetry-chip text-white/80">RESERVATION TERMINAL // VERIFIED ACCESS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
          Онлайн-запись <span className="text-[#d4ff00]">в клуб</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl font-normal">
          Выберите клуб, дату и удобный временной слот. Электронный пропуск и QR-код будут мгновенно отправлены вам в Telegram.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-void-card p-6 sm:p-8 shadow-2xl">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              {/* Club Selector */}
              <div>
                <label className="telemetry-chip text-slate-300 block mb-1.5">
                  1. ВЫБЕРИТЕ СПОРТИВНЫЙ КЛУБ:
                </label>
                <select
                  value={selectedClubId}
                  onChange={(e) => setSelectedClubId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00] font-mono"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id} className="bg-black text-white">
                      {c.name} ({c.metro}) — {c.priceTrial === 0 ? "0 UZS Пробное" : `${Number(c.priceTrial).toLocaleString("ru-RU")} UZS`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="telemetry-chip text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#d4ff00]" />
                    2. ДАТА ТРЕНИРОВКИ:
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00] font-mono"
                  />
                </div>

                <div>
                  <label className="telemetry-chip text-slate-300 block mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#d4ff00]" />
                    3. ВРЕМЕННОЙ СЛОТ:
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00] font-mono"
                  >
                    <option className="bg-black">08:00 - 09:30 (Утренний заряд)</option>
                    <option className="bg-black">12:30 - 14:00 (Дневной WOD)</option>
                    <option className="bg-black">19:00 - 20:30 (Вечерний пик)</option>
                    <option className="bg-black">20:30 - 22:00 (Поздний релакс)</option>
                  </select>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="telemetry-chip text-slate-300 block mb-1.5">
                    4. ВАШЕ ИМЯ:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Алексей"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none focus:border-[#d4ff00]"
                  />
                </div>

                <div>
                  <label className="telemetry-chip text-slate-300 block mb-1.5">
                    5. ТЕЛЕФОН / TELEGRAM:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 (90) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm outline-none focus:border-[#d4ff00]"
                  />
                </div>
              </div>

              <div>
                <label className="telemetry-chip text-slate-300 block mb-1.5">
                  6. ПОЖЕЛАНИЯ К ТРЕНИРОВКЕ (ОПЦИОНАЛЬНО):
                </label>
                <input
                  type="text"
                  placeholder="Например: нужен тренер для новичка, есть ограничение по коленям"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Оформить пропуск за 0 UZS</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Бронирование бесплатное. QR-пропуск придет в Telegram.</span>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4ff00] text-black flex items-center justify-center shadow-xl shadow-[#d4ff00]/40">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-3xl font-black uppercase text-white">
                Пропуск подтвержден!
              </h3>
              <p className="text-sm text-slate-300 font-normal leading-relaxed max-w-md mx-auto">
                Вы успешно забронировали слот в <b>{activeClub.name}</b> на {date || "ближайшее время"} ({timeSlot}). Менеджер свяжется с вами по номеру <b>{phone}</b>.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setName("");
                  setPhone("");
                }}
                className="mt-4 px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-mono text-xs uppercase"
              >
                Оформить еще одну бронь
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Pass Preview */}
        <div className="lg:col-span-5 rounded-3xl border border-[#d4ff00]/40 bg-gradient-to-b from-[#13161c] to-black p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="telemetry-chip text-[#d4ff00]">DIGITAL PASS // SPORTIFY</span>
            <span className="px-2 py-0.5 rounded bg-[#d4ff00] text-black font-mono font-bold text-[10px]">
              {activeClub.priceTrial === 0 ? "0 UZS TRIAL" : `${Number(activeClub.priceTrial).toLocaleString("ru-RU")} UZS`}
            </span>
          </div>

          <div className="space-y-1">
            <span className="telemetry-chip text-slate-400 block">{activeClub.categoryName}</span>
            <h3 className="text-2xl font-black uppercase text-white tracking-tight">{activeClub.name}</h3>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
              {activeClub.address}
            </p>
          </div>

          {/* QR Mock */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-col gap-3">
            <QrCode className="w-24 h-24 text-white stroke-[1.5]" />
            <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
              SCAN AT CLUB RECEPTION // SPORTIFY-PASS
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-white/10">
            <div className="flex justify-between">
              <span className="text-slate-500">АТЛЕТ:</span>
              <span className="text-white font-bold">{name || "Иван Петров"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">СЛОТ:</span>
              <span className="text-white">{timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">СТАТУС:</span>
              <span className="text-[#d4ff00] font-bold">АКТИВЕН ДЛЯ БРОНИРОВАНИЯ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
