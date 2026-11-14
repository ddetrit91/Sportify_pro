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
    const headers = ["ID", "Дата", "Имя", "Телефон", "Спорт", "Клуб", "Бюджет", "Источник", "Статус", "AI Детали", "Заметки"];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleString("ru-RU"),
      `"${l.name}"`,
      `"${l.phone}"`,
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-void text-white">
        <div className="w-full max-w-md rounded-3xl p-8 border border-white/10 bg-void-card shadow-2xl space-y-6">
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
    <div className="min-h-screen bg-void text-white flex flex-col">
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
          <div className="p-5 rounded-2xl border border-white/10 bg-void-card flex items-center justify-between">
            <div>
              <span className="telemetry-chip text-slate-400">ВСЕГО ЗАЯВОК:</span>
              <div className="text-3xl font-black text-white mt-1">{totalLeads}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 text-white flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-void-card flex items-center justify-between">
            <div>
              <span className="telemetry-chip text-slate-400">НОВЫЕ ЛИДЫ:</span>
              <div className="text-3xl font-black text-[#d4ff00] mt-1">{newLeads}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#d4ff00]/10 text-[#d4ff00] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-void-card flex items-center justify-between">
            <div>
              <span className="telemetry-chip text-slate-400">ЗАПИСАНЫ В КЛУБ:</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">{enrolledLeads}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-void-card flex items-center justify-between">
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
        <div className="p-5 rounded-2xl border border-white/10 bg-void-card flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        <div className="p-5 rounded-2xl border border-white/10 bg-void-card flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        <div className="rounded-2xl border border-white/10 bg-void-card overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Клиент</th>
                  <th className="py-3.5 px-4">Телефон</th>
                  <th className="py-3.5 px-4">Направление / Клуб</th>
                  <th className="py-3.5 px-4">Источник</th>
                  <th className="py-3.5 px-4">Дата</th>
                  <th className="py-3.5 px-4">Статус</th>
                  <th className="py-3.5 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
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
                    <td className="py-3.5 px-4 text-slate-400 uppercase text-[10px]">
                      {lead.source}
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
                        className="px-2.5 py-1 rounded-lg bg-black border border-white/10 text-xs font-mono outline-none focus:border-[#d4ff00]"
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
          <div className="rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/15 bg-void-card space-y-5">
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
                <span className="text-slate-400">Телефон:</span>
                <a href={`tel:${selectedLead.phone}`} className="text-[#d4ff00] font-bold">
                  {selectedLead.phone}
                </a>
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
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs text-white outline-none focus:border-[#d4ff00] font-mono"
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
    </div>
  );
}
