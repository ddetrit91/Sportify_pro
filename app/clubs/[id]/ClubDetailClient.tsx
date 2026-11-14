"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Clock, CheckCircle2, ShieldCheck, Sparkles, Calendar, User, Phone, ArrowRight, Award } from "lucide-react";
import { Club } from "@/lib/types";
import { BookingModal } from "@/components/BookingModal";

export function ClubDetailClient({ club }: { club: Club }) {
  const [activePhoto, setActivePhoto] = useState(club.image);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const allPhotos = [club.image, ...(club.gallery || [])];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 space-y-12">
      {/* Breadcrumb Back */}
      <div>
        <Link
          href="/clubs"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-[#d4ff00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться к каталогу клубов</span>
        </Link>
      </div>

      {/* Main Club Banner & Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photos Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
            <img
              src={activePhoto}
              alt={club.name}
              className="w-full h-full object-cover transition-all duration-500 filter brightness-95"
            />
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-xs font-mono text-white">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: club.metroColor || "#d4ff00" }}
              />
              <span>{club.metro}</span>
            </div>
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-amber-400 text-xs font-mono font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{club.rating}</span>
              <span className="text-white/40">({club.reviewCount} отзывов)</span>
            </div>
          </div>

          {/* Thumbnails */}
          {allPhotos.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allPhotos.map((photo, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setActivePhoto(photo)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border shrink-0 transition-all ${
                    activePhoto === photo
                      ? "border-[#d4ff00] scale-105"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking & Info Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 rounded-3xl border border-white/10 bg-void-card p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <span className="telemetry-chip text-[#d4ff00] block mb-1">
              {club.categoryName.toUpperCase()} // СЕРТИФИЦИРОВАННЫЙ КЛУБ
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              {club.name}
            </h1>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
              {club.address} ({club.metro})
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Первое пробное занятие:</span>
              <span className="text-[#d4ff00] font-black text-sm">
                {club.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${club.priceTrial.toLocaleString("ru-RU")} UZS`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Месячный абонемент:</span>
              <span className="text-white font-bold text-sm">
                от {club.priceMonthly.toLocaleString("ru-RU")} UZS
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[11px]">
              <span className="text-slate-400">График работы:</span>
              <span className="text-slate-200">{club.schedule}</span>
            </div>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="w-full py-4 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#d4ff00]/25 transition-all active:scale-95"
          >
            <span>Забронировать пробное занятие 0 UZS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono text-center">
            <ShieldCheck className="w-4 h-4 text-[#d4ff00]" />
            <span>Без предоплаты. Подтверждение за 10 минут.</span>
          </div>
        </div>
      </div>

      {/* Description & Amenities Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-white/10">
        <div className="md:col-span-8 space-y-6">
          <div>
            <span className="telemetry-chip text-[#d4ff00] block mb-2">О ПРОСТРАНСТВЕ</span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              Концепция и оснащение
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal mt-3">
              {club.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div>
            <span className="telemetry-chip text-white block mb-3">УДОБСТВА И СЕРВИС</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {club.amenities.map((am, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 font-mono"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timetable Schedule */}
          {club.timetable && club.timetable.length > 0 && (
            <div className="pt-6">
              <span className="telemetry-chip text-[#d4ff00] block mb-3">
                РАСПИСАНИЕ ТРЕНИРОВОК НА СЕГОДНЯ
              </span>
              <div className="space-y-2.5">
                {club.timetable.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl border border-white/10 bg-void-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#d4ff00] px-2.5 py-1 rounded-md bg-white/5">
                        {slot.time}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{slot.activity}</h4>
                        <span className="text-xs text-slate-400 font-mono">
                          Тренер: {slot.coach}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-400">
                        Осталось {slot.availableSpots} мест
                      </span>
                      <button
                        onClick={() => setIsBookingOpen(true)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#d4ff00] hover:bg-[#bbf200] text-black font-black text-xs uppercase"
                      >
                        Занять слот
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coaches Roster */}
        <div className="md:col-span-4 space-y-6">
          <span className="telemetry-chip text-white block">ТРЕНЕРСКИЙ СОСТАВ</span>
          <div className="space-y-4">
            {club.coaches && club.coaches.map((coach) => (
              <div
                key={coach.id}
                className="p-5 rounded-2xl border border-white/10 bg-void-card space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <h5 className="font-bold text-white text-sm">{coach.name}</h5>
                    <p className="text-[11px] text-slate-400 font-mono">{coach.role}</p>
                    <span className="text-[10px] text-[#d4ff00] font-mono">Опыт: {coach.experience}</span>
                  </div>
                </div>
                {coach.achievements && (
                  <ul className="text-[11px] text-slate-300 space-y-1 font-mono pt-1 border-t border-white/5">
                    {coach.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-[#d4ff00] shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingModal
        club={club}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
