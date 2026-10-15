import React, { useState } from "react";
import { Sparkles, ShieldCheck, ArrowRight, User, Briefcase, Crown, Star, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { playSuccessChime } from "../utils/soundEffects";

const AVATARS = ["🚀", "🤖", "🧠", "⚡", "💎", "🛡️", "🔮", "🎯"];

const ROLES = [
  "Enterprise AI & Agentic Systems Architect",
  "Principal Generative AI Engineer",
  "BI & Power Platform AI Specialist",
  "Full-Stack LLM & FastAPI Developer",
  "Azure Cloud AI Solutions Architect",
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
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#fde68a", "#d97706", "#ffffff"],
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
      xp: 200,
    };

    onComplete(profileData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* ─── Background Gold Glows ─── */}
      <div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(180,83,9,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-10 right-1/3 w-64 h-64 rounded-full blur-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(253,230,138,0.05) 0%, transparent 70%)" }}
      />

      {/* ─── Card ─── */}
      <div
        className="max-w-2xl w-full rounded-3xl p-8 md:p-12 relative z-10"
        style={{
          background: "linear-gradient(135deg, #111 0%, #181818 100%)",
          border: "1px solid rgba(245,158,11,0.25)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(245,158,11,0.08), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Gold top accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, #f59e0b, #fde68a, #f59e0b, transparent)" }}
        />

        {/* ─── Header Badges ─── */}
        <div className="flex items-center justify-between mb-7">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b",
            }}
          >
            <Crown className="w-3.5 h-3.5" />
            Fortune 500 Enterprise Launchpad
          </div>
          <div
            className="text-xs font-bold font-mono"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#d97706",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            BI V18 · Nov 27th BLR
          </div>
        </div>

        {/* ─── Title ─── */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "#f0f0f0" }}>
          AI Launchpad:{" "}
          <span className="shimmer-gold">Zero to Infinity</span>
        </h1>
        <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: "#8a8a8a" }}>
          Welcome to the enterprise standard masterclass in Python, FastAPI, Generative AI, Prompt Engineering,
          Open-Source LLMs, LangChain, LangGraph Multi-Agent Systems, and Azure AI Cloud RAG.
        </p>

        {/* ─── Form ─── */}
        <form onSubmit={handleStart} className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: "#c4c4c4" }}
            >
              Learner Full Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className="relative">
              <User
                className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "#4a4a4a" }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
                placeholder="e.g. Alex Morgan, Senior AI Architect"
                className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-opacity-40 font-medium text-base transition-all outline-none"
                style={{
                  background: "#1f1f1f",
                  border: error ? "1px solid #ef4444" : "1px solid rgba(245,158,11,0.2)",
                  color: "#f0f0f0",
                }}
                onFocus={(e) => (e.target.style.border = "1px solid rgba(245,158,11,0.6)")}
                onBlur={(e) => (e.target.style.border = error ? "1px solid #ef4444" : "1px solid rgba(245,158,11,0.2)")}
                autoFocus
              />
            </div>
            {error && <p className="text-xs mt-1.5 font-medium" style={{ color: "#ef4444" }}>{error}</p>}
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#c4c4c4" }}>
              Choose Your Executive Avatar
            </label>
            <div className="flex flex-wrap gap-2.5">
              {AVATARS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAvatar(item)}
                  className="w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: avatar === item ? "rgba(245,158,11,0.15)" : "#1f1f1f",
                    border: avatar === item ? "2px solid #f59e0b" : "1px solid rgba(255,255,255,0.06)",
                    transform: avatar === item ? "scale(1.12)" : "scale(1)",
                    boxShadow: avatar === item ? "0 0 12px rgba(245,158,11,0.3)" : "none",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#c4c4c4" }}>
              Target Enterprise Specialization
            </label>
            <div className="relative">
              <Briefcase className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#4a4a4a" }} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl font-medium appearance-none cursor-pointer outline-none transition-all"
                style={{
                  background: "#1f1f1f",
                  border: "1px solid rgba(245,158,11,0.2)",
                  color: "#f0f0f0",
                }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} style={{ background: "#111", color: "#f0f0f0" }}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#c4c4c4" }}>
              Organization / Department
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Fortune 500 Enterprise AI Center of Excellence"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#1f1f1f",
                border: "1px solid rgba(245,158,11,0.15)",
                color: "#f0f0f0",
              }}
            />
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { icon: "🏆", title: "Fortune 500",    sub: "Verified Standards" },
              { icon: "💻", title: "Python IDLE",     sub: "WebAssembly Pyodide" },
              { icon: "📜", title: "Gold Certificate", sub: "Official Credential" },
            ].map(({ icon, title, sub }) => (
              <div
                key={title}
                className="p-3 rounded-xl text-center"
                style={{
                  background: "rgba(245,158,11,0.04)",
                  border: "1px solid rgba(245,158,11,0.12)",
                }}
              >
                <span className="text-xl">{icon}</span>
                <p className="text-[11px] font-bold mt-1" style={{ color: "#c4c4c4" }}>{title}</p>
                <p className="text-[10px]" style={{ color: "#3a3a3a" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-gold w-full py-4 px-6 rounded-xl text-base flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Sparkles className="w-5 h-5" style={{ color: "#0a0a0a" }} />
            <span>Begin Enterprise Learning Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: "#0a0a0a" }} />
          </button>

          {/* Powered by */}
          <p className="text-center text-[11px] font-semibold" style={{ color: "#2e2e2e" }}>
            <Crown className="w-3 h-3 inline mr-1" style={{ color: "#f59e0b" }} />
            Powered by <span style={{ color: "#f59e0b" }}>Kapil</span> · AI Launchpad Academy · Fortune 500 Standards
          </p>
        </form>
      </div>
    </div>
  );
}
