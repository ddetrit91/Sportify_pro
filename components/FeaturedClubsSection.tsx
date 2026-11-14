"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, Check, ArrowRight, ShieldCheck, Sparkles, Filter } from "lucide-react";
import { Club } from "@/lib/types";
import { BookingModal } from "./BookingModal";

interface FeaturedClubsSectionProps {
  clubs: Club[];
}

export function FeaturedClubsSection({ clubs }: FeaturedClubsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [onlyFreeTrial, setOnlyFreeTrial] = useState(false);
  const [bookingClub, setBookingClub] = useState<Club | null>(null);

  const categories = [
    { id: "all", label: "Все клубы Ташкента" },
    { id: "rackets", label: "Падел & Теннис" },
    { id: "martial_arts", label: "Бокс & ММА" },
    { id: "fitness", label: "Кроссфит & Зал" },
    { id: "swimming", label: "Бассейн 50м" },
    { id: "yoga", label: "Реформер-пилатес" },
    { id: "extreme", label: "Скалолазание" },
  ];

  const filteredClubs = clubs.filter((c) => {
    const matchCat = activeCategory === "all" || c.category === activeCategory;
    const matchTrial = !onlyFreeTrial || c.priceTrial === 0;
    return matchCat && matchTrial;
  });

  return (
    <section id="clubs" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-slate-700 dark:text-white/80">ТОПОВЫЕ КЛУБЫ ТАШКЕНТА // RATED 4.88+</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-tight">
              Спортивные клубы <span className="text-[#d4ff00]">Ташкента</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Прямое бронирование в проверенные залы Ташкента. Честные цены без скрытых доплат и гарантированное первое занятие за 0 UZS.
            </p>
          </div>

          <a
            href="#booking"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-white/10 hover:border-[#d4ff00] bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold tracking-wide text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-all self-start md:self-end shadow-sm"
          >
            <span>Оформить пропуск 0 UZS</span>
            <ArrowRight className="w-4 h-4 text-[#d4ff00]" />
          </a>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#d4ff00] text-black font-black shadow-md shadow-[#d4ff00]/20"
                    : "border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Toggle: 0 UZS trial */}
          <button
            onClick={() => setOnlyFreeTrial(!onlyFreeTrial)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold tracking-wide flex items-center gap-2 transition-all self-start lg:self-auto ${
              onlyFreeTrial
                ? "border-[#d4ff00] bg-[#d4ff00]/20 text-lime-700 dark:text-[#d4ff00]"
                : "border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white shadow-sm"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyFreeTrial ? "bg-[#d4ff00] animate-ping" : "bg-slate-400 dark:bg-slate-600"}`} />
            <span>Только бесплатное первое занятие (0 UZS)</span>
          </button>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map((club, idx) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col group hover:border-[#d4ff00]/60 transition-all hover:-translate-y-1 shadow-lg dark:shadow-2xl"
            >
              {/* Photo & Overlays */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-900 rounded-t-3xl">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Metro Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: club.metroColor || "#d4ff00" }}
                  />
                  <span>{club.metro}</span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                  <span>{club.rating}</span>
                  <span className="text-white/40 text-[10px]">({club.reviewCount})</span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="telemetry-chip text-[#d4ff00] block mb-0.5">
                    {club.categoryName}
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-tight leading-snug">
                    {club.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {club.description}
                </p>

                {/* Address & schedule */}
                <div className="text-xs font-medium space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                    <span>{club.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{club.schedule}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {club.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="telemetry-chip text-slate-400 dark:text-slate-500 block">АБОНЕМЕНТ</span>
                    <span className="text-base font-extrabold text-slate-950 dark:text-white">
                      от {club.priceMonthly.toLocaleString("ru-RU")} UZS
                    </span>
                    <span className="text-xs font-bold text-lime-600 dark:text-[#d4ff00] block mt-0.5">
                      Пробное: {club.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${club.priceTrial.toLocaleString("ru-RU")} UZS`}
                    </span>
                  </div>

                  <button
                    onClick={() => setBookingClub(club)}
                    className="px-4 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#d4ff00]/20 transition-all active:scale-95"
                  >
                    <span>Записаться</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        club={bookingClub}
        isOpen={!!bookingClub}
        onClose={() => setBookingClub(null)}
      />
    </section>
  );
}
