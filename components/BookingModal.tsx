"use client";

import { useState, useRef } from "react";
import {
  X,
  Loader2,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  UploadCloud,
  Check,
  Copy,
  FileText,
  AlertCircle,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Club } from "@/lib/types";
import { haptic } from "@/lib/haptics";
import { useLanguage } from "@/lib/i18n";
import { DigitalPassCard } from "./DigitalPassCard";

interface BookingModalProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ club, isOpen, onClose }: BookingModalProps) {
  const { t, lang } = useLanguage();

  const [planType, setPlanType] = useState<"trial" | "membership">("trial");
  const [paymentMethod, setPaymentMethod] = useState<"click_payme" | "stripe">("click_payme");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00 - Вечерний слот");

  // Stripe card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Receipt file state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState("");
  const [copiedCard, setCopiedCard] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdPassCode, setCreatedPassCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !club) return null;

  const membershipPrice = club.priceMonthly || 850000;
  const formattedMonthly = Number(membershipPrice).toLocaleString(lang === "uz" ? "uz-UZ" : "ru-RU");

  const handleCopyCard = () => {
    navigator.clipboard.writeText("8600450192837140");
    setCopiedCard(true);
    haptic.light();
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptError("");
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setReceiptError("Файл чека превышает 15 МБ. Выберите меньший размер.");
        return;
      }
      setReceiptFile(file);
      haptic.light();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setReceiptError("");

    if (!name.trim() || !phone.trim()) {
      setErrorMessage(t("errRequiredFields"));
      return;
    }

    // Если выбран платный тариф через перевод Click/Payme, обязательно требуем чек
    if (planType === "membership" && paymentMethod === "click_payme" && !receiptFile) {
      setReceiptError(t("errReceiptRequired"));
      return;
    }

    // Если выбрана оплата через Stripe, создаем серверную сессию Checkout
    if (planType === "membership" && paymentMethod === "stripe") {
      setIsSubmitting(true);
      try {
        const stripeRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            sportInterest: club.categoryName || club.name,
            clubId: club.id,
            clubName: club.name,
            amountUzs: membershipPrice,
            bookingDate: date || "Ближайшая дата",
            bookingTime: time,
            language: lang,
          }),
        });

        const stripeData = await stripeRes.json();
        if (stripeRes.ok && stripeData.success && stripeData.url) {
          window.location.href = stripeData.url;
          return;
        } else {
          setErrorMessage(stripeData.error || t("errNetwork"));
        }
      } catch (err: any) {
        setErrorMessage(t("errNetwork"));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("phone", phone.trim());
      formData.append("sportInterest", club.categoryName || club.name);
      formData.append("clubId", club.id);
      formData.append("clubName", club.name);
      formData.append("planType", planType);
      formData.append("paymentMethod", planType === "trial" ? "free" : paymentMethod);
      formData.append("amountUzs", String(planType === "trial" ? 0 : membershipPrice));
      formData.append("language", lang);
      formData.append("source", "catalog");
      formData.append("bookingDate", date || "Ближайшая дата");
      formData.append("bookingTime", time);

      const planSummary =
        planType === "membership"
          ? `Абонемент (${formattedMonthly} UZS, ${paymentMethod === "stripe" ? "Stripe онлайн" : "Click/Payme с чеком"})`
          : "Вводный визит (0 UZS)";

      formData.append(
        "aiSummary",
        `Бронирование в "${club.name}" (${club.metro}, Ташкент). Тариф: ${planSummary}. Желаемая дата: ${date || "Ближайшая"}, время: ${time}.`
      );

      if (receiptFile) {
        formData.append("receipt", receiptFile);
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        haptic.success();
        const generatedCode = data.passCode || `SPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setCreatedPassCode(generatedCode);
        setIsSuccess(true);
        confetti({
          particleCount: 130,
          spread: 85,
          origin: { y: 0.6 },
          colors: ["#d4ff00", "#ffffff", "#00e5ff"],
        });
      } else {
        setErrorMessage(data.error || t("errNetwork"));
      }
    } catch (err: any) {
      setErrorMessage(t("errNetwork"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setName("");
    setPhone("");
    setReceiptFile(null);
    setCardNumber("");
    setCardExp("");
    setCardCvc("");
    setCreatedPassCode("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto rounded-3xl p-5 sm:p-8 bg-white dark:bg-[#0c0e15] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white shadow-2xl overflow-hidden transition-all">
        {/* Subtle Volt Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4ff00]" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 text-[#d4ff00] telemetry-chip mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span className="text-slate-900 dark:text-[#d4ff00] font-black">
                {lang === "uz" ? "ONLAYN REZERVIATSIYA // SPORTIFY" : "ОНЛАЙН-РЕЗЕРВИРОВАНИЕ // SPORTIFY"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              {club.name}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 mb-5">
              <span className="flex items-center gap-1 text-slate-900 dark:text-white">
                <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
                {club.metro}
              </span>
              <span>•</span>
              <span className="text-[#d4ff00] font-bold">
                {club.categoryName}
              </span>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Select Plan (0 UZS Trial vs Membership) */}
              <div className="space-y-1.5">
                <label className="telemetry-chip text-slate-700 dark:text-slate-300 block font-bold">
                  {t("planTitle")}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Trial 0 UZS */}
                  <button
                    type="button"
                    onClick={() => {
                      haptic.light();
                      setPlanType("trial");
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      planType === "trial"
                        ? "border-[#d4ff00] bg-[#d4ff00]/10 dark:bg-[#d4ff00]/10 shadow-[0_0_15px_rgba(212,255,0,0.15)] ring-1 ring-[#d4ff00]"
                        : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                        {t("planTrial")}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#d4ff00] text-black">
                        0 UZS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {t("planTrialDesc")}
                    </p>
                  </button>

                  {/* Option 2: Monthly Membership */}
                  <button
                    type="button"
                    onClick={() => {
                      haptic.light();
                      setPlanType("membership");
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      planType === "membership"
                        ? "border-[#d4ff00] bg-[#d4ff00]/10 dark:bg-[#d4ff00]/10 shadow-[0_0_15px_rgba(212,255,0,0.15)] ring-1 ring-[#d4ff00]"
                        : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                        {t("planMembership")}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#d4ff00] text-black">
                        {formattedMonthly} UZS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {t("planMembershipDesc")}
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 2 (Conditional): If Membership chosen, show Payment Methods */}
              {planType === "membership" && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-100/60 dark:bg-black/40 space-y-3.5 animate-in fade-in duration-200">
                  <label className="telemetry-chip text-slate-700 dark:text-slate-300 block font-bold">
                    {t("paymentMethodTitle")}:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("click_payme")}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
                        paymentMethod === "click_payme"
                          ? "border-[#d4ff00] bg-[#d4ff00]/15 dark:bg-[#d4ff00]/15 text-slate-900 dark:text-white ring-1 ring-[#d4ff00]"
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <span className="text-base">📲</span>
                      <div>
                        <div className="font-black leading-tight">{t("paymentClickPayme")}</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                          {lang === "uz" ? "Chek biriktirish bilan" : "С прикреплением чека"}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("stripe")}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
                        paymentMethod === "stripe"
                          ? "border-[#d4ff00] bg-[#d4ff00]/15 dark:bg-[#d4ff00]/15 text-slate-900 dark:text-white ring-1 ring-[#d4ff00]"
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#d4ff00]" />
                      <div>
                        <div className="font-black leading-tight">{t("paymentStripe")}</div>
                        <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                          {lang === "uz" ? "Tezkor onlayn to'lov" : "Мгновенное списание"}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Payment Sub-Block A: Click / Payme Card Requisites + Receipt Upload */}
                  {paymentMethod === "click_payme" && (
                    <div className="space-y-3 pt-1">
                      {/* Card Requisites Box */}
                      <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-[#d4ff00]/40 relative overflow-hidden font-mono text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span>{t("transferCardTitle")}</span>
                          <span className="text-[#d4ff00] font-bold">{formattedMonthly} UZS</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base sm:text-lg font-black tracking-wider text-[#d4ff00]">
                            8600 4501 9283 7140
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyCard}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#d4ff00] text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            {copiedCard ? <Check className="w-3 h-3 text-[#d4ff00]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCard ? t("transferCopied") : t("transferCopy")}</span>
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {t("transferRecipient")} • {t("transferBank")}
                        </div>
                      </div>

                      {/* File Upload Box */}
                      <div>
                        <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1 font-bold">
                          {t("receiptUploadTitle")}
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {!receiptFile ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-[#d4ff00] bg-white/50 dark:bg-black/30 text-center cursor-pointer transition-all hover:bg-[#d4ff00]/5 group"
                          >
                            <UploadCloud className="w-6 h-6 mx-auto text-slate-400 group-hover:text-[#d4ff00] transition-colors mb-1.5" />
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {t("receiptUploadPrompt")}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {t("receiptUploadFormats")}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/40 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-[#d4ff00] shrink-0" />
                              <span className="font-bold text-slate-900 dark:text-white truncate">
                                {receiptFile.name}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                ({(receiptFile.size / 1024).toFixed(0)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[10px] text-[#d4ff00] underline font-bold ml-2 shrink-0"
                            >
                              {t("receiptChangeFile")}
                            </button>
                          </div>
                        )}

                        {receiptError && (
                          <p className="text-xs text-red-500 font-semibold mt-1">
                            {receiptError}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Sub-Block B: Stripe Checkout Sandbox Info */}
                  {paymentMethod === "stripe" && (
                    <div className="p-4 rounded-xl bg-slate-900 text-white border border-[#d4ff00]/40 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#d4ff00]" />
                          <span className="font-bold text-sm text-white">STRIPE CHECKOUT</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#d4ff00] text-black">
                          SANDBOX TEST
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        {lang === "uz"
                          ? "To'lov rasmiy Stripe Checkout xavfsiz sahifasida amalga oshiriladi (3D Secure 2.0 va 256-bitli SSL shifrlash)."
                          : "Вы будете перенаправлены на официальную защищенную страницу Stripe Checkout (3D Secure 2.0, сквозное шифрование SSL)."}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
                        <span>Visa, Mastercard, Uzcard</span>
                        <span className="text-[#d4ff00] font-bold">{formattedMonthly} UZS</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Client Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1">
                    {t("clientNameLabel")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("clientNamePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#d4ff00] transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1">
                    {t("clientPhoneLabel")}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 (90) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#d4ff00] transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Slot & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#d4ff00]" />
                    {t("visitDateLabel")}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-[#d4ff00] font-medium"
                  />
                </div>
                <div>
                  <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4ff00]" />
                    {t("visitTimeLabel")}
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-[#d4ff00] font-medium"
                  >
                    <option className="bg-white dark:bg-black">{t("timeMorning")}</option>
                    <option className="bg-white dark:bg-black">{t("timeDay")}</option>
                    <option className="bg-white dark:bg-black">{t("timeEvening")}</option>
                    <option className="bg-white dark:bg-black">{t("timeLate")}</option>
                  </select>
                </div>
              </div>

              {/* Action CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t("btnSubmitting")}</span>
                    </>
                  ) : (
                    <span>
                      {planType === "trial"
                        ? t("btnSubmitTrial")
                        : paymentMethod === "stripe"
                        ? `${lang === "uz" ? "Stripe Checkout orqali to'lash" : "Оплатить через Stripe Checkout"} (${formattedMonthly} UZS) →`
                        : `${t("btnSubmitPaid")} (${formattedMonthly} UZS)`}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>{t("securityNotice")}</span>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen: Personal Neon Digital Pass */
          <DigitalPassCard
            passCode={createdPassCode}
            name={name}
            clubName={club.name}
            sportInterest={club.categoryName}
            planType={planType}
            amountUzs={planType === "trial" ? 0 : membershipPrice}
            date={date}
            timeSlot={time}
            onClose={handleClose}
            closeBtnLabel={t("passCloseBtn")}
          />
        )}
      </div>
    </div>
  );
}
