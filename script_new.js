// ===== KHÔNG GIAN 3D TƯƠNG TÁC =====
const canvas3D = document.getElementById("space3d");
const ctx = canvas3D.getContext("2d");

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Thiết lập canvas
function resizeCanvas() {
  canvas3D.width = window.innerWidth;
  canvas3D.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Class Particle 3D với tương tác
class Particle3D {
  constructor() {
    this.reset();
    this.baseX = this.x;
    this.baseY = this.y;
    this.baseZ = this.z;
  }

  reset() {
    this.x = Math.random() * canvas3D.width;
    this.y = Math.random() * canvas3D.height;
    this.z = Math.random() * 1500 + 500;
    this.baseX = this.x;
    this.baseY = this.y;
    this.baseZ = this.z;

    this.size = Math.random() * 3 + 1;

    // Màu neon
    const colors = [
      "rgba(255, 110, 199, ", // Pink
      "rgba(126, 232, 250, ", // Cyan
      "rgba(138, 43, 226, ", // Purple
      "rgba(255, 20, 147, ", // Deep pink
      "rgba(0, 242, 254, ", // Bright cyan
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.vz = Math.random() * 1 + 0.5;

    // Thuộc tính cho tương tác chuột
    this.mousePower = Math.random() * 50 + 50;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.angle = Math.random() * Math.PI * 2;
  }

  update(mouseInfluence = 0) {
    // Di chuyển về phía trước
    this.z -= this.vz;

    // Tương tác với chuột - Particles bị đẩy ra
    const dx = this.x - targetX;
    const dy = this.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 300;

    if (distance < maxDistance) {
      const force = (1 - distance / maxDistance) * this.mousePower;
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * force * 0.1;
      this.y += Math.sin(angle) * force * 0.1;
    } else {
      // Quay về vị trí ban đầu
      this.x += (this.baseX - this.x) * 0.05;
      this.y += (this.baseY - this.y) * 0.05;
    }

    // Rotation effect
    this.angle += this.rotationSpeed;
    this.x += Math.cos(this.angle) * 0.5;
    this.y += Math.sin(this.angle) * 0.5;

    // Reset nếu ra khỏi màn hình
    if (this.z <= 0) {
      this.reset();
      this.z = 1500;
    }

    if (
      this.x < -100 ||
      this.x > canvas3D.width + 100 ||
      this.y < -100 ||
      this.y > canvas3D.height + 100
    ) {
      this.reset();
    }
  }

  draw() {
    // Perspective 3D
    const scale = 1000 / (1000 + this.z);
    const x2d = (this.x - canvas3D.width / 2) * scale + canvas3D.width / 2;
    const y2d = (this.y - canvas3D.height / 2) * scale + canvas3D.height / 2;
    const size = this.size * scale;
    const opacity = Math.min(1, 1 - this.z / 1500);

    // Vẽ glow effect
    const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 3);
    gradient.addColorStop(0, this.color + opacity + ")");
    gradient.addColorStop(0.5, this.color + opacity * 0.5 + ")");
    gradient.addColorStop(1, this.color + "0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x2d, y2d, size * 3, 0, Math.PI * 2);
    ctx.fill();

    // Vẽ particle chính
    ctx.shadowBlur = 20 * scale;
    ctx.shadowColor = this.color + "1)";
    ctx.fillStyle = this.color + opacity + ")";
    ctx.beginPath();
    ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
    ctx.fill();

    // Vẽ trail nếu gần
    if (this.z < 800) {
      ctx.strokeStyle = this.color + opacity * 0.3 + ")";
      ctx.lineWidth = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(x2d, y2d);
      const trailX = x2d + this.vx * 10 * scale;
      const trailY = y2d + this.vy * 10 * scale;
      ctx.lineTo(trailX, trailY);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }

  get screenX() {
    const scale = 1000 / (1000 + this.z);
    return (this.x - canvas3D.width / 2) * scale + canvas3D.width / 2;
  }

  get screenY() {
    const scale = 1000 / (1000 + this.z);
    return (this.y - canvas3D.height / 2) * scale + canvas3D.height / 2;
  }
}

// Tạo particles
const particles = [];
const particleCount = 200;

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle3D());
}

// Theo dõi chuột
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ===== CHAOS FLYING ENGINE - CỰC CHAOS - TẤT CẢ PHẦN TỬ =====
(() => {
  // SELECTOR: tất cả phần tử khác (không chỉ card)
  const selector =
    "*:not(script):not(style):not(meta):not(link):not(title):not(head)";
  let chaosActive = false;
  const flying = [];
  let rafId = null;
  let timeStep = 0;
  const excludeTags = [
    "SCRIPT",
    "STYLE",
    "META",
    "LINK",
    "TITLE",
    "HEAD",
    "HTML",
    "BODY",
    "CANVAS",
  ];

  function initFlyingElements() {
    flying.length = 0;
    timeStep = 0;
    document.querySelectorAll(selector).forEach((el) => {
      // skip invisible/excluded elements
      if (excludeTags.includes(el.tagName)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.top < -2000 || rect.left < -2000) return; // outside viewport

      // place element where it currently is - FIXED position
      el.classList.add("flying");
      el.style.position = "fixed";
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.top}px`;
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      el.style.margin = "0";
      el.style.pointerEvents = "auto";
      el.style.zIndex = "9999";

      const obj = {
        el,
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        vx: (Math.random() - 0.5) * 3, // VẬN TỐC RẤT CHẬM
        vy: (Math.random() - 0.5) * 3,
        ax: 0,
        ay: 0,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 5, // XOAY RẤT CHẬM
        angularAcc: (Math.random() - 0.5) * 0.2, // CHAOS TỐI THIỂU
        delay: Math.random() * 200,
        started: false,
        scale: 1,
      };

      flying.push(obj);
    });
  }

  function chaosStep() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    timeStep++;

    for (let i = 0; i < flying.length; i++) {
      const f = flying[i];
      if (!f.started) {
        f.delay -= 16;
        if (f.delay <= 0) f.started = true;
        else continue;
      }

      // === LƠ LỬNG NHẸ NHÀNG - CHẬM ĐÃ ===
      // Rất ít thay đổi acceleration
      if (Math.random() < 0.01) {
        f.ax = (Math.random() - 0.5) * 0.01;
        f.ay = (Math.random() - 0.5) * 0.01;
      }

      // Gia tốc áp dụng
      f.vx += f.ax;
      f.vy += f.ay;

      // Giới hạn tốc độ RẤT CHẬM - MOBILE FRIENDLY
      const speedLimit = 0.1; // 0.1 px/frame thôi
      const speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
      if (speed > speedLimit) {
        f.vx *= speedLimit / speed;
        f.vy *= speedLimit / speed;
      }

      f.x += f.vx;
      f.y += f.vy;

      // Xoay rất chậm
      f.rotSpeed += f.angularAcc;
      if (Math.random() < 0.01) {
        f.angularAcc = (Math.random() - 0.5) * 0.02;
      }
      // Xoay tròn rất hiếm
      if (Math.random() < 0.002) {
        f.rot = Math.random() * 360;
        f.rotSpeed = (Math.random() - 0.5) * 0.1;
      }
      f.rot += f.rotSpeed;

      // === BOUNCE NHẸ NHÀNG ===
      if (f.x > w) {
        f.x = -f.w;
        f.vx *= -0.8;
      }
      if (f.x + f.w < 0) {
        f.x = w;
        f.vx *= -0.8;
      }
      if (f.y > h) {
        f.y = -f.h;
        f.vy *= -0.8;
      }
      if (f.y + f.h < 0) {
        f.y = h;
        f.vy *= -0.8;
      }

      // === KHÔNG VA CHẠM ===
      // Tắt va chạm để tăng tốc độ render

      // apply transform
      f.el.style.left = `${Math.round(f.x)}px`;
      f.el.style.top = `${Math.round(f.y)}px`;
      f.el.style.transform = `rotate(${f.rot}deg) scale(${
        0.9 + Math.sin(timeStep * 0.02) * 0.1
      })`;
    }

    rafId = requestAnimationFrame(chaosStep);
  }

  function startChaos() {
    if (chaosActive) return;
    initFlyingElements();
    chaosActive = true;
    rafId = requestAnimationFrame(chaosStep);
    console.log(
      "🎆 CHAOS MODE ACTIVATED! 🎆 Các thẻ bay loạn xạ không quy luật! Nhấn 'f' để tắt, 'r' để reload."
    );
  }

  function stopChaos() {
    if (!chaosActive) return;
    chaosActive = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    document
      .querySelectorAll(selector)
      .forEach((el) => el.classList.remove("flying"));
    console.log(
      'Chaos stopped. Press "f" to start again or "r" to reload page.'
    );
  }

  // Key controls: f = toggle flight, r = reload/reset
  document.addEventListener("keydown", (e) => {
    if (!e.key) return;
    const k = e.key.toLowerCase();
    if (k === "f") {
      if (chaosActive) stopChaos();
      else startChaos();
    }
    if (k === "r") {
      location.reload();
    }
  });

  // Optional: expose to window for debugging
  window.startChaos = startChaos;
  window.stopChaos = stopChaos;
})();

// Smooth mouse movement
function updateMouse() {
  targetX += (mouseX - targetX) * 0.1;
  targetY += (mouseY - targetY) * 0.1;
}

// Vẽ kết nối giữa particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dz = particles[i].z - particles[j].z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < 200) {
        const opacity = (1 - distance / 200) * 0.4;

        // Chỉ vẽ nếu cả 2 particles đều gần camera
        if (particles[i].z < 1000 && particles[j].z < 1000) {
          const gradient = ctx.createLinearGradient(
            particles[i].screenX,
            particles[i].screenY,
            particles[j].screenX,
            particles[j].screenY
          );
          gradient.addColorStop(0, "rgba(255, 110, 199, " + opacity + ")");
          gradient.addColorStop(1, "rgba(126, 232, 250, " + opacity + ")");

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].screenX, particles[i].screenY);
          ctx.lineTo(particles[j].screenX, particles[j].screenY);
          ctx.stroke();
        }
      }
    }
  }
}

// Animation loop
function animate() {
  // Fade trail effect
  ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
  ctx.fillRect(0, 0, canvas3D.width, canvas3D.height);

  updateMouse();

  // Vẽ connections trước
  drawConnections();

  // Sort particles theo z (gần nhất vẽ sau)
  particles.sort((a, b) => b.z - a.z);

  // Update và vẽ particles
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

// Bắt đầu animation
animate();

// Click để tạo explosion
canvas3D.addEventListener("click", (e) => {
  createExplosion(e.clientX, e.clientY);
});

function createExplosion(x, y) {
  const explosionParticles = 30;
  for (let i = 0; i < explosionParticles; i++) {
    const angle = (Math.PI * 2 * i) / explosionParticles;
    const speed = Math.random() * 5 + 3;

    const particle = new Particle3D();
    particle.x = x;
    particle.y = y;
    particle.z = 100;
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
    particle.vz = Math.random() * 2 + 1;
    particle.baseX = x;
    particle.baseY = y;

    particles.push(particle);
  }

  // Giới hạn số particles
  while (particles.length > particleCount + 100) {
    particles.shift();
  }
}

// ===== HOA RƠI =====
const flowers = ["🌸", "🌺", "🌻", "🌷", "🌹", "💐", "🏵️", "🌼", "💮"];
const hearts = ["❤️", "💕", "💖", "💗", "💝"];
const stars = ["⭐", "✨", "🌟", "💫"];
const allEmojis = [...flowers, ...hearts, ...stars];

function createFallingFlower() {
  const flowersContainer = document.getElementById("flowersContainer");
  if (!flowersContainer) return;

  const flower = document.createElement("div");
  flower.className = "flower";
  flower.textContent = allEmojis[Math.floor(Math.random() * allEmojis.length)];
  flower.style.left = Math.random() * 100 + "%";
  flower.style.fontSize = Math.random() * 1.5 + 1 + "rem";
  flower.style.animationDuration = Math.random() * 5 + 5 + "s";
  flower.style.animationDelay = Math.random() * 2 + "s";

  flowersContainer.appendChild(flower);

  setTimeout(() => {
    flower.remove();
  }, 12000);
}

function startFlowerRain() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => createFallingFlower(), i * 200);
  }
  setInterval(() => createFallingFlower(), 300);
}

// ===== MODAL =====
window.addEventListener("load", function () {
  const modal = document.getElementById("welcomeModal");
  const closeBtn = document.getElementById("closeModal");

  if (modal && closeBtn) {
    setTimeout(() => {
      modal.style.display = "flex";
    }, 500);

    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
      createExplosion(window.innerWidth / 2, window.innerHeight / 2);
    });
  }

  startFlowerRain();
});

// ===== DARK MODE =====
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}

// ===== COUNTDOWN =====
function updateCountdown() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let targetDate = new Date(currentYear, 10, 20);

  if (now > targetDate) {
    targetDate = new Date(currentYear + 1, 10, 20);
  }

  const diff = targetDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");

  // Update circular progress
  updateCircularProgress("daysCircle", days, 365);
  updateCircularProgress("hoursCircle", hours, 24);
  updateCircularProgress("minutesCircle", minutes, 60);
  updateCircularProgress("secondsCircle", seconds, 60);
}

function updateCircularProgress(id, value, max) {
  const circle = document.getElementById(id);
  if (circle) {
    const circumference = 2 * Math.PI * 45;
    const progress = (value / max) * circumference;
    circle.style.strokeDashoffset = circumference - progress;
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== NAVIGATION SCROLL =====
const mainNav = document.getElementById("mainNav");
if (mainNav) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      mainNav.classList.add("scrolled");
    } else {
      mainNav.classList.remove("scrolled");
    }
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ===== MESSAGE FORM =====
const messageForm = document.getElementById("messageForm");
const messagesDisplay = document.getElementById("messagesDisplay");
let messages = JSON.parse(localStorage.getItem("teacherMessages")) || [];

function displayMessages() {
  if (!messagesDisplay) return;

  messagesDisplay.innerHTML = "";
  messages.forEach((msg) => {
    const card = document.createElement("div");
    card.className = "message-card";
    card.innerHTML = `
            <strong>💌 ${msg.student} gửi đến ${msg.teacher}:</strong>
            <p>${msg.message}</p>
            <small>📅 ${msg.date}</small>
        `;
    messagesDisplay.appendChild(card);
  });
}

if (messageForm) {
  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const studentName = document.getElementById("studentName").value;
    const teacherName = document.getElementById("teacherName").value;
    const messageText = document.getElementById("messageText").value;

    const newMessage = {
      student: studentName,
      teacher: teacherName,
      message: messageText,
      date: new Date().toLocaleString("vi-VN"),
    };

    messages.unshift(newMessage);
    localStorage.setItem("teacherMessages", JSON.stringify(messages));

    displayMessages();
    messageForm.reset();

    createExplosion(window.innerWidth / 2, window.innerHeight / 2);
    alert("✅ Lời nhắn đã được gửi thành công!");
  });

  displayMessages();
}

// ===== SIGNATURE CANVAS =====
const signatureCanvas = document.getElementById("signatureCanvas");
if (signatureCanvas) {
  const signCtx = signatureCanvas.getContext("2d");
  const clearBtn = document.getElementById("clearSignature");
  const saveBtn = document.getElementById("saveSignature");
  const penColor = document.getElementById("penColor");
  const penSize = document.getElementById("penSize");

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  signCtx.lineJoin = "round";
  signCtx.lineCap = "round";

  function startDrawing(e) {
    isDrawing = true;
    const rect = signatureCanvas.getBoundingClientRect();
    [lastX, lastY] = [
      (e.clientX || e.touches[0].clientX) - rect.left,
      (e.clientY || e.touches[0].clientY) - rect.top,
    ];
  }

  function draw(e) {
    if (!isDrawing) return;

    const rect = signatureCanvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    signCtx.strokeStyle = penColor.value;
    signCtx.lineWidth = penSize.value;

    signCtx.beginPath();
    signCtx.moveTo(lastX, lastY);
    signCtx.lineTo(x, y);
    signCtx.stroke();

    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    isDrawing = false;
  }

  signatureCanvas.addEventListener("mousedown", startDrawing);
  signatureCanvas.addEventListener("mousemove", draw);
  signatureCanvas.addEventListener("mouseup", stopDrawing);
  signatureCanvas.addEventListener("mouseout", stopDrawing);

  signatureCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e);
  });
  signatureCanvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
  });
  signatureCanvas.addEventListener("touchend", stopDrawing);

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      signCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      const dataURL = signatureCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "chu-ky-20-11.png";
      link.href = dataURL;
      link.click();
      alert("✅ Chữ ký đã được lưu!");
    });
  }
}

// ===== SHARE MODAL =====
const shareBtn = document.getElementById("shareBtn");
const shareModal = document.getElementById("shareModal");
const closeShare = document.getElementById("closeShare");

if (shareBtn && shareModal) {
  shareBtn.addEventListener("click", () => {
    shareModal.classList.add("show");
  });

  if (closeShare) {
    closeShare.addEventListener("click", () => {
      shareModal.classList.remove("show");
    });
  }

  shareModal.addEventListener("click", (e) => {
    if (e.target === shareModal) {
      shareModal.classList.remove("show");
    }
  });

  const shareFB = document.getElementById("shareFB");
  const shareZalo = document.getElementById("shareZalo");
  const copyLink = document.getElementById("copyLink");

  if (shareFB) {
    shareFB.addEventListener("click", () => {
      const url = encodeURIComponent(window.location.href);
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank"
      );
    });
  }

  if (shareZalo) {
    shareZalo.addEventListener("click", () => {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://zalo.me/share?url=${url}`, "_blank");
    });
  }

  if (copyLink) {
    copyLink.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("✅ Đã copy link vào clipboard!");
      });
    });
  }
}

