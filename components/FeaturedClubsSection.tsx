"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Clock, ArrowRight, Sparkles, Filter, RotateCcw } from "lucide-react";
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

  const categories = useMemo(
    () => [
      { id: "all", label: "Все клубы Ташкента" },
      { id: "rackets", label: "Падел & Теннис" },
      { id: "martial_arts", label: "Бокс & ММА" },
      { id: "fitness", label: "Кроссфит & Зал" },
      { id: "swimming", label: "Бассейн 50м" },
      { id: "yoga", label: "Реформер-пилатес" },
      { id: "extreme", label: "Скалолазание" },
    ],
    []
  );

  // Dynamic filtering with multi-criteria support
  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const matchCat = activeCategory === "all" || c.category === activeCategory;
      const matchTrial = !onlyFreeTrial || c.priceTrial === 0;
      return matchCat && matchTrial;
    });
  }, [clubs, activeCategory, onlyFreeTrial]);

  const resetFilters = () => {
    haptic.select();
    setActiveCategory("all");
    setOnlyFreeTrial(false);
  };

  return (
    <section id="clubs" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Soft Ambient Radial Shadow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="relative">
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

        {/* Filter Controls Bar with Live Telemetry Count */}
        <div className="flex flex-col gap-4 pb-6 border-b border-slate-200 dark:border-white/10 mb-10">
          {/* Row 1: Monolithic Sport Category Stream across full width (All 7 in 1 row) */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full"
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    haptic.select();
                    setActiveCategory(cat.id);
                  }}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border border-black/15 dark:border-transparent bg-[#d4ff00] text-black font-black shadow-sm dark:shadow-md dark:shadow-[#d4ff00]/25 scale-[1.02]"
                      : "border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-[#0c0e14]/75 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-sm shadow-sm"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Balanced Live Telemetry & Quick Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Left: Live Telemetry Indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
              <span>
                ПОКАЗАНО: <strong className="text-slate-900 dark:text-white font-bold">{filteredClubs.length}</strong> ИЗ{" "}
                {clubs.length} КЛУБОВ
              </span>
              {onlyFreeTrial && (
                <span className="text-black dark:text-[#d4ff00] bg-[#d4ff00]/25 dark:bg-[#d4ff00]/10 px-2 py-0.5 rounded border border-[#d4ff00]/40 text-[10px] uppercase font-sans font-black">
                  Фильтр: 0 UZS
                </span>
              )}
            </div>

            {/* Right: Quick Toggle (0 UZS) + Reset Filters Button */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap self-start sm:self-auto">
              {/* Quick Toggle: 0 UZS trial */}
              <button
                onClick={() => {
                  haptic.toggle();
                  setOnlyFreeTrial(!onlyFreeTrial);
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold tracking-wide flex items-center gap-2 transition-all backdrop-blur-md cursor-pointer ${
                  onlyFreeTrial
                    ? "border-[#d4ff00] bg-[#d4ff00]/20 text-black dark:text-[#d4ff00] shadow-[0_0_15px_-3px_rgba(212,255,0,0.3)] ring-1 ring-[#d4ff00]/40 scale-[1.02]"
                    : "border-slate-300 dark:border-white/10 bg-white/80 dark:bg-[#0c0e14]/85 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:border-slate-400 dark:hover:border-white/25 shadow-sm"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {onlyFreeTrial && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff00] opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 transition-colors ${
                      onlyFreeTrial ? "bg-[#d4ff00]" : "bg-slate-400 dark:bg-slate-600"
                    }`}
                  />
                </span>
                <span>Только бесплатное (0 UZS)</span>
              </button>

              {/* Reset Filters HUD Button */}
              {(activeCategory !== "all" || onlyFreeTrial) && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 bg-white/90 dark:bg-[#0c0e14]/90 hover:border-[#d4ff00]/60 dark:hover:border-[#d4ff00]/60 hover:bg-[#d4ff00]/10 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-[#d4ff00] backdrop-blur-md shadow-sm transition-all cursor-pointer group shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#d4ff00] group-hover:rotate-[-45deg] transition-transform duration-200" />
                  <span>Сбросить</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State when no clubs match */}
        {filteredClubs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 px-6 text-center rounded-3xl border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-[#0c0e14]/75 backdrop-blur-md max-w-lg mx-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#d4ff00]/15 text-[#d4ff00] flex items-center justify-center mx-auto mb-4 border border-[#d4ff00]/30">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white mb-2">
              Клубов не найдено
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              В выбранной категории сейчас нет клубов с бесплатным пробным занятием. Попробуйте снять фильтр «Только 0 UZS» или выбрать другой вид спорта.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-black font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              Показать все залы
            </button>
          </motion.div>
        ) : (
          /* Clubs Grid with Buttery Smooth Framer Motion Layout Reordering */
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredClubs.map((club, idx) => (
                <motion.div
                  key={club.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 28,
                    layout: { duration: 0.35, ease: "easeInOut" },
                  }}
                  className="h-full"
                >
                  <TiltCard maxTilt={5} glareOpacity={0.25} className="rounded-3xl h-full">
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
            </AnimatePresence>
          </motion.div>
        )}
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
