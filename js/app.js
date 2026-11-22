"use strict";

/* ============================================================
   Vintage Photobooth — logic
   ============================================================ */

// Ganti nama yang tampil di atas tiap frame di sini:
const BRAND = "Photobooth";

// ---------------- Filter ----------------
const FILTERS = [
  { id: "normal", name: "Asli",    css: "none", tint: null },
  { id: "mulus",  name: "Mulus",   css: "brightness(1.08) contrast(0.94) saturate(1.0)", tint: "rgba(235,222,205,0.12)",
    preview: "blur(0.6px) brightness(1.09) contrast(0.95)", beauty: true, smooth: 0.5, blur: 5 },
  { id: "glow",   name: "Glow",    css: "brightness(1.15) contrast(0.9) saturate(1.02)", tint: "rgba(240,224,214,0.14)",
    preview: "blur(0.7px) brightness(1.16) contrast(0.9)", beauty: true, smooth: 0.6, blur: 7 },
  { id: "kodak",  name: "Kodak",   css: "sepia(0.3) saturate(1.3) contrast(1.05) brightness(1.03)", tint: "rgba(255,200,130,0.12)" },
  { id: "retro",  name: "Retro",   css: "sepia(0.5) saturate(1.2) contrast(1.1) brightness(0.98)", tint: "rgba(210,170,120,0.18)" },
  { id: "fade",   name: "Fade",    css: "contrast(0.78) brightness(1.08) saturate(0.72)", tint: "rgba(235,228,214,0.16)" },
  { id: "warm",   name: "Hangat",  css: "sepia(0.35) saturate(1.35) brightness(1.04)", tint: "rgba(210,150,95,0.16)" },
  { id: "cool",   name: "Sejuk",   css: "saturate(1.1) hue-rotate(-14deg) brightness(1.02) contrast(1.02)", tint: "rgba(110,140,170,0.16)" },
  { id: "sage",   name: "Sage",    css: "saturate(0.95) hue-rotate(20deg) brightness(1.02)", tint: "rgba(130,150,110,0.16)" },
  { id: "dusk",   name: "Dusk",    css: "saturate(1.1) contrast(1.05) brightness(0.95)", tint: "rgba(120,90,110,0.18)" },
  { id: "film",   name: "Film",    css: "sepia(0.4) hue-rotate(-10deg) contrast(1.25) brightness(0.92) saturate(0.95)", tint: "rgba(120,130,110,0.16)" },
  { id: "mono",   name: "Mono",    css: "grayscale(1) contrast(1.1)", tint: null },
  { id: "noir",   name: "Noir",    css: "grayscale(1) contrast(1.55) brightness(0.88)", tint: null },
];
let currentFilter = FILTERS[1];