// ===== MUSIC BUTTON =====
const musicBtn = document.getElementById("musicBtn");
let musicPlaying = false;

if (musicBtn) {
  musicBtn.addEventListener("click", function () {
    musicPlaying = !musicPlaying;
    if (musicPlaying) {
      this.textContent = "🎵 Tắt nhạc";
      console.log("Nhạc đang phát...");
    } else {
      this.textContent = "🎵 Nhạc";
      console.log("Nhạc đã tắt");
    }
  });
}

// ===== PARALLAX EFFECT =====
window.addEventListener("mousemove", (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

  document
    .querySelectorAll(".wish-card, .wish-card-celebration")
    .forEach((card, index) => {
      card.style.transform = `
            translateX(${moveX * (index + 1)}px) 
            translateY(${moveY * (index + 1)}px)
        `;
    });
});

// ===== ROTATING QUOTES =====
const quotes = [
  {
    text: "Không có thầy, không có giáo dục. Không có giáo dục, không có con người.",
    author: "Ngạn ngữ Việt Nam",
  },
  {
    text: "Tình thầy nghĩa cô như biển trời bao la, công ơn dạy dỗ khó mà quên.",
    author: "Ngạn ngữ Việt Nam",
  },
  {
    text: "Người thầy giỏi là người truyền lửa, không phải người chất đầy bình.",
    author: "William Butler Yeats",
  },
  {
    text: "Dạy học là nghề cao quý nhất vì tất cả các nghề khác đều được dạy.",
    author: "Ngạn ngữ phương Tây",
  },
  {
    text: "Một người thầy có ảnh hưởng đến cả vĩnh cửu; họ không bao giờ biết ảnh hưởng của mình dừng lại ở đâu.",
    author: "Henry Adams",
  },
  {
    text: "Giáo dục là vũ khí mạnh nhất mà bạn có thể sử dụng để thay đổi thế giới.",
    author: "Nelson Mandela",
  },
];

