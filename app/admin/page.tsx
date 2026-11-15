"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  LogOut,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  Send,
  Download,
  Search,
  Filter,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  Database,
  Cloud,
  ImageIcon,
  X,
  ZoomIn,
} from "lucide-react";
import { Lead, LeadStatus } from "@/lib/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<Lead | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewingReceipt(null);
        setSelectedLead(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Telegram test state
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  // Neon Cloud state
  const [dataSource, setDataSource] = useState<string>("neon_postgres");
  const [neonHealth, setNeonHealth] = useState<{
    postgres?: { status: string; latencyMs: number; version?: string; database?: string; leadsCount?: number };
    objectStorage?: { status: string; latencyMs: number; bucket: string; objectsCount: number };
  } | null>(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("spotify-admin-auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      fetchLeads();
      fetchNeonHealth();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("spotify-admin-auth", "true");
        setAuthError("");
        fetchLeads();
        fetchNeonHealth();
      } else {
        setAuthError(data.error || "Неверный пароль администратора. Попробуйте снова.");
      }
    } catch {
      setAuthError("Ошибка подключения к серверу авторизации.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("spotify-admin-auth");
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        if (data.source) {
          setDataSource(data.source);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNeonHealth = async () => {
    try {
      const res = await fetch("/api/neon/health");
      const data = await res.json();
      if (data.services) {
        setNeonHealth(data.services);
      }
    } catch (err) {
      console.warn("Neon health check notice:", err);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту заявку?")) return;

    try {
      const res = await fetch(`/api/leads?id=${leadId}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async (leadId: string, notes: string) => {
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, notes }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, notes } : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTelegramStatus(null);
    try {
      const res = await fetch("/api/telegram/test", { method: "POST" });
      const data = await res.json();
      setTelegramStatus(data);
    } catch (e: any) {
      setTelegramStatus({ success: false, error: "Ошибка запроса к серверу" });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "ID",
      "Пропуск ID",
      "Дата",
      "Имя",
      "Телефон",
      "Тариф",
      "Оплата",
      "Сумма UZS",
      "Чек URL",
      "Язык",
      "Спорт",
      "Клуб",
      "Бюджет",
      "Источник",
      "Статус",
      "AI Детали",
      "Заметки",
    ];
    const rows = leads.map((l) => [
      l.id,
      `"#${l.passCode || ""}"`,
      new Date(l.createdAt).toLocaleString("ru-RU"),
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.planType || "trial"}"`,
      `"${l.paymentMethod || ""}"`,
      `"${l.amountUzs || 0}"`,
      `"${l.receiptUrl || ""}"`,
      `"${l.language || "ru"}"`,
      `"${l.sportInterest || ""}"`,
      `"${l.clubName || ""}"`,
      `"${l.budget || ""}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${(l.aiSummary || "").replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `spotify_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const enrolledLeads = leads.filter((l) => l.status === "enrolled").length;
  const conversionRate = totalLeads > 0 ? Math.round((enrolledLeads / totalLeads) * 100) : 0;

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.sportInterest || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.clubName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-void text-slate-900 dark:text-white transition-colors duration-300">
        <div className="w-full max-w-md rounded-3xl p-8 border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#d4ff00] text-black flex items-center justify-center font-black mx-auto shadow-lg shadow-[#d4ff00]/25">
            <Lock className="w-7 h-7" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase text-white tracking-tight">
              SPORTIFY COMMAND CENTER
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Административный терминал управления лидами и ботом
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono">
                {authError}
              </div>
            )}

            <div>
              <label className="telemetry-chip text-slate-300 block mb-1.5">
                ПАРОЛЬ ДОСТУПА:
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-[#d4ff00] text-sm tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#d4ff00]/25 transition-all"
            >
              Авторизоваться
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-[#d4ff00] font-mono transition-colors">
              ← На главный сайт
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-void text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#d4ff00] text-black flex items-center justify-center font-black">
              <Zap className="w-4 h-4 fill-black stroke-black" />
            </div>
            <span className="text-lg font-black tracking-tighter text-white">
              SPORT<span className="text-[#d4ff00]">IFY</span>
            </span>
            <span className="telemetry-chip text-slate-500 ml-1">ADMIN // V3.2</span>
          </Link>

          <span className="text-white/20">|</span>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
          >
            <span>На сайт</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2 rounded-xl border border-white/10 hover:border-white/30 text-slate-300"
            title="Обновить"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#d4ff00]" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 hover:bg-red-500/10 hover:text-red-400 text-slate-400 text-xs font-mono transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Выйти</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex items-center justify-between">
            <div>
              <span className="telemetry-chip text-slate-400">ВСЕГО ЗАЯВОК:</span>
              <div className="text-3xl font-black text-white mt-1">{totalLeads}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 text-white flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex items-center justify-between">
            <div>
              <span className="telemetry-chip text-slate-400">НОВЫЕ ЛИДЫ:</span>
              <div className="text-3xl font-black text-[#d4ff00] mt-1">{newLeads}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#d4ff00]/10 text-[#d4ff00] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex items-center justify-between">
            <div>
              <span className="telemetry-chip text-slate-400">ЗАПИСАНЫ В КЛУБ:</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">{enrolledLeads}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex items-center justify-between">
            <div>
              <span className="telemetry-chip text-slate-400">КОНВЕРСИЯ В ВИЗИТ:</span>
              <div className="text-3xl font-black text-white mt-1">{conversionRate}%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Neon Cloud Infrastructure Terminal */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#d4ff00]" />
              <span className="font-bold text-sm text-white uppercase">
                NEON CLOUD LAKEBASE (POSTGRESQL & S3 OBJECT STORAGE)
              </span>
              <span className="telemetry-chip text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                CONNECTED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Облачная база данных Postgres и объектное хранилище Neon подключены в режиме реального времени.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Postgres: {neonHealth?.postgres?.status === "healthy" ? `Активен (${neonHealth.postgres.latencyMs} мс)` : "Подключение..."}</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>S3 Bucket: {neonHealth?.objectStorage?.bucket || "assets"} ({neonHealth?.objectStorage?.status === "healthy" ? "OK" : "Проверка..."})</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="text-slate-400">
                <span>Хранилище: </span>
                <span className="text-[#d4ff00] font-bold">{dataSource === "neon_postgres" ? "Neon Lakebase Cloud" : "Local Sync"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchNeonHealth}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-[#d4ff00]" />
              <span>Диагностика Neon</span>
            </button>
          </div>
        </div>

        {/* Telegram Diagnostics Terminal */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-[#d4ff00]" />
              <span className="font-bold text-sm text-white uppercase">
                TELEGRAM BOT NOTIFICATION SERVICE
              </span>
              <span className="telemetry-chip text-slate-500">LIVE SYNC</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Новые заявки с лендинга и AI Matcher дублируются в Telegram кураторам.
            </p>
            {telegramStatus && (
              <div className={`text-xs font-mono pt-1 ${telegramStatus.success ? "text-[#d4ff00]" : "text-amber-400"}`}>
                {telegramStatus.success ? `✓ ${telegramStatus.message}` : `Внимание: ${telegramStatus.error || telegramStatus.message}`}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestTelegram}
              disabled={isTestingTelegram}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono uppercase text-white flex items-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>{isTestingTelegram ? "Тестирование..." : "Проверить бота"}</span>
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-black text-xs font-black uppercase flex items-center gap-2 shadow-md shadow-[#d4ff00]/25"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Экспорт в CSV</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: "all", label: "Все заявки" },
              { id: "new", label: "Новые" },
              { id: "contacted", label: "В обработке" },
              { id: "enrolled", label: "Записаны" },
              { id: "cancelled", label: "Отклонены" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  statusFilter === f.id
                    ? "bg-[#d4ff00] text-black font-black"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по имени, номеру, клубу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-black/60 text-xs text-white outline-none focus:border-[#d4ff00] font-mono"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-void-card overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Пропуск ID</th>
                  <th className="py-3.5 px-4">Клиент</th>
                  <th className="py-3.5 px-4">Телефон</th>
                  <th className="py-3.5 px-4">Направление / Клуб</th>
                  <th className="py-3.5 px-4">Тариф / Оплата</th>
                  <th className="py-3.5 px-4">Чек оплаты</th>
                  <th className="py-3.5 px-4">Дата</th>
                  <th className="py-3.5 px-4">Статус</th>
                  <th className="py-3.5 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#d4ff00]">
                      #{lead.passCode || `SPT-${lead.id.slice(-4)}`}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {lead.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <a href={`tel:${lead.phone}`} className="hover:text-[#d4ff00]">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{lead.sportInterest || "Не указано"}</div>
                      {lead.clubName && (
                        <div className="text-[10px] text-slate-500 font-bold">
                          {lead.clubName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {lead.planType === "membership" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4ff00]/15 text-[#d4ff00] border border-[#d4ff00]/30 whitespace-nowrap">
                          {lead.amountUzs ? `${Number(lead.amountUzs).toLocaleString("ru-RU")} UZS` : "Абонемент"} • {lead.paymentMethod === "stripe" ? "Stripe" : "Click/Payme"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-300 whitespace-nowrap">
                          0 UZS (Пробное)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {lead.receiptUrl ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsZoomed(false);
                              setViewingReceipt(lead);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-400 hover:text-sky-300 font-bold text-[11px] transition-all hover:scale-[1.02] shadow-sm whitespace-nowrap cursor-pointer active:scale-95"
                            title="Открыть чек на странице"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                            <span>Фото чека</span>
                            <Eye className="w-3.5 h-3.5 opacity-80" />
                          </button>
                          <a
                            href={lead.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Открыть оригинал в новой вкладке"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">
                          Не прикреплен
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(lead.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value as LeadStatus)
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono outline-none focus:border-[#d4ff00]"
                      >
                        <option value="new">Новая</option>
                        <option value="contacted">В обработке</option>
                        <option value="enrolled">Записан</option>
                        <option value="cancelled">Отклонена</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-[#d4ff00]"
                        title="Подробнее"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              Заявок по выбранным критериям не найдено.
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-white/15 bg-white dark:bg-void-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="telemetry-chip text-[#d4ff00]">ДЕТАЛИ ЛИДА</span>
                <h3 className="text-xl font-black uppercase text-white mt-0.5">{selectedLead.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#d4ff00]/10 text-[#d4ff00]">
                {selectedLead.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Пропуск ID:</span>
                <span className="text-[#d4ff00] font-black">#{selectedLead.passCode || `SPT-${selectedLead.id.slice(-4)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Телефон:</span>
                <a href={`tel:${selectedLead.phone}`} className="text-[#d4ff00] font-bold">
                  {selectedLead.phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Тариф / Сумма:</span>
                <span className="text-white font-bold">
                  {selectedLead.planType === "membership"
                    ? `${selectedLead.amountUzs ? Number(selectedLead.amountUzs).toLocaleString("ru-RU") : "850 000"} UZS (Абонемент)`
                    : "0 UZS (Пробное занятие)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Оплата:</span>
                <span className="text-slate-200">
                  {selectedLead.paymentMethod === "stripe"
                    ? "💳 Stripe (Онлайн картой)"
                    : selectedLead.paymentMethod === "click_payme"
                    ? "📲 Перевод Click / Payme"
                    : "🎫 0 UZS (Бесплатно)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Язык заявки:</span>
                <span className="text-slate-200">
                  {selectedLead.language === "uz" ? "🇺🇿 O'zbekcha" : "🇷🇺 Русский"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Интерес:</span>
                <span className="text-white">{selectedLead.sportInterest || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Клуб:</span>
                <span className="text-white">{selectedLead.clubName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Дата заявки:</span>
                <span className="text-slate-300">
                  {new Date(selectedLead.createdAt).toLocaleString("ru-RU")}
                </span>
              </div>
            </div>

            {selectedLead.receiptUrl && (
              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 truncate">
                  <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-bold text-white truncate">
                    Чек: {selectedLead.receiptName || "Файл оплаты"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsZoomed(false);
                      setViewingReceipt(selectedLead);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-black text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Смотреть здесь</span>
                  </button>
                  <a
                    href={selectedLead.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="В новой вкладке"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {selectedLead.aiSummary && (
              <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-xs font-mono">
                <span className="text-slate-400 block mb-1">AI-Сводка / Опрос:</span>
                <p className="text-slate-200">{selectedLead.aiSummary}</p>
              </div>
            )}

            <div>
              <label className="telemetry-chip text-slate-400 block mb-1.5">
                Заметки куратора:
              </label>
              <textarea
                rows={2}
                defaultValue={selectedLead.notes || ""}
                onBlur={(e) => handleSaveNotes(selectedLead.id, e.target.value)}
                placeholder="Заметка куратора..."
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none focus:border-[#d4ff00] font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#d4ff00]/20 text-[#d4ff00] font-mono text-xs font-bold"
              >
                Открыть в WhatsApp
              </a>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-mono uppercase text-white"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
      {/* In-Page Receipt Lightbox / Modal */}
      {viewingReceipt && viewingReceipt.receiptUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewingReceipt(null);
            }
          }}
        >
          <div className="rounded-3xl max-w-4xl w-full border border-white/15 bg-[#0b0e14] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-white">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="telemetry-chip text-sky-400">ЧЕК ОБ ОПЛАТЕ</span>
                    <span className="text-[#d4ff00] font-mono font-bold text-xs">
                      #{viewingReceipt.passCode || `SPT-${viewingReceipt.id.slice(-4)}`}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                      {viewingReceipt.paymentMethod === "stripe" ? "Stripe Онлайн" : "Click / Payme Перевод"}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-white truncate mt-0.5">
                    {viewingReceipt.name} • <span className="text-slate-400 font-normal">{viewingReceipt.phone}</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-slate-300 transition-colors font-mono cursor-pointer"
                  title="Масштабировать"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>{isZoomed ? "100%" : "По размеру"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingReceipt(null)}
                  className="w-9 h-9 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Закрыть (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document / Image Viewer Area */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-black/60 flex items-center justify-center min-h-[300px] relative">
              {viewingReceipt.receiptUrl.toLowerCase().endsWith(".pdf") ||
              viewingReceipt.receiptName?.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={viewingReceipt.receiptUrl}
                  className="w-full h-[65vh] rounded-xl border border-white/10 bg-slate-900"
                  title="PDF Чек об оплате"
                />
              ) : (
                <div
                  className={`relative transition-all duration-200 ${
                    isZoomed ? "w-full max-w-none cursor-zoom-out" : "max-h-[65vh] max-w-full flex items-center justify-center cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <img
                    src={viewingReceipt.receiptUrl}
                    alt={`Чек оплаты ${viewingReceipt.name}`}
                    className={`rounded-xl border border-white/10 shadow-2xl object-contain mx-auto transition-transform ${
                      isZoomed ? "max-w-none scale-125 my-8" : "max-h-[65vh] max-w-full"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02]">
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Сумма:</span>
                <span className="text-base font-black text-[#d4ff00]">
                  {Number(viewingReceipt.amountUzs || 850000).toLocaleString("ru-RU")} UZS
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 truncate max-w-[200px]" title={viewingReceipt.receiptName || "Файл чека"}>
                  {viewingReceipt.receiptName || "receipt.png"}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {viewingReceipt.status !== "enrolled" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(viewingReceipt.id, "enrolled");
                      setViewingReceipt({ ...viewingReceipt, status: "enrolled" });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#d4ff00] hover:bg-[#bbf200] text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-[#d4ff00]/25 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Подтвердить оплату</span>
                  </button>
                )}

                <a
                  href={viewingReceipt.receiptUrl}
                  download={viewingReceipt.receiptName || "sportify-receipt"}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>Скачать</span>
                </a>

                <a
                  href={viewingReceipt.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>В новой вкладке</span>
                </a>

                <button
                  type="button"
                  onClick={() => setViewingReceipt(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-mono uppercase text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
