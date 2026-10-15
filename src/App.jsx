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
  recordCodeExecution
} from "./utils/storage";
import { COURSE_INFO } from "./data/curriculumData";
import { ShieldCheck, Sparkles, Crown, Zap } from "lucide-react";

export default function App() {
  const [learner, setLearner] = useState(() => {
    try {
      return getLearnerProfile();
    } catch (error) {
      console.error("Unable to read learner profile:", error);
      return { name: "", isLoggedIn: false, xp: 150, streak: 1, completedModules: [1], unlockedBadges: [], mockTestHistory: [], wheelSpinsCount: 0 };
    }
  });
  const [activeTab, setActiveTab] = useState("curriculum");
  const [codeForIdle, setCodeForIdle] = useState("");
  const [notification, setNotification] = useState(null);
  /* sidebar width — synced with Navbar's collapsed state via localStorage or prop */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 60 : 236;

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOnboardingComplete = (profileData) => {
    const updated = { ...learner, ...profileData, isLoggedIn: true };
    try { saveLearnerProfile(updated); } catch (error) { console.error("Unable to save learner profile:", error); }
    setLearner(updated);
    showNotification(`Welcome aboard, ${profileData.name}! +200 Welcome XP awarded. 🎉`);
  };

  const handleResetLearner = () => {
    const reset = { ...learner, isLoggedIn: false };
    try { saveLearnerProfile(reset); } catch (error) { console.error("Unable to save learner profile:", error); }
    setLearner(reset);
  };

  const handleCompleteModule = (moduleId) => {
    try {
      const updated = completeModule(moduleId);
      setLearner({ ...updated });
    } catch (error) {
      console.error("Unable to update module progress:", error);
      setLearner((current) => ({ ...current, completedModules: [...new Set([...(current.completedModules || []), moduleId])], xp: (current.xp || 0) + 100 }));
    }
    showNotification(`🏆 Module ${moduleId} Mastered! +100 XP awarded.`);
  };

  const handleAwardXP = (points, reason) => {
    try { setLearner({ ...addXP(points, reason) }); }
    catch (error) { console.error("Unable to update XP:", error); setLearner((current) => ({ ...current, xp: (current.xp || 0) + points })); }
    showNotification(`⚡ +${points} XP Earned: ${reason}`);
  };

  const handleRecordSpin = () => {
    const current = { ...learner, wheelSpinsCount: (learner.wheelSpinsCount || 0) + 1, unlockedBadges: [...(learner.unlockedBadges || [])] };
    if (current.wheelSpinsCount >= 3 && !current.unlockedBadges.includes("badge-fortune-wheel-roller")) {
      current.unlockedBadges.push("badge-fortune-wheel-roller");
      current.xp = (current.xp || 0) + 200;
      showNotification("🏆 Badge Unlocked: Wheel of Fortune High Roller (+200 XP)!");
    }
    try { saveLearnerProfile(current); } catch (error) { console.error("Unable to save wheel progress:", error); }
    setLearner(current);
  };

  const handleRecordExamScore = (score) => {
    const current = { ...learner, unlockedBadges: [...(learner.unlockedBadges || [])], mockTestHistory: [...(learner.mockTestHistory || []), { score, date: new Date().toISOString() }] };
    if (score === 100 && !current.unlockedBadges.includes("badge-century-club")) {
      current.unlockedBadges.push("badge-century-club");
      current.xp = (current.xp || 0) + 400;
      showNotification("🎯 Century Club Badge Unlocked (100% Score) +400 XP!");
    }
    if (score >= 80 && !current.unlockedBadges.includes("badge-capstone-legend")) {
      current.unlockedBadges.push("badge-capstone-legend");
      current.xp = (current.xp || 0) + 1000;
      showNotification("🏆 Capstone Legend Badge Unlocked! +1,000 XP!");
    }
    try { saveLearnerProfile(current); } catch (error) { console.error("Unable to save test results:", error); }
    setLearner(current);
  };

  const handleLoadIntoIdle = (codeSnippet) => {
    setCodeForIdle(codeSnippet);
    setActiveTab("idle");
    showNotification("💻 Code loaded into IDLE Studio. Press 'Run Code' to execute!");
  };

  const handleCodeExecuted = () => {
    try { setLearner({ ...recordCodeExecution() }); }
    catch (error) { console.error("Unable to save code execution:", error); }
  };

  if (!learner.isLoggedIn || !learner.name) {
    return <LearnerOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#f0f0f0" }}>
      {/* ─── Gold Notification Toast ─── */}
      {notification && (
        <div
          className="fixed bottom-6 right-6 z-[999] toast-gold px-5 py-3 rounded-2xl flex items-center gap-3 print:hidden"
          style={{ animation: "slideUp 0.25s ease" }}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: "#f59e0b" }} />
          <p className="text-xs font-bold" style={{ color: "#fde68a" }}>{notification}</p>
        </div>
      )}

      {/* ─── Header + Sidebar (Navbar) ─── */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        learner={learner}
        onResetLearner={handleResetLearner}
      />

      {/* ─── Main Content Area — offset for header (56px) + sidebar ─── */}
      <main
        className="min-h-screen flex flex-col"
        style={{
          marginTop: 56,
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="flex-1 p-6 lg:p-8">
          {activeTab === "curriculum"   && <CurriculumView  learner={learner} onCompleteModule={handleCompleteModule} onLoadIntoIdle={handleLoadIntoIdle} />}
          {activeTab === "idle"         && <IntegratedIdle  initialCode={codeForIdle} onCodeExecuted={handleCodeExecuted} />}
          {activeTab === "wheel"        && <SpinningWheel   learner={learner} onAwardXP={handleAwardXP} onRecordSpin={handleRecordSpin} />}
          {activeTab === "mocktests"    && <MockTestEngine  learner={learner} onAwardXP={handleAwardXP} onRecordExamScore={handleRecordExamScore} />}
          {activeTab === "badges"       && <BadgesView      learner={learner} />}
          {activeTab === "certificate"  && <CertificateView learner={learner} />}
          {activeTab === "capstone"     && <CapstoneView    onLoadIntoIdle={handleLoadIntoIdle} />}
        </div>

        {/* ─── ELITE FOOTER ─── */}
        <footer
          className="print:hidden mt-auto"
          style={{
            background: "linear-gradient(90deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
            borderTop: "1px solid rgba(245,158,11,0.15)",
          }}
        >
          {/* Gold divider accent */}
          <div className="gold-divider" />

          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Left — Brand */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
                  style={{
                    background: "linear-gradient(135deg, #b45309, #f59e0b, #fde68a)",
                    color: "#0a0a0a",
                    boxShadow: "0 0 12px rgba(245,158,11,0.3)",
                  }}
                >
                  AI
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#f0f0f0" }}>
                    AI Launchpad Track • {COURSE_INFO.batch}
                  </p>
                  <p className="text-[11px]" style={{ color: "#3a3a3a" }}>
                    Zero to Infinity Enterprise Academy • Fortune 500 Standards
                  </p>
                </div>
              </div>

              {/* Centre — Quick Nav */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold" style={{ color: "#4a4a4a" }}>
                {[
                  ["curriculum",  "14 Modules"],
                  ["idle",        "IDLE Studio"],
                  ["wheel",       "Spin & Win"],
                  ["mocktests",   "Mock Tests"],
                  ["certificate", "Certificate"],
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="transition-colors hover:text-gold-solid"
                    style={{ color: "inherit" }}
                    onMouseEnter={(e) => (e.target.style.color = "#f59e0b")}
                    onMouseLeave={(e) => (e.target.style.color = "")}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Right — Powered By */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" style={{ color: "#f59e0b" }} />
                  <span className="text-xs font-black tracking-wide shimmer-gold">
                    Powered by Kapil
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "#3a3a3a" }}>
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                  <span>Enterprise Grade Verified</span>
                  <Zap className="w-3 h-3 ml-1" style={{ color: "#f59e0b" }} />
                  <span style={{ color: "#f59e0b" }}>Fortune 500 Standards</span>
                </div>
              </div>
            </div>

            {/* Bottom copyright strip */}
            <div
              className="mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-medium"
              style={{ borderTop: "1px solid rgba(245,158,11,0.08)", color: "#2e2e2e" }}
            >
              <span>© {new Date().getFullYear()} AI Launchpad Academy · All rights reserved</span>
              <span>BI V18 · Nov 27th Batch1 BLR · Enterprise Python AI Masterclass</span>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