let currentQuoteIndex = 0;
const quoteElement = document.getElementById("rotatingQuote");

function rotateQuote() {
  if (quoteElement) {
    // Fade out
    quoteElement.style.opacity = "0";

    setTimeout(() => {
      // Change quote
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      quoteElement.textContent = quotes[currentQuoteIndex].text;

      // Update author if element exists
      const authorElement = document.querySelector(".quote-author-celebration");
      if (authorElement) {
        authorElement.textContent = "- " + quotes[currentQuoteIndex].author;
      }

      // Fade in
      quoteElement.style.opacity = "1";
    }, 500);
  }
}

// Rotate quotes every 5 seconds
if (quoteElement) {
  setInterval(rotateQuote, 5000);
}

// ===== SLIDESHOW =====
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".slide");
const indicators = document.querySelectorAll(".indicator");
let slideInterval;

function showSlide(index) {
  // Remove active class from all slides and indicators
  slides.forEach((slide) => slide.classList.remove("active"));
  indicators.forEach((indicator) => indicator.classList.remove("active"));

  // Wrap around
  if (index >= slides.length) {
    currentSlideIndex = 0;
  } else if (index < 0) {
    currentSlideIndex = slides.length - 1;
  } else {
    currentSlideIndex = index;
  }

  // Add active class to current slide and indicator
  if (slides[currentSlideIndex]) {
    slides[currentSlideIndex].classList.add("active");
  }
  if (indicators[currentSlideIndex]) {
    indicators[currentSlideIndex].classList.add("active");
  }
}

