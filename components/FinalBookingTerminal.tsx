"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Gift,
  CheckCircle2,
  CreditCard,
  UploadCloud,
  Check,
  Copy,
  FileText,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { BorderBeam } from "./motion/BorderBeam";
import { MagneticButton } from "./motion/MagneticButton";
import { haptic } from "@/lib/haptics";
import { useLanguage } from "@/lib/i18n";
import { DigitalPassCard } from "./DigitalPassCard";

export function FinalBookingTerminal() {
  const { t, lang } = useLanguage();

  const [planType, setPlanType] = useState<"trial" | "membership">("trial");
  const [paymentMethod, setPaymentMethod] = useState<"click_payme" | "stripe">("stripe");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    sportInterest: "Падел & Большой теннис",
    district: "Мирабадский р-н (ул. Нукусская / Шевченко)",
    notes: "",
  });

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

  const membershipPrice = 850000;
  const formattedMonthly = Number(membershipPrice).toLocaleString(lang === "uz" ? "uz-UZ" : "ru-RU");

  const sportOptions = lang === "uz" ? [
    "Padel va Katta tennis",
    "Boks va Tay boks",
    "Reformer-pilates va Yoga",
    "Olimpiya basseyni 50m",
    "Krossfit va Kuch zali",
    "Qoyaga ko'tarilish (Skalodrom)",
  ] : [
    "Падел & Большой теннис",
    "Бокс & Тайский бокс",
    "Реформер-пилатес & Йога",
    "Олимпийский бассейн 50м",
    "Кроссфит & Силовой зал",
    "Скалолазание & Боулдеринг",
  ];

  const districtOptions = lang === "uz" ? [
    "Mirobod t-ni (Nukus / Shevchenko ko'ch.)",
    "Yakkasaroy t-ni (Bobur / Sh. Rustaveli)",
    "Shayxontohur t-ni (Tashkent City / Paxtakor)",
    "Yunusobod t-ni (Shahriston / Bodomzor)",
    "Mirzo Ulug'bek t-ni (Buyuk Ipak Yo'li)",
    "Chilonzor t-ni (Chilonzor / Novza)",
  ] : [
    "Мирабадский р-н (ул. Нукусская / Шевченко)",
    "Яккасарайский р-н (ул. Бабура / Ш. Руставели)",
    "Шайхантахурский р-н (Tashkent City / м. Пахтакор)",
    "Юнусабадский р-н (м. Шахристан / Бодомзор)",
    "Мирзо-Улугбекский р-н (м. Буюк Ипак Йули)",
    "Чиланзарский р-н (м. Чиланзар / Новза)",
  ];

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

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage(t("errRequiredFields"));
      return;
    }

    if (planType === "membership" && paymentMethod === "click_payme" && !receiptFile) {
      setReceiptError(t("errReceiptRequired"));
      return;
    }

    if (planType === "membership" && paymentMethod === "stripe") {
      setIsSubmitting(true);
      try {
        const stripeRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            sportInterest: formData.sportInterest,
            clubName: formData.district,
            amountUzs: membershipPrice,
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
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("phone", formData.phone.trim());
      data.append("sportInterest", formData.sportInterest);
      data.append("planType", planType);
      data.append("paymentMethod", planType === "trial" ? "free" : paymentMethod);
      data.append("amountUzs", String(planType === "trial" ? 0 : membershipPrice));
      data.append("language", lang);
      data.append("source", "landing_form");

      const planSummary =
        planType === "membership"
          ? `Абонемент (${formattedMonthly} UZS, ${paymentMethod === "stripe" ? "Stripe онлайн" : "Click/Payme с чеком"})`
          : "Вводный визит (0 UZS)";

      data.append(
        "aiSummary",
        `Терминал бронирования Ташкент. Район: ${formData.district}. Тариф: ${planSummary}. Пожелания: ${formData.notes || "Не указаны"}.`
      );

      if (formData.notes) {
        data.append("notes", formData.notes);
      }

      if (receiptFile) {
        data.append("receipt", receiptFile);
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        body: data,
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        haptic.success();
        const generatedCode = resData.passCode || `SPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setCreatedPassCode(generatedCode);
        setIsSuccess(true);
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#d4ff00", "#ffffff", "#00e5ff"],
        });
      } else {
        setErrorMessage(resData.error || t("errNetwork"));
      }
    } catch (err: any) {
      setErrorMessage(t("errNetwork"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      phone: "",
      sportInterest: sportOptions[0],
      district: districtOptions[0],
      notes: "",
    });
    setReceiptFile(null);
    setCardNumber("");
    setCardExp("");
    setCardCvc("");
    setCreatedPassCode("");
  };

  return (
    <section id="booking" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      {/* Background volt light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl border border-slate-200/90 dark:border-[#d4ff00]/30 bg-white/90 dark:bg-[#0c0e14]/85 backdrop-blur-sm p-6 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.9),0_0_30px_-5px_rgba(212,255,0,0.15)] before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/60 dark:before:via-[#d4ff00]/70 before:to-transparent overflow-hidden text-slate-900 dark:text-white">
          {/* Laser Tracing Perimeter Beam */}
          <BorderBeam duration={8} borderWidth={1.5} colorFrom="#d4ff00" />
          {/* Subtle volt top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4ff00] via-lime-400 to-[#d4ff00]" />

          {!isSuccess ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Offer Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 dark:bg-[#d4ff00]/10 border border-lime-500/30 dark:border-[#d4ff00]/30 text-lime-700 dark:text-[#d4ff00] text-xs font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>
                    {lang === "uz" ? "KUNNING MAXSUS TAKLIFI // 0 UZS" : "СПЕЦПРЕДЛОЖЕНИЕ ДНЯ // 0 UZS"}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white leading-[1.05]">
                  {lang === "uz" ? (
                    <>
                      Istalgan klubga <span className="text-[#d4ff00]">ruxsatnomani</span> faollashtiring
                    </>
                  ) : (
                    <>
                      Активируй свой <span className="text-[#d4ff00]">пропуск</span> в любой клуб
                    </>
                  )}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {lang === "uz"
                    ? "Kontaktlaringizni qoldiring: tizim Toshkentdagi yetakchi murabbiyda bepul sinov mashg'ulotini yoki to'liq VIP abonementni darhol rasmiylashtiradi."
                    : "Оставьте контакты: система мгновенно зарезервирует бесплатный вводный слот (60–90 мин) в Ташкенте у топ-тренера или оформит VIP-абонемент с клубными привилегиями."}
                </p>

                <div className="space-y-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                    <span>
                      {lang === "uz" ? "Raqamli QR-ruxsatnoma Telegram / SMS" : "Электронный QR-пропуск в Telegram / SMS"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                    <span>
                      {lang === "uz" ? "Sport ustasidan shaxsiy ko'rik va dastur" : "Персональный инструктаж мастера спорта"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                    <span>
                      {lang === "uz" ? "Qo'ng'iroqlarsiz va spamsiz qulaylik" : "Без звонков и навязчивых предложений"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Terminal Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Plan Selector: 0 UZS Trial vs Membership */}
                  <div className="space-y-1.5">
                    <label className="telemetry-chip text-slate-700 dark:text-slate-300 block font-bold">
                      {t("planTitle")}:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          haptic.light();
                          setPlanType("trial");
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
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

                      <button
                        type="button"
                        onClick={() => {
                          haptic.light();
                          setPlanType("membership");
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
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

                  {/* Payment Sub-Block (If Membership Chosen) */}
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
                              ? "border-[#d4ff00] bg-[#d4ff00]/15 text-slate-900 dark:text-white ring-1 ring-[#d4ff00]"
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
                              ? "border-[#d4ff00] bg-[#d4ff00]/15 text-slate-900 dark:text-white ring-1 ring-[#d4ff00]"
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

                      {/* Click / Payme Requisites + Receipt Upload */}
                      {paymentMethod === "click_payme" && (
                        <div className="space-y-3 pt-1">
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

                      {/* Stripe Checkout Sandbox Info */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                        {t("clientNameLabel")}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("clientNamePlaceholder")}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#d4ff00] transition-colors font-medium"
                      />
                    </div>

                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                        {t("clientPhoneLabel")}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+998 (90) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-[#d4ff00] transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                        {t("sportLabel")}
                      </label>
                      <select
                        value={formData.sportInterest}
                        onChange={(e) => setFormData({ ...formData, sportInterest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-[#d4ff00]"
                      >
                        {sportOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-black text-slate-900 dark:text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                        {t("districtLabel")}
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-[#d4ff00]"
                      >
                        {districtOptions.map((dist) => (
                          <option key={dist} value={dist} className="bg-white dark:bg-black text-slate-900 dark:text-white">
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="telemetry-chip text-slate-700 dark:text-slate-300 block mb-1.5">
                      {t("notesLabel")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("notesPlaceholder")}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#d4ff00]"
                    />
                  </div>

                  <div className="pt-2">
                    <MagneticButton className="w-full">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(212,255,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_30px_rgba(212,255,0,0.55),inset_0_1px_2px_rgba(255,255,255,0.8)] transition-all active:scale-95"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{t("btnSubmitting")}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-slate-950" />
                            <span>
                              {planType === "trial"
                                ? t("btnSubmitTrial")
                                : paymentMethod === "stripe"
                                ? `${lang === "uz" ? "Stripe Checkout orqali to'lash" : "Оплатить через Stripe Checkout"} (${formattedMonthly} UZS) →`
                                : `${t("btnSubmitPaid")} (${formattedMonthly} UZS)`}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </MagneticButton>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center pt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4ff00]" />
                    <span>{t("securityNotice")}</span>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Success Terminal: Digital VIP Pass */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 max-w-lg mx-auto"
            >
              <DigitalPassCard
                passCode={createdPassCode}
                name={formData.name}
                sportInterest={formData.sportInterest}
                clubName={formData.district}
                planType={planType}
                amountUzs={planType === "trial" ? 0 : membershipPrice}
                onClose={handleReset}
                closeBtnLabel={t("passAnotherBtn")}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
