import React, { useState, useRef } from "react";
import { WHEEL_SLICES } from "../data/quizData";
import { 
  Sparkles, 
  RotateCw, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame, 
  Trophy,
  Award,
  Clock
} from "lucide-react";
import confetti from "canvas-confetti";
import { playTickSound, playSuccessChime } from "../utils/soundEffects";

export default function SpinningWheel({ learner, onAwardXP, onRecordSpin }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizScoreFeedback, setQuizScoreFeedback] = useState(null);

  const numSlices = WHEEL_SLICES.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedSlice(null);
    setShowQuizModal(false);
    setSelectedOption(null);
    setHasAnswered(false);
    setQuizScoreFeedback(null);

    // Randomize winning slice
    const winningIndex = Math.floor(Math.random() * numSlices);
    const targetSlice = WHEEL_SLICES[winningIndex];

    // Compute rotation: add 5-8 full spins (1800-2880 deg) + offset to align top pointer
    // Pointer is at 0 degrees (top). Slice 0 is centered around angle
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    // Each slice occupies [i * sliceAngle, (i+1) * sliceAngle]
    // Top pointer corresponds to 270 deg or 0 deg depending on rotation
    const sliceCenterAngle = winningIndex * sliceAngle + sliceAngle / 2;
    const finalAngle = rotation + extraSpins + (360 - (sliceCenterAngle % 360));

    // Play ticking sounds during deceleration
    let tickCount = 0;
    const interval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 25) clearInterval(interval);
    }, 120);

    setRotation(finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSlice(targetSlice);
      setShowQuizModal(true);
      playSuccessChime();
      onRecordSpin();
    }, 4000);
  };

  const handleOptionSelect = (optionIndex) => {
    if (hasAnswered) return;
    setSelectedOption(optionIndex);
    setHasAnswered(true);

    const isCorrect = optionIndex === selectedSlice.correctIndex;
    if (isCorrect) {
      setQuizScoreFeedback({
        isCorrect: true,
        message: `Outstanding! Correct answer! You earned +${selectedSlice.xp} XP!`,
      });
      onAwardXP(selectedSlice.xp, `Daily Wheel: ${selectedSlice.label}`);
      playSuccessChime();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      setQuizScoreFeedback({
        isCorrect: false,
        message: `Not quite! Review the explanation below. You still earned +15 participation XP!`,
      });
      onAwardXP(15, `Wheel Practice: ${selectedSlice.label}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Gamified Arena
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Streak: {learner.streak || 1} Days Active 🔥
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fortune 500 Daily Spinning Wheel
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Spin the wheel once a day for bonus enterprise XP and test your rapid-fire knowledge on Python, FastAPI, LangGraph, Azure AI, and prompt injection defenses!
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl relative z-10">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Spins</p>
            <p className="text-xl font-black text-amber-400">{learner.wheelSpinsCount || 0}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Streak Bonus</p>
            <p className="text-xl font-black text-emerald-400">{(learner.streak || 1) * 1.2}x</p>
          </div>
        </div>
      </div>

      {/* Main Wheel Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Pointer Arrow */}
        <div className="relative z-20 -mb-4 flex flex-col items-center">
          <div className="w-8 h-8 bg-amber-400 rotate-45 transform translate-y-3 rounded-sm shadow-xl shadow-amber-400/50 border-2 border-white" />
        </div>

        {/* Wheel SVG */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 my-4">
          <svg
            className="w-full h-full drop-shadow-2xl transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
            viewBox="0 0 400 400"
          >
            {/* Outer Rim */}
            <circle cx="200" cy="200" r="195" fill="#1e293b" stroke="#334155" strokeWidth="8" />

            {/* Slices */}
            {WHEEL_SLICES.map((slice, i) => {
              const startAngle = (i * sliceAngle * Math.PI) / 180;
              const endAngle = (((i + 1) * sliceAngle) * Math.PI) / 180;
              const x1 = 200 + 190 * Math.cos(startAngle);
              const y1 = 200 + 190 * Math.sin(startAngle);
              const x2 = 200 + 190 * Math.cos(endAngle);
              const y2 = 200 + 190 * Math.sin(endAngle);
              const textAngle = i * sliceAngle + sliceAngle / 2;

              return (
                <g key={slice.id}>
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`}
                    fill={slice.color}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  />
                  {/* Slice Text & Icon */}
                  <g transform={`rotate(${textAngle}, 200, 200)`}>
                    <text
                      x="320"
                      y="204"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(90, 320, 204)`}
                    >
                      {slice.icon} {slice.label}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Inner Center Hub */}
            <circle cx="200" cy="200" r="38" fill="#0f172a" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="200" cy="200" r="18" fill="#f59e0b" />
          </svg>
        </div>

        {/* Spin Trigger Button */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 active:scale-95 disabled:opacity-50 shadow-xl shadow-amber-400/25 transition-all cursor-pointer"
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "SPINNING IN PROGRESS..." : "SPIN FOR DAILY XP & QUIZ"}</span>
          </button>

          <p className="text-xs text-slate-400 text-center">
            {learner.wheelSpinsCount > 0 ? "✨ Practice Spin Mode active — play as many times as you like!" : "🔥 Spin to unlock your first Daily Wheel Badge!"}
          </p>
        </div>
      </div>

      {/* Pop-up Quiz Modal upon landing */}
      {showQuizModal && selectedSlice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedSlice.icon}</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Wheel Landed on: {selectedSlice.label}
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedSlice.category}
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                +{selectedSlice.xp} XP
              </span>
            </div>

            {/* Question */}
            <div className="py-5">
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {selectedSlice.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5 mt-4">
                {selectedSlice.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700";

                  if (hasAnswered) {
                    if (idx === selectedSlice.correctIndex) {
                      btnStyle = "bg-emerald-900/40 border-emerald-500 text-emerald-200 font-bold";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-rose-900/40 border-rose-500 text-rose-200";
                    } else {
                      btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && idx === selectedSlice.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {hasAnswered && idx === selectedOption && idx !== selectedSlice.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {hasAnswered && (
                <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    {quizScoreFeedback?.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span className={`text-xs font-bold ${quizScoreFeedback?.isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
                      {quizScoreFeedback?.message}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-100">Explanation: </strong>
                    {selectedSlice.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {hasAnswered ? "Collect Reward & Close" : "Skip Challenge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
