import React from "react";
import { FORTUNE_500_BADGES } from "../data/quizData";
import { 
  Award, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Flame,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { playBadgeUnlockSound } from "../utils/soundEffects";

export default function BadgesView({ learner }) {
  const unlockedIds = learner.unlockedBadges || [];
  const totalBadges = FORTUNE_500_BADGES.length;
  const unlockedCount = unlockedIds.length;
  const totalBadgeXP = FORTUNE_500_BADGES
    .filter(b => unlockedIds.includes(b.id))
    .reduce((acc, b) => acc + b.xpAward, 0);

  const handleCelebrateBadge = (badge) => {
    playBadgeUnlockSound();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Fortune 500 Executive Credentials
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Learner: {learner.name || "Enterprise Fellow"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Achievement Tiers & Badges
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Each badge signifies industry-verified competency in building production AI systems according to Fortune 500 engineering standards.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Badges Unlocked</p>
              <p className="text-2xl font-black text-amber-400">{unlockedCount} / {totalBadges}</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Badge XP Earned</p>
              <p className="text-2xl font-black text-cyan-400">+{totalBadgeXP}</p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Overall Credential Completion</span>
            <span className="font-bold text-cyan-300">
              {Math.round((unlockedCount / totalBadges) * 100)}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 transition-all duration-700"
              style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FORTUNE_500_BADGES.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => isUnlocked && handleCelebrateBadge(badge)}
              className={`rounded-3xl border p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? "bg-slate-900 border-amber-500/30 hover:border-amber-400/60 shadow-xl shadow-amber-500/5 cursor-pointer hover:scale-[1.02]"
                  : "bg-slate-950/60 border-slate-800/80 opacity-75"
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.color} text-white shadow-amber-500/20`
                      : "bg-slate-800 text-slate-600 border border-slate-700"
                  }`}>
                    {badge.icon}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isUnlocked
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-slate-800 text-slate-500"
                  }`}>
                    {badge.tier}
                  </span>
                </div>

                <h3 className={`text-base font-extrabold ${isUnlocked ? "text-white" : "text-slate-400"}`}>
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Card Footer: Unlock Criteria & Status */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-medium">Requirement:</span>
                  <span className="font-bold text-cyan-300">+{badge.xpAward} XP</span>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  {badge.criteria}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Unlocked & Credentialed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </span>
                  )}

                  {isUnlocked && (
                    <span className="text-[10px] font-semibold text-amber-400 hover:underline">
                      Tap to celebrate 🎉
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
