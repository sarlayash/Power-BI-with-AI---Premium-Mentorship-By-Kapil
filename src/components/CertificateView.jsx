import React, { useRef, useState } from "react";
import {
  Award,
  Printer,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Share2,
  Check,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { playBadgeUnlockSound } from "../utils/soundEffects";

export default function CertificateView({ learner = {} }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const certRef = useRef(null);

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

  // This is a display ID, not a cryptographic or independently verified credential.
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareText = `I have completed the AI Launchpad learning track. Certificate recipient: ${learnerName}. Issued by Kapil — Knowledge MultiVerse Architect. Powered By Kapil. Certificate ID: ${credentialId}.`;

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
      // Sharing can be cancelled by the user; no action is needed.
    }
  };

  const handleConfetti = () => {
    try {
      playBadgeUnlockSound();
    } catch {
      // Sound is optional.
    }

    try {
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.55 },
      });
    } catch {
      // Confetti is optional.
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <style>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { background: #ffffff !important; }
          body * { visibility: hidden !important; }
          .certificate-print-area,
          .certificate-print-area * { visibility: visible !important; }
          .certificate-print-area {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <section className="no-print flex flex-col items-start justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 md:flex-row md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
            <ShieldCheck className="h-4 w-4" />
            Learning Achievement Certificate
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Certificate of Completion
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            A recognition of learning progress and practical effort in the AI
            Launchpad learning track.
          </p>
          <p className="mt-2 font-mono text-xs text-slate-400">
            Certificate ID: {credentialId}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            {copiedLink ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            {copiedLink ? "Copied" : "Share"}
          </button>
          <button
            type="button"
            onClick={() => setShowVerifyModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-300 px-5 py-2.5 text-xs font-black text-slate-950 transition hover:from-amber-400 hover:to-yellow-200"
          >
            <ShieldCheck className="h-4 w-4" />
            Certificate Details
          </button>
        </div>
      </section>

      <section
        ref={certRef}
        onClick={handleConfetti}
        className="certificate-print-area relative w-full cursor-pointer select-none overflow-hidden rounded-3xl border-8 border-double border-amber-500/70 bg-slate-950 p-6 text-slate-100 shadow-2xl sm:p-10 lg:p-14"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(30,41,59,0.55) 0%, rgba(2,6,23,1) 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]">
          <Award className="h-[min(70vw,560px)] w-[min(70vw,560px)] text-amber-300" />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 h-10 w-10 rounded-tl-lg border-l-2 border-t-2 border-amber-400 sm:left-5 sm:top-5 sm:h-14 sm:w-14" />
        <div className="pointer-events-none absolute right-3 top-3 h-10 w-10 rounded-tr-lg border-r-2 border-t-2 border-amber-400 sm:right-5 sm:top-5 sm:h-14 sm:w-14" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-10 w-10 rounded-bl-lg border-b-2 border-l-2 border-amber-400 sm:bottom-5 sm:left-5 sm:h-14 sm:w-14" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-10 w-10 rounded-br-lg border-b-2 border-r-2 border-amber-400 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14" />

        <header className="relative z-10 space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300 sm:text-xs">
            <Sparkles className="h-4 w-4 text-amber-400" />
            SarlaYash Learning Solutions LLP
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-amber-200 sm:text-sm">
            Powered By Kapil
          </p>

          <h2 className="pt-1 font-serif text-3xl font-black uppercase tracking-wide text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text sm:text-5xl">
            Certificate of Completion
          </h2>

          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 sm:text-xs">
            AI Launchpad Learning Track
          </p>
        </header>

        <div className="relative z-10 my-8 space-y-4 text-center sm:my-10">
          <p className="font-serif text-sm italic text-slate-300 sm:text-base">
            This certificate is presented to
          </p>

          <div className="mx-auto inline-block max-w-full border-b-2 border-amber-500/60 px-4 py-3 sm:px-10">
            <span className="break-words font-serif text-3xl font-extrabold tracking-wide text-white sm:text-5xl">
              {learnerName}
            </span>
          </div>

          <p className="text-sm font-semibold tracking-wide text-cyan-200 sm:text-base">
            {learnerRole}
          </p>

          <p className="mx-auto max-w-3xl pt-2 text-xs leading-6 text-slate-300 sm:text-sm">
            In recognition of learning progress, commitment, and successful
            participation in the AI Launchpad learning track. This certificate
            acknowledges the learner&apos;s effort in developing skills across
            AI, data, software, and related technology topics included in the
            program.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 border-t border-amber-500/20 pt-7">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full p-1 shadow-xl sm:h-28 sm:w-28"
            style={{
              background:
                "linear-gradient(135deg, #92400e, #f59e0b, #fde68a, #f59e0b, #92400e)",
              boxShadow: "0 0 32px rgba(245,158,11,0.28)",
            }}
          >
            <div
              className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed text-center"
              style={{
                borderColor: "#78350f",
                background: "linear-gradient(135deg, #fde68a, #f59e0b)",
                color: "#111827",
              }}
            >
              <Award className="mb-1 h-7 w-7" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Achievement
              </span>
              <span className="text-[8px] font-bold">SARLAYASH</span>
            </div>
          </div>

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
              className="mx-auto h-0.5 w-48"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #f59e0b, #fde68a, #f59e0b, transparent)",
              }}
            />
            <p className="text-sm font-extrabold tracking-wide text-white">
              Kapil
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 sm:text-sm">
              Knowledge MultiVerse Architect
            </p>
            <p className="text-xs font-semibold text-slate-300">
              Powered By Kapil
            </p>
          </div>
        </div>

        <footer className="relative z-10 mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-4 text-center text-[10px] text-slate-400 sm:flex-row sm:text-left">
          <span>
            Certificate ID:{" "}
            <strong className="font-mono text-slate-200">{credentialId}</strong>
          </span>
          <span>
            Issue Date: <strong className="text-slate-200">{issueDate}</strong>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Issued by Kapil
          </span>
        </footer>
      </section>

      {showVerifyModal && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-details-title"
          onClick={() => setShowVerifyModal(false)}
        >
          <div
            className="w-full max-w-md space-y-5 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8"
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
                  <p className="font-mono text-xs text-slate-400">
                    {credentialId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close certificate details"
                onClick={() => setShowVerifyModal(false)}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Recipient</dt>
                <dd className="text-right font-bold text-white">{learnerName}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Program</dt>
                <dd className="text-right font-bold text-cyan-200">
                  AI Launchpad Learning Track
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Issued by</dt>
                <dd className="text-right font-bold text-amber-300">
                  Kapil — Knowledge MultiVerse Architect
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Branding</dt>
                <dd className="text-right font-bold text-amber-300">
                  Powered By Kapil
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Record status</dt>
                <dd className="text-right font-bold text-slate-200">
                  Displayed in this application
                </dd>
              </div>
            </dl>

            <p className="text-xs leading-5 text-slate-400">
              This screen displays the certificate information stored or
              generated by this application. It does not independently validate
              identity or provide cryptographic verification.
            </p>

            <button
              type="button"
              onClick={() => setShowVerifyModal(false)}
              className="w-full rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-amber-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
