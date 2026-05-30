/* ============================================================
   NANDAN KUMAR PORTFOLIO — script.js
   ============================================================ */

// ── CUSTOM CURSOR GLOW ──────────────────────────────────────
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ── THEME TOGGLE ────────────────────────────────────────────
function toggleTheme() {
    document.body.classList.toggle('light');
    const btn = document.getElementById('theme-btn');
    btn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
}

// ── NAVBAR SCROLL EFFECT ────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── TYPEWRITER ──────────────────────────────────────────────
const roles = ['Python Developer', 'Web Developer', 'SQL Enthusiast', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typeTarget = document.getElementById('typewriter');

function typewrite() {
    const current = roles[roleIndex];
    if (isDeleting) {
        typeTarget.textContent = current.slice(0, --charIndex);
    } else {
        typeTarget.textContent = current.slice(0, ++charIndex);
    }

    let delay = isDeleting ? 55 : 100;
    if (!isDeleting && charIndex === current.length) {
        delay = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
    }
    setTimeout(typewrite, delay);
}
setTimeout(typewrite, 1200);

// ── SCROLL REVEAL ───────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

// ── SKILL BAR ANIMATION ─────────────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.width + '%';
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObs.observe(el));

// ── STARFIELD CANVAS ────────────────────────────────────────
(function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    let W, H, stars = [], mouseX = 0, mouseY = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 160; i++) {
        stars.push({
            x: Math.random() * 9999,
            y: Math.random() * 9999,
            z: Math.random() * 9999,
            size: Math.random() * 1.5 + 0.3,
            speed: Math.random() * 0.3 + 0.1,
        });
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / W - 0.5) * 0.6;
        mouseY = (e.clientY / H - 0.5) * 0.6;
    });

    function drawStarfield() {
        ctx.clearRect(0, 0, W, H);

        const isDark = !document.body.classList.contains('light');
        stars.forEach(s => {
            s.z -= s.speed;
            if (s.z <= 0) s.z = 9999;

            const px = (s.x - 4999) / s.z * W + W / 2 + mouseX * (9999 / s.z) * 30;
            const py = (s.y - 4999) / s.z * H + H / 2 + mouseY * (9999 / s.z) * 30;
            const r = s.size * (9999 / s.z);
            const a = Math.min(1, (9999 - s.z) / 8000);

            if (px < 0 || px > W || py < 0 || py > H) return;

            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fillStyle = isDark
                ? `rgba(200,210,255,${a})`
                : `rgba(79,140,255,${a * 0.4})`;
            ctx.fill();
        });
        requestAnimationFrame(drawStarfield);
    }
    drawStarfield();
})();

// ── FLOATING PARTICLE BURST ON CLICK ────────────────────────
document.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:6px; height:6px; border-radius:50%;
      background:hsl(${Math.random() * 60 + 200},80%,70%);
      pointer-events:none; z-index:9999;
      transform:translate(-50%,-50%);
    `;
        document.body.appendChild(dot);
        const angle = (Math.PI * 2 / 8) * i;
        const dist = 40 + Math.random() * 30;
        dot.animate([
            { transform: `translate(-50%,-50%) translate(0,0)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`, opacity: 0 }
        ], { duration: 500, easing: 'ease-out', fill: 'forwards' })
            .onfinish = () => dot.remove();
    }
});

console.log('%cNandan Kumar Portfolio 🚀', 'color:#4f8cff;font-size:16px;font-weight:bold;');