// ---------------- Tema frame (muted + pattern khas) ----------------
const THEMES = [
  { id: "sepia", name: "Sépia", title: "SÉPIA", quote: "like old film",
    bg: ["#f5edda", "#ecdfc4"], pattern: "grid", patternColor: "rgba(150,118,74,0.13)",
    accent: "#7a5c3e", photoBorder: "#c9b58c", line: "rgba(122,92,62,0.45)" },
  { id: "olive", name: "Olive", title: "OLIVE", quote: "quiet afternoons",
    bg: ["#e8e9d6", "#d8dbbe"], pattern: "stripes", patternColor: "rgba(92,102,70,0.11)",
    accent: "#5f6b47", photoBorder: "#abb188", line: "rgba(95,107,71,0.45)" },
  { id: "terra", name: "Terracotta", title: "TERRACOTTA", quote: "warm like clay",
    bg: ["#f1ddcd", "#e7c7b0"], pattern: "arches", patternColor: "rgba(170,95,62,0.12)",
    accent: "#a95a3c", photoBorder: "#d6a68b", line: "rgba(169,90,60,0.42)" },
  { id: "dusty", name: "Dusty Blue", title: "DUSTY BLUE", quote: "calm, still water",
    bg: ["#e3e9ed", "#cedbe3"], pattern: "dots", patternColor: "rgba(70,100,125,0.13)",
    accent: "#4a6477", photoBorder: "#a6bece", line: "rgba(74,100,119,0.42)" },
  { id: "mauve", name: "Mauve", title: "MAUVE", quote: "soft, unhurried",
    bg: ["#ece2e6", "#dccbd5"], pattern: "waves", patternColor: "rgba(122,86,104,0.12)",
    accent: "#7c5668", photoBorder: "#c7abb9", line: "rgba(124,86,104,0.42)" },
  { id: "mocha", name: "Mocha", title: "MOCHA", quote: "sweet and slow",
    bg: ["#e9ddc8", "#dccaae"], pattern: "checks", patternColor: "rgba(110,85,60,0.10)",
    accent: "#6f5540", photoBorder: "#c1a686", line: "rgba(111,85,64,0.42)" },
  { id: "noir", name: "Noir", title: "NOIR", quote: "timeless in black", isDark: true,
    bg: ["#2c2b2e", "#1f1e21"], pattern: "ticks", patternColor: "rgba(255,255,255,0.10)",
    accent: "#e8e2d8", photoBorder: "#565057", line: "rgba(232,226,216,0.35)" },
  { id: "forest", name: "Forest", title: "FOREST", quote: "deep and grounded",
    bg: ["#e0e7dc", "#ccd7c6"], pattern: "terrazzo", patternColor: "rgba(60,88,62,0.55)",
    accent: "#44583f", photoBorder: "#a5b9a0", line: "rgba(68,88,63,0.42)" },
  { id: "wine", name: "Wine", title: "WINE", quote: "rich as old wine",
    bg: ["#ecdcdc", "#dcc1c5"], pattern: "scallop", patternColor: "rgba(122,63,76,0.12)",
    accent: "#7a3f4c", photoBorder: "#cea5ac", line: "rgba(122,63,76,0.42)" },
  { id: "slate", name: "Slate", title: "SLATE", quote: "clean and modern",
    bg: ["#e5e7eb", "#d2d6dd"], pattern: "herringbone", patternColor: "rgba(70,78,92,0.11)",
    accent: "#454c58", photoBorder: "#abb2bd", line: "rgba(69,76,88,0.42)" },
];
let currentTheme = THEMES[0];

const $ = (id) => document.getElementById(id);
const video = $("video");
let stream = null;
let facing = "user";
let shots = [];
let busy = false;

// ---------------- UI chip ----------------
(function buildUI() {
  const fWrap = $("filters");
  FILTERS.forEach((f) => {
    const c = document.createElement("div");
    c.className = "chip" + (f.id === currentFilter.id ? " active" : "");
    c.textContent = f.name;
    c.onclick = () => {
      currentFilter = f;
      document.querySelectorAll("#filters .chip").forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      applyPreviewFilter();
    };
    fWrap.appendChild(c);
  });

  const tWrap = $("themes");
  THEMES.forEach((t) => {
    const c = document.createElement("div");
    c.className = "chip theme-chip" + (t.id === currentTheme.id ? " active" : "");
    c.textContent = t.name;
    c.onclick = () => {
      currentTheme = t;
      document.querySelectorAll("#themes .chip").forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      renderFramePreview();
    };
    tWrap.appendChild(c);
  });
})();

function applyPreviewFilter() { video.style.filter = currentFilter.preview || currentFilter.css; }

// ---------------- Kamera ----------------
async function startCamera() {
  try {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false,
    });
    video.srcObject = stream;
    video.style.display = "block";
    video.classList.toggle("mirror", facing === "user");
    $("stageMsg").style.display = "none";
    applyPreviewFilter();
    $("startBtn").style.display = "none";
    $("snapBtn").style.display = "inline-flex";
    $("flipBtn").style.display = "inline-flex";
    $("hint").textContent = "Pilih filter & frame, lalu jepret.";
  } catch (err) {
    $("stageMsg").style.display = "block";
    $("stageMsg").innerHTML =
      "Kamera tidak bisa diakses.<br><small>" +
      (err && err.name === "NotAllowedError"
        ? "Izin kamera ditolak — aktifkan di pengaturan browser."
        : "Pastikan buka lewat HTTPS/localhost & perangkat punya kamera.") + "</small>";
  }
}

function buildDots(n) { const d = $("dots"); d.innerHTML = ""; for (let i = 0; i < n; i++) d.appendChild(document.createElement("i")); }
function markDot(i) { const dots = document.querySelectorAll("#dots i"); if (dots[i]) dots[i].classList.add("done"); }