function changeSlide(direction) {
  showSlide(currentSlideIndex + direction);
  resetSlideInterval();
}

function currentSlide(index) {
  showSlide(index);
  resetSlideInterval();
}

function autoSlide() {
  currentSlideIndex++;
  showSlide(currentSlideIndex);
}

function startSlideshow() {
  slideInterval = setInterval(autoSlide, 4000); // Change slide every 4 seconds
}

function resetSlideInterval() {
  clearInterval(slideInterval);
  startSlideshow();
}

// Start slideshow if slides exist
if (slides.length > 0) {
  startSlideshow();
}

// Make functions global for onclick
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

// ===== MUSIC CONTROL =====
const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");
let isPlaying = false;

if (musicToggle && backgroundMusic) {
  musicToggle.addEventListener("click", function () {
    if (isPlaying) {
      backgroundMusic.pause();
      this.classList.remove("playing");
      this.querySelector(".music-text").textContent = "Phát nhạc";
      isPlaying = false;
    } else {
      backgroundMusic.play().catch((error) => {
        console.log("Không thể phát nhạc tự động:", error);
        alert("Vui lòng nhấp vào nút để phát nhạc!");
      });
      this.classList.add("playing");
      this.querySelector(".music-text").textContent = "Tắt nhạc";
      isPlaying = true;
    }
  });

  // Auto play attempt (may be blocked by browser)
  backgroundMusic.volume = 0.3; // Set volume to 30%
  backgroundMusic
    .play()
    .then(() => {
      musicToggle.classList.add("playing");
      musicToggle.querySelector(".music-text").textContent = "Tắt nhạc";
      isPlaying = true;
    })
    .catch(() => {
      console.log("Autoplay bị chặn - người dùng cần nhấp để phát nhạc");
    });
}

// ===== HEARTS CANVAS =====
const heartsCanvas = document.getElementById("heartsCanvas");
if (heartsCanvas) {
  const heartsCtx = heartsCanvas.getContext("2d");
  const hearts = [];
  let heartCount = 0;
  let lovePoints = 0;

  function resizeHeartsCanvas() {
    heartsCanvas.width = heartsCanvas.offsetWidth;
    heartsCanvas.height = heartsCanvas.offsetHeight;
  }
  resizeHeartsCanvas();
  window.addEventListener("resize", resizeHeartsCanvas);

  class Heart {
    constructor(x, y, size = 20, isSpecial = false) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.isSpecial = isSpecial;
      this.opacity = 1;
      this.vy = -1 - Math.random() * 2;
      this.vx = (Math.random() - 0.5) * 2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      this.life = 100;
    }

    draw() {
      heartsCtx.save();
      heartsCtx.translate(this.x, this.y);
      heartsCtx.rotate(this.rotation);
      heartsCtx.globalAlpha = this.opacity;

      // Draw heart shape
      heartsCtx.fillStyle = this.isSpecial
        ? `rgba(255, 110, 199, ${this.opacity})`
        : `rgba(126, 232, 250, ${this.opacity})`;

      heartsCtx.beginPath();
      const size = this.size;
      heartsCtx.moveTo(0, size / 4);
      heartsCtx.bezierCurveTo(-size / 2, -size / 4, -size, size / 4, 0, size);
      heartsCtx.bezierCurveTo(size, size / 4, size / 2, -size / 4, 0, size / 4);
      heartsCtx.fill();

      // Glow effect
      heartsCtx.shadowBlur = 15;
      heartsCtx.shadowColor = this.isSpecial ? "#ff6ec7" : "#7ee8fa";

      heartsCtx.restore();
    }

    update() {
      this.y += this.vy;
      this.x += this.vx;
      this.rotation += this.rotationSpeed;
      this.life--;
      this.opacity = this.life / 100;

      return this.life > 0;
    }
  }

  function createHeart(x, y, isSpecial = false) {
    const size = isSpecial ? 40 : 20 + Math.random() * 10;
    hearts.push(new Heart(x, y, size, isSpecial));
    heartCount++;
    lovePoints += isSpecial ? 10 : 1;
    updateCounters();
  }

  function updateCounters() {
    const heartCountEl = document.getElementById("heartCount");
    const lovePointsEl = document.getElementById("lovePoints");
    if (heartCountEl) heartCountEl.textContent = heartCount;
    if (lovePointsEl) lovePointsEl.textContent = lovePoints;
  }

  function animateHearts() {
    heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

    for (let i = hearts.length - 1; i >= 0; i--) {
      const heart = hearts[i];
      if (!heart.update()) {
        hearts.splice(i, 1);
      } else {
        heart.draw();
      }
    }

    requestAnimationFrame(animateHearts);
  }

  animateHearts();

  // Mouse move - create small hearts
  let lastHeartTime = 0;
  heartsCanvas.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastHeartTime > 100) {
      const rect = heartsCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createHeart(x, y, false);
      lastHeartTime = now;
    }
  });

  // Click - create big hearts
  heartsCanvas.addEventListener("click", (e) => {
    const rect = heartsCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create burst of hearts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createHeart(
          x + (Math.random() - 0.5) * 50,
          y + (Math.random() - 0.5) * 50,
          true
        );
      }, i * 50);
    }
  });
}

// ===== POEM READER =====
const poems = [
  {
    lines: [
      "Tình thầy nghĩa cô biển trời cao sâu",
      "Dạy chữ dạy người dạy cả tình đầu",
      "Mái trường ngày ấy còn đây bóng dáng",
      "Công ơn thầy cô tựa núi tựa sâu",
    ],
  },
  {
    lines: [
      "Bao nhiêu năm tháng đã qua đi",
      "Hình bóng thầy cô mãi trong tim",
      "Lời dạy từng câu còn đây nhớ mãi",
      "Ơn sâu nghĩa nặng chẳng phai nhòa",
    ],
  },
  {
    lines: [
      "Thầy như ngọn nến sáng đường đi",
      "Cô như ánh trăng dịu dàng soi",
      "Dạy em biết yêu biết thương người",
      "Mãi mãi ghi lòng tình nghĩa cao",
    ],
  },
  {
    lines: [
      "Lá vàng rơi trên sân trường cũ",
      "Nhớ về thầy cô ngày nào",
      "Bài học cuộc đời thầy đã dạy",
      "Mãi mãi là hành trang bên em",
    ],
  },
];

