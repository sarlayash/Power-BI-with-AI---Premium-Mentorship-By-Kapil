// Persistent Learner State Management with LocalStorage

const STORAGE_KEY = "ai_launchpad_learner_profile_v1";

export const DEFAULT_LEARNER = {
  name: "",
  role: "Enterprise AI & Agentic Systems Architect",
  avatar: "🚀",
  company: "Fortune 500 Enterprise AI Center of Excellence",
  joinedAt: null,
  xp: 150,
  streak: 1,
  lastActiveDate: new Date().toISOString().split("T")[0],
  completedModules: [1], // First module ready
  unlockedBadges: ["badge-python-vanguard"], // starter achievement
  mockTestHistory: [],
  wheelSpinsCount: 0,
  dailySpinClaimed: false,
  codeExecutionsCount: 0,
  isLoggedIn: false,
};

export function getLearnerProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LEARNER;
    const parsed = JSON.parse(raw);
    
    // Check if daily streak needs updating
    const today = new Date().toISOString().split("T")[0];
    if (parsed.lastActiveDate !== today) {
      // Check if last active was yesterday
      const last = new Date(parsed.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        parsed.streak = (parsed.streak || 1) + 1;
      } else if (diffDays > 1) {
        parsed.streak = 1;
      }
      parsed.lastActiveDate = today;
      parsed.dailySpinClaimed = false; // Reset daily spin for new day
      saveLearnerProfile(parsed);
    }
    
    return { ...DEFAULT_LEARNER, ...parsed };
  } catch (err) {
    console.error("Failed to load learner profile from storage", err);
    return DEFAULT_LEARNER;
  }
}

export function saveLearnerProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save learner profile", err);
  }
}

export function addXP(points, reason = "") {
  const profile = getLearnerProfile();
  profile.xp = (profile.xp || 0) + points;
  saveLearnerProfile(profile);
  return profile;
}

export function completeModule(moduleId) {
  const profile = getLearnerProfile();
  if (!profile.completedModules.includes(moduleId)) {
    profile.completedModules.push(moduleId);
    profile.xp = (profile.xp || 0) + 100; // 100 XP per module completed
    
    // Check module-related badges
    if (profile.completedModules.includes(1) && 
        profile.completedModules.includes(2) && 
        profile.completedModules.includes(3) && 
        profile.completedModules.includes(4) && 
        !profile.unlockedBadges.includes("badge-python-vanguard")) {
      profile.unlockedBadges.push("badge-python-vanguard");
    }
    if (profile.completedModules.includes(5) && !profile.unlockedBadges.includes("badge-fastapi-architect")) {
      profile.unlockedBadges.push("badge-fastapi-architect");
    }
    if (profile.completedModules.includes(7) && !profile.unlockedBadges.includes("badge-genai-pioneer")) {
      profile.unlockedBadges.push("badge-genai-pioneer");
    }
    if (profile.completedModules.includes(9) && !profile.unlockedBadges.includes("badge-oss-llm-master")) {
      profile.unlockedBadges.push("badge-oss-llm-master");
    }
    if (profile.completedModules.includes(11) && !profile.unlockedBadges.includes("badge-langchain-orchestrator")) {
      profile.unlockedBadges.push("badge-langchain-orchestrator");
    }
    if (profile.completedModules.includes(13) && !profile.unlockedBadges.includes("badge-langgraph-general")) {
      profile.unlockedBadges.push("badge-langgraph-general");
    }
    if (profile.completedModules.includes(14) && !profile.unlockedBadges.includes("badge-azure-rag-champion")) {
      profile.unlockedBadges.push("badge-azure-rag-champion");
    }
    if (profile.completedModules.includes(15) && !profile.unlockedBadges.includes("badge-capstone-legend")) {
      profile.unlockedBadges.push("badge-capstone-legend");
    }
    
    saveLearnerProfile(profile);
  }
  return profile;
}

export function unlockBadge(badgeId) {
  const profile = getLearnerProfile();
  if (!profile.unlockedBadges.includes(badgeId)) {
    profile.unlockedBadges.push(badgeId);
    profile.xp = (profile.xp || 0) + 150;
    saveLearnerProfile(profile);
  }
  return profile;
}

export function recordCodeExecution() {
  const profile = getLearnerProfile();
  profile.codeExecutionsCount = (profile.codeExecutionsCount || 0) + 1;
  profile.xp = (profile.xp || 0) + 10;
  if (profile.codeExecutionsCount >= 10 && !profile.unlockedBadges.includes("badge-idle-ninja")) {
    profile.unlockedBadges.push("badge-idle-ninja");
  }
  saveLearnerProfile(profile);
  return profile;
}
