"use strict";

/* ============================================================
   Dreamy Photobooth — logic
   ============================================================ */

// ---------------- Filter ----------------
const FILTERS = [
  { id: "normal", name: "Asli",    css: "none", tint: null },
  // pastel bersih, pink lembut, kontras normal
  { id: "soft",   name: "Soft",    css: "brightness(1.08) contrast(1.0) saturate(1.12)", tint: "rgba(255,200,215,0.16)" },
  // berkabut & melamun: blur + kontras rendah + semburat ungu
  { id: "dreamy", name: "Dreamy",  css: "brightness(1.3) contrast(0.72) saturate(1.3) blur(1.1px)", tint: "rgba(220,190,255,0.32)" },
  // rose hangat (kemerahan)
  { id: "rose",   name: "Rosé",    css: "saturate(1.35) brightness(1.02) sepia(0.14)", tint: "rgba(255,95,120,0.26)" },
  // bubblegum sejuk: terang, lembut, magenta muda
  { id: "blush",  name: "Blush",   css: "brightness(1.14) contrast(0.9) saturate(1.2)", tint: "rgba(255,150,205,0.30)" },
  // coral-oranye
  { id: "peach",  name: "Peach",   css: "sepia(0.4) saturate(1.7) brightness(1.06)", tint: "rgba(255,140,80,0.28)" },
  // emas golden-hour (kuning)
  { id: "golden", name: "Golden",  css: "sepia(0.8) saturate(1.5) brightness(1.1) contrast(1.05)", tint: "rgba(255,180,40,0.32)" },
  // pop permen: sangat pekat + pink
  { id: "candy",  name: "Candy",   css: "saturate(2.1) contrast(1.15) brightness(1.08)", tint: "rgba(255,110,200,0.22)" },
  // vivid netral tanpa semburat
  { id: "vivid",  name: "Vivid",   css: "saturate(2) contrast(1.28) brightness(1.0)", tint: null },
  // biru pekat
  { id: "cool",   name: "Sejuk",   css: "saturate(1.4) hue-rotate(-20deg) brightness(1.02)", tint: "rgba(80,150,255,0.26)" },
  // es: terang, pudar, cyan
  { id: "frost",  name: "Frost",   css: "saturate(0.7) hue-rotate(-40deg) brightness(1.22) contrast(1.05)", tint: "rgba(150,210,255,0.30)" },
  // hijau mint
  { id: "mint",   name: "Mint",    css: "saturate(1.45) hue-rotate(35deg) brightness(1.04)", tint: "rgba(110,225,175,0.28)" },
  // pudar matte
  { id: "fade",   name: "Fade",    css: "contrast(0.68) brightness(1.16) saturate(0.6)", tint: "rgba(255,248,238,0.20)" },
  // vintage hangat terang
  { id: "sepia",  name: "Vintage", css: "sepia(0.95) saturate(1.2) brightness(1.05) contrast(1.02)", tint: "rgba(255,205,135,0.22)" },
  // film moody: gelap, kehijauan, kontras
  { id: "film",   name: "Film",    css: "sepia(0.4) hue-rotate(-12deg) contrast(1.3) brightness(0.9) saturate(0.95)", tint: "rgba(120,140,110,0.20)" },
  // hitam-putih netral
  { id: "mono",   name: "Mono",    css: "grayscale(1) contrast(1.12)", tint: null },
  // noir dramatis
  { id: "noir",   name: "Noir",    css: "grayscale(1) contrast(1.7) brightness(0.82)", tint: null },
];
let currentFilter = FILTERS[1];

