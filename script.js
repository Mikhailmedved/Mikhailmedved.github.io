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

  /* ---------- Quiz ---------- */
  const questions = [
    {
      scenario: 'Письмо от «банка»: «Подтвердите операцию за 10 минут, иначе счёт будет заблокирован». Ссылка ведёт на bank-online-secure.ru',
      q: 'Как правильно поступить?',
      options: [
        'Перейти по ссылке и войти в «личный кабинет»',
        'Позвонить в банк по номеру с обратной стороны карты',
        'Ответить на письмо с просьбой подтвердить легитимность',
        'Нажать на ссылку, но ничего не вводить',
      ],
      correct: 1,
      why: 'Классический фишинг с давлением срочностью. Связь нужно устанавливать только по официальному каналу, который вы знаете сами.',
    },
    {
      scenario: 'Звонок: «Здравствуйте, я из службы безопасности. Для отмены перевода назовите код из СМС».',
      q: 'Что делать с кодом?',
      options: [
        'Назвать код — служба безопасности имеет доступ',
        'Назвать только последние 4 цифры',
        'Не называть и сразу завершить звонок, затем перезвонить в банк',
        'Отправить код в СМС-сообщении в подтверждение',
      ],
      correct: 2,
      why: 'Коды 2FA не передаются никому — ни «сотруднику банка», ни «поддержке». Настоящий банк никогда их не спрашивает.',
    },
    {
      scenario: 'В мессенджере пишет «директор»: «Я на совещании, быстро, конфиденциально — оплати счёт, реквизиты ниже».',
      q: 'Что делать?',
      options: [
        'Оплатить — это же руководитель',
        'Уточнить что-то в чате и оплатить',
        'Перепроверить запрос по официальному каналу связи (позвонить лично)',
        'Попросить прислать голосовое подтверждение',
      ],
      correct: 2,
      why: 'Это претекстинг (CEO fraud). Поддельный аккаунт и срочность — типовой сценарий. Проверка по независимому каналу ломает атаку.',
    },
    {
      scenario: 'На флешке, найденной в офисе, лежит файл «зарплаты_2026.xlsx.exe».',
      q: 'Действия?',
      options: [
        'Открыть — вдруг там важные данные',
        'Посмотреть через смартфон',
        'Передать в ИТ-отдел, ничего не открывая',
        'Скопировать файл и открыть позже дома',
      ],
      correct: 2,
      why: 'Это baiting: носитель оставлен специально. Расширение .exe при виде таблицы — признак вредоносного файла.',
    },
    {
      scenario: 'Сайт просит ввести логин и пароль, адрес в строке: https://vkontakte-support.ru/login',
      q: 'В чём подвох?',
      options: [
        'Ничего, есть «поддержка» в названии',
        'Домен не официальный — данные украдут',
        'HTTPS означает безопасность и доверие',
        'Можно войти, если сразу выйти из аккаунта',
      ],
      correct: 1,
      why: 'Домен vkontakte-support.ru не принадлежит сервису. HTTPS шифрует соединение, но не гарантирует честность сайта.',
    },
  ];

  const quizBody = document.getElementById('quizBody');
  const quizResult = document.getElementById('quizResult');
  const quizBar = document.getElementById('quizBar');
  const quizCounter = document.getElementById('quizCounter');
  let qi = 0, score = 0, answered = false;

  const setProgress = () => {
    quizBar.style.width = ((qi) / questions.length) * 100 + '%';
    quizCounter.textContent = `${String(Math.min(qi + 1, questions.length)).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    answered = false;
    const item = questions[qi];
    setProgress();
    quizBody.style.display = '';
    quizResult.classList.remove('show');
    quizBody.innerHTML = `
      <div class="quiz-scenario">${item.scenario}</div>
      <div class="quiz-q">${item.q}</div>
      <div class="quiz-options">
        ${item.options.map((o, i) => `<button class="quiz-opt" data-i="${i}"><span class="opt-key">${String.fromCharCode(65 + i)}</span><span>${o}</span></button>`).join('')}
      </div>
      <div class="quiz-feedback" id="feedback"></div>
      <button class="btn btn-primary quiz-next" id="nextBtn">${qi < questions.length - 1 ? 'Следующий вопрос' : 'Показать результат'} →</button>
    `;

    const opts = quizBody.querySelectorAll('.quiz-opt');
    const feedback = quizBody.querySelector('#feedback');
    const nextBtn = quizBody.querySelector('#nextBtn');

    opts.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const chosen = +btn.dataset.i;
        opts.forEach((b, i) => {
          b.disabled = true;
          if (i === item.correct) b.classList.add('correct');
          else if (i === chosen) b.classList.add('wrong');
        });
        if (chosen === item.correct) score++;
        feedback.innerHTML = `<b>${chosen === item.correct ? 'Верно.' : 'Мимо.'}</b> ${item.why}`;
        feedback.classList.add('show');
        nextBtn.classList.add('show');
      });
    });

    nextBtn.addEventListener('click', () => {
      qi++;
      if (qi >= questions.length) showResult();
      else renderQuestion();
    });
  };

  const showResult = () => {
    quizBar.style.width = '100%';
    quizCounter.textContent = 'РЕЗУЛЬТАТ';
    quizBody.style.display = 'none';

    const pct = Math.round((score / questions.length) * 100);
    let verdict, desc;
    if (pct === 100) { verdict = 'Человеческий файрвол'; desc = 'Вы распознаёте сценарии социальной инженерии. Это лучший уровень — отличная база для инструктажа коллег.'; }
    else if (pct >= 60) { verdict = 'Устойчивость хорошая'; desc = 'Основные векторы вы распознаёте, но отдельные приёмы всё ещё могут работать. Перечитайте блоки про фишинг и претекстинг.'; }
    else { verdict = 'Зона риска'; desc = 'Сценарии атак вас пока не останавливают. Начните с правила: любые срочные запросы — повод перепроверять канал связи.'; }
    quizResult.innerHTML = `
      <div class="quiz-score">${pct}<span>%</span></div>
      <div class="quiz-verdict">${verdict}</div>
      <p>Правильных ответов: ${score} из ${questions.length}. ${desc}</p>
      <button class="btn btn-ghost" id="quizRestart">Пройти заново</button>
    `;
    quizResult.classList.add('show');
    quizResult.querySelector('#quizRestart').addEventListener('click', () => {
      qi = 0; score = 0;
      quizResult.classList.remove('show');
      renderQuestion();
    });
  };

  if (quizBody) renderQuestion();

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
