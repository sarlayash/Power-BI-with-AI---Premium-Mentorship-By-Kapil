import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LearnerOnboarding from "./components/LearnerOnboarding";
import CurriculumView from "./components/CurriculumView";
import IntegratedIdle from "./components/IntegratedIdle";
import SpinningWheel from "./components/SpinningWheel";
import MockTestEngine from "./components/MockTestEngine";
import BadgesView from "./components/BadgesView";
import CertificateView from "./components/CertificateView";
import CapstoneView from "./components/CapstoneView";
import {
  getLearnerProfile,
  saveLearnerProfile,
  addXP,
  completeModule,
  recordCodeExecution,
} from "./utils/storage";
import { COURSE_INFO } from "./data/curriculumData";
import { ShieldCheck, Sparkles, Crown, Zap, ArrowDown, BookOpen } from "lucide-react";

const HERO_IMAGE = `${import.meta.env.BASE_URL}ai_launchpad_1510.png`;

const FOUNDER_NOTE = `Welcome to AI Launchpad — a learning journey built on one belief: your starting point does not define your destination. Learn the fundamentals, practise consistently, build real projects, and grow from zero to infinity. Stay curious, stay ethical, and use technology to create meaningful value. I’m glad to be part of your journey.`;

export default function App() {
  const [learner, setLearner] = useState(() => {
    try {
      return getLearnerProfile();
    } catch (error) {
      console.error("Unable to read learner profile:", error);
      return {
        name: "",
        isLoggedIn: false,
        xp: 150,
        streak: 1,
        completedModules: [1],
        unlockedBadges: [],
        mockTestHistory: [],
        wheelSpinsCount: 0,
      };
    }
  });
  const [activeTab, setActiveTab] = useState("curriculum");
  const [codeForIdle, setCodeForIdle] = useState("");
  const [notification, setNotification] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 60 : 236;

  const showNotification = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(null), 3500);
  };

  const handleOnboardingComplete = (profileData) => {
    const updated = { ...learner, ...profileData, isLoggedIn: true };
    try {
      saveLearnerProfile(updated);
    } catch (error) {
      console.error("Unable to save learner profile:", error);
    }
    setLearner(updated);
    showNotification(`Welcome aboard, ${profileData.name}! +200 Welcome XP awarded. 🎉`);
  };

  const handleResetLearner = () => {
    const reset = { ...learner, isLoggedIn: false };
    try {
      saveLearnerProfile(reset);
    } catch (error) {
      console.error("Unable to save learner profile:", error);
    }
    setLearner(reset);
  };

  const handleCompleteModule = (moduleId) => {
    try {
      const updated = completeModule(moduleId);
      setLearner({ ...updated });
    } catch (error) {
      console.error("Unable to update module progress:", error);
      setLearner((current) => ({
        ...current,
        completedModules: [...new Set([...(current.completedModules || []), moduleId])],
        xp: (current.xp || 0) + 100,
      }));
    }
    showNotification(`🏆 Module ${moduleId} mastered! +100 XP awarded.`);
  };

  const handleAwardXP = (points, reason) => {
    try {
      setLearner({ ...addXP(points, reason) });
    } catch (error) {
      console.error("Unable to update XP:", error);
      setLearner((current) => ({ ...current, xp: (current.xp || 0) + points }));
    }
    showNotification(`⚡ +${points} XP earned: ${reason}`);
  };

  const handleRecordSpin = () => {
    const current = {
      ...learner,
      wheelSpinsCount: (learner.wheelSpinsCount || 0) + 1,
      unlockedBadges: [...(learner.unlockedBadges || [])],
    };
    if (
      current.wheelSpinsCount >= 3 &&
      !current.unlockedBadges.includes("badge-fortune-wheel-roller")
    ) {
      current.unlockedBadges.push("badge-fortune-wheel-roller");
      current.xp = (current.xp || 0) + 200;
      showNotification("🏆 Badge unlocked: Wheel of Fortune High Roller (+200 XP)!");
    }
    try {
      saveLearnerProfile(current);
    } catch (error) {
      console.error("Unable to save wheel progress:", error);
    }
    setLearner(current);
  };

  const handleRecordExamScore = (score) => {
    const current = {
      ...learner,
      unlockedBadges: [...(learner.unlockedBadges || [])],
      mockTestHistory: [
        ...(learner.mockTestHistory || []),
        { score, date: new Date().toISOString() },
      ],
    };
    if (score === 100 && !current.unlockedBadges.includes("badge-century-club")) {
      current.unlockedBadges.push("badge-century-club");
      current.xp = (current.xp || 0) + 400;
      showNotification("🎯 Century Club badge unlocked (+400 XP)!");
    }
    if (score >= 80 && !current.unlockedBadges.includes("badge-capstone-legend")) {
      current.unlockedBadges.push("badge-capstone-legend");
      current.xp = (current.xp || 0) + 1000;
      showNotification("🏆 Capstone Legend badge unlocked (+1,000 XP)!");
    }
    try {
      saveLearnerProfile(current);
    } catch (error) {
      console.error("Unable to save test results:", error);
    }
    setLearner(current);
  };

  const handleLoadIntoIdle = (codeSnippet) => {
    setCodeForIdle(codeSnippet);
    setActiveTab("idle");
    showNotification("💻 Code loaded into IDLE Studio. Press Run Code to execute.");
  };

  const handleCodeExecuted = () => {
    try {
      setLearner({ ...recordCodeExecution() });
    } catch (error) {
      console.error("Unable to save code execution:", error);
    }
  };

  if (!learner.isLoggedIn || !learner.name) {
    return <LearnerOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      {notification && (
        <div
          className="toast-gold fixed bottom-6 right-6 z-[999] flex items-center gap-3 rounded-2xl px-5 py-3 print:hidden"
          style={{ animation: "slideUp 0.25s ease" }}
          role="status"
          aria-live="polite"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs font-bold text-amber-100">{notification}</p>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        learner={learner}
        onResetLearner={handleResetLearner}
        onSidebarCollapse={setSidebarCollapsed}
      />

      <main
        className="flex min-h-screen flex-col"
        style={{
          marginTop: 56,
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === "curriculum" && (
            <>
              <section className="relative mb-10 overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#171109] via-[#080808] to-black p-5 shadow-2xl sm:p-8 lg:p-10">
                <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:gap-12">
                  <div className="order-2 text-center md:order-1 md:text-left">
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      AI Launchpad Academy
                    </span>

                    <h1 className="mt-6 font-serif text-4xl font-black leading-tight text-white sm:text-5xl">
                      AI Launchpad
                      <span className="mt-2 block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                        Zero to Infinity
                      </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base md:mx-0">
                      Learn by building. Practise with purpose. Turn curiosity into capability.
                    </p>

                    <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.25em] text-amber-300">
                      Powered By Kapil
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("founder-note")?.scrollIntoView({
                          behavior: "smooth",
                        })
                      }
                      className="mt-7 rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-black transition hover:bg-amber-300"
                    >
                      Read Founder Note ↓
                    </button>
                  </div>

                  <div className="order-1 mx-auto w-full max-w-[360px] md:order-2 md:max-w-[420px]">
                    <div className="overflow-hidden rounded-2xl border border-amber-400/50 bg-black p-1 shadow-[0_0_35px_rgba(245,158,11,0.15)]">
                      <img
                        src={HERO_IMAGE}
                        alt="AI Launchpad — Zero To Infinity — Powered By Kapil"
                        className="block h-auto w-full rounded-xl object-contain"
                        fetchPriority="high"
                        onError={(event) => {
                          console.error("AI Launchpad greeting card failed to load:", HERO_IMAGE);
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                      A greeting from Kapil
                    </p>
                  </div>
                </div>
              </section>

              <section
                id="founder-note"
                className="relative mb-10 overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#17130a] via-[#0d0d0d] to-black p-6 shadow-xl sm:p-10"
              >
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="relative z-10 grid gap-8 md:grid-cols-[auto,1fr] md:items-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10 text-amber-300">
                    <Crown className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
                      A personal message
                    </p>
                    <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
                      Founder Note by Kapil
                    </h2>
                    <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                      {FOUNDER_NOTE}
                    </p>
                    <div className="mt-6 border-l-2 border-amber-400 pl-4">
                      <p className="font-serif text-2xl font-bold italic text-amber-300">
                        Kapil
                      </p>
                      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.18em] text-white sm:text-sm">
                        Knowledge MultiVerse Architect
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                        Powered By Kapil
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Your Zero-to-Infinity Journey</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Continue your modules, practise in IDLE Studio, test your knowledge, and earn badges.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <BookOpen className="h-4 w-4" />
                  {COURSE_INFO.batch}
                </div>
              </section>

              <CurriculumView
                learner={learner}
                onCompleteModule={handleCompleteModule}
                onLoadIntoIdle={handleLoadIntoIdle}
              />
            </>
          )}

          {activeTab === "idle" && (
            <IntegratedIdle initialCode={codeForIdle} onCodeExecuted={handleCodeExecuted} />
          )}
          {activeTab === "wheel" && (
            <SpinningWheel learner={learner} onAwardXP={handleAwardXP} onRecordSpin={handleRecordSpin} />
          )}
          {activeTab === "mocktests" && (
            <MockTestEngine learner={learner} onAwardXP={handleAwardXP} onRecordExamScore={handleRecordExamScore} />
          )}
          {activeTab === "badges" && <BadgesView learner={learner} />}
          {activeTab === "certificate" && <CertificateView learner={learner} />}
          {activeTab === "capstone" && <CapstoneView onLoadIntoIdle={handleLoadIntoIdle} />}
        </div>

        <footer
          className="print:hidden mt-auto"
          style={{
            background: "linear-gradient(90deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
            borderTop: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          <div className="gold-divider" />
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-black"
                  style={{
                    background: "linear-gradient(135deg, #b45309, #f59e0b, #fde68a)",
                    color: "#0a0a0a",
                    boxShadow: "0 0 12px rgba(245,158,11,0.3)",
                  }}
                >
                  AI
                </div>
                <div>
                  <p className="text-xs font-bold text-[#f0f0f0]">
                    AI Launchpad Track • {COURSE_INFO.batch}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Zero to Infinity • Learn, build, and grow
                  </p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500" aria-label="Footer navigation">
                {[
                  ["curriculum", "Learning Modules"],
                  ["idle", "IDLE Studio"],
                  ["wheel", "Spin & Win"],
                  ["mocktests", "Mock Tests"],
                  ["badges", "Badges"],
                  ["certificate", "Certificate"],
                  ["capstone", "Capstone"],
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="transition-colors hover:text-amber-300"
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <div className="flex flex-col items-center gap-2 md:items-end">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-400" />
                  <span className="shimmer-gold text-xs font-black tracking-wide">
                    Powered By Kapil
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Learning • Practice • Progress</span>
                  <Zap className="ml-1 h-3 w-3 text-amber-400" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Knowledge MultiVerse Architect
                </span>
              </div>
            </div>

            <div
              className="mt-5 flex flex-col items-center justify-between gap-2 border-t pt-4 text-center text-[10px] font-medium sm:flex-row sm:text-left"
              style={{ borderColor: "rgba(245,158,11,0.08)", color: "#64748b" }}
            >
              <span>© {new Date().getFullYear()} AI Launchpad Academy</span>
              <span>Zero to Infinity • Powered By Kapil</span>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
