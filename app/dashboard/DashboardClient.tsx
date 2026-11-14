"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, Calendar, Clock, MapPin, Award, Flame, Star, Activity, CheckCircle2, ArrowRight, Heart, Sparkles, User, RefreshCw } from "lucide-react";
import { Club } from "@/lib/types";

export function DashboardClient({ clubs }: { clubs: Club[] }) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history" | "saved">("upcoming");

  const upcomingBookings = [
    {
      id: "b-1",
      clubName: "Padel & Tennis Arena (Лужники)",
      sport: "Падел-теннис (Корт №3)",
      date: "Завтра, 15 ноября",
      time: "19:00 - 20:30",
      coach: "Хорхе Санчес",
      metro: "м. Воробьевы горы",
      status: "Подтверждено",
      qrCodeId: "SP-PADEL-9821",
    },
    {
      id: "b-2",
      clubName: "Aquaterra Swim & Spa",
      sport: "Плавание (Дорожка №4)",
      date: "Вторник, 17 ноября",
      time: "07:30 - 09:00",
      coach: "Максим Демьянов",
      metro: "м. Киевская",
      status: "Подтверждено",
      qrCodeId: "SP-SWIM-4412",
    },
  ];

  const pastVisits = [
    {
      id: "p-1",
      clubName: "Apex Fitness & Performance",
      sport: "CrossFit WOD Olympic Lift",
      date: "12 ноября, 18:30",
      coach: "Илья Березин",
      calories: 720,
      heartRateAvg: 154,
    },
    {
      id: "p-2",
      clubName: "Prana Yoga & Reformer Studio",
      sport: "Reformer Flow: Здоровая спина",
      date: "8 ноября, 09:00",
      coach: "Елена Воронова",
      calories: 410,
      heartRateAvg: 118,
    },
    {
      id: "p-3",
      clubName: "Fight Academy Prime",
      sport: "Бокс: Школа техники для новичков",
      date: "3 ноября, 19:30",
      coach: "Руслан Каримов",
      calories: 840,
      heartRateAvg: 162,
    },
  ];

  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-10">
      {/* User Header Profile */}
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4ff00] to-green-400 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-[#d4ff00]/20 shrink-0">
            КР
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black uppercase text-white tracking-tight">
                Константин Романов
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#d4ff00] text-black font-mono font-bold text-[10px]">
                PRO MEMBER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              ID: SP-849201 // ТАШКЕНТ // АКТИВНЫЙ БАЛАНС: 3 ТРЕНИРОВКИ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#booking"
            className="px-5 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#d4ff00]/25 transition-all"
          >
            <span>Забронировать тренировку 0 UZS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col justify-between">
          <span className="telemetry-chip text-slate-400">ПОСЕЩЕНИЙ В МЕСЯЦ:</span>
          <div className="text-3xl font-black text-white mt-2">12</div>
          <span className="text-[10px] text-[#d4ff00] mt-1">+4 к прошлому месяцу</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col justify-between">
          <span className="telemetry-chip text-slate-400">СОЖЖЕНО КАЛОРИЙ:</span>
          <div className="text-3xl font-black text-amber-400 mt-2 flex items-center gap-1">
            <Flame className="w-6 h-6" />
            8 420
          </div>
          <span className="text-[10px] text-slate-400 mt-1">~700 ккал / тренировка</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col justify-between">
          <span className="telemetry-chip text-slate-400">КЛУБОВ ПАРТНЕРОВ:</span>
          <div className="text-3xl font-black text-white mt-2">4</div>
          <span className="text-[10px] text-slate-400 mt-1">Разные локации</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col justify-between">
          <span className="telemetry-chip text-slate-400">РЕЙТИНГ ДИСЦИПЛИНЫ:</span>
          <div className="text-3xl font-black text-[#d4ff00] mt-2">100%</div>
          <span className="text-[10px] text-slate-400 mt-1">Без пропусков слотов</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 font-bold transition-all relative ${
            activeTab === "upcoming" ? "text-[#d4ff00]" : "text-slate-400 hover:text-white"
          }`}
        >
          <span>Предстоящие слоты ({upcomingBookings.length})</span>
          {activeTab === "upcoming" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4ff00]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 font-bold transition-all relative ${
            activeTab === "history" ? "text-[#d4ff00]" : "text-slate-400 hover:text-white"
          }`}
        >
          <span>История тренировок ({pastVisits.length})</span>
          {activeTab === "history" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4ff00]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-3 font-bold transition-all relative ${
            activeTab === "saved" ? "text-[#d4ff00]" : "text-slate-400 hover:text-white"
          }`}
        >
          <span>Избранные клубы</span>
          {activeTab === "saved" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4ff00]" />
          )}
        </button>
      </div>

      {/* Tab 1: Upcoming */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingBookings.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl hover:border-[#d4ff00]/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white shrink-0">
                  <QrCode className="w-8 h-8 text-[#d4ff00]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="telemetry-chip text-[#d4ff00]">{b.status}</span>
                    <span className="text-[11px] font-mono text-slate-500">ID: {b.qrCodeId}</span>
                  </div>
                  <h3 className="text-xl font-black uppercase text-white mt-1">{b.sport}</h3>
                  <p className="text-xs text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
                    {b.clubName} ({b.metro})
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Инструктор: <b className="text-white">{b.coach}</b>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Calendar className="w-3.5 h-3.5 text-[#d4ff00]" />
                    {b.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#d4ff00]" />
                    {b.time}
                  </div>
                </div>

                <button
                  onClick={() => alert(`QR-пропуск ${b.qrCodeId} активен. Предъявите на ресепшн ${b.clubName}.`)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-white text-xs uppercase"
                >
                  Показать QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: History */}
      {activeTab === "history" && (
        <div className="space-y-3 font-mono">
          {pastVisits.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs text-slate-400">{p.date}</span>
                <h4 className="text-base font-black uppercase text-white mt-0.5">{p.sport}</h4>
                <p className="text-xs text-slate-400">{p.clubName} • Тренер: {p.coach}</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {p.calories} ккал
                </span>
                <span className="text-slate-400">Пульс ср: {p.heartRateAvg} bpm</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Saved */}
      {activeTab === "saved" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.slice(0, 3).map((club) => (
            <div key={club.id} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card p-5 space-y-3">
              <img src={club.image} alt={club.name} className="w-full h-36 object-cover rounded-xl" />
              <h4 className="font-bold text-white uppercase text-base">{club.name}</h4>
              <p className="text-xs text-slate-400 font-mono">{club.metro} • от {club.priceMonthly.toLocaleString("ru-RU")} UZS</p>
              <Link
                href={`/clubs/${club.id}`}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-center block"
              >
                Открыть профиль
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
