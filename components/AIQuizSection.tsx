"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Check,
  ArrowRight,
  ArrowLeft,
  Send,
  MapPin,
  Loader2,
  Sliders,
  ShieldCheck,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QuizAnswers, Club } from "@/lib/types";
import { BorderBeam } from "./motion/BorderBeam";
import { CounterNumber } from "./motion/CounterNumber";
import { MagneticButton } from "./motion/MagneticButton";
import { haptic } from "@/lib/haptics";

const cleanAiText = (txt?: string) => {
  if (!txt) return "";
  return txt
    .replace(/^[ \t]*\*+[ \t]+/gm, "• ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\*+/g, "");
};

export function AIQuizSection({ clubs = [] }: { clubs?: Club[] }) {
  const [activeTab, setActiveTab] = useState<"quiz" | "chat" | "synthesizer">("quiz");

  // 1. Quiz State
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    goal: "",
    experience: "",
    sportType: "",
    location: "Ташкент",
    budget: "",
  });
  const [quizResult, setQuizResult] = useState<{
    recommendation: string;
    clubName: string;
    clubPrice: string;
    clubMetro: string;
  } | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizLeadForm, setQuizLeadForm] = useState({ name: "", phone: "" });
  const [quizSuccess, setQuizSuccess] = useState(false);

  // 2. Chat State (Умный ИИ-Консультант)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Ассалому алейкум! Я персональный ИИ-консультант SPOTIFY в Ташкенте ⚡\n\nС помощью умного ИИ я подберу идеальную активность, клуб и тренера под твои цели и бюджет. Расскажи, чего ты хочешь достичь?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatLeadForm, setChatLeadForm] = useState({ name: "", phone: "", isOpen: false });
  const [chatSuccess, setChatSuccess] = useState(false);

  // 3. Synthesizer State
  const [synthGoal, setSynthGoal] = useState("stress");
  const [stressLevel, setStressLevel] = useState(8);
  const [isMatching, setIsMatching] = useState(false);

  // Visual Photo Cards for Goals (Step 1) - Replaced emojis with high-impact sports photography
  const goals = [
    {
      id: "weight_loss",
      title: "Сбросить вес & Рельеф",
      badge: "ФУНКЦИОНАЛ // КАРДИО",
      desc: "Интенсивный функциональный тренинг, кроссфит, интервалы",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=700&auto=format&fit=crop",
    },
    {
      id: "stress_relief",
      title: "Снять стресс & Перезагрузка",
      badge: "БОЙЦОВСКИЙ КЛУБ",
      desc: "Бокс, кикбоксинг, спарринги, выплеск адреналина",
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=700&auto=format&fit=crop",
    },
    {
      id: "healthy_back",
      title: "Здоровая спина & Осанка",
      badge: "РЕФОРМЕРЫ & ЙОГА",
      desc: "Реформер-пилатес, глубокая растяжка, коррекция осанки",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=700&auto=format&fit=crop",
    },
    {
      id: "muscle_gain",
      title: "Сила & Мышечная масса",
      badge: "СИЛОВЫЕ ПРОТОКОЛЫ",
      desc: "Тренажерный зал, тяжелая атлетика, пауэрлифтинг",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=700&auto=format&fit=crop",
    },
    {
      id: "social_fun",
      title: "Падел & Новые знакомства",
      badge: "ТРЕНД №1 В ТАШКЕНТЕ",
      desc: "Азартная игра в парах, турниры и спортивное комьюнити",
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=700&auto=format&fit=crop",
    },
    {
      id: "swim_endurance",
      title: "Плавание & Выносливость",
      badge: "ОЛИМПИЙСКИЙ БАССЕЙН 50М",
      desc: "Олимпийская чаша, спа и кардио без травм суставов",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=700&auto=format&fit=crop",
    },
  ];

  const experiences = [
    {
      id: "beginner",
      title: "Абсолютный новичок «с нуля»",
      tag: "БЕРЕЖНЫЙ СТАРТ",
      desc: "Никогда не тренировался(ась) или был долгий перерыв от 2 лет. Нужен персональный вводный инструктаж.",
    },
    {
      id: "intermediate",
      title: "Любитель со стажем",
      tag: "РЕГУЛЯРНЫЙ СПОРТ",
      desc: "Занимаюсь 1-2 раза в неделю, знаком(а) с техникой, хочу улучшить результаты и дисциплину.",
    },
    {
      id: "advanced",
      title: "Продвинутый атлет",
      tag: "ВЫСОКИЙ ТЕМП",
      desc: "Регулярные тяжелые тренировки 3-5 раз в неделю, высокий темп, поиск лучших тренеров столицы.",
    },
  ];

  // Visual Photo Cards for Sports (Step 3) - Replaced emojis with real action photo cards
  const sports = [
    {
      id: "crossfit",
      title: "Кроссфит & Фитнес",
      district: "Мирабадский р-н (Нукусская)",
      kcal: "850 ккал/ч",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "boxing",
      title: "Бокс & Buka Fight",
      district: "Шайхантахур (ул. Абая)",
      kcal: "900 ккал/ч",
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "swim",
      title: "Плавание в бассейне",
      district: "Яккасарайский р-н (ул. Бабура)",
      kcal: "680 ккал/ч",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "padel",
      title: "Падел & Большой теннис",
      district: "Юнусабадский р-н (м. Шахристан)",
      kcal: "650 ккал/ч",
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "pilates",
      title: "Реформер-пилатес & Йога",
      district: "Мирзо-Улугбек (Мустакиллик)",
      kcal: "420 ккал/ч",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "climb",
      title: "Скалолазание & Боулдеринг",
      district: "Чиланзар (м. Новза)",
      kcal: "620 ккал/ч",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const budgets = [
    {
      id: "b1",
      title: "До 850 000 UZS / месяц",
      badge: "БАЗОВЫЙ",
      desc: "Абонемент, секции и групповые программы в клубах Ташкента",
    },
    {
      id: "b2",
      title: "До 1 400 000 UZS / месяц",
      badge: "ОПТИМАЛЬНЫЙ",
      desc: "Премиум клуб с бассейном, спа-зоной и безлимитным доступом",
    },
    {
      id: "b3",
      title: "Премиум без ограничений (VIP)",
      badge: "ВСЁ ВКЛЮЧЕНО",
      desc: "Персональные тренировки с топ-наставниками и выделенный сервис",
    },
  ];

  const synthGoals = [
    { id: "stress", label: "Снять стресс & Выплеск энергии", club: "Buka Boxing Gym (Абая)" },
    { id: "back", label: "Здоровая спина & Осанка", club: "Prana Pilates & Reformer (Мустакиллик)" },
    { id: "fatburn", label: "Похудение & Рельеф", club: "Apex Performance (Нукусская)" },
    { id: "social", label: "Драйв & Знакомства в падел", club: "Padel Arena Tashkent (Юнусабад)" },
    { id: "swim", label: "Выносливость без травм", club: "Aquaterra Swim & Wellness (Бабура)" },
  ];

  const handleGoalSelect = (goalTitle: string) => {
    haptic.select();
    setAnswers((prev) => ({ ...prev, goal: goalTitle }));
    setStep(2);
  };

  const handleExpSelect = (expTitle: string) => {
    haptic.select();
    setAnswers((prev) => ({ ...prev, experience: expTitle }));
    setStep(3);
  };

  const handleSportSelect = (sportTitle: string) => {
    haptic.select();
    setAnswers((prev) => ({ ...prev, sportType: sportTitle }));
    setStep(4);
  };

  const handleFinishQuiz = async (budgetTitle: string) => {
    haptic.success();
    const updatedAnswers = { ...answers, budget: budgetTitle };
    setAnswers(updatedAnswers);
    setIsSubmittingQuiz(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizData: updatedAnswers }),
      });
      const data = await response.json();

      let club = {
        name: "Apex Performance",
        price: "850 000 UZS / мес (первое занятие 0 UZS)",
        metro: "ул. Нукусская (Мирабадский р-н)",
      };

      if (updatedAnswers.sportType.includes("Бокс")) {
        club = {
          name: "Buka Boxing Gym",
          price: "950 000 UZS / мес (пробное 0 UZS)",
          metro: "ул. Абая, м. Пахтакор (Шайхантахур)",
        };
      } else if (updatedAnswers.sportType.includes("Плавание")) {
        club = {
          name: "Aquaterra Swim & Wellness",
          price: "1 200 000 UZS / мес (пробное 0 UZS)",
          metro: "ул. Бабура, Яккасарайский р-н",
        };
      } else if (updatedAnswers.sportType.includes("Падел") || updatedAnswers.sportType.includes("теннис")) {
        club = {
          name: "Padel Arena Tashkent",
          price: "1 400 000 UZS / мес (пробное 0 UZS)",
          metro: "Юнусабадский р-н, м. Шахристан",
        };
      } else if (updatedAnswers.sportType.includes("пилатес") || updatedAnswers.sportType.includes("Йога")) {
        club = {
          name: "Prana Pilates & Reformer",
          price: "1 100 000 UZS / мес (пробное 0 UZS)",
          metro: "пр-т Мустакиллик, Мирзо-Улугбекский р-н",
        };
      }

      setQuizResult({
        recommendation:
          data.reply ||
          "На основе анализа параметров мы сформировали персональную программу тренировок с максимальной эффективностью в Ташкенте!",
        clubName: club.name,
        clubPrice: club.price,
        clubMetro: club.metro,
      });
      setStep(5);
    } catch {
      setStep(5);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const submitQuizLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizLeadForm.name || !quizLeadForm.phone) return;

    setIsSubmittingQuiz(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quizLeadForm.name,
          phone: quizLeadForm.phone,
          sportInterest: answers.sportType || "По результатам квиза",
          clubName: quizResult?.clubName,
          budget: answers.budget,
          source: "quiz",
          aiSummary: `Цель: ${answers.goal}. Уровень: ${answers.experience}. Бюджет: ${answers.budget}. AI: ${quizResult?.recommendation?.substring(0, 150)}...`,
        }),
      });

      if (response.ok) {
        setQuizSuccess(true);
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#d4ff00", "#10b981", "#ffffff"],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Chat send handler
  const handleSendMessage = async (msgToSend?: string) => {
    const text = msgToSend || inputMessage;
    if (!text.trim() || isAiThinking) return;

    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsAiThinking(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5),
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Отличный выбор! Я зафиксировал ваши предпочтения. Оставьте контакты, и мы забронируем вводное бесплатное занятие (0 UZS).",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Спасибо за вопрос! Вы можете прямо сейчас забронировать бесплатное вводное занятие (0 UZS) в лучших клубах Ташкента с персональным инструктором.",
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const submitChatLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatLeadForm.name || !chatLeadForm.phone) return;

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: chatLeadForm.name,
          phone: chatLeadForm.phone,
          source: "ai_chat",
          aiSummary: `Заявка из диалога с ИИ. Последние сообщения: ${messages
            .slice(-2)
            .map((m) => m.content)
            .join(" | ")
            .substring(0, 200)}`,
        }),
      });
      if (response.ok) {
        setChatSuccess(true);
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 }, colors: ["#d4ff00", "#ffffff"] });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="ai-matcher" className="py-24 relative overflow-hidden bg-transparent text-slate-900 dark:text-white border-y border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div id="ai-quiz" className="sr-only">AI Quiz Anchor</div>

      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#d4ff00]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Protected Liquid Glass Card with Volt Rim */}
        <div className="relative rounded-3xl p-6 sm:p-8 mb-10 border border-slate-200/90 dark:border-[#d4ff00]/25 bg-white/80 dark:bg-[#08090b]/65 backdrop-blur-xl shadow-[0_16px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8),0_0_25px_-5px_rgba(212,255,0,0.12)] before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/70 dark:before:via-[#d4ff00]/80 before:to-transparent overflow-hidden text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-[#d4ff00]/30 bg-white/80 dark:bg-[#d4ff00]/10 mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
            <span className="telemetry-chip text-slate-700 dark:text-[#d4ff00]">
              NEURAL MATCHING ENGINE // УМНЫЙ ИИ-ПОМОЩНИК
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
            Интерактивный Квиз & <span className="text-[#d4ff00]">ИИ-Подбор</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Пройдите быстрый 4-шаговый визуальный квиз, получите консультацию с помощью ИИ или используйте экспресс-синтезатор параметров.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-black/70 border border-slate-300 dark:border-white/15 backdrop-blur-md shadow-lg dark:shadow-2xl">
            <button
              onClick={() => {
                haptic.select();
                setActiveTab("quiz");
              }}
              className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "quiz"
                  ? "bg-[#d4ff00] text-slate-950 shadow-lg shadow-[#d4ff00]/25"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>1. Интерактивный Квиз</span>
            </button>
            <button
              onClick={() => {
                haptic.select();
                setActiveTab("chat");
              }}
              className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "chat"
                  ? "bg-[#d4ff00] text-slate-950 shadow-lg shadow-[#d4ff00]/25"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>2. Консультация с помощью ИИ</span>
            </button>
            <button
              onClick={() => {
                haptic.select();
                setActiveTab("synthesizer");
              }}
              className={`hidden md:flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "synthesizer"
                  ? "bg-[#d4ff00] text-slate-950 shadow-lg shadow-[#d4ff00]/25"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>3. Экспресс-Синтезатор</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: INTERACTIVE 4-STEP QUIZ WITH VISUAL SPORTS PHOTO CARDS
           ========================================================================= */}
        {activeTab === "quiz" && (
          <div className="relative rounded-3xl border border-slate-200/90 dark:border-[#d4ff00]/25 bg-white/90 dark:bg-[#0c0e14]/75 backdrop-blur-xl p-6 sm:p-10 shadow-[0_16px_50px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85),0_0_25px_-5px_rgba(212,255,0,0.12)] before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d4ff00]/50 dark:before:via-[#d4ff00]/60 before:to-transparent text-slate-900 dark:text-white overflow-hidden">
            {/* Running Border Laser Beam */}
            <BorderBeam duration={9} borderWidth={1.5} colorFrom="#d4ff00" />
            {/* Progress Bar */}
            {step < 5 && (
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-lime-600 dark:text-[#d4ff00]">ШАГ 0{step} / 04</span>
                  <span>{step === 1 ? "25%" : step === 2 ? "50%" : step === 3 ? "75%" : "99%"}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4ff00] transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(212,255,0,0.5)]"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* Step 1: Goal (Photo Cards) */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="telemetry-chip text-lime-600 dark:text-[#d4ff00] block mb-1">ШАГ 01. ПРИОРИТЕТ ТРЕНИРОВОК</span>
                    <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-slate-950 dark:text-white tracking-tight">
                      Какая главная цель ваших занятий в Ташкенте?
                    </h3>
                  </div>

                  {/* Visual Photo Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {goals.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleGoalSelect(g.title)}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/15 hover:border-[#d4ff00] dark:hover:border-[#d4ff00] bg-slate-100 dark:bg-[#0c0e14]/85 text-left transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_45px_-10px_rgba(212,255,0,0.25)] h-52 flex flex-col justify-end p-5 before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/25 before:to-transparent before:z-20"
                      >
                        <img
                          src={g.image}
                          alt={g.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-65 contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="relative z-10 space-y-1">
                          <span className="telemetry-chip text-[#d4ff00] text-[9px] block">
                            {g.badge}
                          </span>
                          <div className="font-extrabold text-base text-white group-hover:text-[#d4ff00] transition-colors leading-tight">
                            {g.title}
                          </div>
                          <div className="text-[11px] text-slate-300 font-medium line-clamp-2">
                            {g.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Experience */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <span className="telemetry-chip text-lime-600 dark:text-[#d4ff00] block text-[10px]">ШАГ 02. ФОРМА & ОПЫТ</span>
                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-slate-950 dark:text-white tracking-tight">
                        Ваш текущий уровень физической подготовки
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5">
                    {experiences.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => handleExpSelect(exp.title)}
                        className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#d4ff00] bg-slate-50 dark:bg-white/5 hover:bg-lime-50 dark:hover:bg-[#d4ff00]/10 text-left transition-all group"
                      >
                        <div>
                          <span className="telemetry-chip text-lime-600 dark:text-[#d4ff00] text-[9px] block mb-0.5">{exp.tag}</span>
                          <div className="font-extrabold text-slate-900 dark:text-white group-hover:text-lime-700 dark:group-hover:text-[#d4ff00] text-sm sm:text-base">
                            {exp.title}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">{exp.desc}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-lime-600 dark:group-hover:text-[#d4ff00] group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Sport (Rich Visual Action Cards) */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <span className="telemetry-chip text-lime-600 dark:text-[#d4ff00] block text-[10px]">ШАГ 03. ДИСЦИПЛИНА</span>
                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-slate-950 dark:text-white tracking-tight">
                        Какое направление привлекает сильнее всего?
                      </h3>
                    </div>
                  </div>

                  {/* Sports Photo Action Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {sports.map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => handleSportSelect(sp.title)}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/15 hover:border-[#d4ff00] dark:hover:border-[#d4ff00] bg-slate-100 dark:bg-[#0c0e14]/85 text-left transition-all duration-300 hover:-translate-y-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_45px_-10px_rgba(212,255,0,0.25)] h-48 flex flex-col justify-between p-4 before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/25 before:to-transparent before:z-20"
                      >
                        <img
                          src={sp.image}
                          alt={sp.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-65 contrast-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-[#d4ff00] text-black font-extrabold text-[10px] uppercase tracking-wider">
                            {sp.kcal}
                          </span>
                        </div>
                        <div className="relative z-10 space-y-0.5">
                          <span className="text-[10px] text-slate-300 font-medium block">
                            {sp.district}
                          </span>
                          <div className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#d4ff00] transition-colors leading-tight">
                            {sp.title}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Budget */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStep(3)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <span className="telemetry-chip text-lime-600 dark:text-[#d4ff00] block text-[10px]">ШАГ 04. БЮДЖЕТ</span>
                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-slate-950 dark:text-white tracking-tight">
                        Комфортный бюджет тренировок в месяц (UZS)
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5">
                    {budgets.map((b) => (
                      <button
                        key={b.id}
                        disabled={isSubmittingQuiz}
                        onClick={() => handleFinishQuiz(b.title)}
                        className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#d4ff00] bg-slate-50 dark:bg-white/5 hover:bg-lime-50 dark:hover:bg-[#d4ff00]/10 text-left transition-all group disabled:opacity-50"
                      >
                        <div>
                          <span className="telemetry-chip text-lime-600 dark:text-[#d4ff00] text-[9px] block mb-0.5">{b.badge}</span>
                          <div className="font-extrabold text-slate-900 dark:text-white group-hover:text-lime-700 dark:group-hover:text-[#d4ff00] text-sm sm:text-base">
                            {b.title}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">{b.desc}</div>
                        </div>
                        {isSubmittingQuiz ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#d4ff00]" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-lime-600 dark:group-hover:text-[#d4ff00] group-hover:translate-x-1 transition-all" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Result & Lead Capture */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="p-6 sm:p-7 rounded-2xl bg-lime-500/10 dark:bg-[#d4ff00]/10 border border-lime-500/30 dark:border-[#d4ff00]/30 space-y-4">
                    <div className="flex items-center gap-2 text-lime-700 dark:text-[#d4ff00] text-xs uppercase tracking-wider font-bold">
                      <Sparkles className="w-4 h-4 text-[#d4ff00]" />
                      <span>РЕЗУЛЬТАТ НЕЙРОСЕТЕВОГО АНАЛИЗА SPOTIFY</span>
                    </div>
                    <p className="text-slate-800 dark:text-white text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                      {cleanAiText(quizResult?.recommendation)}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#d4ff00]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 block">
                          Рекомендуемый клуб в Ташкенте:
                        </span>
                        <div className="font-black text-xl text-slate-950 dark:text-white">
                          {quizResult?.clubName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
                          <span>{quizResult?.clubMetro}</span>
                          <span>•</span>
                          <span className="font-bold text-lime-700 dark:text-[#d4ff00]">
                            {quizResult?.clubPrice}
                          </span>
                        </div>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#d4ff00] text-slate-950 font-black text-xs uppercase tracking-wider self-start sm:self-center">
                        0 UZS ПРОБНОЕ
                      </span>
                    </div>
                  </div>

                  {/* Booking form */}
                  {!quizSuccess ? (
                    <form onSubmit={submitQuizLead} className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-display text-lg font-black uppercase text-slate-950 dark:text-white tracking-tight">
                          Зафиксировать бесплатный пробный визит (0 UZS)
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Заявка мгновенно поступит администратору в клуб <b>{quizResult?.clubName}</b> и продублируется в Telegram.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                            Ваше имя
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Сардор / Константин"
                            value={quizLeadForm.name}
                            onChange={(e) => setQuizLeadForm({ ...quizLeadForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/60 focus:border-[#d4ff00] outline-none text-sm text-slate-900 dark:text-white transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                            Телефон в Ташкенте (+998)
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+998 (90) 123-45-67"
                            value={quizLeadForm.phone}
                            onChange={(e) => setQuizLeadForm({ ...quizLeadForm, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/60 focus:border-[#d4ff00] outline-none text-sm text-slate-900 dark:text-white transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingQuiz}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4ff00]/25 transition-all active:scale-95"
                        >
                          {isSubmittingQuiz ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <span>Записаться за 0 UZS</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-[#d4ff00] font-semibold transition-colors"
                        >
                          ↺ Пройти квиз заново
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-8 rounded-2xl bg-lime-500/10 dark:bg-[#d4ff00]/10 border border-lime-500/30 dark:border-[#d4ff00]/30 text-center space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-full bg-[#d4ff00] text-slate-950 flex items-center justify-center shadow-lg shadow-[#d4ff00]/30">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h4 className="font-display text-xl font-black uppercase text-slate-950 dark:text-white">
                        Заявка успешно оформлена!
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                        Детали переданы в клуб <b>{quizResult?.clubName}</b> и отправлены в Telegram. Менеджер свяжется с вами в течение 10 минут!
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================================================
            TAB 2: LIVE AI CHAT ASSISTANT ("Консультация с помощью ИИ")
           ========================================================================= */}
        {activeTab === "chat" && (
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-void-card/90 backdrop-blur-md p-6 sm:p-8 shadow-xl dark:shadow-2xl flex flex-col h-[600px] relative text-slate-900 dark:text-white">
            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-[#d4ff00] text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#d4ff00] text-slate-950 font-semibold"
                        : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white"
                    }`}
                  >
                    {cleanAiText(m.content)}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-lime-600 dark:text-[#d4ff00] p-2 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4ff00]" />
                  <span>Умный ИИ анализирует запрос и каталог залов Ташкента...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="py-3 flex flex-wrap gap-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => handleSendMessage("Что посоветуешь для снятия стресса после сидячей работы в Ташкенте?")}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:border-[#d4ff00] hover:text-black dark:hover:text-[#d4ff00] text-slate-700 dark:text-slate-300 transition-colors font-medium shadow-sm"
              >
                🧘 Снять стресс после работы
              </button>
              <button
                onClick={() => handleSendMessage("Где лучший олимпийский бассейн со спа в Ташкенте и сколько стоит?")}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:border-[#d4ff00] hover:text-black dark:hover:text-[#d4ff00] text-slate-700 dark:text-slate-300 transition-colors font-medium shadow-sm"
              >
                🏊 Олимпийский бассейн 50м
              </button>
              <button
                onClick={() => handleSendMessage("Хочу начать заниматься боксом с нуля в Buka, как проходит пробное?")}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:border-[#d4ff00] hover:text-black dark:hover:text-[#d4ff00] text-slate-700 dark:text-slate-300 transition-colors font-medium shadow-sm"
              >
                🥊 Бокс с нуля в Buka
              </button>
              <button
                onClick={() => handleSendMessage("Сколько стоят корты для падел-тенниса на Юнусабаде?")}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:border-[#d4ff00] hover:text-black dark:hover:text-[#d4ff00] text-slate-700 dark:text-slate-300 transition-colors font-medium shadow-sm"
              >
                🎾 Корты для падел-тенниса
              </button>
            </div>

            {/* Input Bar */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Задай любой вопрос ИИ: 'Какой зал выбрать на Чиланзаре?', 'Хочу скинуть 5 кг'..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-[#d4ff00]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isAiThinking || !inputMessage.trim()}
                className="p-3 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] disabled:opacity-40 text-slate-950 transition-all shadow-md shadow-[#d4ff00]/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Drawer */}
            {!chatSuccess ? (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500 dark:text-slate-400">Понравилась рекомендация? Забронируйте слот 0 UZS:</span>
                <button
                  onClick={() => setChatLeadForm({ ...chatLeadForm, isOpen: !chatLeadForm.isOpen })}
                  className="font-bold text-lime-600 dark:text-[#d4ff00] hover:underline"
                >
                  {chatLeadForm.isOpen ? "Скрыть форму" : "Оставить контакты ⚡"}
                </button>
              </div>
            ) : (
              <div className="mt-2 text-xs text-lime-600 dark:text-[#d4ff00] font-bold text-center">
                ✓ Контакты переданы в клуб и Telegram! Менеджер свяжется с вами.
              </div>
            )}

            {chatLeadForm.isOpen && !chatSuccess && (
              <form onSubmit={submitChatLead} className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ваше имя"
                  value={chatLeadForm.name}
                  onChange={(e) => setChatLeadForm({ ...chatLeadForm, name: e.target.value })}
                  className="sm:w-1/3 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/70 text-slate-900 dark:text-white font-medium outline-none focus:border-[#d4ff00]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Телефон (+998 ...)"
                  value={chatLeadForm.phone}
                  onChange={(e) => setChatLeadForm({ ...chatLeadForm, phone: e.target.value })}
                  className="sm:w-1/2 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-black/70 text-slate-900 dark:text-white font-medium outline-none focus:border-[#d4ff00]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d4ff00] text-slate-950 font-black text-xs uppercase rounded-lg hover:bg-[#bbf200] shadow-md shadow-[#d4ff00]/20"
                >
                  Записаться
                </button>
              </form>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: QUICK PARAMETER SYNTHESIZER
           ========================================================================= */}
        {activeTab === "synthesizer" && (
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-void-card/90 backdrop-blur-md p-6 sm:p-10 shadow-xl dark:shadow-2xl space-y-6 text-slate-900 dark:text-white">
            <div className="space-y-3">
              <label className="telemetry-chip text-lime-600 dark:text-[#d4ff00] block text-xs">
                01. ГЛАВНЫЙ ЗАПРОС ТЕЛА И РАЗУМА:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {synthGoals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setIsMatching(true);
                      setSynthGoal(g.id);
                      setTimeout(() => setIsMatching(false), 200);
                    }}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      synthGoal === g.id
                        ? "border-[#d4ff00] bg-lime-500/15 dark:bg-[#d4ff00]/15 text-slate-950 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-[#d4ff00]/50"
                    }`}
                  >
                    <span>{g.label}</span>
                    {synthGoal === g.id && <span className="w-2 h-2 rounded-full bg-[#d4ff00]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="telemetry-chip text-slate-500 dark:text-slate-400">02. ТЕКУЩИЙ УРОВЕНЬ НАПРЯЖЕНИЯ / СТРЕССА:</span>
                <span className="font-extrabold text-lime-600 dark:text-[#d4ff00]">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4ff00]"
              />
            </div>

            <div className="p-5 rounded-2xl bg-lime-500/10 dark:bg-[#d4ff00]/10 border border-lime-500/30 dark:border-[#d4ff00]/25 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div>
                <span className="telemetry-chip text-lime-600 dark:text-[#d4ff00] block text-[10px]">ПОДОБРАННЫЙ СПОРТИВНЫЙ КЛУБ:</span>
                <div className="font-black text-lg text-slate-950 dark:text-white">
                  {synthGoals.find((g) => g.id === synthGoal)?.club}
                </div>
              </div>
              <a
                href="#booking"
                className="px-6 py-2.5 rounded-xl bg-[#d4ff00] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-[#bbf200] transition-colors shadow-md shadow-[#d4ff00]/20"
              >
                Забронировать 0 UZS
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}