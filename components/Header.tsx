"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Sun, Moon, Menu, X, ArrowRight, Lock, Sparkles } from "lucide-react";
import { AmbientSoundController } from "./AmbientSoundController";
import { MagneticButton } from "./motion/MagneticButton";
import { SonarPing } from "./motion/SonarPing";
import { haptic } from "@/lib/haptics";

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
    haptic.toggle(!isDark);
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
        <span className="inline-flex items-center gap-2 truncate">
          <SonarPing size="sm" color="bg-[#d4ff00]" />
          <span className="truncate">SPORTIFY LIVE // ТАШКЕНТ: 18 СЛОТОВ ОТКРЫТО СЕГОДНЯ</span>
        </span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline text-white/90 font-medium">ПЕРВАЯ ТРЕНИРОВКА 0 UZS (БЕСПЛАТНО)</span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-200 font-medium">
          <span className="text-[#ff2d55]">📞</span>
          <span>+998 (71) 200-77-90</span>
        </span>
      </div>

      {/* Main Command Navbar (High-Tech Athletic Glassmorphism with Mirror Bevel) */}
      <div
        className={`relative w-full transition-all duration-300 border-b before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/15 before:to-transparent pointer-events-auto ${
          isScrolled
            ? "bg-white/95 dark:bg-[#08090b]/95 backdrop-blur-2xl border-slate-200 dark:border-white/15 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_18px_45px_-12px_rgba(0,0,0,0.8)] py-2.5 sm:py-3"
            : "bg-white/85 dark:bg-[#08090b]/85 backdrop-blur-xl border-slate-200/70 dark:border-white/10 py-3 sm:py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4ff00] via-[#cbf200] to-[#b4f000] text-black flex items-center justify-center font-black shadow-[0_0_20px_rgba(212,255,0,0.45)] group-hover:scale-105 group-hover:shadow-[0_0_28px_rgba(212,255,0,0.65)] transition-all shrink-0">
              <Zap className="w-5 h-5 fill-black stroke-black" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black font-display tracking-tight text-slate-950 dark:text-white">
                  SPORT<span className="text-[#d4ff00]">IFY</span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-normal">
                  / TASHKENT
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500 dark:text-slate-400 -mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
                <span>SPORT ECOSYSTEM</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav Capsule with Athletic Highlighting */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-[#11141c]/90 border border-slate-200 dark:border-white/10 rounded-full p-1 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  link.highlight
                    ? "text-black bg-[#d4ff00] hover:bg-[#cbf200] font-black shadow-[0_0_16px_rgba(212,255,0,0.45)] hover:shadow-[0_0_24px_rgba(212,255,0,0.65)] hover:scale-105 active:scale-95"
                    : "text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/10"
                }`}
              >
                {link.highlight && (
                  <Sparkles className="w-3.5 h-3.5 fill-black stroke-black animate-pulse shrink-0" />
                )}
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
              className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-[#11141c]/90 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all shadow-sm flex items-center justify-center active:scale-95 hover:border-[#d4ff00]/60"
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
              className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-[#11141c]/90 hover:border-[#d4ff00]/60 text-slate-600 dark:text-slate-300 hover:text-[#d4ff00] transition-all shadow-sm flex items-center justify-center active:scale-95"
              title="Панель администратора"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Primary Action Button with Magnetic Pull Physics */}
            <MagneticButton className="hidden sm:inline-block">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 h-10 px-6 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#d4ff00] via-[#cbf200] to-[#b4f000] hover:from-[#bbf200] hover:to-[#9ee600] text-black shadow-[0_0_20px_rgba(212,255,0,0.4)] hover:shadow-[0_0_28px_rgba(212,255,0,0.6)] transition-all active:scale-95 shrink-0"
              >
                <span>Записаться 0 UZS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </MagneticButton>

            {/* Mobile Menu Hamburger */}
            <button
              aria-label="Открыть мобильное меню"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-[#11141c]/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center active:scale-95"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#08090b]/95 backdrop-blur-2xl px-6 py-5 mt-2 space-y-4 animate-in fade-in slide-in-from-top-3">
            <div className="flex flex-col space-y-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                    link.highlight
                      ? "bg-[#d4ff00]/15 dark:bg-[#d4ff00]/20 text-lime-700 dark:text-[#d4ff00] border border-[#d4ff00]/30 font-black"
                      : "text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.highlight && <Sparkles className="w-4 h-4 text-[#d4ff00]" />}
                    {link.label}
                  </span>
                  {link.highlight && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#d4ff00] text-black shadow-sm">
                      AI MATCH
                    </span>
                  )}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold py-2.5 px-3.5 rounded-xl text-slate-500 hover:text-[#d4ff00] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Админ-панель</span>
                <Lock className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2 sm:hidden border-t border-slate-200 dark:border-white/10">
              <AmbientSoundController />
            </div>

            <div className="pt-2">
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#d4ff00] to-[#bbf200] text-black shadow-[0_0_20px_rgba(212,255,0,0.35)] active:scale-95 transition-all"
              >
                <span>Забронировать 0 UZS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