// ---------------- Tema frame ----------------
const THEMES = [
  { id: "strawberry", name: "🍓 Strawberry", title: "strawberry kiss", quote: "semanis stroberi, selembut cinta",
    bg: ["#ffe7f1", "#ffd0e4"], dot: "rgba(255,150,190,0.30)", accent: "#ff5c92", photoBorder: "#ffb3cd", footer: "#ff6f9e",
    stickers: ["🍓", "🌸", "💗", "🎀", "🍰"] },
  { id: "sky", name: "☁️ Sky", title: "dreamy sky", quote: "seluas langit, selembut awan",
    bg: ["#e6f1ff", "#d4e6ff"], dot: "rgba(130,180,255,0.25)", accent: "#4f86d6", photoBorder: "#bcd8ff", footer: "#5b8fd6",
    stickers: ["☁️", "⭐", "🌙", "💙", "🕊️"] },
  { id: "matcha", name: "🍵 Matcha", title: "fresh matcha", quote: "setenang pagi yang hijau",
    bg: ["#e9f7ee", "#d5efd9"], dot: "rgba(120,200,150,0.25)", accent: "#4faa6d", photoBorder: "#bfe6c8", footer: "#5fa876",
    stickers: ["🍃", "🌿", "⭐", "🍵", "💚"] },
  { id: "bear", name: "🧸 Honey Bear", title: "honey bear", quote: "sehangat pelukan di pagi hari",
    bg: ["#fff3e2", "#ffe7cc"], dot: "rgba(230,180,120,0.28)", accent: "#c68a4a", photoBorder: "#ffd9a8", footer: "#bd8a55",
    stickers: ["🧸", "🍯", "🐾", "⭐", "🌻"] },
  { id: "y2k", name: "✨ Y2K", title: "cyber cutie", quote: "main karakter, selalu",
    bg: ["#ffd1e8", "#c9b6f5", "#b6d8ff"], dot: "rgba(255,255,255,0.45)", accent: "#8a5bd6", photoBorder: "#ffffff", footer: "#9a5bd6",
    stickers: ["✨", "💿", "🦋", "💖", "🌟"] },
  { id: "sakura", name: "🌸 Sakura", title: "sakura dream", quote: "mekar indah sekali seumur hidup",
    bg: ["#fff0f5", "#ffdce8"], dot: "rgba(255,170,200,0.28)", accent: "#e86b96", photoBorder: "#ffc4d8", footer: "#e07090",
    stickers: ["🌸", "🌷", "🦋", "💮", "🏵️"] },
  { id: "galaxy", name: "🌙 Galaxy", title: "starry night", quote: "kamu, bintang paling terang", isDark: true,
    bg: ["#3a2b63", "#5a4a8a", "#2d2450"], dot: "rgba(255,255,255,0.35)", accent: "#e9dcff", photoBorder: "#c9b6f5", footer: "#8a6fc9",
    stickers: ["🌙", "⭐", "✨", "🪐", "💫"] },
  { id: "peachy", name: "🍑 Peachy", title: "peachy sunset", quote: "semanis langit senja",
    bg: ["#ffe9d6", "#ffd0b0", "#ffb8d0"], dot: "rgba(255,170,120,0.26)", accent: "#e8784f", photoBorder: "#ffc9a8", footer: "#e0824f",
    stickers: ["🍑", "🌅", "🧡", "⭐", "🌻"] },
  { id: "blueberry", name: "🫐 Blueberry", title: "blueberry pop", quote: "kecil, tapi berkesan",
    bg: ["#e4e3ff", "#cdd4ff"], dot: "rgba(150,160,255,0.24)", accent: "#6a66d6", photoBorder: "#c2c6ff", footer: "#7068d0",
    stickers: ["🫐", "💜", "⭐", "🌀", "💙"] },
  { id: "noir", name: "🖤 Noir", title: "mon chéri", quote: "classic never fades",
    bg: ["#f4f1f2", "#e7e1e4"], dot: "rgba(70,60,66,0.14)", accent: "#3a2f34", photoBorder: "#4a3f44", footer: "#5a4f54",
    stickers: ["🖤", "✦", "♡", "✧", "☕"] },
  { id: "lemon", name: "🍋 Lemon", title: "lemon soda", quote: "secerah pagi musim panas",
    bg: ["#fff6d6", "#ffeeb0"], dot: "rgba(240,200,80,0.26)", accent: "#d9a400", photoBorder: "#ffe08a", footer: "#c99a2f",
    stickers: ["🍋", "🌼", "⭐", "🐝", "🌟"] },
  { id: "ocean", name: "🌊 Ocean", title: "ocean breeze", quote: "setenang debur ombak",
    bg: ["#d6f3f5", "#bfe6ff"], dot: "rgba(90,190,210,0.24)", accent: "#2f93b0", photoBorder: "#bfe6f0", footer: "#3f9fb5",
    stickers: ["🌊", "🐚", "⭐", "🐬", "💧"] },
  { id: "cocoa", name: "🍫 Cocoa", title: "sweet cocoa", quote: "hangat, manis, dan nyaman",
    bg: ["#efe1d6", "#e3cdb8"], dot: "rgba(150,110,80,0.20)", accent: "#8a5a3a", photoBorder: "#d8b89a", footer: "#9a6a4a",
    stickers: ["🍫", "☕", "🧸", "🍪", "⭐"] },
  { id: "lavender", name: "💜 Lavender", title: "lavender haze", quote: "menenangkan seperti senja ungu",
    bg: ["#f0e6ff", "#e2d2ff"], dot: "rgba(170,130,230,0.22)", accent: "#8a5bd6", photoBorder: "#d8c4f5", footer: "#8f66c9",
    stickers: ["💜", "🪻", "⭐", "🦋", "✨"] },
  { id: "rainbow", name: "🌈 Rainbow", title: "over the rainbow", quote: "setelah hujan, selalu ada warna",
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

// ---------------- Susun strip ----------------
function currentCols() { return parseInt($("layout").value, 10) === 2 ? 2 : 1; }

function composeStrip(sources) {
  const n = sources.length;
  const th = currentTheme;
  const dark = !!th.isDark;
  const cs = th.stickers;
  const cols = currentCols();
  const rows = Math.ceil(n / cols);

  const photoW = cols === 1 ? 640 : 384;
  const photoH = Math.round(photoW * 3 / 4);
  const sidePad = 50, gapX = 34, gapY = 46, top = 186, bottom = 206;
  const W = cols * photoW + (cols - 1) * gapX + sidePad * 2;
  const H = top + rows * photoH + (rows - 1) * gapY + bottom;

  const c = $("stripCanvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  // --- latar gradasi ---
  const grad = ctx.createLinearGradient(0, 0, W, H);
  th.bg.forEach((col, i) => grad.addColorStop(i / (th.bg.length - 1), col));
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  // --- kilau lembut di atas (depth) ---
  const sheen = ctx.createLinearGradient(0, 0, 0, H * 0.4);
  sheen.addColorStop(0, "rgba(255,255,255,0.18)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen; ctx.fillRect(0, 0, W, H * 0.4);

  // --- vignette halus di tepi (bingkai terasa) ---
  const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, dark ? "rgba(0,0,0,0.18)" : "rgba(120,80,100,0.08)");
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

  // --- motif polkadot halus ---
  ctx.fillStyle = th.dot;
  for (let y = 40; y < H; y += 52) {
    for (let x = ((Math.round(y / 52) % 2) ? 40 : 66); x < W; x += 52) {
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    }
  }

  // --- confetti halus hanya di area foto (kelihatan di sela, bukan di judul/footer) ---
  const rnd = mulberry32(7);
  ctx.globalAlpha = 0.5; ctx.textAlign = "center";
  for (let i = 0; i < 18; i++) {
    const s = cs[Math.floor(rnd() * cs.length)];
    ctx.font = (18 + rnd() * 14) + "px serif";
    ctx.fillText(s, rnd() * W, top + rnd() * (H - bottom - top));
  }
  ctx.globalAlpha = 1;

  // --- bingkai bermat (double border) ---
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.5)" : hexA(th.footer, 0.5);
  ctx.lineWidth = 5; roundRect(ctx, 14, 14, W - 28, H - 28, 26); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2.5; ctx.setLineDash([9, 8]);
  roundRect(ctx, 26, 26, W - 52, H - 52, 20); ctx.stroke();
  ctx.setLineDash([]);

  // --- ornamen 4 sudut (stiker + aksen kecil) ---
  ctx.textAlign = "center";
  const corners = [[52, 66], [W - 52, 66], [52, H - 40], [W - 52, H - 40]];
  corners.forEach((p, i) => {
    ctx.font = "30px serif"; ctx.fillText(cs[i % cs.length], p[0], p[1]);
    ctx.font = "16px serif"; ctx.fillStyle = dark ? "rgba(255,255,255,0.7)" : hexA(th.accent, 0.7);
    ctx.fillText("✦", p[0] + (p[0] < W / 2 ? 24 : -24), p[1] - 14);
  });

  // --- judul (tulisan sambung, dengan bayangan lembut) ---
  ctx.save();
  ctx.shadowColor = dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.9)";
  ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
  ctx.fillStyle = th.accent;
  ctx.font = "400 94px 'Great Vibes', cursive";
  ctx.fillText(th.title, W / 2, 118);
  ctx.restore();
  ctx.font = "30px serif"; ctx.fillStyle = dark ? "#fff" : th.footer;
  ctx.fillText(cs[0] + "  ♡  " + cs[1], W / 2, 160);

  // --- foto-foto (grid) ---
  sources.forEach((src, i) => {
    const r = Math.floor(i / cols), ci = i % cols;
    const x = sidePad + ci * (photoW + gapX);
    const y = top + r * (photoH + gapY);

    // kartu putih + bayangan
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.16)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 7;
    roundRect(ctx, x, y, photoW, photoH, 16); ctx.fillStyle = "#fff"; ctx.fill();
    ctx.restore();

    // border warna tema
    ctx.save();
    roundRect(ctx, x + 3, y + 3, photoW - 6, photoH - 6, 14);
    ctx.strokeStyle = th.photoBorder; ctx.lineWidth = 7; ctx.stroke();
    roundRect(ctx, x + 10, y + 10, photoW - 20, photoH - 20, 10); ctx.clip();
    coverDraw(ctx, src, x + 10, y + 10, photoW - 20, photoH - 20);
    ctx.restore();

    // garis dalam putih tipis
    ctx.save();
    roundRect(ctx, x + 10, y + 10, photoW - 20, photoH - 20, 10);
    ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();

    // selotip washi di dua sudut atas
    washiTape(ctx, x + 40, y - 2, hexA(th.accent, 0.42), -0.35);
    washiTape(ctx, x + photoW - 40, y - 2, hexA(th.accent, 0.42), 0.35);

    // satu stiker kecil di pojok bawah foto
    ctx.font = "32px serif"; ctx.textAlign = "center";
    rotatedSticker(ctx, cs[(i + 1) % cs.length], x + photoW - 24, y + photoH - 16, 0.15);
  });

  // ---- footer menyesuaikan tema ----
  const d = new Date();
  const tgl = d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const fy = H - bottom;
  ctx.textAlign = "center";

  // pembatas hiasan
  const dy = fy + 32;
  ctx.strokeStyle = th.dot; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2 - 170, dy); ctx.lineTo(W / 2 - 70, dy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W / 2 + 70, dy); ctx.lineTo(W / 2 + 170, dy); ctx.stroke();
  ctx.font = "26px serif"; ctx.fillStyle = dark ? "#fff" : th.footer;
  ctx.fillText(cs[1] + " " + cs[0] + " " + cs[2], W / 2, dy + 9);

  // pil tanggal transparan bernuansa tema
  const by = fy + 104, pillW = Math.min(400, W - 90), pillH = 58;
  ctx.fillStyle = dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.6)";
  roundRect(ctx, (W - pillW) / 2, by - 42, pillW, pillH, 29); ctx.fill();
  ctx.strokeStyle = dark ? "rgba(255,255,255,0.35)" : hexA(th.footer, 0.45);
  ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = dark ? "#ffffff" : th.footer;
  ctx.font = "700 30px 'Quicksand', sans-serif";
  ctx.fillText(cs[3] + "   " + tgl + "   " + cs[4], W / 2, by - 2);

  // quote tulisan sambung
  ctx.font = "700 48px 'Dancing Script', cursive"; ctx.fillStyle = th.accent;
  ctx.fillText(th.quote, W / 2, by + 62);
}

function washiTape(ctx, cx, cy, color, rot) {
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = color;
  ctx.fillRect(-42, -13, 84, 26);
  ctx.restore();
}

function hexA(hex, a) {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((x) => x + x).join("") : m;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
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