let currentPoemIndex = 0;
const poemTextEl = document.getElementById("poemText");
const prevPoemBtn = document.getElementById("prevPoem");
const nextPoemBtn = document.getElementById("nextPoem");
const readPoemBtn = document.getElementById("readPoem");
const progressDots = document.querySelectorAll(".progress-dots .dot");

function displayPoem(index) {
  if (!poemTextEl) return;

  const poem = poems[index];
  poemTextEl.innerHTML = "";

  poem.lines.forEach((line, i) => {
    const p = document.createElement("p");
    p.className = "poem-line";
    p.textContent = line;
    p.style.animationDelay = `${i * 0.2}s`;
    poemTextEl.appendChild(p);
  });

  // Update progress dots
  progressDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function nextPoem() {
  currentPoemIndex = (currentPoemIndex + 1) % poems.length;
  displayPoem(currentPoemIndex);
}

function prevPoem() {
  currentPoemIndex = (currentPoemIndex - 1 + poems.length) % poems.length;
  displayPoem(currentPoemIndex);
}

function readPoem() {
  if (!readPoemBtn) return;

  const poem = poems[currentPoemIndex];
  const utterance = new SpeechSynthesisUtterance(poem.lines.join(". "));
  utterance.lang = "vi-VN";
  utterance.rate = 0.8;
  utterance.pitch = 1.1;

  readPoemBtn.classList.add("reading");

  utterance.onend = () => {
    readPoemBtn.classList.remove("reading");
  };

  speechSynthesis.speak(utterance);
}

if (prevPoemBtn) prevPoemBtn.addEventListener("click", prevPoem);
if (nextPoemBtn) nextPoemBtn.addEventListener("click", nextPoem);
if (readPoemBtn) readPoemBtn.addEventListener("click", readPoem);

// Initialize first poem
if (poemTextEl) {
  displayPoem(0);
}

// ===== GREETING CARD CREATOR =====
const cardMessage = document.getElementById("cardMessage");
const cardSignature = document.getElementById("cardSignature");
const previewMessage = document.getElementById("previewMessage");
const previewSignature = document.getElementById("previewSignature");
const updatePreviewBtn = document.getElementById("updatePreview");
const downloadCardBtn = document.getElementById("downloadCard");
const shareCardBtn = document.getElementById("shareCardBtn");
const templateBtns = document.querySelectorAll(".template-btn");
const previewCard = document.querySelector(".preview-card");

let currentTemplate = "classic";

// Template buttons
templateBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    templateBtns.forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    currentTemplate = this.dataset.template;
    previewCard.className = `preview-card ${currentTemplate}`;
    unlockAchievement(
      "designer",
      "Nhà Thiết Kế",
      "Thử 3 mẫu thiệp khác nhau",
      15
    );
  });
});

// Update preview
function updateCardPreview() {
  if (previewMessage && cardMessage) {
    previewMessage.textContent = cardMessage.value || "Kính chúc thầy cô...";
  }
  if (previewSignature && cardSignature) {
    previewSignature.textContent = "- " + (cardSignature.value || "Học trò");
  }
}

if (updatePreviewBtn) {
  updatePreviewBtn.addEventListener("click", updateCardPreview);
}

// Auto update on typing
if (cardMessage) {
  cardMessage.addEventListener("input", updateCardPreview);
}
if (cardSignature) {
  cardSignature.addEventListener("input", updateCardPreview);
}

// Download card as image
if (downloadCardBtn) {
  downloadCardBtn.addEventListener("click", function () {
    // Use html2canvas library would be ideal, but here's a simple approach
    alert(
      "Tính năng tải xuống sẽ chuyển đổi thiệp thành hình ảnh!\n\nHiện tại, bạn có thể chụp màn hình (PrtScn) để lưu thiệp."
    );
    unlockAchievement("creator", "Người Sáng Tạo", "Tạo thiệp chúc mừng", 20);
  });
}

