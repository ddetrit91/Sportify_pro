"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Filter, ArrowRight, Clock, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { Club } from "@/lib/types";
import { BookingModal } from "@/components/BookingModal";

export function ClubsDirectoryClient({ initialClubs }: { initialClubs: Club[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMetro, setSelectedMetro] = useState("all");
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");
  const [freeTrialOnly, setFreeTrialOnly] = useState(false);
  const [bookingClub, setBookingClub] = useState<Club | null>(null);

  const categories = [
    { id: "all", label: "Все категории" },
    { id: "rackets", label: "Падел & Теннис" },
    { id: "martial_arts", label: "Бокс & ММА" },
    { id: "fitness", label: "Кроссфит & Зал" },
    { id: "swimming", label: "Бассейн 50м" },
    { id: "yoga", label: "Реформер-пилатес" },
    { id: "extreme", label: "Скалолазание" },
  ];

  const metros = ["all", "м. Спортивная", "м. Динамо", "м. Киевская", "м. Воробьевы горы", "м. Маяковская", "м. Дмитровская"];

  const filtered = initialClubs
    .filter((c) => {
      const matchCat = selectedCategory === "all" || c.category === selectedCategory;
      const matchMetro = selectedMetro === "all" || c.metro.includes(selectedMetro.replace("м. ", ""));
      const matchTrial = !freeTrialOnly || c.priceTrial === 0;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.metro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchMetro && matchTrial && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_asc") return a.priceMonthly - b.priceMonthly;
      if (sortBy === "price_desc") return b.priceMonthly - a.priceMonthly;
      return 0;
    });

  return (
    <div className="pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* Page Header */}
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
          <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
          <span className="telemetry-chip text-white/80">ОНЛАЙН-РЕЕСТР ПЛОЩАДОК ТАШКЕНТА</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
          Каталог клубов и <span className="text-[#d4ff00]">локаций</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl font-normal">
          Сравнивайте условия, расписание и цены проверенных клубов Ташкента. Записывайтесь онлайн на первое занятие за 0 UZS.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-6 rounded-3xl border border-white/10 bg-void-card shadow-2xl mb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по названию, метро или оборудованию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-[#d4ff00]/60 transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedMetro}
              onChange={(e) => setSelectedMetro(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]/60 font-mono"
            >
              {metros.map((m) => (
                <option key={m} value={m} className="bg-black text-white">
                  {m === "all" ? "Все станции метро" : m}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]/60 font-mono"
            >
              <option value="rating" className="bg-black text-white">По рейтингу (топ)</option>
              <option value="price_asc" className="bg-black text-white">Сначала доступные</option>
              <option value="price_desc" className="bg-black text-white">Сначала премиум</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Checkboxes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? "bg-[#d4ff00] text-black font-black"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setFreeTrialOnly(!freeTrialOnly)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider flex items-center gap-2 shrink-0 ${
              freeTrialOnly
                ? "border-[#d4ff00] bg-[#d4ff00]/15 text-[#d4ff00]"
                : "border-white/10 bg-white/5 text-slate-400"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${freeTrialOnly ? "bg-[#d4ff00]" : "bg-slate-600"}`} />
            <span>Только 0 UZS Пробное</span>
          </button>
        </div>
      </div>

      {/* Clubs Count telemetry */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
        <span>НАЙДЕНО ОБЪЕКТОВ: <b className="text-white">{filtered.length}</b></span>
        <span>ТАШКЕНТ И СТОЛИЧНАЯ АГЛОМЕРАЦИЯ</span>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((club) => (
          <div
            key={club.id}
            className="rounded-3xl border border-white/10 bg-void-card overflow-hidden group hover:border-[#d4ff00]/40 transition-all flex flex-col justify-between shadow-2xl"
          >
            <div className="relative h-60 w-full overflow-hidden bg-slate-900">
              <img
                src={club.image}
                alt={club.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-mono text-white">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: club.metroColor || "#d4ff00" }}
                />
                <span>{club.metro}</span>
              </div>
              <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{club.rating}</span>
                <span className="text-white/40 text-[10px]">({club.reviewCount})</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="telemetry-chip text-[#d4ff00] block mb-0.5">
                  {club.categoryName}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {club.name}
                </h3>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {club.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {club.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4ff00]" />
                  {club.schedule}
                </span>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="telemetry-chip text-slate-500 block">АБОНЕМЕНТ</span>
                  <span className="text-lg font-extrabold text-white">
                    от {club.priceMonthly.toLocaleString("ru-RU")} UZS
                  </span>
                  <span className="text-xs font-bold text-[#d4ff00] block mt-0.5">
                    Пробное: {club.priceTrial === 0 ? "0 UZS (Бесплатно)" : `${club.priceTrial.toLocaleString("ru-RU")} UZS`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/clubs/${club.id}`}
                    className="p-2.5 rounded-xl border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-colors"
                    title="Страница клуба"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setBookingClub(club)}
                    className="px-4 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#d4ff00]/20 transition-all active:scale-95"
                  >
                    <span>Записаться</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BookingModal
        club={bookingClub}
        isOpen={!!bookingClub}
        onClose={() => setBookingClub(null)}
      />
    </div>
  );
}
