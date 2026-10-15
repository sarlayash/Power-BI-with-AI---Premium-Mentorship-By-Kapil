import React, { useState, useEffect } from "react";
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
  unlockBadge, 
  recordCodeExecution 
} from "./utils/storage";
import { COURSE_INFO } from "./data/curriculumData";
import { ShieldCheck, Sparkles, Terminal, BookOpen, GraduationCap } from "lucide-react";

export default function App() {
  const [learner, setLearner] = useState(getLearnerProfile());
  const [activeTab, setActiveTab] = useState("curriculum");
  const [codeForIdle, setCodeForIdle] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOnboardingComplete = (profileData) => {
    const updated = { ...learner, ...profileData, isLoggedIn: true };
    saveLearnerProfile(updated);
    setLearner(updated);
    showNotification(`Welcome aboard, ${profileData.name}! +200 Welcome XP awarded.`);
  };

  const handleResetLearner = () => {
    const reset = { ...learner, isLoggedIn: false };
    saveLearnerProfile(reset);
    setLearner(reset);
  };

  const handleCompleteModule = (moduleId) => {
    const updated = completeModule(moduleId);
    setLearner({ ...updated });
    showNotification(`Module ${moduleId} Mastered! +100 XP awarded.`);
  };

  const handleAwardXP = (points, reason) => {
    const updated = addXP(points, reason);
    setLearner({ ...updated });
    showNotification(`+${points} XP Earned: ${reason}`);
  };

  const handleRecordSpin = () => {
    const current = getLearnerProfile();
    current.wheelSpinsCount = (current.wheelSpinsCount || 0) + 1;
    if (current.wheelSpinsCount >= 3 && !current.unlockedBadges.includes("badge-fortune-wheel-roller")) {
      current.unlockedBadges.push("badge-fortune-wheel-roller");
      current.xp = (current.xp || 0) + 200;
      showNotification("🏆 Badge Unlocked: Wheel of Fortune High Roller (+200 XP)!");
    }
    saveLearnerProfile(current);
    setLearner({ ...current });
  };

  const handleRecordExamScore = (score) => {
    const current = getLearnerProfile();
    if (!current.mockTestHistory) current.mockTestHistory = [];
    current.mockTestHistory.push({
      score,
      date: new Date().toISOString()
    });

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

    saveLearnerProfile(current);
    setLearner({ ...current });
  };

  const handleLoadIntoIdle = (codeSnippet) => {
    setCodeForIdle(codeSnippet);
    setActiveTab("idle");
    showNotification("Code loaded into IDLE Studio. Press 'Run Code' to execute!");
  };

  const handleCodeExecuted = () => {
    const updated = recordCodeExecution();
    setLearner({ ...updated });
  };

  // If learner has not entered name yet, render the onboarding gate
  if (!learner.isLoggedIn || !learner.name) {
    return <LearnerOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 animate-spin" />
          <p className="text-xs font-bold text-cyan-200">{notification}</p>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        learner={learner}
        onResetLearner={handleResetLearner}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === "curriculum" && (
          <CurriculumView
            learner={learner}
            onCompleteModule={handleCompleteModule}
            onLoadIntoIdle={handleLoadIntoIdle}
          />
        )}

        {activeTab === "idle" && (
          <IntegratedIdle
            initialCode={codeForIdle}
            onCodeExecuted={handleCodeExecuted}
          />
        )}

        {activeTab === "wheel" && (
          <SpinningWheel
            learner={learner}
            onAwardXP={handleAwardXP}
            onRecordSpin={handleRecordSpin}
          />
        )}

        {activeTab === "mocktests" && (
          <MockTestEngine
            learner={learner}
            onAwardXP={handleAwardXP}
            onRecordExamScore={handleRecordExamScore}
          />
        )}

        {activeTab === "badges" && (
          <BadgesView learner={learner} />
        )}

        {activeTab === "certificate" && (
          <CertificateView learner={learner} />
        )}

        {activeTab === "capstone" && (
          <CapstoneView onLoadIntoIdle={handleLoadIntoIdle} />
        )}
      </main>

      {/* Enterprise Standard Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  AI Launchpad Track • {COURSE_INFO.batch}
                </p>
                <p className="text-[11px] text-slate-500">
                  Zero to Infinity Enterprise Academy • Fortune 500 Standards
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <button 
                onClick={() => setActiveTab("curriculum")} 
                className="hover:text-cyan-400 transition-colors"
              >
                14 Modules
              </button>
              <button 
                onClick={() => setActiveTab("idle")} 
                className="hover:text-cyan-400 transition-colors"
              >
                Integrated IDLE
              </button>
              <button 
                onClick={() => setActiveTab("wheel")} 
                className="hover:text-cyan-400 transition-colors"
              >
                Spinning Wheel
              </button>
              <button 
                onClick={() => setActiveTab("mocktests")} 
                className="hover:text-cyan-400 transition-colors"
              >
                Certification Exam
              </button>
              <button 
                onClick={() => setActiveTab("certificate")} 
                className="hover:text-cyan-400 transition-colors"
              >
                Gold Certificate
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise Grade Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
