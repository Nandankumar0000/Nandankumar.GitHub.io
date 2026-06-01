/* ============================================================
   NANDAN KUMAR — script.js
   ============================================================ */

// ── LOADER ──────────────────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hide');
    }, 1600);
});

// ── CUSTOM CURSOR ───────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    cursorDot.style.left = cx + 'px';
    cursorDot.style.top = cy + 'px';
    requestAnimationFrame(animCursor);
})();

// ── THREE.JS 3D BACKGROUND ──────────────────────────────────
(function init3D() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 30);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.18, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Floating wireframe shapes
    const shapes = [];
    const geos = [
        new THREE.IcosahedronGeometry(1.4, 0),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.TetrahedronGeometry(1.3, 0),
        new THREE.IcosahedronGeometry(1.0, 0),
        new THREE.OctahedronGeometry(0.9, 0),
    ];
    const accentColor = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'neon') return 0xdc32ff;
        if (theme === 'solar') return 0xffb400;
        return 0x00c8ff;
    };

    geos.forEach((geo, i) => {
        const mat = new THREE.MeshBasicMaterial({ color: accentColor(), wireframe: true, transparent: true, opacity: 0.18 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 24, (Math.random() - 0.5) * 10 - 10);
        mesh.userData = { rx: Math.random() * 0.008 + 0.003, ry: Math.random() * 0.008 + 0.003, mat };
        scene.add(mesh);
        shapes.push(mesh);
    });

    // Central glowing sphere
    const sphereGeo = new THREE.SphereGeometry(3, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({ color: accentColor(), wireframe: true, transparent: true, opacity: 0.06 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Mouse parallax
    let tmx = 0, tmy = 0;
    document.addEventListener('mousemove', e => {
        tmx = (e.clientX / window.innerWidth - 0.5) * 0.6;
        tmy = (e.clientY / window.innerHeight - 0.5) * 0.6;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Update colors on theme change
    window._update3DColors = () => {
        const c = accentColor();
        shapes.forEach(s => s.userData.mat.color.setHex(c));
        sphereMat.color.setHex(c);
        starMat.color.setHex(c === 0xffb400 ? 0xffcc66 : c === 0xdc32ff ? 0xee88ff : 0xaaccff);
    };

    (function animate() {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.0003;
        stars.rotation.x += 0.0001;
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;
        shapes.forEach(s => { s.rotation.x += s.userData.rx; s.rotation.y += s.userData.ry; });
        camera.position.x += (tmx * 3 - camera.position.x) * 0.04;
        camera.position.y += (-tmy * 3 - camera.position.y) * 0.04;
        renderer.render(scene, camera);
    })();
})();

// ── THEME SWITCHER ──────────────────────────────────────────
document.querySelectorAll('.thm').forEach(btn => {
    btn.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', btn.dataset.theme);
        document.querySelectorAll('.thm').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window._update3DColors) window._update3DColors();
    });
});

// ── NAVBAR SCROLL ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backTop.classList.toggle('show', window.scrollY > 400);
});
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ── MOBILE MENU ─────────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('open');
});
function closeMobile() { document.getElementById('mobile-menu').classList.remove('open'); }

// ── TYPEWRITER ──────────────────────────────────────────────
const roles = ['Python Developer', 'Web Developer', 'SQL Enthusiast', 'AI/ML Learner', 'Problem Solver'];
let ri = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function typewrite() {
    const word = roles[ri];
    tw.textContent = deleting ? word.slice(0, --ci) : word.slice(0, ++ci);
    let delay = deleting ? 50 : 95;
    if (!deleting && ci === word.length) { delay = 2000; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 400; }
    setTimeout(typewrite, delay);
}
setTimeout(typewrite, 1800);

// ── SCROLL REVEAL ───────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── SKILL BARS ──────────────────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.w + '%';
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.sk-fill').forEach(el => skillObs.observe(el));

