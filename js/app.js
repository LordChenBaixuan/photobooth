"use strict";

/* ============================================================
   Dreamy Photobooth — logic
   ============================================================ */

// ---------------- Filter ----------------
const FILTERS = [
  { id: "normal", name: "Asli",    css: "none", tint: null },
  { id: "soft",   name: "Soft",    css: "saturate(1.1) brightness(1.08) contrast(0.96)", tint: "rgba(255,190,214,0.16)" },
  { id: "dreamy", name: "Dreamy",  css: "brightness(1.12) contrast(0.9) saturate(1.1)", tint: "rgba(255,220,235,0.15)" },
  { id: "rose",   name: "Rosé",    css: "saturate(1.15) brightness(1.05)", tint: "rgba(255,150,190,0.18)" },
  { id: "blush",  name: "Blush",   css: "saturate(1.2) brightness(1.04)", tint: "rgba(255,130,175,0.20)" },
  { id: "peach",  name: "Peach",   css: "sepia(0.25) saturate(1.3) brightness(1.06)", tint: "rgba(255,190,150,0.14)" },
  { id: "golden", name: "Golden",  css: "sepia(0.4) saturate(1.3) brightness(1.08)", tint: "rgba(255,195,120,0.15)" },
  { id: "warm",   name: "Hangat",  css: "saturate(1.25) sepia(0.2) brightness(1.05)", tint: "rgba(255,210,170,0.12)" },
  { id: "candy",  name: "Candy",   css: "saturate(1.6) brightness(1.06) contrast(1.05)", tint: "rgba(255,180,220,0.12)" },
  { id: "vivid",  name: "Vivid",   css: "saturate(1.55) contrast(1.12)", tint: null },
  { id: "cool",   name: "Sejuk",   css: "saturate(1.1) hue-rotate(-12deg) brightness(1.05)", tint: "rgba(180,220,255,0.12)" },
  { id: "frost",  name: "Frost",   css: "saturate(1.05) hue-rotate(-18deg) brightness(1.1) contrast(1.02)", tint: "rgba(200,225,255,0.16)" },
  { id: "mint",   name: "Mint",    css: "saturate(1.1) hue-rotate(15deg) brightness(1.05)", tint: "rgba(190,235,210,0.14)" },
  { id: "fade",   name: "Fade",    css: "contrast(0.82) brightness(1.08) saturate(0.82)", tint: "rgba(255,245,235,0.12)" },
  { id: "film",   name: "Film",    css: "sepia(0.45) contrast(1.1) brightness(0.98) saturate(0.9)", tint: "rgba(235,225,200,0.12)" },
  { id: "sepia",  name: "Vintage", css: "sepia(0.65) contrast(1.05) brightness(1.02)", tint: "rgba(255,225,190,0.12)" },
  { id: "mono",   name: "Mono",    css: "grayscale(1) contrast(1.05)", tint: null },
  { id: "noir",   name: "Noir",    css: "grayscale(1) contrast(1.28) brightness(0.95)", tint: null },
];
let currentFilter = FILTERS[1];

