import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Terminal,
  Disc,
  FileCheck2,
  Award,
  GraduationCap,
  Flame,
  Sparkles,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  Cpu,
  TrendingUp,
  Star,
} from "lucide-react";

/* ─── Live Clock Hook ─── */
function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ─── Nav Items ─── */
const NAV_ITEMS = [
  { id: "curriculum",  label: "Curriculum & Notes",  icon: BookOpen,      badge: null,          group: "LEARNING" },
  { id: "idle",        label: "Python IDLE Studio",  icon: Terminal,      badge: "Python 3.12", group: "LEARNING" },
  { id: "capstone",    label: "Capstone Blueprint",  icon: Layers,        badge: null,          group: "LEARNING" },
  { id: "wheel",       label: "Daily Spin Quizzes",  icon: Disc,          badge: "LIVE",        group: "PRACTICE" },
  { id: "mocktests",   label: "Mock Test Centre",    icon: FileCheck2,    badge: "30 Qs",       group: "PRACTICE" },
  { id: "badges",      label: "Badges & Tiers",      icon: Award,         badge: null,          group: "REWARDS" },
  { id: "certificate", label: "Gold Certificate",    icon: GraduationCap, badge: null,          group: "REWARDS" },
];

const GROUPS = ["LEARNING", "PRACTICE", "REWARDS"];