// ── CLICK BURST ─────────────────────────────────────────────
document.addEventListener('click', e => {
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        const angle = (Math.PI * 2 / 10) * i;
        const dist = 35 + Math.random() * 30;
        p.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:5px;height:5px;border-radius:50%;pointer-events:none;z-index:9999;
      background:var(--accent);transform:translate(-50%,-50%);
    `;
        document.body.appendChild(p);
        p.animate([
            { transform: `translate(-50%,-50%)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px),calc(-50% + ${Math.sin(angle) * dist}px))`, opacity: 0 }
        ], { duration: 550, easing: 'ease-out', fill: 'forwards' }).onfinish = () => p.remove();
    }
});

// ── CERTIFICATE MODAL ───────────────────────────────────────
function openCert(src, title) {
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-dl').href = src;
    document.getElementById('cert-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCert() {
    document.getElementById('cert-modal').classList.remove('open');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCert(); });

// ── TILT EFFECT ON CARDS ────────────────────────────────────
document.querySelectorAll('.proj-card,.cert-card,.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ── TERMINAL TYPING ANIMATION ───────────────────────────────
(function terminalAnim() {
    const lines = document.querySelectorAll('#terminal-body .t-line');
    lines.forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-8px)';
        line.style.transition = 'opacity .3s ease, transform .3s ease';
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'none';
        }, 2000 + i * 350);
    });
})();

// ── FIRE & WATER CANVAS PARTICLES ──────────────────────────
(function initFireWater() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fw-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;z-index:1;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    // FIRE particles
    const fireParticles = [];
    for (let i = 0; i < 60; i++) {
        fireParticles.push({
            x: Math.random() * window.innerWidth,
            y: H + Math.random() * 200,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -(Math.random() * 2.5 + 1.2),
            size: Math.random() * 5 + 2,
            life: Math.random(),
            maxLife: Math.random() * 0.6 + 0.4,
            side: Math.random() < 0.5 ? 'left' : 'right',
        });
    }

    // WATER particles
    const waterParticles = [];
    for (let i = 0; i < 50; i++) {
        waterParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 1.2 + 0.3,
            size: Math.random() * 4 + 1.5,
            life: Math.random(),
            wave: Math.random() * Math.PI * 2,
        });
    }

    function resetFire(p) {
        const side = p.side;
        p.x = side === 'left'
            ? Math.random() * W * 0.15
            : W - Math.random() * W * 0.15;
        p.y = H + 10;
        p.vx = (Math.random() - 0.5) * 0.9;
        p.vy = -(Math.random() * 3 + 1.5);
        p.size = Math.random() * 6 + 2;
        p.life = 0;
        p.maxLife = Math.random() * 0.5 + 0.4;
    }

    function resetWater(p) {
        p.x = Math.random() * W;
        p.y = -10;
        p.vx = (Math.random() - 0.5) * 0.5;
        p.vy = Math.random() * 1.5 + 0.5;
        p.size = Math.random() * 4 + 1.5;
        p.life = 0;
        p.wave = Math.random() * Math.PI * 2;
    }

    function drawFireWater() {
        ctx.clearRect(0, 0, W, H);

        const theme = document.documentElement.getAttribute('data-theme');

        // ── FIRE (bottom-left & bottom-right corners) ──
        fireParticles.forEach(p => {
            p.life += 0.008;
            p.x += p.vx + Math.sin(p.life * 8) * 0.4;
            p.y += p.vy;
            p.vy -= 0.015; // accelerate upward

            if (p.life >= p.maxLife || p.y < H * 0.55) resetFire(p);

            const t = p.life / p.maxLife;
            const a = Math.sin(t * Math.PI) * 0.55;
            const r = p.size * (1 - t * 0.5);

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
            if (theme === 'solar') {
                grad.addColorStop(0, `rgba(255,255,180,${a})`);
                grad.addColorStop(0.4, `rgba(255,160,0,${a * 0.8})`);
                grad.addColorStop(1, `rgba(255,50,0,0)`);
            } else if (theme === 'neon') {
                grad.addColorStop(0, `rgba(255,200,255,${a})`);
                grad.addColorStop(0.4, `rgba(220,50,255,${a * 0.8})`);
                grad.addColorStop(1, `rgba(120,0,180,0)`);
            } else {
                grad.addColorStop(0, `rgba(255,240,180,${a})`);
                grad.addColorStop(0.4, `rgba(255,120,0,${a * 0.8})`);
                grad.addColorStop(1, `rgba(255,30,0,0)`);
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });

        // ── WATER (falling from top-center area) ──
        waterParticles.forEach(p => {
            p.life += 0.006;
            p.wave += 0.04;
            p.x += p.vx + Math.sin(p.wave) * 0.5;
            p.y += p.vy;

            if (p.y > H + 10) resetWater(p);

            const a = Math.min(p.life * 3, 1) * 0.45;
            const r = p.size;

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
            if (theme === 'solar') {
                grad.addColorStop(0, `rgba(0,240,200,${a})`);
                grad.addColorStop(0.5, `rgba(0,180,255,${a * 0.7})`);
                grad.addColorStop(1, `rgba(0,100,255,0)`);
            } else if (theme === 'neon') {
                grad.addColorStop(0, `rgba(160,255,80,${a})`);
                grad.addColorStop(0.5, `rgba(0,220,120,${a * 0.7})`);
                grad.addColorStop(1, `rgba(0,150,80,0)`);
            } else {
                grad.addColorStop(0, `rgba(180,255,255,${a})`);
                grad.addColorStop(0.5, `rgba(0,200,255,${a * 0.7})`);
                grad.addColorStop(1, `rgba(0,100,200,0)`);
            }
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, r, r * 1.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });

        requestAnimationFrame(drawFireWater);
    }
    drawFireWater();
})();

console.log('%c⚡ Nandan Kumar Portfolio', 'color:#00c8ff;font-size:18px;font-weight:900;font-family:monospace');
