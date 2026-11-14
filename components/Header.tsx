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
      setIsScrolled(window.scrollY > 25);
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
    <>
      {/* Top Telemetry Notification Ticker */}
      <div className="bg-black/95 text-[#d4ff00] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase py-2 px-4 text-center border-b border-white/10 flex items-center justify-center gap-3 relative z-50">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
          <span>SPORTIFY LIVE // ТАШКЕНТ: 18 СЛОТОВ ОТКРЫТО СЕГОДНЯ</span>
        </span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline text-white/90 font-medium">ПЕРВАЯ ТРЕНИРОВКА 0 UZS (БЕСПЛАТНО)</span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline text-slate-300 font-medium">📞 +998 (71) 200-77-90</span>
      </div>

      {/* Floating Volumetric Architectural Island Header */}
      <header className="fixed top-9 sm:top-10 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <div
            className={`relative w-full rounded-2xl sm:rounded-3xl transition-all duration-300 px-4 sm:px-6 flex items-center justify-between before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent ${
              isScrolled
                ? "h-[70px] sm:h-[76px] bg-black/85 dark:bg-[#080a0f]/90 bg-white/90 backdrop-blur-2xl border border-white/20 dark:border-white/15 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                : "h-20 sm:h-[84px] bg-black/60 dark:bg-[#080a0f]/75 bg-white/80 backdrop-blur-xl border border-white/15 dark:border-white/12 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)] dark:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
            }`}
          >
            {/* Left: Brand Logo & Identity */}
            <a href="#" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#d4ff00] via-[#cbf200] to-[#a3e635] text-slate-950 flex items-center justify-center font-black shadow-lg shadow-[#d4ff00]/30 ring-2 ring-[#d4ff00]/40 group-hover:scale-105 group-hover:shadow-[#d4ff00]/50 transition-all">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 stroke-slate-950" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                    SPORT<span className="text-[#d4ff00]">IFY</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-white/10 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-white/10">
                    TASHKENT
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400 -mt-0.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#d4ff00]" />
                  <span>Спортивная Экосистема</span>
                </span>
              </div>
            </a>

            {/* Center: Volumetric Segmented Navigation Dock */}
            <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-black/30 dark:bg-black/40 bg-slate-100/80 border border-white/10 dark:border-white/10 backdrop-blur-md shadow-inner">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 xl:px-4 py-2 text-[13px] font-bold tracking-tight rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                    link.highlight
                      ? "text-slate-900 dark:text-[#d4ff00] hover:bg-[#d4ff00]/15 hover:shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/15 dark:hover:bg-white/10"
                  }`}
                >
                  {link.highlight && (
                    <Sparkles className="w-3.5 h-3.5 text-[#d4ff00] animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            {/* Right: Volumetric Action Controls & CTA */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Ambient Sound Toggle Controller */}
              <div className="hidden sm:block">
                <AmbientSoundController />
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Переключить тему"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/12 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all shadow-sm flex items-center justify-center active:scale-95 hover:border-[#d4ff00]/60"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Admin Portal Link */}
              <Link
                href="/admin"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/12 bg-white/80 dark:bg-white/5 hover:border-[#d4ff00]/60 text-slate-600 dark:text-slate-400 hover:text-[#d4ff00] transition-all shadow-sm flex items-center justify-center active:scale-95"
                title="Панель администратора"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              {/* Primary High-Impact CTA Button */}
              <a
                href="#booking"
                className="hidden sm:inline-flex items-center gap-2 h-10 sm:h-11 px-5 sm:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#d4ff00] via-[#cbf200] to-[#b4f000] hover:from-[#bbf200] hover:to-[#9ee600] text-slate-950 shadow-[0_4px_20px_rgba(212,255,0,0.35)] hover:shadow-[0_6px_28px_rgba(212,255,0,0.55)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95"
              >
                <span>Записаться 0 UZS</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Mobile Menu Hamburger */}
              <button
                aria-label="Открыть мобильное меню"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 dark:border-white/12 bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center active:scale-95"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 rounded-2xl sm:rounded-3xl bg-black/90 dark:bg-[#080a0f]/95 bg-white/95 backdrop-blur-2xl border border-white/20 dark:border-white/15 p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-bold py-2.5 px-3 rounded-xl text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#d4ff00] text-slate-950">
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

              {/* Mobile Ambient Sound Controller */}
              <div className="pt-2 sm:hidden border-t border-white/10">
                <AmbientSoundController />
              </div>

              <div className="pt-2">
                <a
                  href="#booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#d4ff00] to-[#bbf200] text-slate-950 shadow-lg shadow-[#d4ff00]/30 active:scale-95 transition-all"
                >
                  <span>Забронировать 0 UZS</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
