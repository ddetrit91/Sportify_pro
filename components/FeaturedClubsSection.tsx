"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, Check, ArrowRight, ShieldCheck, Sparkles, Filter } from "lucide-react";
import { Club } from "@/lib/types";
import { BookingModal } from "./BookingModal";
import { TiltCard } from "./motion/TiltCard";
import { BorderBeam } from "./motion/BorderBeam";
import { MagneticButton } from "./motion/MagneticButton";
import { SonarPing } from "./motion/SonarPing";
import { haptic } from "@/lib/haptics";

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="relative">
            {/* Soft Ambient Radial Shadow: gracefully dims background kinetic lines without any harsh borders */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-8 -inset-y-6 rounded-[40px] bg-[radial-gradient(ellipse_at_center,_rgba(248,250,252,0.9)_0%,_rgba(248,250,252,0.6)_50%,_transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(7,8,10,0.92)_0%,_rgba(7,8,10,0.65)_55%,_transparent_100%)] blur-2xl pointer-events-none -z-10"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 dark:border-[#d4ff00]/30 bg-white/80 dark:bg-[#d4ff00]/10 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="telemetry-chip text-slate-700 dark:text-[#d4ff00]">ТОПОВЫЕ КЛУБЫ ТАШКЕНТА // RATED 4.88+</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              Спортивные клубы <span className="text-[#d4ff00]">Ташкента</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Прямое бронирование в проверенные залы Ташкента. Честные цены без скрытых доплат и гарантированное первое занятие за 0 UZS.
            </p>
          </div>

          <a
            href="#booking"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-[#d4ff00]/30 hover:border-[#d4ff00] bg-white dark:bg-[#0c0e14]/85 hover:bg-slate-200 dark:hover:bg-[#d4ff00]/15 text-xs font-bold tracking-wide text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-[#d4ff00] transition-all self-start md:self-end shadow-sm backdrop-blur-md shrink-0"
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
                onClick={() => {
                  haptic.select();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#d4ff00] text-black font-black shadow-md shadow-[#d4ff00]/20"
                    : "border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-[#0c0e14]/75 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-sm shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Toggle: 0 UZS trial */}
          <button
            onClick={() => setOnlyFreeTrial(!onlyFreeTrial)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold tracking-wide flex items-center gap-2 transition-all self-start lg:self-auto shrink-0 backdrop-blur-md ${
              onlyFreeTrial
                ? "border-[#d4ff00] bg-[#d4ff00]/20 text-lime-700 dark:text-[#d4ff00]"
                : "border-slate-300 dark:border-white/10 bg-white/80 dark:bg-[#0c0e14]/85 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white shadow-sm"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyFreeTrial ? "bg-[#d4ff00] animate-ping" : "bg-slate-400 dark:bg-slate-600"}`} />
            <span>Только бесплатное первое занятие (0 UZS)</span>
          </button>
        </div>

        {/* Clubs Grid with 3D Mouse Tilt & Dynamic Glare */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map((club, idx) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="h-full"
            >
              <TiltCard maxTilt={5} glareOpacity={0.25} className="rounded-3xl">
                <div className="relative h-full rounded-3xl border border-slate-200/90 dark:border-[#d4ff00]/25 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-sm flex flex-col group hover:border-[#d4ff00]/80 dark:hover:border-[#d4ff00] transition-all duration-300 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(212,255,0,0.15)] hover:shadow-[0_24px_60px_-15px_rgba(212,255,0,0.35)] before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent before:z-20 overflow-hidden">
                  {/* Top Club of the Week Border Beam */}
                  {idx === 0 && (
                    <BorderBeam duration={7} borderWidth={1.5} colorFrom="#d4ff00" />
                  )}

                  {/* Photo & Overlays */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900 rounded-t-3xl">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {/* Metro Badge with Live Sonar Radar */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                      <SonarPing size="sm" color="bg-[#d4ff00]" />
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
                      <div className="min-w-0">
                        <span className="telemetry-chip text-slate-400 dark:text-slate-500 block">АБОНЕМЕНТ</span>
                        <span className="text-base font-extrabold text-slate-950 dark:text-white truncate block">
                          от {club.priceMonthly.toLocaleString("ru-RU")} UZS
                        </span>
                        <span className="text-xs font-bold text-lime-600 dark:text-[#d4ff00] block mt-0.5 whitespace-nowrap">
                          Пробное: {club.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${club.priceTrial.toLocaleString("ru-RU")} UZS`}
                        </span>
                      </div>

                      {/* Magnetic CTA Button with Spring Physics */}
                      <MagneticButton
                        onClick={() => {
                          haptic.click();
                          setBookingClub(club);
                        }}
                      >
                        <div className="px-4 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md shadow-[#d4ff00]/20 hover:shadow-[#d4ff00]/40 transition-all active:scale-95">
                          <span>Записаться</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </TiltCard>
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