function snapOnce() {
  const w = video.videoWidth || 1280;
  const h = video.videoHeight || 960;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (facing === "user") { ctx.translate(w, 0); ctx.scale(-1, 1); }
  ctx.filter = currentFilter.css === "none" ? "none" : currentFilter.css;
  ctx.drawImage(video, 0, 0, w, h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = "none";

  // filter wajah: tumpuk lapisan buram lembut untuk menghaluskan kulit & flek
  if (currentFilter.beauty) {
    const tmp = document.createElement("canvas");
    tmp.width = w; tmp.height = h;
    tmp.getContext("2d").drawImage(c, 0, 0);
    ctx.save();
    ctx.globalAlpha = currentFilter.smooth || 0.55;
    ctx.filter = "blur(" + Math.max(3, Math.round(w / 220) + (currentFilter.blur || 5) - 5) + "px)";
    ctx.drawImage(tmp, 0, 0, w, h);
    ctx.restore();
    ctx.filter = "none";
  }

  if (currentFilter.tint) { ctx.fillStyle = currentFilter.tint; ctx.fillRect(0, 0, w, h); }
  return c;
}

function countdownOnce(n) {
  return new Promise((resolve) => {
    const el = $("countdown"); const span = el.querySelector("span");
    el.classList.add("show"); let k = n; span.textContent = k;
    span.style.animation = "none"; void span.offsetWidth; span.style.animation = "";
    const timer = setInterval(() => {
      k--;
      if (k <= 0) { clearInterval(timer); el.classList.remove("show"); resolve(); }
      else { span.textContent = k; span.style.animation = "none"; void span.offsetWidth; span.style.animation = ""; }
    }, 1000);
  });
}

async function startSequence() {
  if (busy || !stream) return;
  busy = true; $("snapBtn").disabled = true; $("flipBtn").disabled = true;
  const total = parseInt($("shotCount").value, 10);
  const secs = parseInt($("timer").value, 10) || 3;
  shots = []; buildDots(total);
  for (let i = 0; i < total; i++) {
    await countdownOnce(secs);
    const fl = $("flash"); fl.classList.remove("go"); void fl.offsetWidth; fl.classList.add("go");
    shots.push(snapOnce()); markDot(i);
    await new Promise((r) => setTimeout(r, 700));
  }
  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
  composeStrip(shots);
  busy = false; $("snapBtn").disabled = false; $("flipBtn").disabled = false;
  showResult();
}

// ---------------- PRNG kecil ----------------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------- Pattern tiap frame (diperhalus) ----------------
const PATTERNS = {
  grid(ctx, W, H, col) {
    ctx.strokeStyle = col;
    ctx.lineWidth = 0.8;
    for (let x = 0; x <= W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.lineWidth = 1.8; // garis mayor
    for (let x = 0; x <= W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  },
  stripes(ctx, W, H, col) {
    ctx.strokeStyle = col;
    for (let d = -H; d < W; d += 26) {
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + H, H); ctx.stroke();
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(d + 10, 0); ctx.lineTo(d + 10 + H, H); ctx.stroke();
    }
  },
  dots(ctx, W, H, col) {
    ctx.fillStyle = col;
    for (let y = 16; y < H; y += 26) {
      for (let x = ((Math.round(y / 26) % 2) ? 16 : 29); x < W; x += 26) {
        ctx.beginPath(); ctx.arc(x, y, 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 13, y + 13, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }
  },
  checks(ctx, W, H, col) {
    const s = 44; ctx.fillStyle = col;
    for (let r = 0; r * s < H; r++) for (let cc = 0; cc * s < W; cc++) if ((r + cc) % 2 === 0) ctx.fillRect(cc * s, r * s, s, s);
    ctx.strokeStyle = col; ctx.lineWidth = 0.6;
    for (let x = 0; x <= W; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  },
  arches(ctx, W, H, col) {
    ctx.strokeStyle = col; const s = 58;
    for (let y = s; y < H + s; y += s) for (let x = 0; x < W + s; x += s) {
      ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, s / 2, Math.PI, 0); ctx.stroke();
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y, s / 2 - 9, Math.PI, 0); ctx.stroke();
    }
  },
  waves(ctx, W, H, col) {
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    for (let y = 20; y < H; y += 24) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 6) { const yy = y + Math.sin(x / 20) * 6; x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
      ctx.stroke();
    }
  },
  terrazzo(ctx, W, H, col) {
    const rnd = mulberry32(5);
    for (let i = 0; i < 260; i++) {
      const x = rnd() * W, y = rnd() * H, r = 2 + rnd() * 5;
      ctx.globalAlpha = 0.22 + rnd() * 0.32; ctx.fillStyle = col;
      ctx.beginPath();
      const t = rnd();
      if (t < 0.5) ctx.arc(x, y, r, 0, Math.PI * 2);
      else if (t < 0.8) { ctx.save(); ctx.translate(x, y); ctx.rotate(rnd() * 6); ctx.rect(-r, -r * 0.7, r * 2, r * 1.4); ctx.restore(); }
      else { ctx.save(); ctx.translate(x, y); ctx.rotate(rnd() * 6); ctx.moveTo(-r, r); ctx.lineTo(0, -r); ctx.lineTo(r, r); ctx.closePath(); ctx.restore(); }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
  scallop(ctx, W, H, col) {
    ctx.strokeStyle = col; const s = 46;
    for (let y = s; y < H + s; y += s / 1.7) for (let x = 0; x < W + s; x += s) {
      ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, s / 2, Math.PI, 0, true); ctx.stroke();
      ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, s / 2 - 7, Math.PI, 0, true); ctx.stroke();
    }
  },
  herringbone(ctx, W, H, col) {
    ctx.strokeStyle = col; ctx.lineWidth = 4; const s = 24;
    for (let y = 0; y < H; y += s) {
      const up = (Math.round(y / s) % 2) === 0;
      for (let x = 0; x < W; x += s * 2) {
        ctx.beginPath();
        if (up) { ctx.moveTo(x, y + s); ctx.lineTo(x + s, y); } else { ctx.moveTo(x, y); ctx.lineTo(x + s, y + s); }
        ctx.stroke();
      }
    }
  },
  ticks(ctx, W, H, col) {
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; const s = 40;
    for (let y = s; y < H; y += s) for (let x = s; x < W; x += s) {
      ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, 1.6, 0, Math.PI * 2); ctx.fill();
    }
  },
};

function currentCols() { return parseInt($("layout").value, 10) === 2 ? 2 : 1; }
function currentShape() { const s = $("shape"); return s ? s.value : "rect"; }

// bentuk foto: menyiapkan path sesuai pilihan
function shapePath(ctx, x, y, w, h, shape) {
  ctx.beginPath();
  if (shape === "oval") { ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); return; }
  if (shape === "circle") { ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2); return; }
  if (shape === "arch") {
    const r = Math.min(w / 2, h * 0.55);
    ctx.moveTo(x, y + h); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h); ctx.closePath(); return;
  }
  const rr = shape === "rounded" ? 30 : 6;
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr); ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr); ctx.arcTo(x, y, x + w, y, rr); ctx.closePath();
}

