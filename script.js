/* ═══════════════════════════════════════════
   MOAZ PORTFOLIO — script.js
   All animations, interactions, and effects
═══════════════════════════════════════════ */

/* ══ LOADER ══════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const canvas = document.getElementById('loader-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Loader particle field
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.6 + 0.2
  }));

  let rafId;
  function drawLoader() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.opacity})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(drawLoader);
  }
  drawLoader();

  // Hide loader after fill animation (2.6s) + short delay
  setTimeout(() => {
    loader.classList.add('hidden');
    cancelAnimationFrame(rafId);
    initMain();
  }, 3000);
})();

/* ══ MAIN INIT (runs after loader) ═══════ */
function initMain() {

  // ── AOS ───────────────────────────────
  AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: true,
    offset: 80
  });

  // ── Particle background ───────────────
  initParticles();

  // ── Custom cursor ─────────────────────
  initCursor();

  // ── Typed text ────────────────────────
  initTyped();

  // ── Navbar ────────────────────────────
  initNavbar();

  // ── Smooth scroll ─────────────────────
  initSmoothScroll();

  // ── Scroll progress ───────────────────
  initScrollProgress();

  // ── Counter animations ────────────────
  initCounters();

  // ── Skill bars ────────────────────────
  initSkillBars();

  // ── Tilt effect on cards ──────────────
  initTilt();

  // ── Contact form ──────────────────────
  initForm();

  // ── Active nav on scroll ──────────────
  initScrollSpy();
}

/* ══ PARTICLE CANVAS ═════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor(W * H / 14000), 120);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 120) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // Mouse interaction
      const mx = particles[i].x - mouse.x;
      const my = particles[i].y - mouse.y;
      const md = Math.sqrt(mx * mx + my * my);
      if (md < 150) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,212,255,${(1 - md / 150) * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  draw();
}

/* ══ CUSTOM CURSOR ═══════════════════════ */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let rx = 0, ry = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top = ty + 'px';
  });

  // Ring follows with lag
  function animateCursor() {
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .skill-card, .project-card, .about-card, .goal-card, input, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
      dot.style.background = 'rgba(0,212,255,0.4)';
      ring.style.transform = 'translate(-50%, -50%) scale(1.8)';
      ring.style.borderColor = 'rgba(0,212,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      dot.style.background = 'var(--neon)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = 'rgba(0,212,255,0.5)';
    });
  });
}

/* ══ TYPED TEXT ══════════════════════════ */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Frontend Developer',
    'CS Student',
    'UI/UX Enthusiast',
    'JavaScript Learner',
    'Clean Code Advocate',
    'Future Software Engineer'
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2000); // pause
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 40 : 80);
  }

  type();
}

/* ══ NAVBAR ══════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ══ SMOOTH SCROLL ═══════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══ SCROLL PROGRESS ═════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  });
}

/* ══ COUNTERS ════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let started = false;

  function startCounters() {
    counters.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(interval);
      }, 35);
    });
  }

  const heroSection = document.getElementById('home');
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      setTimeout(startCounters, 1200);
    }
  }, { threshold: 0.3 });

  if (heroSection) observer.observe(heroSection);
}

/* ══ SKILL BARS ══════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('animate'), 200);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

/* ══ TILT EFFECT ═════════════════════════ */
function initTilt() {
  const tiltEls = document.querySelectorAll('.skill-card, .project-card, .about-card, .goal-card, .contact-card, .contact-form');

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 6;
      const tiltY = -((x - cx) / cx) * 6;
      el.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      el.style.transformStyle = 'preserve-3d';

      // Move glow with cursor
      const glow = el.querySelector('.skill-glow');
      if (glow) {
        glow.style.background = `radial-gradient(200px circle at ${x}px ${y}px, rgba(0,212,255,0.06), transparent)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      const glow = el.querySelector('.skill-glow');
      if (glow) glow.style.background = '';
    });
  });
}

/* ══ CONTACT FORM ════════════════════════ */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
      btn.style.background = 'linear-gradient(135deg, #06d6a0, #00b4d8)';
      btn.style.opacity = '1';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = origText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });

  // Input glow on focus
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('focus', () => {
      el.parentElement.style.setProperty('--focus', '1');
    });
    el.addEventListener('blur', () => {
      el.parentElement.style.setProperty('--focus', '0');
    });
  });
}

/* ══ SCROLL SPY ══════════════════════════ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const navH = document.getElementById('navbar').offsetHeight + 30;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - navH) current = s.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
}

/* ══ PARALLAX ════════════════════════════ */
(function initParallax() {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, i) => {
      const speed = 0.05 + i * 0.02;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
    const geo = document.querySelectorAll('.geo');
    geo.forEach((g, i) => {
      const speed = 0.03 + i * 0.015;
      g.style.transform = `translateY(${y * speed}px) rotate(${y * 0.02}deg)`;
    });
  });
})();

/* ══ GLOWING NEON LINES ANIMATION ════════ */
(function initNeonLines() {
  // Add animated neon border sweep to glass cards on hover
  const style = document.createElement('style');
  style.textContent = `
    .glass-card::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent);
      opacity: 0;
      transition: opacity 0.4s;
      pointer-events: none;
      background-size: 200% 100%;
      animation: shimmer 3s linear infinite;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .glass-card:hover::after { opacity: 1; }
  `;
  document.head.appendChild(style);
})();

/* ══ HERO ENTRANCE ANIMATION ════════════ */
(function heroEntrance() {
  // Staggered reveal after loader
  setTimeout(() => {
    document.querySelectorAll('[data-aos]').forEach(el => {
      el.style.opacity = '';
    });
  }, 100);
})();

/* ══ BADGE HOVER LABELS ══════════════════ */
document.querySelectorAll('.badge').forEach(b => {
  b.addEventListener('mouseenter', () => {
    b.style.boxShadow = '0 0 25px rgba(0,212,255,0.5)';
    b.style.transform = 'scale(1.1) translateY(-5px)';
  });
  b.addEventListener('mouseleave', () => {
    b.style.boxShadow = '';
    b.style.transform = '';
  });
});

/* ══ KEYBOARD NAVIGATION ════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('nav-links').classList.remove('open');
  }
});

/* ══ TOUCH: DISABLE CUSTOM CURSOR ════════ */
if ('ontouchstart' in window) {
  document.getElementById('cursor-dot').style.display = 'none';
  document.getElementById('cursor-ring').style.display = 'none';
  document.body.style.cursor = 'auto';
}
