import React, { useState } from "react";
import {
  Award,
  Download,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Share2,
  Check,
  X,
  Image as ImageIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { playBadgeUnlockSound } from "../utils/soundEffects";
import { downloadCertificatePng } from "../utils/pngExporter";

export default function CertificateView({ learner = {} }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const learnerName = learner?.name?.trim() || "Distinguished Learner";
  const learnerRole =
    learner?.role?.trim() || "AI, Data & Technology Practitioner";
  const issueDate = learner?.joinedAt
    ? new Date(learner.joinedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const idSource = `${learnerName}-SARLAYASH-KAPIL`;
  const idHash = Math.abs(
    idSource
      .split("")
      .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0)
  )
    .toString()
    .padStart(8, "0")
    .slice(0, 8);
  const credentialId = `SY-KMV-${idHash}`;

  const handleDownloadPng = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadCertificatePng({
        learnerName,
        learnerRole,
        credentialId,
        issueDate,
      });
      setDownloadSuccess(true);
      handleConfetti();
      window.setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Certificate PNG export failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `I have completed the AI Launchpad learning track. Certificate recipient: ${learnerName}. Issued by Kapil | Founder and Knowledge Multiverse Architect. Powered By Kapil. Certificate ID: ${credentialId}.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "SarlaYash Learning Certificate",
          text: shareText,
          url: window.location.href,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopiedLink(true);
        window.setTimeout(() => setCopiedLink(false), 2000);
      } else {
        window.prompt("Copy your certificate details:", shareText);
      }
    } catch {
      // Sharing cancelled by user
    }
  };

  const handleConfetti = () => {
    try {
      playBadgeUnlockSound();
    } catch {
      // Sound is optional
    }

    try {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.55 },
      });
    } catch {
      // Confetti is optional
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Action Bar */}
      <section className="elite-card flex flex-col items-start justify-between gap-6 p-6 sm:p-8 md:flex-row md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
            High-Resolution PNG Credential
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Official Certificate of Completion
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-zinc-300">
            Download your official certificate in crisp, high-resolution{" "}
            <strong className="text-amber-300">PNG format</strong> (2400×1720px)
            with zero overlapping borders or font rendering issues.
          </p>
          <p className="mt-2 font-mono text-xs text-amber-400/90">
            Certificate ID: {credentialId}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="btn-gold inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider text-neutral-950 cursor-pointer disabled:opacity-60"
          >
            {downloadSuccess ? (
              <Check className="h-4 w-4 text-neutral-950" />
            ) : (
              <Download className="h-4 w-4 text-neutral-950" />
            )}
            <span>
              {isDownloading
                ? "Generating PNG..."
                : downloadSuccess
                ? "PNG Downloaded!"
                : "Download Certificate (PNG)"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-neutral-900 px-4 py-3 text-xs font-bold text-amber-200 transition hover:bg-neutral-800 cursor-pointer"
          >
            {copiedLink ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Share2 className="h-4 w-4 text-amber-400" />
            )}
            <span>{copiedLink ? "Copied" : "Share"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-neutral-900 px-4 py-3 text-xs font-bold text-zinc-200 transition hover:border-amber-500/40 hover:text-white cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>Certificate Details</span>
          </button>
        </div>
      </section>

      {/* Certificate Canvas Card — Non-overlapping nested frame architecture */}
      <section
        onClick={handleConfetti}
        className="relative w-full cursor-pointer select-none rounded-3xl bg-neutral-950 p-3 sm:p-5 shadow-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(38, 38, 38, 0.7) 0%, rgba(10, 10, 10, 1) 100%)",
          border: "3px solid #d97706",
          boxShadow:
            "0 25px 70px rgba(0,0,0,0.85), 0 0 35px rgba(245, 158, 11, 0.12)",
        }}
      >
        {/* Inner Frame with dedicated padding so corner ornaments never collide with content */}
        <div
          className="relative rounded-2xl px-6 py-10 sm:px-14 sm:py-14 lg:px-20 lg:py-16"
          style={{
            border: "1.5px solid rgba(245, 158, 11, 0.45)",
          }}
        >
          {/* Corner Ornaments — strictly pinned to the inner frame corners */}
          <div className="pointer-events-none absolute left-3 top-3 h-7 w-7 border-l-2 border-t-2 border-amber-400 sm:left-4 sm:top-4 sm:h-9 sm:w-9" />
          <div className="pointer-events-none absolute right-3 top-3 h-7 w-7 border-r-2 border-t-2 border-amber-400 sm:right-4 sm:top-4 sm:h-9 sm:w-9" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 border-b-2 border-l-2 border-amber-400 sm:bottom-4 sm:left-4 sm:h-9 sm:w-9" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-7 w-7 border-b-2 border-r-2 border-amber-400 sm:bottom-4 sm:right-4 sm:h-9 sm:w-9" />

          {/* Subtle Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
            <Award className="h-72 w-72 sm:h-96 sm:w-96 text-amber-400" />
          </div>

          {/* Certificate Header */}
          <header className="relative z-10 space-y-3 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>SarlaYash Learning Solutions LLP</span>
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-amber-200 sm:text-sm">
              Powered By Kapil
            </p>

            <h2
              className="pt-1 font-serif text-2xl font-black uppercase tracking-wider sm:text-4xl lg:text-5xl"
              style={{ color: "#fcd34d" }}
            >
              Certificate of Completion
            </h2>

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 sm:text-xs">
              AI Launchpad Learning Track • BI V18
            </p>
          </header>

          {/* Recipient Block */}
          <div className="relative z-10 my-8 space-y-4 text-center sm:my-10">
            <p className="font-serif text-sm italic text-zinc-300 sm:text-base">
              This certificate is proudly presented to
            </p>

            <div className="mx-auto max-w-2xl border-b-2 border-amber-500/60 px-4 pb-3 pt-1 sm:px-10">
              <span className="block break-words font-serif text-2xl font-extrabold tracking-wide text-white sm:text-4xl lg:text-5xl">
                {learnerName}
              </span>
            </div>

            <p className="text-sm font-bold tracking-wide text-amber-300 sm:text-base">
              {learnerRole}
            </p>

            <p className="mx-auto max-w-3xl pt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm sm:leading-7">
              In recognition of outstanding learning progress, engineering
              commitment, and successful completion of the AI Launchpad
              Zero-to-Infinity curriculum covering Python, FastAPI
              Microservices, Generative AI, Prompt Engineering, Open-Source
              LLMs, LangChain, LangGraph Multi-Agent Systems, and Enterprise
              Azure AI RAG.
            </p>
          </div>

          {/* Seal & Sole Signatory Block */}
          <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-8 border-t border-amber-500/20 pt-8 md:flex-row md:gap-16">
            {/* Gold Seal */}
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full p-1.5 shadow-xl sm:h-28 sm:w-28"
              style={{
                background:
                  "linear-gradient(135deg, #92400e, #f59e0b, #fde68a, #f59e0b, #92400e)",
                boxShadow: "0 0 28px rgba(245,158,11,0.25)",
              }}
            >
              <div
                className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed text-center px-2"
                style={{
                  borderColor: "#78350f",
                  background: "linear-gradient(135deg, #fde68a, #f59e0b)",
                  color: "#111827",
                }}
              >
                <Award className="mb-0.5 h-6 w-6 shrink-0" />
                <span className="text-[8px] font-black uppercase tracking-wider leading-tight">
                  Official Seal
                </span>
                <span className="text-[8px] font-bold uppercase leading-tight">
                  SarlaYash
                </span>
              </div>
            </div>

            {/* Sole Signatory: Kapil | Founder and Knowledge Multiverse Architect */}
            <div className="space-y-2 text-center">
              <div
                className="font-serif text-3xl font-bold italic tracking-wide sm:text-4xl"
                style={{
                  color: "#fbbf24",
                  textShadow: "0 0 18px rgba(245,158,11,0.25)",
                }}
              >
                Kapil
              </div>
              <div
                className="mx-auto h-0.5 w-56 sm:w-64"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #f59e0b, #fde68a, #f59e0b, transparent)",
                }}
              />
              <p className="pt-1 text-sm font-extrabold tracking-wide text-white sm:text-base">
                Kapil | Founder and Knowledge Multiverse Architect
              </p>
              <p className="text-xs font-bold text-amber-400">
                Powered By Kapil • AI Launchpad Academy
              </p>
            </div>
          </div>

          {/* Bottom Metadata Bar */}
          <footer className="relative z-10 mt-8 flex flex-col items-center justify-between gap-3 border-t border-zinc-800/90 pt-5 text-center text-[11px] text-zinc-400 sm:flex-row sm:text-left">
            <span>
              Certificate ID:{" "}
              <strong className="font-mono text-zinc-200">{credentialId}</strong>
            </span>
            <span>
              Issue Date: <strong className="text-zinc-200">{issueDate}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Kapil | Founder and Knowledge Multiverse Architect</span>
            </span>
          </footer>
        </div>
      </section>

      {showVerifyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-details-title"
          onClick={() => setShowVerifyModal(false)}
        >
          <div
            className="w-full max-w-md space-y-5 rounded-3xl border border-amber-500/30 bg-neutral-900 p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    id="certificate-details-title"
                    className="text-base font-bold text-white"
                  >
                    Certificate Details
                  </h3>
                  <p className="font-mono text-xs text-zinc-400">
                    {credentialId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close certificate details"
                onClick={() => setShowVerifyModal(false)}
                className="rounded-lg p-1 text-zinc-400 transition hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="space-y-3 rounded-2xl border border-zinc-800 bg-neutral-950 p-4 text-xs">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-zinc-500">Recipient</dt>
                <dd className="text-right font-bold text-white">{learnerName}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-zinc-500">Program</dt>
                <dd className="text-right font-bold text-amber-200">
                  AI Launchpad Learning Track
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-zinc-500">Signatory</dt>
                <dd className="text-right font-bold text-amber-400">
                  Kapil | Founder and Knowledge Multiverse Architect
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-zinc-500">Download Format</dt>
                <dd className="text-right font-bold text-emerald-400">
                  High-Resolution PNG Only
                </dd>
              </div>
            </dl>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowVerifyModal(false);
                  handleDownloadPng();
                }}
                className="btn-gold flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black text-neutral-950 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="rounded-xl border border-zinc-700 bg-neutral-800 px-4 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-neutral-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