// Share card
if (shareCardBtn) {
  shareCardBtn.addEventListener("click", function () {
    const shareText = `Chúc mừng ngày Nhà giáo Việt Nam 20/11!\n\n${cardMessage.value}\n\n${cardSignature.value}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Thiệp chúc mừng 20/11",
          text: shareText,
        })
        .then(() => {
          unlockAchievement(
            "sharer",
            "Người Chia Sẻ",
            "Chia sẻ thiệp lên mạng xã hội",
            25
          );
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Đã sao chép nội dung thiệp!\nBạn có thể dán vào mạng xã hội.");
        unlockAchievement("sharer", "Người Chia Sẻ", "Chia sẻ thiệp", 25);
      });
    }
  });
}

// ===== ACHIEVEMENT SYSTEM =====
const achievements = [
  {
    id: "visitor",
    name: "Khách Ghé Thăm",
    desc: "Truy cập trang web",
    points: 5,
    unlocked: false,
  },
  {
    id: "explorer",
    name: "Nhà Thám Hiểm",
    desc: "Xem tất cả các phần",
    points: 10,
    unlocked: false,
  },
  {
    id: "artist",
    name: "Nghệ Sĩ",
    desc: "Vẽ 50 trái tim",
    points: 15,
    unlocked: false,
  },
  {
    id: "poet",
    name: "Thi Sĩ",
    desc: "Đọc tất cả các bài thơ",
    points: 15,
    unlocked: false,
  },
  {
    id: "designer",
    name: "Nhà Thiết Kế",
    desc: "Thử 3 mẫu thiệp",
    points: 15,
    unlocked: false,
  },
  {
    id: "creator",
    name: "Người Sáng Tạo",
    desc: "Tạo thiệp chúc mừng",
    points: 20,
    unlocked: false,
  },
  {
    id: "writer",
    name: "Nhà Văn",
    desc: "Gửi lời nhắn",
    points: 20,
    unlocked: false,
  },
  {
    id: "sharer",
    name: "Người Chia Sẻ",
    desc: "Chia sẻ lên mạng xã hội",
    points: 25,
    unlocked: false,
  },
  {
    id: "master",
    name: "Bậc Thầy",
    desc: "Mở khóa tất cả thành tích",
    points: 50,
    unlocked: false,
  },
  {
    id: "lover",
    name: "Người Yêu Thương",
    desc: "Tương tác đủ 100 lần",
    points: 30,
    unlocked: false,
  },
];

let totalPoints = 0;
let totalUnlocked = 0;
let interactionCount = 0;

const achievementOverlay = document.getElementById("achievementOverlay");
const achievementToggle = document.getElementById("achievementToggle");
const achievementPanel = document.getElementById("achievementPanel");
const closeAchievements = document.getElementById("closeAchievements");
const achievementsList = document.getElementById("achievementsList");
const achievementBadge = document.getElementById("achievementBadge");

// Load achievements from localStorage
function loadAchievements() {
  const saved = localStorage.getItem("achievements");
  if (saved) {
    const savedData = JSON.parse(saved);
    achievements.forEach((ach, index) => {
      if (savedData[index]) {
        ach.unlocked = savedData[index].unlocked;
      }
    });
    totalPoints = savedData.totalPoints || 0;
    totalUnlocked = savedData.totalUnlocked || 0;
    interactionCount = savedData.interactionCount || 0;
  }
  renderAchievements();
  updateAchievementStats();
}

// Save achievements
function saveAchievements() {
  const data = {
    achievements: achievements.map((a) => ({ unlocked: a.unlocked })),
    totalPoints,
    totalUnlocked,
    interactionCount,
  };
  localStorage.setItem("achievements", JSON.stringify(data));
}

// Render achievements list
function renderAchievements() {
  if (!achievementsList) return;

  achievementsList.innerHTML = achievements
    .map(
      (ach) => `
    <div class="achievement-item ${ach.unlocked ? "" : "locked"}">
      <span class="achievement-item-icon">${ach.unlocked ? "�" : "🔒"}</span>
      <div class="achievement-item-info">
        <div class="achievement-item-title">${ach.name}</div>
        <div class="achievement-item-desc">${ach.desc}</div>
      </div>
      <span class="achievement-item-points">+${ach.points}</span>
    </div>
  `
    )
    .join("");
}

// Update stats
function updateAchievementStats() {
  const totalPointsEl = document.getElementById("totalPoints");
  const totalAchievementsEl = document.getElementById("totalAchievements");

  if (totalPointsEl) totalPointsEl.textContent = totalPoints;
  if (totalAchievementsEl)
    totalAchievementsEl.textContent = `${totalUnlocked}/${achievements.length}`;
  if (achievementBadge) achievementBadge.textContent = totalUnlocked;
}

// Unlock achievement
function unlockAchievement(id, name, desc, points) {
  const ach = achievements.find((a) => a.id === id);
  if (!ach || ach.unlocked) return;

  ach.unlocked = true;
  totalPoints += points;
  totalUnlocked++;

  // Show popup
  if (achievementOverlay) {
    const descEl = document.getElementById("achievementDesc");
    const pointsEl = document.getElementById("achievementPoints");

    if (descEl) descEl.textContent = desc;
    if (pointsEl) pointsEl.textContent = points;

    achievementOverlay.classList.add("show");

    setTimeout(() => {
      achievementOverlay.classList.remove("show");
    }, 3000);
  }

  renderAchievements();
  updateAchievementStats();
  saveAchievements();

  // Check if all unlocked
  if (totalUnlocked === achievements.length - 1) {
    setTimeout(() => {
      unlockAchievement("master", "Bậc Thầy", "Mở khóa tất cả thành tích", 50);
    }, 500);
  }
}

// Toggle achievement panel
if (achievementToggle) {
  achievementToggle.addEventListener("click", function () {
    achievementPanel.classList.toggle("show");
  });
}

if (closeAchievements) {
  closeAchievements.addEventListener("click", function () {
    achievementPanel.classList.remove("show");
  });
}

// Close popup on click
if (achievementOverlay) {
  achievementOverlay.addEventListener("click", function () {
    this.classList.remove("show");
  });
}

// Track interactions
function trackInteraction() {
  interactionCount++;
  saveAchievements();

  if (interactionCount >= 100) {
    unlockAchievement("lover", "Người Yêu Thương", "Tương tác đủ 100 lần", 30);
  }
}

// Add interaction tracking to various elements
document.addEventListener("click", trackInteraction);
document.addEventListener("mousemove", function () {
  if (Math.random() < 0.01) trackInteraction(); // 1% chance on mouse move
});

// Unlock visitor achievement on load
setTimeout(() => {
  unlockAchievement(
    "visitor",
    "Khách Ghé Thăm",
    "Truy cập trang web lần đầu",
    5
  );
}, 2000);

// Load achievements
loadAchievements();

// ===== FIREWORKS EFFECT =====
const fireworksCanvas = document.getElementById("fireworksCanvas");
const fireworksCtx = fireworksCanvas ? fireworksCanvas.getContext("2d") : null;
const fireworks = [];
const fireworkParticles = [];

function resizeFireworksCanvas() {
  if (!fireworksCanvas) return;
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

if (fireworksCanvas) {
  resizeFireworksCanvas();
  window.addEventListener("resize", resizeFireworksCanvas);
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = fireworksCanvas.height;
    this.targetY = y;
    this.speed = 5;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  update() {
    this.y -= this.speed;
    return this.y > this.targetY;
  }

  draw() {
    if (!fireworksCtx) return;
    fireworksCtx.beginPath();
    fireworksCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    fireworksCtx.fillStyle = this.color;
    fireworksCtx.fill();
  }

  explode() {
    for (let i = 0; i < 50; i++) {
      fireworkParticles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 5 + 2;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.gravity = 0.1;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    return this.alpha > 0;
  }

  draw() {
    if (!fireworksCtx) return;
    fireworksCtx.save();
    fireworksCtx.globalAlpha = this.alpha;
    fireworksCtx.beginPath();
    fireworksCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    fireworksCtx.fillStyle = this.color;
    fireworksCtx.fill();
    fireworksCtx.restore();
  }
}

function animateFireworks() {
  if (!fireworksCtx || !fireworksCanvas) return;

  fireworksCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
  fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    if (!fw.update()) {
      fw.explode();
      fireworks.splice(i, 1);
    } else {
      fw.draw();
    }
  }

  for (let i = fireworkParticles.length - 1; i >= 0; i--) {
    const p = fireworkParticles[i];
    if (!p.update()) {
      fireworkParticles.splice(i, 1);
    } else {
      p.draw();
    }
  }

  requestAnimationFrame(animateFireworks);
}

function launchFirework() {
  if (!fireworksCanvas) return;
  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * fireworksCanvas.height * 0.5;
  fireworks.push(new Firework(x, y));
}

// Trigger fireworks on section scroll
let fireworksActive = false;
let fireworksInterval;

function startFireworks() {
  if (fireworksActive || !fireworksCanvas) return;
  fireworksActive = true;
  fireworksCanvas.classList.add("active");
  animateFireworks();

  fireworksInterval = setInterval(() => {
    launchFirework();
  }, 500);

  setTimeout(() => {
    stopFireworks();
  }, 5000);
}

function stopFireworks() {
  if (!fireworksActive) return;
  fireworksActive = false;
  clearInterval(fireworksInterval);
  setTimeout(() => {
    if (fireworksCanvas) fireworksCanvas.classList.remove("active");
  }, 2000);
}

// Trigger fireworks when reaching certain sections
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id === "wishes") {
        if (Math.random() < 0.3) {
          // 30% chance
          startFireworks();
        }
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => observer.observe(section));

console.log("�🌸 Chúc mừng ngày Nhà giáo Việt Nam 20/11! 🌸");
console.log("💡 Tip: Di chuyển chuột để tương tác với particles 3D!");
console.log("💡 Tip: Click vào canvas để tạo explosion effect!");
console.log("🎵 Tip: Nhấp vào nút nhạc để phát/tắt nhạc nền!");
console.log("💕 Tip: Di chuyển chuột trên canvas để tạo trái tim!");
console.log("📜 Tip: Nhấp 'Đọc Thơ' để nghe thơ về thầy cô!");
console.log("🎨 Tip: Tạo thiệp chúc mừng và chia sẻ lên mạng xã hội!");
console.log("🏆 Tip: Mở khóa thành tích bằng cách tương tác với trang web!");
console.log("🎆 Tip: Pháo hoa sẽ xuất hiện khi bạn cuộn qua các phần!");

// ========================================
// VIRTUAL FLOWERS GARDEN
// ========================================
const gardenCanvas = document.getElementById("gardenCanvas");
const gardenCtx = gardenCanvas ? gardenCanvas.getContext("2d") : null;
const flowerCountElem = document.getElementById("flowerCount");
const gardenLevelElem = document.getElementById("gardenLevel");
const clearGardenBtn = document.getElementById("clearGarden");
const flowerButtons = document.querySelectorAll(".flower-btn");

let selectedFlower = "";
let plantedFlowers = [];
let gardenLevel = 1;

// Load garden from localStorage
const savedGarden = localStorage.getItem("flowersGarden");
if (savedGarden) {
  plantedFlowers = JSON.parse(savedGarden);
}

if (gardenCanvas) {
  gardenCanvas.width = gardenCanvas.offsetWidth;
  gardenCanvas.height = gardenCanvas.offsetHeight;
}

function drawGarden() {
  if (!gardenCtx || !gardenCanvas) return;
  gardenCtx.clearRect(0, 0, gardenCanvas.width, gardenCanvas.height);

  plantedFlowers.forEach((flower) => {
    gardenCtx.font = `${flower.size}px Arial`;
    gardenCtx.fillText(flower.emoji, flower.x, flower.y);
  });

  updateGardenStats();
}

function updateGardenStats() {
  const count = plantedFlowers.length;
  gardenLevel = Math.floor(count / 10) + 1;

  if (flowerCountElem) flowerCountElem.textContent = count;
  if (gardenLevelElem) gardenLevelElem.textContent = gardenLevel;

  // Save to localStorage
  localStorage.setItem("flowersGarden", JSON.stringify(plantedFlowers));

  // Unlock achievements
  if (count >= 10) unlockAchievement("garden_lover");
}

// Flower selection
flowerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    flowerButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedFlower = btn.dataset.flower;
  });
});

// Plant flowers on click
if (gardenCanvas) {
  gardenCanvas.addEventListener("click", (e) => {
    const rect = gardenCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    plantedFlowers.push({
      emoji: selectedFlower,
      x: x,
      y: y,
      size: Math.random() * 20 + 30,
    });

    drawGarden();
    unlockAchievement("first_flower");
  });
}

// Clear garden
if (clearGardenBtn) {
  clearGardenBtn.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ vườn hoa?")) {
      plantedFlowers = [];
      localStorage.removeItem("flowersGarden");
      drawGarden();
    }
  });
}

// Initial draw
drawGarden();

// ========================================
// 3. MEMORY WALL (STICKY NOTES)
// ========================================
const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNote");
const memoryWall = document.querySelector(".memory-wall");

let notes = [];

// Load notes from localStorage
const savedNotes = localStorage.getItem("memoryNotes");
if (savedNotes) {
  notes = JSON.parse(savedNotes);
  notes.forEach((note) => createNoteElement(note));
}

function createNoteElement(note) {
  if (!memoryWall) return;

  const noteElem = document.createElement("div");
  noteElem.className = `sticky-note ${note.color}`;
  noteElem.style.transform = `rotate(${note.rotation}deg)`;
  noteElem.innerHTML = `
    <div class="note-text">${note.text}</div>
    <button class="note-delete">×</button>
  `;

  // Delete note
  noteElem.querySelector(".note-delete").addEventListener("click", () => {
    notes = notes.filter((n) => n.id !== note.id);
    localStorage.setItem("memoryNotes", JSON.stringify(notes));
    noteElem.remove();
  });

  memoryWall.appendChild(noteElem);
}

if (addNoteBtn && noteInput) {
  addNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    if (text === "") {
      alert("Vui lòng nhập nội dung lời nhắn!");
      return;
    }

    const colors = ["yellow", "pink", "blue", "green"];
    const note = {
      id: Date.now(),
      text: text,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 10 - 5,
    };

    notes.push(note);
    localStorage.setItem("memoryNotes", JSON.stringify(notes));
    createNoteElement(note);
    noteInput.value = "";

    unlockAchievement("memory_keeper");
  });

  noteInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addNoteBtn.click();
    }
  });
}

// ========================================
// 4. MOOD SELECTOR & THEME CHANGER
// ========================================
const moodToggle = document.querySelector(".mood-toggle");
const moodPanel = document.querySelector(".mood-panel");
const moodButtons = document.querySelectorAll(".mood-btn");

let currentMood = "happy";

if (moodToggle && moodPanel) {
  moodToggle.addEventListener("click", () => {
    moodPanel.classList.toggle("show");
  });
}

moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    const emoji = btn.dataset.emoji;

    // Update active state
    moodButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Change theme
    document.body.className = document.body.className
      .split(" ")
      .filter((c) => !c.startsWith("mood-"))
      .join(" ");
    document.body.classList.add(`mood-${mood}`);

    // Update toggle icon
    if (moodToggle) {
      const icon = moodToggle.querySelector(".mood-icon");
      if (icon) icon.textContent = emoji;
    }

    currentMood = mood;

    // Special effects based on mood
    applyMoodEffects(mood);

    unlockAchievement("mood_master");
  });
});

function applyMoodEffects(mood) {
  // Change particle colors based on mood
  switch (mood) {
    case "happy":
      // Bright cheerful colors
      break;
    case "grateful":
      // Golden warm colors
      break;
    case "nostalgic":
      // Purple vintage colors
      break;
    case "excited":
      // Vibrant energetic colors
      startFireworks();
      break;
    case "loving":
      // Pink romantic colors
      break;
  }
}

// ========================================
// 5. CONFETTI CANNON
// ========================================
const fireConfettiBtn = document.getElementById("fireConfetti");
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;

let confettiParticles = [];
let confettiActive = false;

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 5;
    this.speedX = Math.random() * 10 - 5;
    this.speedY = Math.random() * -15 - 10;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.gravity = 0.5;
    this.opacity = 1;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.005;

    return this.opacity > 0 && this.y < window.innerHeight + 50;
  }

  draw() {
    if (!confettiCtx) return;
    confettiCtx.save();
    confettiCtx.globalAlpha = this.opacity;
    confettiCtx.translate(this.x, this.y);
    confettiCtx.rotate((this.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = this.color;
    confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    confettiCtx.restore();
  }
}

function fireConfetti() {
  if (!confettiCanvas || !confettiCtx) return;

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.classList.add("active");
  confettiActive = true;

  // Create confetti burst
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight - 100;

  for (let i = 0; i < 150; i++) {
    confettiParticles.push(new ConfettiParticle(centerX, centerY));
  }

  animateConfetti();
  unlockAchievement("party_starter");
}

function animateConfetti() {
  if (!confettiActive || !confettiCtx || !confettiCanvas) return;

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    if (!p.update()) {
      confettiParticles.splice(i, 1);
    } else {
      p.draw();
    }
  }

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
    confettiCanvas.classList.remove("active");
  }
}

if (fireConfettiBtn) {
  fireConfettiBtn.addEventListener("click", fireConfetti);
}

// ========================================
// 6. VOICE RECORDER WITH WAVEFORM
// ========================================
const voiceToggle = document.querySelector(".voice-toggle");
const voicePanel = document.querySelector(".voice-panel");
const startRecordBtn = document.getElementById("startRecord");
const stopRecordBtn = document.getElementById("stopRecord");
const playRecordBtn = document.getElementById("playRecord");
const downloadRecordBtn = document.getElementById("downloadRecord");
const waveformCanvas = document.getElementById("waveformCanvas");
const waveformCtx = waveformCanvas ? waveformCanvas.getContext("2d") : null;
const statusDot = document.querySelector(".status-dot");
const statusText = document.querySelector(".status-text");
const recordingsList = document.querySelector(".recordings-list");

let mediaRecorder = null;
let audioChunks = [];
let recordedBlob = null;
let audioContext = null;
let analyser = null;
let dataArray = null;
let waveformAnimationId = null;

if (voiceToggle && voicePanel) {
  voiceToggle.addEventListener("click", () => {
    voicePanel.classList.toggle("show");
  });
}

// Start recording
if (startRecordBtn) {
  startRecordBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        recordedBlob = new Blob(audioChunks, { type: "audio/webm" });
        playRecordBtn.disabled = false;
        downloadRecordBtn.disabled = false;
        statusText.textContent = "Đã thu âm";
        statusDot.classList.remove("recording");

        // Stop waveform animation
        if (waveformAnimationId) {
          cancelAnimationFrame(waveformAnimationId);
        }

        stream.getTracks().forEach((track) => track.stop());
        unlockAchievement("voice_master");
      };

      mediaRecorder.start();
      startRecordBtn.disabled = true;
      stopRecordBtn.disabled = false;
      statusText.textContent = "Đang ghi âm...";
      statusDot.classList.add("recording");

      // Setup waveform visualization
      setupWaveform(stream);
    } catch (err) {
      console.error("Lỗi khi truy cập micro:", err);
      alert("Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập!");
    }
  });
}

// Stop recording
if (stopRecordBtn) {
  stopRecordBtn.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      startRecordBtn.disabled = false;
      stopRecordBtn.disabled = true;
    }
  });
}

// Play recording
if (playRecordBtn) {
  playRecordBtn.addEventListener("click", () => {
    if (recordedBlob) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  });
}

// Download recording
if (downloadRecordBtn) {
  downloadRecordBtn.addEventListener("click", () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ghi-am-2011-${Date.now()}.webm`;
      a.click();
    }
  });
}

