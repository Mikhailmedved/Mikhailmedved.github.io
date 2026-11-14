(() => {
  'use strict';

  /* ---------- Cursor ---------- */
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  });
  (function raf() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
    requestAnimationFrame(raf);
  })();

  document.querySelectorAll('[data-hover]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('grow'));
  });

  /* ---------- Magnetic ---------- */
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.26}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });

  /* ---------- Nav ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
    io.observe(el);
  });

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const dur = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach((c) => cio.observe(c));

  /* ---------- Parallax ---------- */
  const heroBg = document.getElementById('heroBgText');
  const ctaBg = document.getElementById('ctaBg');
  const parallax = () => {
    if (heroBg) heroBg.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.12}px))`;
    if (ctaBg && ctaBg.parentElement) {
      const r = ctaBg.parentElement.getBoundingClientRect();
      const off = (r.top + r.height / 2 - innerHeight / 2) * -0.08;
      ctaBg.style.transform = `translate(-50%, calc(-50% + ${off}px))`;
    }
  };
  addEventListener('scroll', parallax, { passive: true });
  parallax();

  /* ---------- Terminal typing ---------- */
  const termBody = document.getElementById('termBody');
  const lines = [
    { t: '> инициализация сценария...', c: 'dim' },
    { t: '> цель: сотрудник / отдел продаж', c: 'dim' },
    { t: '> вектор: претекстинг', c: 'warn' },
    { t: '> канал: email + звонок', c: 'dim' },
    { t: '> доверие установлено: 87%', c: 'ok' },
    { t: '> доступ получен', c: 'warn' },
  ];
  if (termBody) {
    let li = 0, ci = 0, buffer = '';
    const caret = () => '<span class="cursor-blink"></span>';
    const type = () => {
      if (li >= lines.length) {
        termBody.innerHTML = buffer + caret();
        return;
      }
      const { t, c } = lines[li];
      if (ci === 0) buffer += `<div class="${c}">`;
      buffer += t[ci];
      ci++;
      termBody.innerHTML = buffer + '<div></div>' + caret();
      if (ci >= t.length) {
        buffer += '</div>';
        li++; ci = 0;
        setTimeout(type, 380);
      } else {
        setTimeout(type, t[ci - 1] === ' ' ? 40 : 26);
      }
    };
    setTimeout(type, 900);
  }

  /* ---------- Hero title mouse parallax ---------- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && matchMedia('(pointer:fine)').matches) {
    addEventListener('mousemove', (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 8;
      const y = (e.clientY / innerHeight - 0.5) * 6;
      heroTitle.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();