"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Sun, Moon, Menu, X, ArrowRight, Search, Lock } from "lucide-react";
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

    window.addEventListener("scroll", handleScroll);
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
    { label: "Клубы Ташкента", href: "#clubs" },
    { label: "Виды спорта", href: "#sports" },
    { label: "AI Matcher", href: "#ai-matcher" },
    { label: "Преимущества", href: "#advantages" },
    { label: "Отзывы", href: "#reviews" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      {/* Top Telemetry Notification Bar */}
      <div className="bg-black text-[#d4ff00] text-[11px] font-semibold tracking-wider uppercase py-1.5 px-4 text-center border-b border-white/5 flex items-center justify-center gap-3 relative z-50">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
          <span>SPORTIFY LIVE // ТАШКЕНТ: 18 СЛОТОВ ОТКРЫТО СЕГОДНЯ</span>
        </span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline text-white/90 font-medium">ПЕРВАЯ ТРЕНИРОВКА 0 UZS (БЕСПЛАТНО)</span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline text-slate-300 font-medium">📞 +998 (71) 200-77-90</span>
      </div>

      <header
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-athletic shadow-2xl py-3 border-b"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#d4ff00] text-black flex items-center justify-center font-black shadow-lg shadow-[#d4ff00]/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center">
                SPORT<span className="text-[#d4ff00]">IFY</span>
                <span className="ml-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 tracking-widest">
                  /TOSHKENT
                </span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 -mt-1">
                Sport Ecosystem
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl glass-athletic border border-white/10 dark:border-white/5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-bold tracking-tight rounded-lg transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2.5">
            {/* Ambient Sound Toggle */}
            <AmbientSoundController />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-void-surface hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
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
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-void-surface hover:border-[#d4ff00]/60 text-slate-600 dark:text-slate-400 hover:text-[#d4ff00] transition-colors"
              title="Панель администратора"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Primary Action Button */}
            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 shadow-md shadow-[#d4ff00]/25 hover:shadow-[#d4ff00]/40 transition-all active:scale-95"
            >
              <span>Записаться 0 UZS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              aria-label="Открыть мобильное меню"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-athletic border-b border-slate-200 dark:border-white/10 px-6 py-6 mt-3 space-y-4 animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold py-2 text-slate-800 dark:text-slate-200 hover:text-[#d4ff00] border-t border-slate-100 dark:border-white/5 first:border-t-0"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold py-2 text-slate-500 hover:text-[#d4ff00] border-t border-slate-100 dark:border-white/5 flex items-center justify-between"
              >
                <span>Админ-панель</span>
                <Lock className="w-4 h-4" />
              </Link>
            </div>
            <div className="pt-2">
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#d4ff00] text-slate-950 shadow-lg shadow-[#d4ff00]/25"
              >
                <span>Забронировать 0 UZS</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
