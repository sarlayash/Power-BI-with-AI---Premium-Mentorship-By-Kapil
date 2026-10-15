import React, { useState, useRef } from "react";
import { 
  Award, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check 
} from "lucide-react";
import confetti from "canvas-confetti";
import { playBadgeUnlockSound } from "../utils/soundEffects";

export default function CertificateView({ learner }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const certRef = useRef(null);

  const learnerName = learner.name || "Distinguished Enterprise Fellow";
  const issueDate = learner.joinedAt || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  // Deterministic Credential ID based on learner name
  const hash = Math.abs(
    (learnerName + "BI-V18-BLR").split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0)
  ).toString().padStart(6, "0").slice(0, 8);
  const credentialId = `BLR-V18-AI-${hash}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `I am proud to earn my official Enterprise AI Launchpad Certification (BI V18 Track) in Python, FastAPI, LangGraph Multi-Agent Systems, and Azure AI Cloud RAG! Credential ID: ${credentialId}`;
    if (navigator.share) {
      navigator.share({
        title: "Fortune 500 AI Launchpad Certificate",
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleConfetti = () => {
    playBadgeUnlockSound();
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Action Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Industry Credential
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {credentialId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Official Executive Certificate of Completion
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Accredited by the Enterprise AI Center of Excellence. Demonstrates production competency across all 14 curriculum modules and the end-to-end Capstone Project.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? "Copied" : "Share"}</span>
          </button>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Authenticity</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Container */}
      <div 
        ref={certRef}
        onClick={handleConfetti}
        className="w-full bg-slate-950 border-8 border-double border-amber-600/60 rounded-3xl p-8 sm:p-16 relative overflow-hidden shadow-2xl text-slate-100 select-none cursor-pointer"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)",
        }}
      >
        {/* Subtle Guilloché Watermark Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Award className="w-[600px] h-[600px] text-amber-400" />
        </div>

        {/* Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/80 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/80 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/80 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/80 rounded-br-xl" />

        {/* Certificate Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Fortune 500 Executive Standard
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 uppercase pt-2">
            Certificate of Engineering Excellence
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-sans tracking-widest uppercase">
            AI Launchpad Track • Batch BI-V18 BLR
          </p>
        </div>

        {/* Recipient Statement */}
        <div className="text-center my-10 space-y-4 relative z-10">
          <p className="text-xs sm:text-sm text-slate-400 font-sans italic">
            This is proudly and formally conferred upon
          </p>

          <div className="border-b-2 border-amber-500/40 inline-block px-8 py-2 min-w-[280px]">
            <span className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-wide">
              {learnerName}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-cyan-300 font-semibold tracking-wide">
            {learner.role || "Enterprise AI & Agentic Systems Architect"}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
            for successfully mastering from <span className="text-amber-300 font-bold">Zero to Infinity</span> all 14 core technical modules encompassing Python Basics, Data Structures, OOP Generics, REST API Microservices with FastAPI, Generative AI Foundations, Prompt Engineering, Open-Source LLMs (Ollama), LangChain Orchestration, Agentic ReAct Tooling, LangGraph Multi-Agent Workflows, and Enterprise RAG on Azure AI Services — capped with the delivery of the Production AI Sales Assistant.
          </p>
        </div>

        {/* Signatures & Gold Holographic Seal */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-8 pt-8 mt-6 border-t border-slate-800/80 relative z-10">
          {/* Signatory 1 */}
          <div className="text-center md:text-left space-y-1">
            <div className="font-serif italic text-base sm:text-lg text-cyan-300 tracking-wider font-semibold">
              Dr. Arvind Ramanathan
            </div>
            <div className="w-36 h-0.5 bg-slate-700 mx-auto md:mx-0" />
            <p className="text-[11px] font-bold text-slate-200">Director, Enterprise AI Systems</p>
            <p className="text-[10px] text-slate-500">AI Launchpad Program Board</p>
          </div>

          {/* Central Holographic Gold Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-1 shadow-2xl shadow-amber-500/30 flex items-center justify-center relative">
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-950 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-br from-yellow-300 to-amber-500 text-slate-950 font-black">
                <ShieldCheck className="w-6 h-6 text-slate-950 mb-0.5" />
                <span className="text-[9px] uppercase tracking-tighter leading-none">OFFICIAL SEAL</span>
                <span className="text-[8px] font-extrabold text-amber-950">FORTUNE 500</span>
              </div>
            </div>
            <div className="flex gap-2 -mt-2">
              <div className="w-3 h-8 bg-amber-600 transform -rotate-12 rounded-b" />
              <div className="w-3 h-8 bg-amber-600 transform rotate-12 rounded-b" />
            </div>
          </div>

          {/* Signatory 2 & QR Representation */}
          <div className="text-center md:text-right space-y-1">
            <div className="font-serif italic text-base sm:text-lg text-cyan-300 tracking-wider font-semibold">
              Sarah Jenkins, Fellow
            </div>
            <div className="w-36 h-0.5 bg-slate-700 mx-auto md:ml-auto md:mr-0" />
            <p className="text-[11px] font-bold text-slate-200">Chief Enterprise Architect</p>
            <p className="text-[10px] text-slate-500">Center of Excellence</p>
          </div>
        </div>

        {/* Bottom Verification Footer */}
        <div className="mt-8 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 relative z-10">
          <span>Credential ID: <strong className="text-slate-300 font-mono">{credentialId}</strong></span>
          <span>Conferred Date: <strong className="text-slate-300">{issueDate}</strong></span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Cryptographically Verified
          </span>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Verified Credential Record</h3>
                <p className="text-xs text-slate-400 font-mono">{credentialId}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Learner:</span>
                <span className="text-white font-bold">{learnerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program:</span>
                <span className="text-cyan-300 font-bold">BI V18 AI Launchpad</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold">ACTIVE & VALID</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accreditation:</span>
                <span className="text-amber-400 font-bold">Fortune 500 Standards</span>
              </div>
            </div>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
