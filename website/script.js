// ─── Scroll-triggered animations ───
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll("[data-animate]").forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
  observer.observe(el);
});

document.querySelectorAll(".step").forEach((el) => {
  observer.observe(el);
});

// ─── Nav scroll effect ───
const nav = document.getElementById("nav");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
      ticking = false;
    });
    ticking = true;
  }
});

// ─── Floating chess pieces ───
const pieces = [
  "\u2654", "\u2655", "\u2656", "\u2657", "\u2658", "\u2659",
  "\u265A", "\u265B", "\u265C", "\u265D", "\u265E", "\u265F",
];

const floatingContainer = document.getElementById("floatingPieces");

function createFloatingPiece() {
  const el = document.createElement("span");
  el.className = "floating-piece";
  el.textContent = pieces[Math.floor(Math.random() * pieces.length)];
  el.style.left = Math.random() * 100 + "%";
  el.style.animationDuration = 15 + Math.random() * 20 + "s";
  el.style.fontSize = 20 + Math.random() * 30 + "px";
  el.style.opacity = 0.03 + Math.random() * 0.05;
  floatingContainer.appendChild(el);

  el.addEventListener("animationend", () => {
    el.remove();
  });
}

// Stagger initial pieces
for (let i = 0; i < 12; i++) {
  setTimeout(createFloatingPiece, i * 800);
}
setInterval(createFloatingPiece, 2500);

// ─── Stat counter animation ───
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 40);
  });
}

// Fire counters when hero is visible
const heroObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  },
  { threshold: 0.3 }
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) heroObserver.observe(heroStats);

// ─── Demo tabs ───
document.querySelectorAll(".demo-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".demo-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".demo-screen").forEach((s) => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  });
});

// ─── Platform detection ───
function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || "";

  if (ua.includes("mac") || platform.includes("mac")) return "mac";
  if (ua.includes("win") || platform.includes("win")) return "win";
  if (ua.includes("linux")) return "linux";
  return null;
}

const detected = detectPlatform();
if (detected) {
  const el = document.getElementById("dl-" + detected);
  if (el) {
    el.classList.add("detected");
    // Move detected platform to first position visually
    el.parentElement.prepend(el);
  }
}

// ─── Smooth scroll for nav links ───
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ─── Mockup board shimmer on hover ───
document.querySelectorAll(".mockup-board").forEach((board) => {
  board.addEventListener("mouseenter", () => {
    const evalFill = board.querySelector(".mockup-eval-fill");
    if (evalFill) {
      const newHeight = 30 + Math.random() * 50;
      evalFill.style.height = newHeight + "%";
    }
  });
});
