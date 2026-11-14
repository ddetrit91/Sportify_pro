"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Sun, Moon, Menu, X, ArrowRight, Lock, Sparkles } from "lucide-react";
import { AmbientSoundController } from "./AmbientSoundController";

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("spotify-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("spotify-theme", "dark");
      setIsDark(true);
    }
  };

  const navLinks = [
    { label: "Клубы Ташкента", href: "#clubs", highlight: false },
    { label: "Виды спорта", href: "#sports", highlight: false },
    { label: "AI Matcher", href: "#ai-matcher", highlight: true },
    { label: "Преимущества", href: "#advantages", highlight: false },
    { label: "Отзывы", href: "#reviews", highlight: false },
    { label: "FAQ", href: "#faq", highlight: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Telemetry Micro-Ticker (Smoothly tucks away when scrolled to keep navbar sleek) */}
      <div
        className={`bg-black/95 text-[#d4ff00] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border-b border-white/10 flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden ${
          isScrolled
            ? "max-h-0 opacity-0 py-0 overflow-hidden border-b-0"
            : "max-h-8 py-1.5 px-4 opacity-100"
        }`}
      >
        <span className="inline-flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse shrink-0" />
          <span className="truncate">SPORTIFY LIVE // ТАШКЕНТ: 18 СЛОТОВ ОТКРЫТО СЕГОДНЯ</span>
        </span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline text-white/90 font-medium">ПЕРВАЯ ТРЕНИРОВКА 0 UZS (БЕСПЛАТНО)</span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline text-slate-300 font-medium">📞 +998 (71) 200-77-90</span>
      </div>

      {/* Main Liquid Glass Navbar (Стиль «Жидкое стекло»: оптическая рефракция, двойной зеркальный скос, мягкий блюр) */}
      <div
        className={`relative w-full transition-all duration-300 border-b border-white/20 dark:border-white/15 backdrop-blur-2xl backdrop-saturate-200 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/35 before:to-transparent before:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-white/25 dark:after:via-white/15 after:to-transparent after:pointer-events-none ${
          isScrolled
            ? "bg-white/[0.85] dark:bg-[#07090e]/[0.82] shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.3),inset_0_-1px_1.5px_0_rgba(0,0,0,0.25),0_16px_48px_-10px_rgba(0,0,0,0.5)] py-2.5 sm:py-3"
            : "bg-white/[0.68] dark:bg-[#07090e]/[0.65] shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.2),inset_0_-1px_1.5px_0_rgba(0,0,0,0.15),0_12px_36px_-10px_rgba(0,0,0,0.35)] py-3 sm:py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity with Liquid Volt Gloss */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4ff00] via-[#cbf200] to-[#a3e635] text-slate-950 flex items-center justify-center font-black shadow-[0_0_20px_rgba(212,255,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.7)] group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(212,255,0,0.6)] transition-all">
              <Zap className="w-5 h-5 fill-slate-950 stroke-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                  SPORT<span className="text-[#d4ff00]">IFY</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-white/20 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-white/20 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  TASHKENT
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 -mt-0.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#d4ff00]" />
                <span>Спортивная Экосистема</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with Liquid Pill Hover Effect */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-white/15 dark:border-white/10 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-bold tracking-tight rounded-lg transition-all flex items-center gap-1.5 ${
                  link.highlight
                    ? "text-lime-700 dark:text-[#d4ff00] bg-lime-500/15 dark:bg-[#d4ff00]/15 hover:bg-lime-500/25 dark:hover:bg-[#d4ff00]/25 font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-lime-500/25 dark:border-[#d4ff00]/30"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                }`}
              >
                {link.highlight && (
                  <Sparkles className="w-3.5 h-3.5 text-[#d4ff00] animate-pulse" />
                )}
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Primary CTA with Liquid Glass Styling */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Ambient Sound Toggle */}
            <div className="hidden sm:block">
              <AmbientSoundController />
            </div>

            {/* Liquid Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="w-9 h-9 rounded-xl border border-white/25 dark:border-white/15 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center active:scale-95 hover:border-[#d4ff00]/60 backdrop-blur-md"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Liquid Admin Command Link */}
            <Link
              href="/admin"
              className="w-9 h-9 rounded-xl border border-white/25 dark:border-white/15 bg-white/60 dark:bg-white/5 hover:border-[#d4ff00]/60 hover:text-[#d4ff00] text-slate-600 dark:text-slate-400 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center active:scale-95 backdrop-blur-md"
              title="Панель администратора"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Liquid Volt CTA Button */}
            <a
              href="#booking"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#d4ff00] via-[#cbf200] to-[#b4f000] hover:from-[#bbf200] hover:to-[#9ee600] text-slate-950 shadow-[0_4px_20px_rgba(212,255,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_28px_rgba(212,255,0,0.55)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95"
            >
              <span>Записаться 0 UZS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              aria-label="Открыть мобильное меню"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl border border-white/25 dark:border-white/15 bg-white/60 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/15 transition-colors flex items-center justify-center active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer in Liquid Glass Style */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 dark:border-white/15 bg-white/95 dark:bg-[#07080a]/95 backdrop-blur-2xl px-6 py-5 mt-2 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold py-2.5 px-3 rounded-xl text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#d4ff00] text-slate-950 shadow-sm">
                      AI
                    </span>
                  )}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold py-2.5 px-3 rounded-xl text-slate-500 hover:text-[#d4ff00] hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Админ-панель</span>
                <Lock className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2 sm:hidden border-t border-white/10">
              <AmbientSoundController />
            </div>

            <div className="pt-2">
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#d4ff00] to-[#bbf200] text-slate-950 shadow-[0_4px_20px_rgba(212,255,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] active:scale-95 transition-all"
              >
                <span>Забронировать 0 UZS</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