function setupWaveform(stream) {
  if (!waveformCanvas || !waveformCtx) return;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  drawWaveform();
}

function drawWaveform() {
  if (!waveformCtx || !waveformCanvas || !analyser || !dataArray) return;

  waveformAnimationId = requestAnimationFrame(drawWaveform);

  analyser.getByteTimeDomainData(dataArray);

  waveformCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
  waveformCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);

  waveformCtx.lineWidth = 2;
  waveformCtx.strokeStyle = "#7ee8fa";
  waveformCtx.beginPath();

  const sliceWidth = (waveformCanvas.width * 1.0) / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * waveformCanvas.height) / 2;

    if (i === 0) {
      waveformCtx.moveTo(x, y);
    } else {
      waveformCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  waveformCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
  waveformCtx.stroke();
}

// ========================================
// 7. ANIMATED TIMELINE WITH AOS
// ========================================
// Simple scroll animation for timeline
const timelineItems = document.querySelectorAll(".timeline-item");

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("aos-animate");
      }
    });
  },
  { threshold: 0.3 }
);

timelineItems.forEach((item) => {
  timelineObserver.observe(item);
});

// Update console tips
console.log(" Tip: Xoay khối 3D bằng chuột hoặc các nút điều khiển!");
console.log(" Tip: Click trên canvas để trồng hoa và tạo vườn riêng!");
console.log(" Tip: Viết lời nhắn và dán lên bức tường kỷ niệm!");
console.log(" Tip: Thay đổi tâm trạng để đổi giao diện và hiệu ứng!");
console.log(" Tip: Bắn pháo giấy để tạo không khí vui vẻ!");
console.log(" Tip: Ghi âm lời chúc và tải xuống để gửi thầy cô!");
console.log(" Tip: Cuộn xuống xem timeline câu chuyện về thầy cô!");

// ===== ZERO-G (mất trọng lực) - auto-assign class to matching elements =====
document.addEventListener("DOMContentLoaded", () => {
  const selector =
    '[class*="card"], [class*="Card"], .modal-content-new, .hero-content-celebration, .message-card, .sticky-note, .preview-card';

  document.querySelectorAll(selector).forEach((el) => {
    // đánh dấu để dễ xử lý nếu cần; animation-delay để các phần tử không đồng bộ
    el.classList.add("zero-g");
    const delay = Math.random() * 4;
    el.style.animationDelay = `${delay}s`;
  });

  // Mẹo: nhấn phím 'g' để tạm dừng/tiếp tục hiệu ứng zero-g (troll nhanh)
  document.addEventListener("keydown", (e) => {
    if (e.key && e.key.toLowerCase() === "g") {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.style.animationPlayState === "paused") {
          el.style.animationPlayState = "";
        } else {
          el.style.animationPlayState = "paused";
        }
      });
    }
  });

  // AUTO-START CHAOS - tất cả thành phần bay loạn xạ sau 2 giây
  setTimeout(() => {
    window.startChaos();
  }, 2000);
});
