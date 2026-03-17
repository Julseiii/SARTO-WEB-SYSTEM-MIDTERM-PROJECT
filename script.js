// =====================
// ACHIEVEMENT SYSTEM
// =====================
function showAchievement(icon, desc) {
  const el = document.getElementById('achievement');
  document.getElementById('achievement-desc').textContent = desc;
  el.querySelector('.achievement-icon').textContent = icon;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

const achievements = {
  about: ['🗺️', 'About Section Unlocked!'],
  background: ['📚', 'Background Zone Entered!'],
  hobbies: ['🎯', 'Hobbies Discovered!'],
  contact: ['📡', 'Contact Portal Opened!']
};

// =====================
// PIXEL CURSOR
// =====================
const cursorCanvas = document.getElementById('cursor');
const ctx = cursorCanvas.getContext('2d');
const trail = document.getElementById('cursor-trail');

const cursorPixels = [
  [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1], [3, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
  [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
  [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],
  [0, 6], [1, 6], [3, 6], [4, 6],
  [0, 7], [4, 7], [5, 7]
];

function drawCursor() {
  ctx.clearRect(0, 0, 24, 24);
  ctx.fillStyle = '#ffe600';
  cursorPixels.forEach(([x, y]) => ctx.fillRect(x * 2, y * 2, 2, 2));
  ctx.fillStyle = '#b44fff';
  [[1, 1], [2, 1], [1, 2], [2, 2]].forEach(([x, y]) => ctx.fillRect(x * 2, y * 2, 2, 2));
}
drawCursor();

document.addEventListener('mousemove', (e) => {
  cursorCanvas.style.left = (e.clientX - 2) + 'px';
  cursorCanvas.style.top = (e.clientY - 2) + 'px';
  trail.style.left = (e.clientX - 4) + 'px';
  trail.style.top = (e.clientY - 4) + 'px';
});

// =====================
// INTERACTIVE CANVAS BACKGROUND
// =====================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let W, H;
let particles = [];
let stars = [];
let grid = [];
const GRID_SIZE = 40;
let mx = 0, my = 0;

function resize() {
  W = bgCanvas.width = window.innerWidth;
  H = bgCanvas.height = window.innerHeight;
  initStars();
  initGrid();
}

function initStars() {
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.floor(Math.random() * 3) + 1,
    speed: Math.random() * 0.3 + 0.05,
    phase: Math.random() * Math.PI * 2
  }));
}

function initGrid() {
  grid = [];
  const cols = Math.ceil(W / GRID_SIZE);
  const rows = Math.ceil(H / GRID_SIZE);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < 0.15) {
        grid.push({
          x: c * GRID_SIZE, y: r * GRID_SIZE, size: GRID_SIZE,
          alpha: Math.random() * 0.08,
          speed: (Math.random() - 0.5) * 0.002,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }
}

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function drawBg() {
  bgCtx.clearRect(0, 0, W, H);

  const grad = bgCtx.createRadialGradient(mx, my, 0, W / 2, H / 2, Math.max(W, H));
  grad.addColorStop(0, 'rgba(61,0,112,0.9)');
  grad.addColorStop(0.4, 'rgba(26,0,48,0.95)');
  grad.addColorStop(1, 'rgba(5,0,15,1)');
  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0, 0, W, H);

  const mGrad = bgCtx.createRadialGradient(mx, my, 0, mx, my, 300);
  mGrad.addColorStop(0, 'rgba(123,0,212,0.15)');
  mGrad.addColorStop(1, 'transparent');
  bgCtx.fillStyle = mGrad;
  bgCtx.fillRect(0, 0, W, H);

  grid.forEach(cell => {
    cell.phase += cell.speed;
    const a = cell.alpha + Math.sin(cell.phase) * 0.04;
    bgCtx.fillStyle = `rgba(123,0,212,${Math.max(0, a)})`;
    bgCtx.fillRect(cell.x, cell.y, cell.size, cell.size);
    bgCtx.strokeStyle = 'rgba(180,79,255,0.04)';
    bgCtx.lineWidth = 1;
    bgCtx.strokeRect(cell.x, cell.y, cell.size, cell.size);
  });

  bgCtx.strokeStyle = 'rgba(61,0,112,0.15)';
  bgCtx.lineWidth = 1;
  for (let x = 0; x < W; x += GRID_SIZE) {
    bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, H); bgCtx.stroke();
  }
  for (let y = 0; y < H; y += GRID_SIZE) {
    bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(W, y); bgCtx.stroke();
  }

  const starColors = ['255,230,0', '180,79,255', '0,255,255', '255,0,170'];
  stars.forEach(star => {
    star.phase += star.speed * 0.05;
    const b = (Math.sin(star.phase) + 1) / 2;
    const c = starColors[Math.floor(star.x * star.y) % starColors.length];
    bgCtx.fillStyle = `rgba(${c},${0.4 + b * 0.6})`;
    bgCtx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    if (b > 0.8 && star.size > 1) {
      bgCtx.fillStyle = `rgba(${c},0.2)`;
      bgCtx.fillRect(Math.floor(star.x) - star.size, Math.floor(star.y), star.size, star.size);
      bgCtx.fillRect(Math.floor(star.x) + star.size, Math.floor(star.y), star.size, star.size);
      bgCtx.fillRect(Math.floor(star.x), Math.floor(star.y) - star.size, star.size, star.size);
      bgCtx.fillRect(Math.floor(star.x), Math.floor(star.y) + star.size, star.size, star.size);
    }
  });

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.life -= 2; p.vy += 0.1;
    bgCtx.fillStyle = `rgba(${p.color},${p.life / 100})`;
    bgCtx.fillRect(Math.floor(p.x), Math.floor(p.y), 3, 3);
  });

  requestAnimationFrame(drawBg);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(drawBg);