// teks dengan jarak huruf (editorial)
function drawSpaced(ctx, text, cx, y, gap) {
  const chars = Array.from(text);
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  let total = widths.reduce((a, w) => a + w + gap, 0) - gap;
  let x = cx - total / 2;
  ctx.textAlign = "left";
  chars.forEach((ch, i) => { ctx.fillText(ch, x, y); x += widths[i] + gap; });
  ctx.textAlign = "center";
}

// ---------------- Susun strip (minimalis vintage) ----------------
function composeStrip(sources, canvasEl) {
  const n = sources.length;
  const th = currentTheme;
  const dark = !!th.isDark;
  const cols = currentCols();
  const rows = Math.ceil(n / cols);

  const photoW = cols === 1 ? 640 : 384;
  const photoH = Math.round(photoW * 3 / 4);
  const shape = currentShape();
  const sidePad = 58, gapX = 30, gapY = 36, top = 176, bottom = 158;
  const W = cols * photoW + (cols - 1) * gapX + sidePad * 2;
  const H = top + rows * photoH + (rows - 1) * gapY + bottom;

  const c = canvasEl || $("stripCanvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  // latar
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  th.bg.forEach((col, i) => grad.addColorStop(i / (th.bg.length - 1), col));
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  // pattern khas tema
  (PATTERNS[th.pattern] || PATTERNS.grid)(ctx, W, H, th.patternColor);

  // vignette halus
  const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.4, W / 2, H / 2, Math.max(W, H) * 0.72);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, dark ? "rgba(0,0,0,0.28)" : "rgba(60,45,35,0.08)");
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

  // bingkai keyline ganda
  ctx.strokeStyle = th.line; ctx.lineWidth = 2; roundRect(ctx, 20, 20, W - 40, H - 40, 10); ctx.stroke();
  ctx.lineWidth = 1; roundRect(ctx, 28, 28, W - 56, H - 56, 7); ctx.stroke();

  // nama photobooth di atas + rule
  ctx.fillStyle = th.accent;
  ctx.font = "700 46px 'Playfair Display', Georgia, serif";
  drawSpaced(ctx, BRAND.toUpperCase(), W / 2, 90, 6);
  ctx.strokeStyle = th.line; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W / 2 - 84, 116); ctx.lineTo(W / 2 - 14, 116); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W / 2 + 14, 116); ctx.lineTo(W / 2 + 84, 116); ctx.stroke();
  ctx.fillStyle = th.accent; ctx.beginPath(); ctx.arc(W / 2, 116, 3, 0, Math.PI * 2); ctx.fill();

  // foto-foto
  sources.forEach((src, i) => {
    const r = Math.floor(i / cols), ci = i % cols;
    const x = sidePad + ci * (photoW + gapX);
    const y = top + r * (photoH + gapY);

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.2)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#fff"; shapePath(ctx, x, y, photoW, photoH, shape); ctx.fill();
    ctx.restore();

    ctx.save();
    shapePath(ctx, x + 8, y + 8, photoW - 16, photoH - 16, shape); ctx.clip();
    coverDraw(ctx, src, x + 8, y + 8, photoW - 16, photoH - 16);
    ctx.restore();

    ctx.strokeStyle = th.line; ctx.lineWidth = 1.5;
    shapePath(ctx, x + 8, y + 8, photoW - 16, photoH - 16, shape); ctx.stroke();
  });

  // footer: tanggal (menyesuaikan warna tema) + quote kecil
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dt = new Date();
  const tgl = dt.getDate() + " " + months[dt.getMonth()].toUpperCase() + " " + dt.getFullYear();
  const fy = H - bottom;

  // rule
  ctx.strokeStyle = th.line; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W / 2 - 70, fy + 34); ctx.lineTo(W / 2 - 12, fy + 34); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W / 2 + 12, fy + 34); ctx.lineTo(W / 2 + 70, fy + 34); ctx.stroke();
  ctx.fillStyle = th.accent; ctx.beginPath(); ctx.arc(W / 2, fy + 34, 3, 0, Math.PI * 2); ctx.fill();

  // tanggal
  ctx.fillStyle = th.accent;
  ctx.font = "500 26px 'Playfair Display', Georgia, serif";
  drawSpaced(ctx, tgl, W / 2, fy + 78, 3);

  // quote kecil (muted)
  ctx.fillStyle = dark ? "rgba(255,255,255,0.55)" : "rgba(70,55,45,0.55)";
  ctx.font = "italic 400 26px 'Playfair Display', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(th.quote, W / 2, fy + 114);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function coverDraw(ctx, src, dx, dy, dw, dh) {
  const sw = src.width, sh = src.height;
  const scale = Math.max(dw / sw, dh / sh);
  const w = sw * scale, h = sh * scale;
  ctx.drawImage(src, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
}

