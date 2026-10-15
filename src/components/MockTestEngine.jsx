import React, { useState, useEffect } from "react";
import { MOCK_TEST_QUESTIONS } from "../data/quizData";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Award, 
  AlertCircle,
  HelpCircle,
  BarChart3,
  FileCheck2
} from "lucide-react";
import confetti from "canvas-confetti";
import { playSuccessChime, playBadgeUnlockSound } from "../utils/soundEffects";

export default function MockTestEngine({ learner, onAwardXP, onRecordExamScore }) {
  const [testState, setTestState] = useState("intro"); // 'intro' | 'active' | 'review'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: selectedOptionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800); // 30 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [examResults, setExamResults] = useState(null);

  const questions = MOCK_TEST_QUESTIONS;
  const currentQ = questions[currentIndex];

  // Timer logic
  useEffect(() => {
    let timer = null;
    if (testState === "active" && isTimerRunning && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testState, isTimerRunning, timeLeftSeconds]);

  const handleStartExam = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeftSeconds(1800);
    setCurrentIndex(0);
    setTestState("active");
    setIsTimerRunning(true);
  };

  const handleSelectOption = (optIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const toggleFlagQuestion = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleSubmitExam = () => {
    setIsTimerRunning(false);
    
    // Calculate results
    let correctCount = 0;
    const categoryStats = {};

    questions.forEach((q, idx) => {
      const isCorrect = userAnswers[idx] === q.correctIndex;
      if (isCorrect) correctCount++;

      const cat = q.category || "General";
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, correct: 0 };
      }
      categoryStats[cat].total += 1;
      if (isCorrect) categoryStats[cat].correct += 1;
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const isPassed = scorePercent >= 75;

    const results = {
      scorePercent,
      correctCount,
      totalQuestions: questions.length,
      isPassed,
      categoryStats,
      timeTakenSec: 1800 - timeLeftSeconds,
    };

    setExamResults(results);
    setTestState("review");

    // Award XP and badges
    const earnedXP = isPassed ? 350 : 100;
    onAwardXP(earnedXP, `Mock Assessment (${scorePercent}%)`);
    onRecordExamScore(scorePercent);

    if (isPassed) {
      playBadgeUnlockSound();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* State 1: Intro Screen */}
      {testState === "intro" && (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                Fortune 500 Assessment Center
              </span>
              <span className="text-xs text-slate-400 font-mono">
                BI V18 AI Launchpad Track
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Official 12-Day Certification Mock Assessment
            </h1>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Validate your full-spectrum mastery across Python Fundamentals, OOP, FastAPI, Generative AI, Prompt Engineering, Open-Source LLMs (Ollama), LangChain Orchestration, Multi-Agent Systems (LangGraph), Azure Cloud RAG, and Capstone Architectures.
            </p>
          </div>

          {/* Test Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Questions</p>
              <p className="text-2xl font-black text-cyan-400 mt-1">30</p>
              <p className="text-[10px] text-slate-500">Multiple Choice</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</p>
              <p className="text-2xl font-black text-amber-400 mt-1">30:00</p>
              <p className="text-[10px] text-slate-500">Minutes Timed</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Passing Score</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">75%</p>
              <p className="text-[10px] text-slate-500">23+ Correct Answers</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reward</p>
              <p className="text-2xl font-black text-yellow-400 mt-1">+350 XP</p>
              <p className="text-[10px] text-slate-500">Certificate Eligible</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Examination Rules & Standards:
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-slate-400">
              <li>Each question has exactly one correct answer. No negative marking is applied.</li>
              <li>You can flag questions to revisit before final submission using the navigation palette.</li>
              <li>Achieving 75% or higher unlocks official Fortune 500 Certificate verification!</li>
              <li>Detailed explanations for every option will be accessible immediately upon completion.</li>
            </ul>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-600/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5" />
            <span>Start 30-Minute Timed Mock Exam</span>
          </button>
        </div>
      )}

      {/* State 2: Active Exam Testing Interface */}
      {testState === "active" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Question Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              {/* Top Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentQ.category}
                  </span>
                </div>

                <button
                  onClick={toggleFlagQuestion}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    flaggedQuestions[currentIndex]
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentIndex] ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span>{flaggedQuestions[currentIndex] ? "Flagged" : "Flag for Review"}</span>
                </button>
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 text-cyan-200 shadow-md shadow-blue-500/10"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        isSelected ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Palette Column: Timer & Question Matrix */}
          <div className="lg:col-span-4 space-y-6">
            {/* Timer Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Time Remaining
              </span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1 flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 text-amber-400" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Auto-submits when timer expires
              </p>
            </div>

            {/* Question Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Question Palette
                </span>
                <span className="text-xs text-slate-400">
                  {Object.keys(userAnswers).length} / {questions.length} Answered
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {questions.map((_, qIdx) => {
                  const isCurrent = qIdx === currentIndex;
                  const isAnswered = userAnswers[qIdx] !== undefined;
                  const isFlagged = flaggedQuestions[qIdx];

                  let colorClass = "bg-slate-950 text-slate-400 border-slate-800";
                  if (isCurrent) {
                    colorClass = "bg-blue-600 text-white border-cyan-400 ring-2 ring-cyan-400/50";
                  } else if (isFlagged) {
                    colorClass = "bg-amber-500/20 text-amber-300 border-amber-500";
                  } else if (isAnswered) {
                    colorClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
                  }

                  return (
                    <button
                      key={qIdx}
                      onClick={() => setCurrentIndex(qIdx)}
                      className={`h-9 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${colorClass}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Flagged
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-700" /> Unvisited
                </span>
              </div>

              <button
                onClick={handleSubmitExam}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                Finish & Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Detailed Scorecard & Review Screen */}
      {testState === "review" && examResults && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Executive Scorecard Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    examResults.isPassed 
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  }`}>
                    {examResults.isPassed ? "CERTIFIED & PASSED" : "RETAKE RECOMMENDED"}
                  </span>
                  <span className="text-xs text-slate-400">
                    Duration: {Math.floor(examResults.timeTakenSec / 60)}m {examResults.timeTakenSec % 60}s
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  Assessment Score: {examResults.scorePercent}%
                </h1>
                <p className="text-slate-300 text-sm mt-2 max-w-xl">
                  {examResults.isPassed
                    ? `Congratulations ${learner.name || "Learner"}! You have successfully surpassed the Fortune 500 standard threshold (75%). Your Certificate of Completion is now eligible for official verification.`
                    : "You scored below the 75% threshold. Review the concept explanations below and retake to earn your official verified certificate."}
                </p>
              </div>

              {/* Big Score Visual Circle */}
              <div className="text-center p-6 bg-slate-950/80 border border-slate-800 rounded-3xl">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Score</p>
                <p className={`text-5xl font-black mt-1 ${examResults.isPassed ? "text-emerald-400" : "text-amber-400"}`}>
                  {examResults.correctCount} / {examResults.totalQuestions}
                </p>
                <p className="text-xs text-slate-400 mt-1">Questions Correct</p>
              </div>
            </div>

            {/* Category Performance Breakdown */}
            <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(examResults.categoryStats).map(([cat, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={cat} className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center">
                    <p className="text-[10px] font-bold text-slate-400 truncate" title={cat}>{cat}</p>
                    <p className={`text-base font-extrabold mt-1 ${pct >= 70 ? "text-cyan-400" : "text-rose-400"}`}>
                      {pct}%
                    </p>
                    <p className="text-[10px] text-slate-500">{stats.correct}/{stats.total}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStartExam}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Mock Exam</span>
              </button>
            </div>
          </div>

          {/* Detailed Question by Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              Complete Question Review & Concept Solutions
            </h3>

            {questions.map((q, idx) => {
              const userPick = userAnswers[idx];
              const isCorrect = userPick === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-3xl border bg-slate-900 transition-all ${
                    isCorrect ? "border-emerald-500/30" : "border-rose-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="font-bold text-slate-300">
                      Question {idx + 1} • <span className="text-slate-400 font-normal">{q.category}</span>
                    </span>
                    <span className={`flex items-center gap-1 font-bold ${
                      isCorrect ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white mt-3 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="space-y-2 mt-4">
                    {q.options.map((opt, optIdx) => {
                      let style = "bg-slate-950/60 border-slate-800 text-slate-400";
                      if (optIdx === q.correctIndex) {
                        style = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold";
                      } else if (optIdx === userPick) {
                        style = "bg-rose-950/40 border-rose-500 text-rose-200 line-through";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${style}`}>
                          <span>
                            <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </span>
                          {optIdx === q.correctIndex && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Solved Explanation */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <p className="font-bold text-cyan-300 uppercase tracking-wider text-[10px]">
                      Concept Breakdown & Rationale:
                    </p>
                    <p className="leading-relaxed text-slate-300">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
