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

      {/* Main Command Navbar (Refined 60px height, High-Tech Glassmorphism, Perfect Proportions) */}
      <div
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/95 dark:bg-[#07080a]/95 backdrop-blur-2xl border-slate-200 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-black/30 py-2.5 sm:py-3"
            : "bg-white/85 dark:bg-[#07080a]/80 backdrop-blur-xl border-slate-200/60 dark:border-white/10 py-3 sm:py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4ff00] via-[#cbf200] to-[#a3e635] text-slate-950 flex items-center justify-center font-black shadow-md shadow-[#d4ff00]/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-slate-950 stroke-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                  SPORT<span className="text-[#d4ff00]">IFY</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-white/10 dark:bg-white/10 text-slate-600 dark:text-slate-400 border border-white/10">
                  TASHKENT
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 -mt-0.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#d4ff00]" />
                <span>Спортивная Экосистема</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav Capsule */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  link.highlight
                    ? "text-black bg-[#d4ff00] hover:bg-[#bbf200] shadow-sm shadow-[#d4ff00]/25 flex items-center gap-1.5"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10"
                }`}
              >
                {link.highlight && <Sparkles className="w-3 h-3 fill-black" />}
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Ambient Sound Toggle */}
            <div className="hidden sm:block">
              <AmbientSoundController />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all shadow-sm flex items-center justify-center active:scale-95 hover:border-[#d4ff00]/60"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Admin Command Link */}
            <Link
              href="/admin"
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 hover:border-[#d4ff00]/60 text-slate-600 dark:text-slate-400 hover:text-[#d4ff00] transition-all shadow-sm flex items-center justify-center active:scale-95"
              title="Панель администратора"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Primary Action Button */}
            <a
              href="#booking"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 shadow-md shadow-[#d4ff00]/20 hover:shadow-[#d4ff00]/35 hover:-translate-y-0.5 transition-all active:translate-y-0 active:scale-95"
            >
              <span>Записаться 0 UZS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              aria-label="Открыть мобильное меню"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center active:scale-95"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#07080a]/95 backdrop-blur-2xl px-6 py-5 mt-2 space-y-4 animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold py-2.5 px-3 rounded-lg text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
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
                className="text-sm font-bold py-2.5 px-3 rounded-lg text-slate-500 hover:text-[#d4ff00] hover:bg-white/10 transition-colors flex items-center justify-between"
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
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-black uppercase tracking-wider bg-[#d4ff00] text-slate-950 shadow-md shadow-[#d4ff00]/25 active:scale-95 transition-all"
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