// ---------------- Tema frame ----------------
const THEMES = [
  { id: "strawberry", name: "🍓 Strawberry", title: "strawberry kiss",
    bg: ["#ffe7f1", "#ffd0e4"], dot: "rgba(255,150,190,0.30)", accent: "#ff5c92", photoBorder: "#ffb3cd", footer: "#ff6f9e",
    stickers: ["🍓", "🌸", "💗", "🎀", "🍰"] },
  { id: "sky", name: "☁️ Sky", title: "dreamy sky",
    bg: ["#e6f1ff", "#d4e6ff"], dot: "rgba(130,180,255,0.25)", accent: "#4f86d6", photoBorder: "#bcd8ff", footer: "#5b8fd6",
    stickers: ["☁️", "⭐", "🌙", "💙", "🕊️"] },
  { id: "matcha", name: "🍵 Matcha", title: "fresh matcha",
    bg: ["#e9f7ee", "#d5efd9"], dot: "rgba(120,200,150,0.25)", accent: "#4faa6d", photoBorder: "#bfe6c8", footer: "#5fa876",
    stickers: ["🍃", "🌿", "⭐", "🍵", "💚"] },
  { id: "bear", name: "🧸 Honey Bear", title: "honey bear",
    bg: ["#fff3e2", "#ffe7cc"], dot: "rgba(230,180,120,0.28)", accent: "#c68a4a", photoBorder: "#ffd9a8", footer: "#bd8a55",
    stickers: ["🧸", "🍯", "🐾", "⭐", "🌻"] },
  { id: "y2k", name: "✨ Y2K", title: "cyber cutie",
    bg: ["#ffd1e8", "#c9b6f5", "#b6d8ff"], dot: "rgba(255,255,255,0.45)", accent: "#8a5bd6", photoBorder: "#ffffff", footer: "#9a5bd6",
    stickers: ["✨", "💿", "🦋", "💖", "🌟"] },
  { id: "sakura", name: "🌸 Sakura", title: "sakura dream",
    bg: ["#fff0f5", "#ffdce8"], dot: "rgba(255,170,200,0.28)", accent: "#e86b96", photoBorder: "#ffc4d8", footer: "#e07090",
    stickers: ["🌸", "🌷", "🦋", "💮", "🏵️"] },
  { id: "galaxy", name: "🌙 Galaxy", title: "starry night",
    bg: ["#3a2b63", "#5a4a8a", "#2d2450"], dot: "rgba(255,255,255,0.35)", accent: "#e9dcff", photoBorder: "#c9b6f5", footer: "#8a6fc9",
    stickers: ["🌙", "⭐", "✨", "🪐", "💫"] },
  { id: "peachy", name: "🍑 Peachy", title: "peachy sunset",
    bg: ["#ffe9d6", "#ffd0b0", "#ffb8d0"], dot: "rgba(255,170,120,0.26)", accent: "#e8784f", photoBorder: "#ffc9a8", footer: "#e0824f",
    stickers: ["🍑", "🌅", "🧡", "⭐", "🌻"] },
  { id: "blueberry", name: "🫐 Blueberry", title: "blueberry pop",
    bg: ["#e4e3ff", "#cdd4ff"], dot: "rgba(150,160,255,0.24)", accent: "#6a66d6", photoBorder: "#c2c6ff", footer: "#7068d0",
    stickers: ["🫐", "💜", "⭐", "🌀", "💙"] },
  { id: "noir", name: "🖤 Noir", title: "mon chéri",
    bg: ["#f4f1f2", "#e7e1e4"], dot: "rgba(70,60,66,0.14)", accent: "#3a2f34", photoBorder: "#4a3f44", footer: "#5a4f54",
    stickers: ["🖤", "✦", "♡", "✧", "☕"] },
  { id: "lemon", name: "🍋 Lemon", title: "lemon soda",
    bg: ["#fff6d6", "#ffeeb0"], dot: "rgba(240,200,80,0.26)", accent: "#d9a400", photoBorder: "#ffe08a", footer: "#c99a2f",
    stickers: ["🍋", "🌼", "⭐", "🐝", "🌟"] },
  { id: "ocean", name: "🌊 Ocean", title: "ocean breeze",
    bg: ["#d6f3f5", "#bfe6ff"], dot: "rgba(90,190,210,0.24)", accent: "#2f93b0", photoBorder: "#bfe6f0", footer: "#3f9fb5",
    stickers: ["🌊", "🐚", "⭐", "🐬", "💧"] },
  { id: "cocoa", name: "🍫 Cocoa", title: "sweet cocoa",
    bg: ["#efe1d6", "#e3cdb8"], dot: "rgba(150,110,80,0.20)", accent: "#8a5a3a", photoBorder: "#d8b89a", footer: "#9a6a4a",
    stickers: ["🍫", "☕", "🧸", "🍪", "⭐"] },
  { id: "lavender", name: "💜 Lavender", title: "lavender haze",
    bg: ["#f0e6ff", "#e2d2ff"], dot: "rgba(170,130,230,0.22)", accent: "#8a5bd6", photoBorder: "#d8c4f5", footer: "#8f66c9",
    stickers: ["💜", "🪻", "⭐", "🦋", "✨"] },
  { id: "rainbow", name: "🌈 Rainbow", title: "over the rainbow",
    bg: ["#ffd6e8", "#fff0c2", "#d6f5e0", "#d6e8ff"], dot: "rgba(255,255,255,0.4)", accent: "#ff7fa8", photoBorder: "#ffffff", footer: "#9a7fd6",
    stickers: ["🌈", "⭐", "💗", "✨", "🍬"] },
];
let currentTheme = THEMES[0];

const $ = (id) => document.getElementById(id);
const video = $("video");
let stream = null;
let facing = "user";
let shots = [];
let busy = false;

// ---------------- Hiasan latar melayang ----------------
(function decor() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = $("decor");
  if (!layer) return;
  const set = ["🌸", "⭐", "💗", "✨", "🎀", "🍓", "☁️"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("div");
    s.className = "float";
    s.textContent = set[i % set.length];
    s.style.left = Math.random() * 96 + "vw";
    s.style.top = Math.random() * 92 + "vh";
    s.style.fontSize = Math.random() * 16 + 18 + "px";
    s.style.animationDuration = Math.random() * 3 + 3 + "s";
    s.style.animationDirection = i % 2 ? "alternate" : "alternate-reverse";
    layer.appendChild(s);
  }
})();

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
    };
    tWrap.appendChild(c);
  });
})();

