"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Download, ShieldCheck, Sparkles, QrCode as QrIcon, Clock, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface DigitalPassCardProps {
  passCode: string;
  name: string;
  clubName?: string;
  sportInterest?: string;
  planType: "trial" | "membership";
  amountUzs?: number;
  date?: string;
  timeSlot?: string;
  onClose?: () => void;
  closeBtnLabel?: string;
}

export function DigitalPassCard({
  passCode,
  name,
  clubName,
  sportInterest,
  planType,
  amountUzs,
  date,
  timeSlot,
  onClose,
  closeBtnLabel,
}: DigitalPassCardProps) {
  const { t, lang } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const qrContent = JSON.stringify({
      app: "SPORTIFY_TASHKENT",
      passCode,
      name,
      club: clubName || sportInterest || "SPORTIFY VIP",
      plan: planType,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });

    QRCode.toDataURL(qrContent, {
      width: 280,
      margin: 1.5,
      color: {
        dark: "#000000",
        light: "#d4ff00",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [passCode, name, clubName, sportInterest, planType]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `SPORTIFY_PASS_${passCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const formattedAmount =
    planType === "membership"
      ? amountUzs
        ? `${Number(amountUzs).toLocaleString(lang === "uz" ? "uz-UZ" : "ru-RU")} UZS`
        : "850 000 UZS"
      : "0 UZS";

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
      {/* Prominent Acceptance & Payment Confirmation Banner */}
      <div className="p-3.5 rounded-2xl bg-[#d4ff00]/15 border border-[#d4ff00]/50 flex items-center justify-center gap-2.5 text-center shadow-[0_0_25px_rgba(212,255,0,0.2)]">
        <CheckCircle2 className="w-5 h-5 text-[#d4ff00] shrink-0" />
        <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-[#d4ff00]">
          {lang === "uz"
            ? "To'lov muvaffaqiyatli o'tdi // Ariza qabul qilindi"
            : "Оплата прошла успешно // Заявка принята"}
        </span>
      </div>

      {/* Success Headline */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4ff00]/15 border border-[#d4ff00]/40 text-[#d4ff00] text-[11px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("passSuccessTitle")}</span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {t("passSuccessSubtitle")}
        </p>
      </div>

      {/* The VIP Pass Card */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#141721] via-[#0d0f17] to-[#07080c] border-2 border-[#d4ff00] text-white shadow-[0_0_50px_rgba(212,255,0,0.25)] overflow-hidden">
        {/* Neon Volt Glow Overlays */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4ff00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#d4ff00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#d4ff00] text-black flex items-center justify-center font-black text-sm shadow-md shadow-[#d4ff00]/40">
              ⚡
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-white font-display">
                SPORT<span className="text-[#d4ff00]">IFY</span> // PASS
              </div>
              <div className="text-[9px] uppercase tracking-widest text-[#d4ff00] font-bold">
                TASHKENT 2026
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-[#d4ff00] text-black">
              {planType === "membership" ? "VIP MEMBERSHIP" : "FREE ENTRY // 0 UZS"}
            </span>
          </div>
        </div>

        {/* Pass ID Barcode Row */}
        <div className="py-4 flex items-center justify-between border-b border-white/5 font-mono text-xs relative z-10">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              {t("passIdLabel")}
            </span>
            <span className="text-base sm:text-lg font-black text-[#d4ff00] tracking-wider">
              #{passCode}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              {t("transferAmountLabel")}
            </span>
            <span className="text-xs font-bold text-white">
              {formattedAmount}
            </span>
          </div>
        </div>

        {/* Athlete & Location Info */}
        <div className="py-4 space-y-2.5 border-b border-white/5 relative z-10 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">
              {t("passAthleteLabel")}:
            </span>
            <span className="font-bold text-white text-sm">
              {name}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">
              {t("passClubLabel")}:
            </span>
            <span className="font-bold text-[#d4ff00] text-right max-w-[200px] truncate">
              {clubName || sportInterest || "SPORTIFY PARTNER CLUB"}
            </span>
          </div>

          {(date || timeSlot) && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">
                {t("visitDateLabel")}
              </span>
              <span className="font-mono text-slate-300">
                {date || "Ближайшая дата"} • {timeSlot?.split(" - ")[0] || "19:00"}
              </span>
            </div>
          )}
        </div>

        {/* QR Code Presentation Box */}
        <div className="pt-5 pb-3 text-center relative z-10">
          <div className="relative inline-block p-3 rounded-2xl bg-[#d4ff00] shadow-[0_0_25px_rgba(212,255,0,0.5)]">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`SPORTIFY PASS #${passCode}`}
                className="w-44 h-44 rounded-xl mx-auto block"
              />
            ) : (
              <div className="w-44 h-44 rounded-xl bg-black/10 flex items-center justify-center">
                <QrIcon className="w-10 h-10 text-black animate-spin" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-mono text-[#d4ff00] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("passValidDays")}</span>
            <span>•</span>
            <span className="text-white">{t("passStatusActive")}</span>
          </div>
        </div>

        {/* Subtle Watermark Bottom */}
        <div className="pt-2 text-center text-[9px] uppercase tracking-widest text-slate-500 font-mono">
          SPORTIFY PASS PROTOCOL // TASHKENT UZBEKISTAN
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleDownload}
          className="w-full py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/30 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{downloadSuccess ? t("passSavedPrompt") : t("passDownloadBtn")}</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs uppercase tracking-wider transition-colors"
          >
            {closeBtnLabel || t("passCloseBtn")}
          </button>
        )}
      </div>
    </div>
  );
}
