"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw, CreditCard } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const passCode = searchParams.get("pass_code");
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#07080c] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-[#0d0f17] border border-slate-200 dark:border-white/10 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
          <XCircle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
            {lang === "uz" ? "To'lov bekor qilindi" : "Оплата отменена"}
          </h2>
          {passCode && (
            <p className="text-xs font-mono text-[#d4ff00] mt-1 font-bold">
              #{passCode}
            </p>
          )}
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {lang === "uz"
              ? "Stripe orqali to'lov bekor qilindi. Mablag' yechib olinmadi va ruxsatnoma faollashtirilmadi."
              : "Процесс оплаты через Stripe Checkout был прерван. Средства не списывались, и слот остался неактивным."}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-left text-xs space-y-1">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-[#d4ff00]" />
            <span>{lang === "uz" ? "Boshqa to'lov usuli:" : "Альтернативные варианты:"}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {lang === "uz"
              ? "Click yoki Payme orqali to'g'ridan-to'g'ri karta o'tkazmasini tanlashingiz mumkin."
              : "Вы можете оформить оплату прямым переводом Click / Payme с прикреплением чека."}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href="/#booking"
            className="w-full py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{lang === "uz" ? "Qaytadan urinish" : "Попробовать снова"}</span>
          </Link>

          <Link
            href="/"
            className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "uz" ? "Bosh sahifa" : "Вернуться на главную"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07080c]" />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
