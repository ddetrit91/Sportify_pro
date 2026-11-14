"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  Check,
  MapPin,
  Calendar,
  ArrowRight,
  Minimize2,
} from "lucide-react";
import confetti from "canvas-confetti";

const cleanAiText = (txt: string) => {
  if (!txt) return "";
  return txt
    .replace(/^[ \t]*\*+[ \t]+/gm, "• ")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\*+/g, "");
};

export function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Ассалому алейкум! Я персональный ИИ-консультант SPOTIFY в Ташкенте ⚡\n\nПомогу найти идеальный спорт, сравнить условия в залах Ташкента и забронировать первое занятие бесплатно (0 UZS). О чем хотите узнать?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "" });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isAiThinking]);

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
            "Отличный вопрос! Я готов помочь вам записаться на бесплатное первое занятие (0 UZS). Нажмите кнопку бронирования ниже!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Спасибо за обращение! Вы можете прямо сейчас забронировать бесплатное вводное занятие (0 UZS) в лучших залах Ташкента.",
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    setIsSubmittingLead(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name,
          phone: leadForm.phone,
          source: "ai_chat",
          aiSummary: `Заявка из плавающего виджета ИИ. Диалог: ${messages
            .slice(-2)
            .map((m) => m.content)
            .join(" | ")
            .substring(0, 180)}`,
        }),
      });
      if (response.ok) {
        setLeadSuccess(true);
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#d4ff00", "#10b981", "#ffffff"],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <>
      {/* 1. Floating Toggle Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-[#d4ff00]/40 transition-all hover:scale-105 active:scale-95 border-2 border-black"
          >
            {/* Green Online Dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>

            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>ИИ-Помощник</span>

            {/* Notification Pulse Ring */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
          </button>
        )}
      </div>

      {/* 2. Floating AI Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 w-[94vw] sm:w-[420px] h-[600px] max-h-[85vh] z-50 bg-[#0c0e13]/95 backdrop-blur-2xl border border-white/15 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-black/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-[#d4ff00] text-slate-950 flex items-center justify-center font-black shadow-md shadow-[#d4ff00]/25">
                <Sparkles className="w-5 h-5 fill-slate-950" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-tight">
                  <span>SPORTIFY ИИ-Консультант</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Онлайн // Подбор клубов в Ташкенте</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsLeadDrawerOpen(!isLeadDrawerOpen)}
                title="Забронировать 0 UZS"
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-colors ${
                  isLeadDrawerOpen
                    ? "bg-white text-black"
                    : "bg-[#d4ff00] text-black hover:bg-[#bbf200]"
                }`}
              >
                {isLeadDrawerOpen ? "Чат" : "Бронь 0 UZS"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Свернуть окно"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Booking Lead Drawer (if active) */}
          {isLeadDrawerOpen && (
            <div className="p-4 bg-[#d4ff00]/10 border-b border-[#d4ff00]/25 space-y-3">
              {!leadSuccess ? (
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Занять бесплатный слот (0 UZS)
                    </span>
                    <span className="text-[10px] text-[#d4ff00] font-semibold">Ташкент</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Ваше имя"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="+998 (90) ..."
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-[#d4ff00]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#d4ff00]/20"
                  >
                    {isSubmittingLead ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Оформить пропуск за 0 UZS</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-[#d4ff00]/20 border border-[#d4ff00]/30 text-center space-y-1">
                  <span className="text-xs font-bold text-white block">
                    ✓ Заявка передана координатору!
                  </span>
                  <span className="text-[11px] text-slate-300 block">
                    Электронный пропуск отправлен в Telegram.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-[#d4ff00] text-black flex items-center justify-center font-extrabold text-[10px] shrink-0 mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#d4ff00] text-black font-semibold rounded-br-sm shadow-md"
                      : "bg-white/5 border border-white/10 text-white rounded-bl-sm whitespace-pre-line"
                  }`}
                >
                  {cleanAiText(m.content)}
                </div>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs text-[#d4ff00] p-2 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4ff00]" />
                <span>ИИ анализирует залы Ташкента...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-black/40 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSendMessage("🥊 Хочу бокс с нуля в Buka, какие условия?")}
              className="px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-slate-300 text-[11px] font-medium whitespace-nowrap bg-white/5 transition-colors"
            >
              🥊 Бокс с нуля в Buka
            </button>
            <button
              onClick={() => handleSendMessage("🏊 Где лучший бассейн 50м на Бабура?")}
              className="px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-slate-300 text-[11px] font-medium whitespace-nowrap bg-white/5 transition-colors"
            >
              🏊 Бассейн 50м
            </button>
            <button
              onClick={() => handleSendMessage("🧘 Реформер-пилатес для спины на Мустакиллик")}
              className="px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-slate-300 text-[11px] font-medium whitespace-nowrap bg-white/5 transition-colors"
            >
              🧘 Пилатес для спины
            </button>
            <button
              onClick={() => handleSendMessage("🎾 Корты для падел-тенниса на Юнусабаде")}
              className="px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-slate-300 text-[11px] font-medium whitespace-nowrap bg-white/5 transition-colors"
            >
              🎾 Падел Юнусабад
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-black/80 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Спросите ИИ о любом зале в Ташкенте..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs outline-none focus:border-[#d4ff00] transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isAiThinking || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] disabled:opacity-40 text-black transition-all shadow-md shadow-[#d4ff00]/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}