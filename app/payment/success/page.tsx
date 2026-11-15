"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";
import { DigitalPassCard } from "@/components/DigitalPassCard";
import { useLanguage } from "@/lib/i18n";
import { haptic } from "@/lib/haptics";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { lang } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [passData, setPassData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const verifyPayment = async () => {
    if (!sessionId) {
      setIsLoading(false);
      setErrorMessage("Идентификатор сессии оплаты (session_id) не найден.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`);
      const data = await res.json();

      if (res.ok && data.success && data.paid) {
        setIsPaid(true);
        setPassData(data);
        haptic.success();
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 },
          colors: ["#d4ff00", "#ffffff", "#00e5ff"],
        });
      } else {
        setIsPaid(false);
        setErrorMessage(
          data.error ||
            "Платеж еще не подтвержден процессингом Stripe или был отменен банком."
        );
      }
    } catch (err: any) {
      setErrorMessage("Ошибка сети при проверке статуса платежа.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center bg-slate-50 dark:bg-[#07080c] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-lg mx-auto">
        {isLoading ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0d0f17] border border-slate-200 dark:border-white/10 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4ff00]/15 text-[#d4ff00] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              {lang === "uz" ? "To'lov tekshirilmoqda..." : "Верификация оплаты в Stripe..."}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {lang === "uz"
                ? "Bank tranzaksiyasi holati to'g'ridan-to'g'ri Stripe serverlaridan tekshirilmoqda"
                : "Проверяем фактический статус транзакции напрямую через защищенный шлюз Stripe"}
            </p>
          </div>
        ) : isPaid && passData ? (
          <div className="space-y-4">
            <DigitalPassCard
              passCode={passData.passCode}
              name={passData.name}
              clubName={passData.clubName}
              sportInterest={passData.sportInterest}
              planType="membership"
              amountUzs={passData.amountUzs}
              date={passData.date}
              timeSlot={passData.timeSlot}
              onClose={() => (window.location.href = "/")}
              closeBtnLabel={lang === "uz" ? "Bosh sahifaga qaytish" : "Вернуться на главную"}
            />
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0d0f17] border border-red-500/30 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-red-500">
              {lang === "uz" ? "To'lov tasdiqlanmadi" : "Платеж не подтвержден"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {errorMessage}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={verifyPayment}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#d4ff00] text-black font-black text-xs uppercase flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{lang === "uz" ? "Qayta tekshirish" : "Проверить снова"}</span>
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold uppercase"
              >
                {lang === "uz" ? "Bosh sahifa" : "На главную"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#07080c] text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#d4ff00]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
