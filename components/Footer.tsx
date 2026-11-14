import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Send, Lock, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-black/60 backdrop-blur-xl text-slate-900 dark:text-white pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-[#d4ff00] text-black flex items-center justify-center font-black shadow-lg shadow-[#d4ff00]/25">
                <Zap className="w-5 h-5 fill-black stroke-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-950 dark:text-white">
                SPORT<span className="text-lime-600 dark:text-[#d4ff00]">IFY</span>
              </span>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-normal">
              Интеллектуальная спортивная платформа нового поколения. Прямой онлайн-доступ к премиальным спортивным клубам Ташкента, тренировкам и кортам.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-white/10 hover:border-[#d4ff00]/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-[#d4ff00] transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@sportify.uz"
                className="w-9 h-9 rounded-lg border border-slate-300 dark:border-white/10 hover:border-[#d4ff00]/60 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-[#d4ff00] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <span className="telemetry-chip text-slate-900 dark:text-white block font-bold">НАВИГАЦИЯ</span>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href="#clubs" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Клубы Ташкента
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Виды спорта
                </a>
              </li>
              <li>
                <a href="#ai-matcher" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  AI Matcher
                </a>
              </li>
              <li>
                <a href="#advantages" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Преимущества
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Отзывы
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Sports Categories */}
          <div className="lg:col-span-3 space-y-3">
            <span className="telemetry-chip text-slate-900 dark:text-white block font-bold">ДИСЦИПЛИНЫ ТАШКЕНТА</span>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href="#sports" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Падел & Большой теннис
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Бокс & Тайский бокс
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Кроссфит & Силовой тренинг
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Реформер-пилатес & Йога
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Бассейн 50м & Плавание
                </a>
              </li>
              <li>
                <a href="#sports" className="hover:text-lime-600 dark:hover:text-[#d4ff00] transition-colors">
                  Скалолазание & Боулдеринг
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <span className="telemetry-chip text-slate-900 dark:text-white block font-bold">ШТАБ-КВАРТИРА</span>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-lime-600 dark:text-[#d4ff00] shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+998712007790" className="font-bold text-slate-950 dark:text-white hover:text-lime-600 dark:hover:text-[#d4ff00]">
                    +998 (71) 200-77-90
                  </a>
                  <span className="block text-[10px] text-slate-500">Колл-центр (Ташкент)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-lime-600 dark:text-[#d4ff00] shrink-0 mt-0.5" />
                <a href="mailto:support@sportify.uz" className="hover:text-lime-600 dark:hover:text-[#d4ff00]">
                  support@sportify.uz
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-[#d4ff00] shrink-0 mt-0.5" />
                <span>г. Ташкент, Мирабадский р-н, ул. Нукусская, 29 (Tashkent City)</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-3.5 h-3.5 text-lime-600 dark:text-[#d4ff00] shrink-0 mt-0.5" />
                <span>Пн-Вс: 07:00 – 23:00 UZT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div>
            © {new Date().getFullYear()} SPORTIFY DIGITAL ECOSYSTEM. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:underline cursor-pointer">Политика конфиденциальности</span>
            <span className="hover:underline cursor-pointer">Оферта платформы</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300 dark:border-white/10 hover:border-[#d4ff00]/60 hover:text-black dark:hover:text-[#d4ff00] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Админ-панель</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
