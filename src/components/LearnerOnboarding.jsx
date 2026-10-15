import React, { useState } from "react";
import { Sparkles, ShieldCheck, ArrowRight, User, Briefcase, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { playSuccessChime } from "../utils/soundEffects";

const AVATARS = ["🚀", "🤖", "🧠", "⚡", "💎", "🛡️", "🔮", "🎯"];

const ROLES = [
  "Enterprise AI & Agentic Systems Architect",
  "Principal Generative AI Engineer",
  "BI & Power Platform AI Specialist",
  "Full-Stack LLM & FastAPI Developer",
  "Azure Cloud AI Solutions Architect"
];

export default function LearnerOnboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [company, setCompany] = useState("Fortune 500 Enterprise Center of Excellence");
  const [error, setError] = useState("");

  const handleStart = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name to begin your journey.");
      return;
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    playSuccessChime();

    const profileData = {
      name: name.trim(),
      role,
      avatar,
      company: company.trim() || "Fortune 500 Enterprise",
      joinedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isLoggedIn: true,
      xp: 200, // Onboarding welcome bonus XP!
    };

    onComplete(profileData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Fortune 500 Enterprise Launchpad
          </div>
          <span className="text-xs text-slate-400 font-mono">BI V18 • Nov 27th BLR</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
          AI Launchpad: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Zero to Infinity</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
          Welcome to the enterprise standard masterclass in Python, FastAPI, Generative AI, Prompt Engineering, Open-Source LLMs, LangChain, LangGraph Multi-Agent Systems, and Azure AI Cloud RAG.
        </p>

        {/* Form */}
        <form onSubmit={handleStart} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Learner Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. Alex Morgan, Senior AI Architect"
                className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-base"
                autoFocus
              />
            </div>
            {error && <p className="text-rose-400 text-xs mt-1.5 font-medium">{error}</p>}
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Choose Your Executive Avatar
            </label>
            <div className="flex flex-wrap gap-2.5">
              {AVATARS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAvatar(item)}
                  className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all ${
                    avatar === item
                      ? "bg-blue-600 border-2 border-cyan-400 scale-110 shadow-lg shadow-blue-500/30"
                      : "bg-slate-800/80 border border-slate-700 hover:bg-slate-700/80 hover:scale-105"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Target Enterprise Specialization
            </label>
            <div className="relative">
              <Briefcase className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium appearance-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Company / Center */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Organization / Department
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Fortune 500 Enterprise AI Center of Excellence"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-xl">🏆</span>
              <p className="text-[11px] font-semibold text-slate-300 mt-1">Fortune 500</p>
              <p className="text-[10px] text-slate-500">Verified Standards</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-xl">💻</span>
              <p className="text-[11px] font-semibold text-slate-300 mt-1">Integrated IDLE</p>
              <p className="text-[10px] text-slate-500">WebAssembly Pyodide</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-xl">📜</span>
              <p className="text-[11px] font-semibold text-slate-300 mt-1">Gold Certificate</p>
              <p className="text-[10px] text-slate-500">Official Credential</p>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 active:scale-[0.99] transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>Begin Enterprise Learning Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