export default function Navbar({ activeTab, setActiveTab, learner, onResetLearner }) {
  const now = useLiveClock();
  const [collapsed, setCollapsed] = useState(false);

  const level  = Math.floor((learner.xp || 0) / 250) + 1;
  const xpToNext = level * 250;
  const xpPct  = Math.min(100, Math.round(((learner.xp || 0) % 250) / 250 * 100));

  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      {/* ══════════════════════════════════════════════
          TOP HEADER BAR — full width, always visible
         ══════════════════════════════════════════════ */}
      <header className="elite-header fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-4 print:hidden">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
          onClick={() => setActiveTab("curriculum")}
          style={{ width: collapsed ? 56 : 240, transition: "width 0.3s" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm"
            style={{
              background: "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fde68a 100%)",
              color: "#0a0a0a",
              boxShadow: "0 0 16px rgba(245,158,11,0.4)",
            }}
          >
            AI
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="shimmer-gold font-extrabold text-sm tracking-tight whitespace-nowrap">
                  AI LAUNCHPAD
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(245,158,11,0.15)",
                    border: "1px solid rgba(245,158,11,0.35)",
                    color: "#fbbf24",
                  }}
                >
                  BI V18
                </span>
              </div>
              <p className="text-[10px] font-medium" style={{ color: "#8a8a8a" }}>
                Zero to Infinity
              </p>
            </div>
          )}
        </div>

        {/* Centre — Live Date & Time */}
        <div className="flex-1 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" style={{ color: "#d97706" }} />
            <span className="text-xs font-semibold" style={{ color: "#c4c4c4" }}>{dateStr}</span>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
            <span
              className="text-xs font-bold font-mono tracking-wide"
              style={{ color: "#fbbf24" }}
            >
              {timeStr.split(":").map((seg, i) =>
                i < 2
                  ? [<span key={i}>{seg}</span>, <span key={`c${i}`} className="clock-colon">:</span>]
                  : <span key={i}>{seg}</span>
              )}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#4a4a4a" }}>
            <Cpu className="w-3.5 h-3.5" />
            <span>Powered by Kapil</span>
          </div>
        </div>

        {/* Right — Learner Stats */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Streak */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{learner.streak || 1}d</span>
          </div>

          {/* XP */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", color: "#fbbf24" }}
          >
            <Sparkles className="w-3 h-3" style={{ color: "#fde68a" }} />
            <span>{(learner.xp || 0).toLocaleString()} XP</span>
          </div>

          {/* Avatar + Name */}
          <div className="relative group">
            <button
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl transition-all text-left"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <span className="text-xl">{learner.avatar || "🚀"}</span>
              <div className="hidden md:block">
                <p className="text-xs font-bold max-w-[110px] truncate" style={{ color: "#f0f0f0" }}>
                  {learner.name || "Learner"}
                </p>
                <p className="text-[10px] font-semibold" style={{ color: "#f59e0b" }}>
                  Lvl {level} Architect
                </p>
              </div>
            </button>

            {/* Hover Dropdown */}
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
              style={{ background: "#111", border: "1px solid rgba(245,158,11,0.25)" }}
            >
              <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid rgba(245,158,11,0.12)" }}>
                <span className="text-3xl p-1.5 rounded-xl" style={{ background: "rgba(245,158,11,0.08)" }}>
                  {learner.avatar}
                </span>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate" style={{ color: "#f0f0f0" }}>{learner.name}</p>
                  <p className="text-[11px] truncate" style={{ color: "#8a8a8a" }}>{learner.role}</p>
                </div>
              </div>

              <div className="py-2.5 space-y-1.5 text-xs" style={{ color: "#8a8a8a" }}>
                <div className="flex justify-between">
                  <span>Company:</span>
                  <span className="font-medium text-right max-w-[130px] truncate" style={{ color: "#c4c4c4" }}>{learner.company}</span>
                </div>
                <div className="flex justify-between">
                  <span>Track:</span>
                  <span className="font-semibold" style={{ color: "#f59e0b" }}>BI V18 AI Launchpad</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold" style={{ color: "#fbbf24" }}>Level {level} Master</span>
                </div>
                <div className="flex justify-between">
                  <span>Badges:</span>
                  <span className="font-bold" style={{ color: "#fbbf24" }}>{(learner.unlockedBadges || []).length} Earned</span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(245,158,11,0.1)" }}>
                <div className="flex justify-between text-[10px] font-semibold mb-1" style={{ color: "#8a8a8a" }}>
                  <span>XP to Level {level + 1}</span>
                  <span style={{ color: "#f59e0b" }}>{xpPct}%</span>
                </div>
                <div className="xp-bar-track h-1.5">
                  <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
                </div>
              </div>

              <button
                onClick={onResetLearner}
                className="w-full mt-3 pt-2 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ borderTop: "1px solid rgba(245,158,11,0.1)", color: "#ef4444" }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Reset Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          LEFT SIDEBAR — fixed, below header
         ══════════════════════════════════════════════ */}
      <aside
        className="sidebar fixed top-14 left-0 bottom-0 z-40 flex flex-col print:hidden transition-all duration-300"
        style={{ width: collapsed ? 60 : 236 }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all"
          style={{
            background: "#1f1f1f",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#f59e0b",
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-none">
          {GROUPS.map((group) => {
            const items = NAV_ITEMS.filter((i) => i.group === group);
            return (
              <div key={group} className="mb-4">
                {!collapsed && (
                  <p
                    className="text-[10px] font-bold tracking-[0.15em] uppercase px-2 mb-1.5"
                    style={{ color: "#3a3a3a" }}
                  >
                    {group}
                  </p>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={collapsed ? item.label : ""}
                      className={`sidebar-item w-full mb-0.5 ${isActive ? "active" : ""}`}
                      style={collapsed ? { justifyContent: "center", padding: "10px 0" } : {}}
                    >
                      <Icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: isActive ? "#f59e0b" : "#4a4a4a" }}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{
                                background: isActive ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.04)",
                                border: `1px solid ${isActive ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.06)"}`,
                                color: isActive ? "#fbbf24" : "#4a4a4a",
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
                {!collapsed && group !== "REWARDS" && (
                  <div className="gold-divider my-3 mx-2 opacity-30" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer — Learner mini card */}
        {!collapsed && (
          <div
            className="p-3 mx-2 mb-4 rounded-xl"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{learner.avatar || "🚀"}</span>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate" style={{ color: "#f0f0f0" }}>
                  {learner.name || "Learner"}
                </p>
                <p className="text-[10px]" style={{ color: "#f59e0b" }}>
                  Lvl {level} • {(learner.xp || 0).toLocaleString()} XP
                </p>
              </div>
            </div>
            <div className="xp-bar-track h-1">
              <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] mt-1 font-medium" style={{ color: "#3a3a3a" }}>
              <span>{(learner.completedModules || []).length} modules done</span>
              <span>{xpPct}% to Lvl {level + 1}</span>
            </div>
          </div>
        )}

        {/* Collapsed avatar */}
        {collapsed && (
          <div className="flex justify-center mb-4">
            <span className="text-xl">{learner.avatar || "🚀"}</span>
          </div>
        )}
      </aside>
    </>
  );
}
