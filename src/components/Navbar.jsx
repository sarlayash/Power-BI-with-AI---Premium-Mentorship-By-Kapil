import React from "react";
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
  ChevronDown,
  LogOut
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, learner, onResetLearner }) {
  const level = Math.floor((learner.xp || 0) / 250) + 1;

  const navItems = [
    { id: "curriculum", label: "Curriculum & Notes", icon: BookOpen },
    { id: "idle", label: "Integrated IDLE", icon: Terminal, badge: "Python 3.12" },
    { id: "wheel", label: "Daily Spin Quizzes", icon: Disc, highlight: true },
    { id: "mocktests", label: "Mock Test Center", icon: FileCheck2 },
    { id: "badges", label: "Badges & Tiers", icon: Award },
    { id: "certificate", label: "Certificate", icon: GraduationCap },
    { id: "capstone", label: "Capstone Blueprint", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("curriculum")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-xl">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">AI LAUNCHPAD</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  BI V18
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Zero to Infinity • Fortune 500 Standards
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-slate-800 text-cyan-300 px-1.5 py-0.2 rounded border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Learner Stats & Profile Pill */}
          <div className="flex items-center gap-3">
            {/* Streak Flame */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold" title="Daily Learning Streak">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
              <span>{learner.streak || 1}d</span>
            </div>

            {/* XP Points */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-bold" title="Total Experience Points (XP)">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{learner.xp || 0} XP</span>
            </div>

            {/* User Profile Mini Card */}
            <div className="relative group">
              <button className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left">
                <span className="text-xl">{learner.avatar || "🚀"}</span>
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">
                    {learner.name || "Learner"}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-semibold">
                    Lvl {level} Architect
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <span className="text-3xl p-1.5 rounded-xl bg-slate-800">{learner.avatar}</span>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{learner.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{learner.role}</p>
                  </div>
                </div>

                <div className="py-2.5 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Company:</span>
                    <span className="font-medium text-right max-w-[130px] truncate">{learner.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Track:</span>
                    <span className="font-semibold text-cyan-400">BI V18 AI Launchpad</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level:</span>
                    <span className="font-bold text-amber-400">Level {level} Master</span>
                  </div>
                </div>

                <button
                  onClick={onResetLearner}
                  className="w-full mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch / Reset Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Scroll */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