function applyPreviewFilter() { video.style.filter = currentFilter.css; }

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
    $("hint").textContent = "Siap! Pilih filter & tema, lalu jepret ✿";
  } catch (err) {
    $("stageMsg").style.display = "block";
    $("stageMsg").innerHTML =
      '<span class="big">🥺</span>Kamera tidak bisa diakses.<br><small>' +
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
  shots = []; buildDots(total);
  for (let i = 0; i < total; i++) {
    await countdownOnce(3);
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

// ---------------- Susun strip ----------------
function composeStrip(sources) {
  const n = sources.length;
  const PW = 620, PH = Math.round(PW * 3 / 4);
  const sidePad = 46, gap = 54, top = 170, bottom = 180;
  const W = PW + sidePad * 2;
  const H = top + n * PH + (n - 1) * gap + bottom;
  const th = currentTheme;

  const c = $("stripCanvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  // latar gradasi
  const grad = ctx.createLinearGradient(0, 0, W, H);
  th.bg.forEach((col, i) => grad.addColorStop(i / (th.bg.length - 1), col));
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  // polkadot
  ctx.fillStyle = th.dot;
  for (let y = 30; y < H; y += 46) {
    for (let x = (y % 92 === 0 ? 30 : 53); x < W; x += 46) {
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // confetti stiker
  const rnd = mulberry32(99);
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 26; i++) {
    const s = th.stickers[Math.floor(rnd() * th.stickers.length)];
    const size = 20 + rnd() * 18;
    ctx.font = size + "px serif"; ctx.textAlign = "center";
    ctx.fillText(s, rnd() * W, top * 0.4 + rnd() * (H - top * 0.4));
  }
  ctx.globalAlpha = 1;

  // border dalam putus-putus
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 3; ctx.setLineDash([10, 9]);
  roundRect(ctx, 16, 16, W - 32, H - 32, 22); ctx.stroke();
  ctx.setLineDash([]);

  // judul (tulisan sambung)
  ctx.textAlign = "center";
  ctx.fillStyle = th.accent;
  ctx.font = "400 86px 'Great Vibes', cursive";
  ctx.fillText(th.title, W / 2, 104);
  ctx.font = "30px serif";
  ctx.fillText(th.stickers[0] + "  ♡  " + th.stickers[1], W / 2, 144);

  // foto + hiasan
  sources.forEach((src, i) => {
    const y = top + i * (PH + gap);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.14)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
    roundRect(ctx, sidePad, y, PW, PH, 18); ctx.fillStyle = "#fff"; ctx.fill();
    ctx.restore();

    ctx.save();
    roundRect(ctx, sidePad + 4, y + 4, PW - 8, PH - 8, 15);
    ctx.strokeStyle = th.photoBorder; ctx.lineWidth = 6; ctx.stroke();
    roundRect(ctx, sidePad + 9, y + 9, PW - 18, PH - 18, 12); ctx.clip();
    coverDraw(ctx, src, sidePad + 9, y + 9, PW - 18, PH - 18);
    ctx.restore();

    ctx.font = "40px serif"; ctx.textAlign = "center";
    rotatedSticker(ctx, th.stickers[(i + 1) % th.stickers.length], sidePad + PW - 18, y + 22, -0.25);
    rotatedSticker(ctx, th.stickers[(i + 3) % th.stickers.length], sidePad + 22, y + PH - 16, 0.2);

    if (i < n - 1) {
      const gy = y + PH + gap / 2 + 6;
      ctx.font = "30px serif";
      const row = [th.stickers[i % th.stickers.length], "✧", th.stickers[(i + 2) % th.stickers.length]];
      row.forEach((s, j) => ctx.fillText(s, W / 2 + (j - 1) * 54, gy));
    }
  });

  // footer
  const d = new Date();
  const tgl = d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const by = H - bottom + 54;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.1)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
  const pillW = 320, pillH = 56;
  roundRect(ctx, (W - pillW) / 2, by - 40, pillW, pillH, 28);
  ctx.fillStyle = "#fff"; ctx.fill(); ctx.restore();
  ctx.fillStyle = th.footer; ctx.font = "700 30px 'Quicksand', sans-serif"; ctx.textAlign = "center";
  ctx.fillText("📅 " + tgl, W / 2, by - 2);
  ctx.font = "700 48px 'Dancing Script', cursive"; ctx.fillStyle = th.accent;
  ctx.fillText("sweet little moment " + th.stickers[0], W / 2, by + 62);
}

function rotatedSticker(ctx, s, x, y, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillText(s, 0, 0); ctx.restore(); }
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

// hook pengujian
window.__composeStrip = composeStrip;
window.__setTheme = (i) => { currentTheme = THEMES[i]; };
