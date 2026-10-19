import React, { useState } from "react";
import { FORTUNE_500_BADGES } from "../data/quizData";
import {
  Award,
  Lock,
  CheckCircle2,
  Download,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { playBadgeUnlockSound } from "../utils/soundEffects";
import { downloadBadgePng } from "../utils/pngExporter";

export default function BadgesView({ learner = {} }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedId, setDownloadedId] = useState(null);

  const unlockedIds = learner.unlockedBadges || [];
  const totalBadges = FORTUNE_500_BADGES.length;
  const unlockedCount = unlockedIds.length;
  const totalBadgeXP = FORTUNE_500_BADGES.filter((b) =>
    unlockedIds.includes(b.id)
  ).reduce((acc, b) => acc + b.xpAward, 0);

  const learnerName = learner?.name?.trim() || "Distinguished Learner";
  const issueDate = learner?.joinedAt
    ? new Date(learner.joinedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const handleCelebrateBadge = () => {
    try {
      playBadgeUnlockSound();
    } catch {}
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const handleDownloadBadgePng = async (e, badge, isUnlocked) => {
    e.stopPropagation();
    if (downloadingId) return;
    setDownloadingId(badge.id);
    try {
      await downloadBadgePng({
        badge,
        learnerName,
        issueDate,
        isUnlocked,
      });
      setDownloadedId(badge.id);
      handleCelebrateBadge();
      window.setTimeout(() => {
        setDownloadedId((current) => (current === badge.id ? null : current));
      }, 2500);
    } catch (error) {
      console.error("Badge PNG export failed:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="elite-card p-6 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                PNG Collectible Credentials
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Learner: {learnerName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Achievement Tiers &amp; Badges
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Every badge is exportable in high-resolution{" "}
              <strong className="text-amber-300">PNG format</strong> (1440×1720px)
              signed by{" "}
              <strong className="text-amber-300">
                Kapil | Founder and Knowledge Multiverse Architect
              </strong>{" "}
              with clean borders and typography.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 bg-neutral-950/90 border border-amber-500/25 px-5 py-4 rounded-2xl shrink-0">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Badges Unlocked
              </p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">
                {unlockedCount} / {totalBadges}
              </p>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Badge XP Earned
              </p>
              <p className="text-2xl font-black text-amber-200 mt-0.5">
                +{totalBadgeXP}
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Overall Credential Completion</span>
            <span className="font-bold text-amber-300">
              {Math.round((unlockedCount / totalBadges) * 100)}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-neutral-900 border border-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-700"
              style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FORTUNE_500_BADGES.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id);
          const isBusy = downloadingId === badge.id;
          const isDone = downloadedId === badge.id;

          return (
            <div
              key={badge.id}
              onClick={() => isUnlocked && handleCelebrateBadge()}
              className={`rounded-3xl p-6 transition-all relative flex flex-col justify-between ${
                isUnlocked
                  ? "bg-neutral-900 border-2 border-amber-500/45 hover:border-amber-400 shadow-xl cursor-pointer"
                  : "bg-neutral-950/90 border border-zinc-800/90 hover:border-amber-500/30"
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0 ${
                      isUnlocked
                        ? `bg-gradient-to-tr ${badge.color} text-white`
                        : "bg-neutral-900 text-zinc-400 border border-amber-500/25"
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      isUnlocked
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-neutral-900 text-zinc-400 border border-zinc-800"
                    }`}
                  >
                    {badge.tier}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white leading-snug">
                  {badge.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Card Footer: Unlock Criteria, Status & PNG Download */}
              <div className="mt-6 pt-4 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px] font-medium">
                    Reward:
                  </span>
                  <span className="font-bold text-amber-300">
                    +{badge.xpAward} XP
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-normal">
                  {badge.criteria}
                </p>

                <div className="pt-2 flex items-center justify-between gap-2">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>In Progress</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleDownloadBadgePng(e, badge, isUnlocked)}
                    disabled={isBusy}
                    className="btn-gold inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-extrabold text-neutral-950 cursor-pointer disabled:opacity-60"
                  >
                    {isDone ? (
                      <Check className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                    )}
                    <span>
                      {isBusy
                        ? "Saving..."
                        : isDone
                        ? "Saved PNG"
                        : "Download PNG"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
