import React, { useState } from "react";
import { 
  MODULES_DATA, 
  COURSE_INFO 
} from "../data/curriculumData";
import { 
  CheckCircle2, 
  Play, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  BookOpen, 
  Code2, 
  Lightbulb, 
  ChevronRight, 
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { playSuccessChime } from "../utils/soundEffects";

export default function CurriculumView({ 
  learner, 
  onCompleteModule, 
  onLoadIntoIdle 
}) {
  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);
  const [activeSubtopicTab, setActiveSubtopicTab] = useState(0);

  const selectedModule = MODULES_DATA.find((m) => m.id === selectedModuleId) || MODULES_DATA[0];
  const isCompleted = learner.completedModules?.includes(selectedModule.id);

  // Filter modules based on search
  const filteredModules = MODULES_DATA.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.day.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.subtopics.some(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    );
  });

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleComplete = () => {
    onCompleteModule(selectedModule.id);
    playSuccessChime();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-500/20 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                {COURSE_INFO.batch}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {COURSE_INFO.duration}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise AI Launchpad Curriculum
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Zero to Infinity comprehensive study notes, mental models, annotated examples, solved solutions, and runnable IDLE code for all 14 modules + Capstone.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-3 rounded-2xl">
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Track Mastery</p>
              <p className="text-lg font-black text-cyan-400">
                {learner.completedModules?.length || 0} / {MODULES_DATA.length} Modules
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-400 flex items-center justify-center font-bold text-xs text-white">
              {Math.round(((learner.completedModules?.length || 0) / MODULES_DATA.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigator + Module Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Modules List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, FastAPI, LangGraph..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Module List Scroll Area */}
          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredModules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              const isDone = learner.completedModules?.includes(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setActiveSubtopicTab(0);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10"
                      : "bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? "bg-blue-500 text-white" : "bg-slate-800 text-cyan-400"
                      }`}>
                        {mod.day}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {mod.duration}
                      </span>
                      {isDone && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/20" />
                      )}
                    </div>
                    <h3 className={`text-xs font-bold truncate ${
                      isSelected ? "text-cyan-300" : "text-white"
                    }`}>
                      {mod.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {mod.category}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-2 transition-transform ${
                    isSelected ? "text-cyan-400 translate-x-1" : "text-slate-600"
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Pane: Module Details, Notes, and Solved Labs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {selectedModule.day} • {selectedModule.duration}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300">
                  {selectedModule.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed & Verified
                  </span>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Mark as Mastered (+100 XP)</span>
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-4">
              {selectedModule.title}
            </h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              {selectedModule.summary}
            </p>

            {/* Enterprise Relevance Box */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Fortune 500 Enterprise Relevance
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedModule.enterpriseContext}
                </p>
              </div>
            </div>
          </div>

          {/* Subtopics Tabs & Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white">
                  Topic Notes & Mental Models
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {selectedModule.subtopics.length} Subtopics
              </span>
            </div>

            {/* Subtopic Tab Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {selectedModule.subtopics.map((sub, idx) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubtopicTab(idx)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeSubtopicTab === idx
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  Step {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Subtopic Content */}
            {selectedModule.subtopics[activeSubtopicTab] && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-sm font-bold text-cyan-300">
                    {selectedModule.subtopics[activeSubtopicTab].title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedModule.subtopics[activeSubtopicTab].description}
                  </p>
                </div>

                {/* Notes Bullet Points */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    Key Concepts & Architectural Rules:
                  </h5>
                  <ul className="space-y-2">
                    {selectedModule.subtopics[activeSubtopicTab].notes.map((note, nIdx) => (
                      <li key={nIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-slate-800/20 p-2.5 rounded-xl border border-slate-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Annotated Code Snippet */}
                {selectedModule.subtopics[activeSubtopicTab].codeSnippet && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-blue-400" />
                        Interactive Code Example
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCode(selectedModule.subtopics[activeSubtopicTab].codeSnippet, selectedModule.subtopics[activeSubtopicTab].id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white transition-all"
                        >
                          {copiedSnippetId === selectedModule.subtopics[activeSubtopicTab].id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onLoadIntoIdle(selectedModule.subtopics[activeSubtopicTab].codeSnippet)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-sm transition-all"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Run in IDLE</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
                      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>python_snippet.py</span>
                        <span className="text-emerald-400 font-semibold">Ready to execute</span>
                      </div>
                      <pre className="p-4 text-slate-200 overflow-x-auto leading-relaxed">
                        <code>{selectedModule.subtopics[activeSubtopicTab].codeSnippet}</code>
                      </pre>
                      {selectedModule.subtopics[activeSubtopicTab].output && (
                        <div className="bg-slate-900/90 border-t border-slate-800 p-3">
                          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Standard Output:</p>
                          <pre className="text-cyan-400 text-xs overflow-x-auto">
                            <code>{selectedModule.subtopics[activeSubtopicTab].output}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Solved Hands-on Use Case Lab */}
          {selectedModule.handsOnUseCase && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                    🚀
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                      Day Hands-on Production Lab
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      {selectedModule.handsOnUseCase.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onLoadIntoIdle(selectedModule.handsOnUseCase.solutionCode)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Execute Solved Lab in IDLE</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedModule.handsOnUseCase.description}
              </p>

              {/* Lab Code Display */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    production_solution.py
                  </span>
                  <button
                    onClick={() => handleCopyCode(selectedModule.handsOnUseCase.solutionCode, "lab-solution")}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedSnippetId === "lab-solution" ? (
                      <span className="text-emerald-400">Copied!</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-emerald-300/90 overflow-x-auto max-h-96 leading-relaxed">
                  <code>{selectedModule.handsOnUseCase.solutionCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
