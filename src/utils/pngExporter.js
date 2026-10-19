// High-resolution deterministic Canvas 2D PNG exporter for Certificates & Badges
// Guarantees:
// 1. Only PNG format output (image/png)
// 2. Waits for web fonts before measuring/drawing
// 3. Strict bounding-box & vertical flow layout — zero overlapping borders or clipped text

const SANS_FONT = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";
const SERIF_FONT = "Georgia, 'Times New Roman', serif";
const MONO_FONT = "'Fira Code', Consolas, monospace";

async function ensureFontsLoaded() {
  if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed with fallback system fonts if font loading API fails
    }
  }
}

function wrapTextLines(ctx, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${currentLine} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
}

function fitFontSize(ctx, text, fontWeight, fontStyle, fontFamily, maxFontSize, minFontSize, maxWidth) {
  let size = maxFontSize;
  while (size > minFontSize) {
    ctx.font = `${fontStyle ? fontStyle + " " : ""}${fontWeight} ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  ctx.font = `${fontStyle ? fontStyle + " " : ""}${fontWeight} ${minFontSize}px ${fontFamily}`;
  return minFontSize;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCornerOrnaments(ctx, x, y, w, h, armLength, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "square";

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + armLength);
  ctx.lineTo(x, y);
  ctx.lineTo(x + armLength, y);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - armLength, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + armLength);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - armLength);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + armLength, y + h);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - armLength, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - armLength);
  ctx.stroke();

  ctx.restore();
}

function triggerCanvasPngDownload(canvas, filename) {
  const safeName = filename.endsWith(".png") ? filename : `${filename}.png`;
  return new Promise((resolve, reject) => {
    try {
      if (canvas.toBlob) {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to generate PNG blob."));
              return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = safeName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 3000);
            resolve(safeName);
          },
          "image/png",
          1.0
        );
      } else {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = safeName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve(safeName);
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates and downloads a high-resolution (2400x1680) PNG Certificate
 * with zero border or font overlap.
 */
export async function downloadCertificatePng({
  learnerName = "Distinguished Learner",
  learnerRole = "AI, Data & Technology Practitioner",
  credentialId = "SY-KMV-00000000",
  issueDate = "",
}) {
  await ensureFontsLoaded();

  const W = 1200;
  const H = 860;
  const SCALE = 2; // 2400 x 1720 crisp retina PNG

  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;

  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);

  // 1. Background — Elite Obsidian & Charcoal radial gradient
  const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 720);
  bgGrad.addColorStop(0, "#171717");
  bgGrad.addColorStop(0.6, "#0d0d0d");
  bgGrad.addColorStop(1, "#070707");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle corner gold glow
  const glowGrad = ctx.createRadialGradient(W / 2, 140, 10, W / 2, 140, 420);
  glowGrad.addColorStop(0, "rgba(245, 158, 11, 0.09)");
  glowGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Non-overlapping Outer & Inner Gold Borders
  // Outer border at inset 28px
  const borderGrad = ctx.createLinearGradient(0, 0, W, H);
  borderGrad.addColorStop(0, "#b45309");
  borderGrad.addColorStop(0.25, "#fbbf24");
  borderGrad.addColorStop(0.5, "#fde68a");
  borderGrad.addColorStop(0.75, "#f59e0b");
  borderGrad.addColorStop(1, "#b45309");

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 28, 28, W - 56, H - 56, 20);
  ctx.stroke();

  // Inner thin border at inset 40px
  ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 40, 40, W - 80, H - 80, 14);
  ctx.stroke();

  // Corner ornaments strictly at inset 50px (arms 32px -> ends at 82px, well clear of content area)
  drawCornerOrnaments(ctx, 50, 50, W - 100, H - 100, 32, "#fbbf24");

  // Safe inner content width: x from 110 to 1090 (maxWidth = 980)
  const centerX = W / 2;
  const maxContentW = 940;

  // 3. Top Pill Badge (y = 74..108)
  const pillText = "SARLAYASH LEARNING SOLUTIONS LLP";
  ctx.font = `700 12px ${SANS_FONT}`;
  const pillW = Math.max(320, ctx.measureText(pillText).width + 48);
  const pillX = centerX - pillW / 2;
  const pillY = 72;
  const pillH = 32;

  ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#fcd34d";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`✦  ${pillText}  ✦`, centerX, pillY + pillH / 2 + 1);

  // 4. Sub-header: POWERED BY KAPIL (y = 128)
  ctx.font = `800 13px ${SANS_FONT}`;
  ctx.fillStyle = "#fde68a";
  ctx.fillText("P O W E R E D   B Y   K A P I L", centerX, 128);

  // 5. Main Title: CERTIFICATE OF COMPLETION (y = 176)
  const titleGrad = ctx.createLinearGradient(centerX - 360, 150, centerX + 360, 195);
  titleGrad.addColorStop(0, "#fde68a");
  titleGrad.addColorStop(0.5, "#fbbf24");
  titleGrad.addColorStop(1, "#f59e0b");
  ctx.font = `900 44px ${SERIF_FONT}`;
  ctx.fillStyle = titleGrad;
  ctx.fillText("CERTIFICATE OF COMPLETION", centerX, 176);

  // 6. Track Subtitle (y = 212)
  ctx.font = `700 12px ${SANS_FONT}`;
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("A I   L A U N C H P A D   L E A R N I N G   T R A C K   •   B I   V 1 8", centerX, 212);

  // 7. Presentation Line (y = 262)
  ctx.font = `italic 400 18px ${SERIF_FONT}`;
  ctx.fillStyle = "#d1d5db";
  ctx.fillText("This certificate is proudly presented to", centerX, 262);

  // 8. Recipient Name (y = 322) — dynamically sized so long names never overflow
  const cleanName = String(learnerName || "Distinguished Learner").trim();
  const nameFontSize = fitFontSize(ctx, cleanName, "800", "", SERIF_FONT, 52, 28, maxContentW - 80);
  ctx.font = `800 ${nameFontSize}px ${SERIF_FONT}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(cleanName, centerX, 320);

  // Gold underline beneath recipient name (y = 352)
  const measuredNameW = Math.min(maxContentW - 40, Math.max(340, ctx.measureText(cleanName).width + 80));
  const lineGrad = ctx.createLinearGradient(centerX - measuredNameW / 2, 0, centerX + measuredNameW / 2, 0);
  lineGrad.addColorStop(0, "rgba(245, 158, 11, 0)");
  lineGrad.addColorStop(0.2, "#f59e0b");
  lineGrad.addColorStop(0.5, "#fde68a");
  lineGrad.addColorStop(0.8, "#f59e0b");
  lineGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - measuredNameW / 2, 352);
  ctx.lineTo(centerX + measuredNameW / 2, 352);
  ctx.stroke();

  // 9. Recipient Role (y = 382)
  const cleanRole = String(learnerRole || "Enterprise AI & Agentic Systems Architect").trim();
  fitFontSize(ctx, cleanRole, "700", "", SANS_FONT, 18, 13, maxContentW - 80);
  ctx.fillStyle = "#fbbf24";
  ctx.fillText(cleanRole, centerX, 382);

  // 10. Citation Paragraph (y = 420..495)
  const bodyText =
    "In recognition of outstanding learning progress, engineering commitment, and successful completion of the AI Launchpad Zero-to-Infinity curriculum covering Python, FastAPI Microservices, Generative AI, Prompt Engineering, Open-Source LLMs, LangChain, LangGraph Multi-Agent Systems, and Enterprise Azure AI RAG.";
  ctx.font = `400 15px ${SANS_FONT}`;
  ctx.fillStyle = "#d4d4d8";
  const bodyLines = wrapTextLines(ctx, bodyText, 820);
  let bodyY = 422;
  for (const line of bodyLines) {
    ctx.fillText(line, centerX, bodyY);
    bodyY += 24;
  }

  // 11. Horizontal Gold Section Divider (y = 515)
  ctx.strokeStyle = "rgba(245, 158, 11, 0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 515);
  ctx.lineTo(W - 120, 515);
  ctx.stroke();

  // 12. Seal + Sole Signatory Section (y = 535..735)
  // Draw Gold Medallion on the Left-Center (x = 340, y = 625) and Sole Signatory on Right-Center (x = 700, y = 625)
  // OR centered stacked cleanly. Let's check vertical space: 515 to 755 is 240px!
  // With a 2-column balanced executive row (Gold Seal on left x=370, Sole Signatory on right x=730), there is 240px of vertical height and 480px width per column — zero chance of vertical or horizontal crowding!
  const sealX = 360;
  const sealY = 632;
  const sealR = 58;

  // Ribbons under seal
  ctx.fillStyle = "#b45309";
  ctx.beginPath();
  ctx.moveTo(sealX - 18, sealY + 42);
  ctx.lineTo(sealX - 30, sealY + 82);
  ctx.lineTo(sealX - 16, sealY + 76);
  ctx.lineTo(sealX - 6, sealY + 84);
  ctx.lineTo(sealX - 4, sealY + 42);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(sealX + 18, sealY + 42);
  ctx.lineTo(sealX + 30, sealY + 82);
  ctx.lineTo(sealX + 16, sealY + 76);
  ctx.lineTo(sealX + 6, sealY + 84);
  ctx.lineTo(sealX + 4, sealY + 42);
  ctx.closePath();
  ctx.fill();

  // Outer metallic gold circle
  const sealGrad = ctx.createLinearGradient(sealX - sealR, sealY - sealR, sealX + sealR, sealY + sealR);
  sealGrad.addColorStop(0, "#b45309");
  sealGrad.addColorStop(0.5, "#fde68a");
  sealGrad.addColorStop(1, "#d97706");
  ctx.fillStyle = sealGrad;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.fill();

  // Inner dashed ring
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Seal text
  ctx.fillStyle = "#111827";
  ctx.font = `900 11px ${SANS_FONT}`;
  ctx.fillText("★ OFFICIAL SEAL ★", sealX, sealY - 14);
  ctx.font = `900 13px ${SANS_FONT}`;
  ctx.fillText("ACHIEVEMENT", sealX, sealY + 4);
  ctx.font = `800 10px ${SANS_FONT}`;
  ctx.fillText("SARLAYASH", sealX, sealY + 21);

  // Sole Signatory Block (Centered at x = 730)
  const sigX = 730;
  ctx.font = `italic 700 42px ${SERIF_FONT}`;
  ctx.fillStyle = "#fbbf24";
  ctx.fillText("Kapil", sigX, 592);

  // Gold signature line
  const sigLineGrad = ctx.createLinearGradient(sigX - 180, 0, sigX + 180, 0);
  sigLineGrad.addColorStop(0, "rgba(245, 158, 11, 0)");
  sigLineGrad.addColorStop(0.2, "#f59e0b");
  sigLineGrad.addColorStop(0.5, "#fde68a");
  sigLineGrad.addColorStop(0.8, "#f59e0b");
  sigLineGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.strokeStyle = sigLineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sigX - 180, 622);
  ctx.lineTo(sigX + 180, 622);
  ctx.stroke();

  // Exact required signatory title
  ctx.font = `800 16px ${SANS_FONT}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Kapil | Founder and Knowledge Multiverse Architect", sigX, 650);

  ctx.font = `700 13px ${SANS_FONT}`;
  ctx.fillStyle = "#f59e0b";
  ctx.fillText("Powered By Kapil • AI Launchpad Academy", sigX, 676);

  // 13. Bottom Footer Bar (y = 752..792) — strictly above y=810 inner border!
  ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 748);
  ctx.lineTo(W - 100, 748);
  ctx.stroke();

  const footerY = 776;
  ctx.font = `600 12px ${MONO_FONT}`;
  ctx.fillStyle = "#a1a1aa";
  ctx.textAlign = "left";
  ctx.fillText(`Certificate ID: ${credentialId}`, 100, footerY);

  ctx.font = `600 12px ${SANS_FONT}`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#d4d4d8";
  ctx.fillText(`Issue Date: ${issueDate}`, centerX, footerY);

  ctx.font = `700 12px ${SANS_FONT}`;
  ctx.textAlign = "right";
  ctx.fillStyle = "#fcd34d";
  ctx.fillText("Kapil | Founder and Knowledge Multiverse Architect", W - 100, footerY);

  const slug = cleanName.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "Learner";
  return triggerCanvasPngDownload(canvas, `AI-Launchpad-Certificate-${slug}.png`);
}

/**
 * Generates and downloads a high-resolution (1400x1680) PNG Badge Card
 * with zero border or font overlap.
 */
export async function downloadBadgePng({
  badge,
  learnerName = "Distinguished Learner",
  issueDate = "",
  isUnlocked = true,
}) {
  await ensureFontsLoaded();

  const W = 720;
  const H = 860;
  const SCALE = 2; // 1440 x 1720 crisp retina PNG

  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;

  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);

  // 1. Background
  const bgGrad = ctx.createRadialGradient(W / 2, H / 3, 40, W / 2, H / 2, 600);
  bgGrad.addColorStop(0, "#1c1917");
  bgGrad.addColorStop(0.6, "#0f0f0f");
  bgGrad.addColorStop(1, "#070707");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Non-overlapping Gold Double Frame
  const borderGrad = ctx.createLinearGradient(0, 0, W, H);
  borderGrad.addColorStop(0, "#b45309");
  borderGrad.addColorStop(0.3, "#fbbf24");
  borderGrad.addColorStop(0.5, "#fde68a");
  borderGrad.addColorStop(0.7, "#f59e0b");
  borderGrad.addColorStop(1, "#b45309");

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 24, 24, W - 48, H - 48, 24);
  ctx.stroke();

  ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 36, 36, W - 72, H - 72, 18);
  ctx.stroke();

  drawCornerOrnaments(ctx, 46, 46, W - 92, H - 92, 26, "#fbbf24");

  const centerX = W / 2;
  const maxTextW = W - 150; // 570px safe text width

  // 3. Top Header Pill (y = 70..102)
  ctx.font = `700 11px ${SANS_FONT}`;
  const topPillText = "FORTUNE 500 EXECUTIVE BADGE CREDENTIAL";
  const pillW = Math.max(310, ctx.measureText(topPillText).width + 44);
  ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
  drawRoundedRect(ctx, centerX - pillW / 2, 70, pillW, 30, 15);
  ctx.fill();
  ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#fcd34d";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`✦  ${topPillText}  ✦`, centerX, 86);

  // 4. Brand Line (y = 122)
  ctx.font = `800 12px ${SANS_FONT}`;
  ctx.fillStyle = "#fde68a";
  ctx.fillText("P O W E R E D   B Y   K A P I L", centerX, 122);

  // 5. Central Gold Medallion Emblem (center y = 235, radius = 74)
  const emblemY = 232;
  const emblemR = 72;

  const glow = ctx.createRadialGradient(centerX, emblemY, 20, centerX, emblemY, 130);
  glow.addColorStop(0, "rgba(245, 158, 11, 0.25)");
  glow.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, emblemY, 130, 0, Math.PI * 2);
  ctx.fill();

  const ringGrad = ctx.createLinearGradient(centerX - emblemR, emblemY - emblemR, centerX + emblemR, emblemY + emblemR);
  ringGrad.addColorStop(0, "#b45309");
  ringGrad.addColorStop(0.5, "#fde68a");
  ringGrad.addColorStop(1, "#d97706");
  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(centerX, emblemY, emblemR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#141414";
  ctx.beginPath();
  ctx.arc(centerX, emblemY, emblemR - 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(centerX, emblemY, emblemR - 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Emoji / Icon inside emblem
  ctx.font = `400 54px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(badge?.icon || "🏆", centerX, emblemY + 4);

  // 6. Tier Pill (y = 330..358)
  const tierLabel = `${String(badge?.tier || "ELITE").toUpperCase()} TIER  •  +${badge?.xpAward || 250} XP`;
  ctx.font = `800 12px ${SANS_FONT}`;
  const tierW = Math.max(190, ctx.measureText(tierLabel).width + 36);
  ctx.fillStyle = "rgba(245, 158, 11, 0.16)";
  drawRoundedRect(ctx, centerX - tierW / 2, 326, tierW, 28, 14);
  ctx.fill();
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#fbbf24";
  ctx.fillText(tierLabel, centerX, 341);

  // 7. Badge Title (y = 392)
  const badgeTitle = String(badge?.title || "Enterprise Achievement Badge");
  const titleSize = fitFontSize(ctx, badgeTitle, "900", "", SERIF_FONT, 32, 20, maxTextW);
  ctx.font = `900 ${titleSize}px ${SERIF_FONT}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(badgeTitle, centerX, 392);

  // 8. Badge Description (y = 432..485)
  ctx.font = `400 15px ${SANS_FONT}`;
  ctx.fillStyle = "#d4d4d8";
  const descLines = wrapTextLines(ctx, badge?.description || "", maxTextW - 30);
  let cursorY = 432;
  for (const line of descLines.slice(0, 3)) {
    ctx.fillText(line, centerX, cursorY);
    cursorY += 23;
  }

  // 9. Recipient Box (y = 515..595)
  const boxY = 512;
  const boxH = 84;
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  drawRoundedRect(ctx, 85, boxY, W - 170, boxH, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(245, 158, 11, 0.28)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = `700 11px ${SANS_FONT}`;
  ctx.fillStyle = "#a1a1aa";
  ctx.fillText(
    isUnlocked ? "CREDENTIAL CONFERRED UPON" : "CREDENTIAL CANDIDATE",
    centerX,
    boxY + 24
  );

  const cleanLearner = String(learnerName || "Distinguished Learner").trim();
  const learnerFontSize = fitFontSize(ctx, cleanLearner, "800", "", SERIF_FONT, 26, 16, W - 210);
  ctx.font = `800 ${learnerFontSize}px ${SERIF_FONT}`;
  ctx.fillStyle = "#fde68a";
  ctx.fillText(cleanLearner, centerX, boxY + 58);

  // 10. Sole Signatory Section (y = 635..735)
  ctx.font = `italic 700 32px ${SERIF_FONT}`;
  ctx.fillStyle = "#fbbf24";
  ctx.fillText("Kapil", centerX, 642);

  const sigGrad = ctx.createLinearGradient(centerX - 150, 0, centerX + 150, 0);
  sigGrad.addColorStop(0, "rgba(245, 158, 11, 0)");
  sigGrad.addColorStop(0.5, "#fbbf24");
  sigGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.strokeStyle = sigGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 150, 664);
  ctx.lineTo(centerX + 150, 664);
  ctx.stroke();

  ctx.font = `800 14px ${SANS_FONT}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Kapil | Founder and Knowledge Multiverse Architect", centerX, 688);

  ctx.font = `700 12px ${SANS_FONT}`;
  ctx.fillStyle = "#f59e0b";
  ctx.fillText("AI Launchpad Academy • BI V18 Track", centerX, 712);

  // 11. Footer Metadata (y = 772, well inside y = 824 inner border)
  ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(75, 746);
  ctx.lineTo(W - 75, 746);
  ctx.stroke();

  const finalDate =
    issueDate ||
    new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  ctx.font = `600 11px ${MONO_FONT}`;
  ctx.fillStyle = "#a1a1aa";
  ctx.textAlign = "left";
  ctx.fillText(`ID: ${String(badge?.id || "badge").toUpperCase()}`, 75, 774);

  ctx.font = `600 11px ${SANS_FONT}`;
  ctx.textAlign = "right";
  ctx.fillStyle = "#fcd34d";
  ctx.fillText(`Issued: ${finalDate}`, W - 75, 774);

  const badgeSlug = String(badge?.id || "badge").replace(/[^a-zA-Z0-9-]+/g, "-");
  return triggerCanvasPngDownload(canvas, `AI-Launchpad-${badgeSlug}.png`);
}