// =====================
// CLICK PARTICLES
// =====================
document.addEventListener('click', (e) => {
  const colors = ['180,79,255', '255,230,0', '0,255,255', '255,0,170', '0,255,136'];
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      life: 80 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
});

// =====================
// TYPEWRITER EFFECT
// =====================
const phrases = [
  'BSIT Student | 1st Year | Passionate',
  'DIPA TAPOS',
  'Quest: Live Authentically',
  'XP: Unlimited · Respawn: Always',
  'BSIT Student | 1st Year | Passionate',
  'Side Quest: Makapagtapos at mag earn ng 6 digits'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeLoop() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typeEl.textContent = phrase.slice(0, charIdx);
    if (charIdx >= phrase.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
    setTimeout(typeLoop, 70);
  } else {
    charIdx--;
    typeEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
    setTimeout(typeLoop, 35);
  }
}
setTimeout(typeLoop, 500);

// =====================
// SCROLL ANIMATIONS
// =====================
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const sectionId = entry.target.closest('section')?.id;
      if (sectionId && achievements[sectionId] && !entry.target.dataset.achieved) {
        entry.target.dataset.achieved = '1';
        setTimeout(() => showAchievement(...achievements[sectionId]), 400);
      }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

const xpObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.xp-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => bar.style.width = w, 100);
      });
    }
  });
}, { threshold: 0.3 });

const hobbiesGrid = document.querySelector('.hobbies-grid');
if (hobbiesGrid) xpObserver.observe(hobbiesGrid);

// =====================
// NAV ACTIVE STATE
// =====================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const href = `#${entry.target.id}`;
      navLinks.forEach(link => {
        if (link.getAttribute('href') === href) {
          link.style.color = 'var(--pixel-yellow)';
          link.style.borderColor = 'var(--pixel-yellow)';
        } else {
          link.style.color = '';
          link.style.borderColor = '';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => scrollObserver.observe(s));

// =====================
// RETRO CORNER SPANS
// =====================
document.querySelectorAll('.retro-corner').forEach(el => {
  if (!el.querySelector('span')) {
    el.innerHTML = `<span>${el.innerHTML}</span>`;
  }
});

// =====================
// KONAMI CODE EASTER EGG
// =====================
let konamiSequence = [];
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', e => {
  konamiSequence.push(e.key);
  konamiSequence = konamiSequence.slice(-10);
  if (konamiSequence.join(',') === konami.join(',')) {
    showAchievement('🌈', 'KONAMI CODE! +30 LIVES!');
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
          life: 100,
          color: ['255,230,0', '0,255,255', '255,0,170', '0,255,136'][i % 4]
        });
      }, i * 50);
    }
  }
});

// =====================
// ACHIEVEMENT CAROUSEL
// =====================
(function () {
  const slides = document.querySelectorAll('.achievement-slide');
  const prevBtn = document.getElementById('achPrev');
  const nextBtn = document.getElementById('achNext');
  const dotsWrap = document.getElementById('carouselDots');
  if (!slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

  let current = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active-dot' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active-slide');
    dotsWrap.children[current].classList.remove('active-dot');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active-slide');
    dotsWrap.children[current].classList.add('active-dot');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
})();

// Show welcome achievement on load
window.addEventListener('load', () => {
  setTimeout(() => showAchievement('🎮', 'WELCOME, PLAYER ONE!'), 500);
});