// ---------------- Preview frame ----------------
function placeholderPhoto() {
  const w = 800, h = 600;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const x = cv.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#d7d4ce"); g.addColorStop(1, "#c3bfb8");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.fillStyle = "rgba(255,255,255,0.5)";
  x.beginPath(); x.arc(w / 2, h * 0.42, h * 0.2, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.moveTo(w / 2 - h * 0.32, h);
  x.quadraticCurveTo(w / 2, h * 0.56, w / 2 + h * 0.32, h); x.closePath(); x.fill();
  return cv;
}

function renderFramePreview() {
  const pv = $("framePreview");
  if (!pv) return;
  const arr = [placeholderPhoto(), placeholderPhoto()];
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => composeStrip(arr, pv)).catch(() => composeStrip(arr, pv));
  } else { composeStrip(arr, pv); }
}

function showResult() { $("camView").style.display = "none"; $("result").classList.add("show"); }
function showCam() { $("result").classList.remove("show"); $("camView").style.display = "block"; $("dots").innerHTML = ""; }

// ---------------- Tombol ----------------
$("startBtn").onclick = startCamera;
$("snapBtn").onclick = startSequence;
$("flipBtn").onclick = () => { facing = facing === "user" ? "environment" : "user"; startCamera(); };
$("retakeBtn").onclick = showCam;
$("downloadBtn").onclick = () => {
  const a = document.createElement("a");
  a.download = "photobooth-" + Date.now() + ".png";
  a.href = $("stripCanvas").toDataURL("image/png"); a.click();
};
$("layout").addEventListener("change", renderFramePreview);
$("shape").addEventListener("change", renderFramePreview);
renderFramePreview();

// hook pengujian
window.__composeStrip = composeStrip;
window.__setTheme = (i) => { currentTheme = THEMES[i]; renderFramePreview(); };
