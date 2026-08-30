/**
 * My Journey Beyond the Classroom - Portfolio Application
 * Logic & Interactive Systems for 2nd Year B.Sc. Data Science Student
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursorSpotlight();
  initThemeToggle();
  initAudioSystem();
  initMobileNav();
  initTimelineStepper();
  initPipelineFlow();
  initAgmarknetChart();
  initExperienceModals();
  initResumeActions();
  initScrollSpy();
});

/* ==========================================================================
   1. Dynamic Interactive Particle Constellation Canvas
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 85;
  const maxDistance = 140;
  const mouse = { x: null, y: null, radius: 160 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.6 ? '#00f2fe' : (Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6');
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.baseColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
          ctx.strokeStyle = isDark 
            ? `rgba(0, 242, 254, ${alpha * 0.18})` 
            : `rgba(2, 132, 199, ${alpha * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Connect to mouse
    if (mouse.x != null && mouse.y != null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = 1 - dist / mouse.radius;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(particles[i].x, particles[i].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Cursor Spotlight Variable
   ========================================================================== */
function initCursorSpotlight() {
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
}

/* ==========================================================================
   3. Theme Toggle (Dark & Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const iconSpan = document.getElementById('theme-icon');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    playSound('click');
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
    showToast(`Theme switched to ${next} mode`);
  });

  function updateThemeIcon(theme) {
    if (!iconSpan) return;
    if (theme === 'light') {
      iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    } else {
      iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  }
}

/* ==========================================================================
   4. Audio Feedback (Web Audio API Synthesizer)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundIcon) {
      soundIcon.innerHTML = soundEnabled 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    }
    showToast(soundEnabled ? 'Audio cues enabled' : 'Audio cues muted');
    if (soundEnabled) playSound('click');
  });
}

function playSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'step') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    // Graceful fallback if AudioContext is blocked
  }
}

/* ==========================================================================
   5. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    playSound('click');
  });

  const links = drawer.querySelectorAll('.nav-link');
  links.forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   6. Interactive Timeline Stepper (1.5 Years Growth)
   ========================================================================== */
function initTimelineStepper() {
  const stepBtns = document.querySelectorAll('.timeline-step-btn');
  const timelineCards = document.querySelectorAll('.timeline-event-card');

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('step');
      const phase = btn.getAttribute('data-phase');

      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      timelineCards.forEach(card => {
        const cardPhases = card.getAttribute('data-phases') || '';
        if (phase === 'all' || cardPhases.includes(phase)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Featured Project 7-Step Interactive Pipeline Flow
   ========================================================================== */
const pipelineData = {
  'gov-data': {
    title: '1. Government Data (AGMARKNET)',
    desc: 'Extracted public market data from the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture and Farmers Welfare (AGMARKNET portal), focusing on daily arrivals and wholesale commodity market prices.',
    tech: 'AGMARKNET Public Portal, Raw CSV/JSON extraction, Market mandi records'
  },
  'collection': {
    title: '2. Data Collection',
    desc: 'Systematically aggregated multi-year historical wholesale price time-series across selected agricultural commodities (e.g. Onion, Tomato, Wheat) spanning various state mandis.',
    tech: 'Structured Querying, Multi-market batch extraction, Dataset formatting'
  },
  'cleaning': {
    title: '3. Data Cleaning',
    desc: 'Handled missing market trading days (due to holidays/weekends), standardized date-time formats, resolved commodity variety discrepancies, and filtered spurious price outliers.',
    tech: 'Missing Value Imputation, Outlier Filtering, Standardized Schema'
  },
  'analysis': {
    title: '4. Data Analysis',
    desc: 'Performed descriptive statistical analysis on modal, minimum, and maximum prices. Evaluated price spread between arrival volume surges and commodity modal values.',
    tech: 'Descriptive Statistics, Modal Price Spread, Correlation Indices'
  },
  'visualization': {
    title: '5. Visualization',
    desc: 'Constructed clear visual charts including time-series trends, seasonal moving averages, mandi-wise price comparisons, and volatility distribution plots.',
    tech: 'Time-Series Charts, Multi-commodity Overlays, Moving Averages'
  },
  'pattern': {
    title: '6. Pattern Identification',
    desc: 'Identified seasonal price cycles, harvest-period price dips, festival demand spikes, and cyclical price fluctuations across historical trading months.',
    tech: 'Seasonality Decomposition, Cyclical Wave Inspection, Demand Peaks'
  },
  'forecasting': {
    title: '7. Forecasting Fundamentals',
    desc: 'Explored time-series forecasting fundamentals (moving averages, trend extrapolation, baseline projection intervals) to study future commodity price trends.',
    tech: 'Moving Average Smoothing, Trend Trajectories, Baseline Prediction Bands'
  }
};

function initPipelineFlow() {
  const steps = document.querySelectorAll('.pipeline-step');
  const titleEl = document.getElementById('pipeline-detail-title');
  const descEl = document.getElementById('pipeline-detail-desc');
  const techEl = document.getElementById('pipeline-detail-tech');

  if (!steps.length || !titleEl) return;

  steps.forEach(step => {
    step.addEventListener('click', () => {
      playSound('step');
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      const stepKey = step.getAttribute('data-step');
      const data = pipelineData[stepKey];
      if (data) {
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        techEl.textContent = data.tech;
      }
    });
  });
}

/* ==========================================================================
   8. AGMARKNET Interactive Price & Forecasting Chart
   ========================================================================== */
const commodityDatasets = {
  onion: {
    name: 'Onion (Modal Price ₹/Quintal)',
    historical: [1850, 1920, 2100, 1750, 1600, 1550, 2200, 2800, 3400, 3100, 2400, 2100],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    forecast: [2250, 2400, 2600, 2150],
    forecastMonths: ['Jan (Est)', 'Feb (Est)', 'Mar (Est)', 'Apr (Est)'],
    upperBand: [2450, 2650, 2900, 2400],
    lowerBand: [2050, 2150, 2300, 1900]
  },
  tomato: {
    name: 'Tomato (Modal Price ₹/Quintal)',
    historical: [1200, 1350, 1100, 950, 1400, 2200, 3800, 4200, 2600, 1800, 1500, 1300],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    forecast: [1450, 1300, 1150, 1600],
    forecastMonths: ['Jan (Est)', 'Feb (Est)', 'Mar (Est)', 'Apr (Est)'],
    upperBand: [1700, 1550, 1400, 1950],
    lowerBand: [1200, 1050, 900, 1250]
  },
  wheat: {
    name: 'Wheat (Modal Price ₹/Quintal)',
    historical: [2125, 2150, 2180, 2100, 2110, 2160, 2200, 2240, 2275, 2300, 2320, 2350],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    forecast: [2380, 2400, 2360, 2310],
    forecastMonths: ['Jan (Est)', 'Feb (Est)', 'Mar (Est)', 'Apr (Est)'],
    upperBand: [2440, 2470, 2420, 2380],
    lowerBand: [2320, 2330, 2300, 2240]
  }
};

let currentCommodity = 'onion';

function initAgmarknetChart() {
  const canvas = document.getElementById('agmarknet-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const btns = document.querySelectorAll('.commodity-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCommodity = btn.getAttribute('data-commodity');
      renderChart();
    });
  });

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width - 32) * dpr;
    canvas.height = 320 * dpr;
    canvas.style.width = `${rect.width - 32}px`;
    canvas.style.height = `320px`;
    ctx.scale(dpr, dpr);
    renderChart();
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 50);

  function renderChart() {
    const data = commodityDatasets[currentCommodity];
    const width = parseFloat(canvas.style.width);
    const height = parseFloat(canvas.style.height);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 30, right: 30, bottom: 40, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const allPrices = [...data.historical, ...data.forecast, ...data.upperBand, ...data.lowerBand];
    const minPrice = Math.floor(Math.min(...allPrices) * 0.9 / 100) * 100;
    const maxPrice = Math.ceil(Math.max(...allPrices) * 1.1 / 100) * 100;

    const totalPoints = data.historical.length + data.forecast.length;
    const allLabels = [...data.months, ...data.forecastMonths];

    function getX(index) {
      return padding.left + (index / (totalPoints - 1)) * chartW;
    }

    function getY(val) {
      return padding.top + chartH - ((val - minPrice) / (maxPrice - minPrice)) * chartH;
    }

    // Grid lines & Y Axis Labels
    const ySteps = 5;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= ySteps; i++) {
      const val = minPrice + ((maxPrice - minPrice) / ySteps) * i;
      const y = getY(val);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(`₹${Math.round(val)}`, padding.left - 10, y);
    }

    // X Axis Labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i < totalPoints; i += 2) {
      const x = getX(i);
      ctx.fillStyle = i >= data.historical.length ? '#8b5cf6' : '#64748b';
      ctx.fillText(allLabels[i], x, height - padding.bottom + 12);
    }

    // Draw Forecasting Confidence Band Area
    const histLen = data.historical.length;
    ctx.beginPath();
    const startX = getX(histLen - 1);
    const startY = getY(data.historical[histLen - 1]);

    ctx.moveTo(startX, startY);
    for (let i = 0; i < data.forecast.length; i++) {
      ctx.lineTo(getX(histLen + i), getY(data.upperBand[i]));
    }
    for (let i = data.forecast.length - 1; i >= 0; i--) {
      ctx.lineTo(getX(histLen + i), getY(data.lowerBand[i]));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.fill();

    // Draw Historical Data Line & Gradient Fill
    const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0.28)');
    grad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data.historical[0]));
    for (let i = 1; i < histLen; i++) {
      ctx.lineTo(getX(i), getY(data.historical[i]));
    }
    ctx.lineTo(getX(histLen - 1), height - padding.bottom);
    ctx.lineTo(getX(0), height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Historical Stroke Line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data.historical[0]));
    for (let i = 1; i < histLen; i++) {
      ctx.lineTo(getX(i), getY(data.historical[i]));
    }
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Historical Points
    for (let i = 0; i < histLen; i++) {
      const px = getX(i);
      const py = getY(data.historical[i]);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#070a13';
      ctx.fill();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw Forecasting Line (Dashed)
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(getX(histLen - 1), getY(data.historical[histLen - 1]));
    for (let i = 0; i < data.forecast.length; i++) {
      ctx.lineTo(getX(histLen + i), getY(data.forecast[i]));
    }
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    // Forecast Points
    for (let i = 0; i < data.forecast.length; i++) {
      const px = getX(histLen + i);
      const py = getY(data.forecast[i]);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#070a13';
      ctx.fill();
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Demarcation Line between Historical and Forecast
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(getX(histLen - 1), padding.top);
    ctx.lineTo(getX(histLen - 1), height - padding.bottom);
    ctx.stroke();

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8b5cf6';
    ctx.textAlign = 'left';
    ctx.fillText('Forecast Interval ➔', getX(histLen - 1) + 6, padding.top + 10);
    ctx.restore();
  }
}

/* ==========================================================================
   9. Experience Cards Modal System
   ========================================================================== */
const experienceDetails = {
  datagenics: {
    title: 'DATAGENICS',
    badge: 'Departmental Participation',
    subtitle: 'Exposure to Data Science Community & Activities',
    summary: 'Participated in the Datagenics event and gained exposure to the Data Science community and departmental activities.',
    takeaways: [
      'Engaged with fellow students and departmental peers in collaborative Data Science discussions.',
      'Gained first-hand exposure to departmental traditions, technical showcases, and knowledge sharing.',
      'Developed enthusiasm for continuous participation and community-driven learning.'
    ]
  },
  'data-hunt': {
    title: 'DATA HUNT',
    badge: 'Conducted Activity',
    subtitle: 'Event Leadership & Coordination',
    summary: 'Conducted Data Hunt as a departmental activity, taking full ownership of planning, teamwork, and execution.',
    takeaways: [
      'Event Coordination: Managed clue structures, activity checkpoints, and participant flow.',
      'Teamwork & Communication: Collaborated with student peers and department mentors for seamless delivery.',
      'Responsibility: Oversaw event logistics, problem-solving under real-time conditions, and participant support.'
    ]
  },
  'data-conclave': {
    title: 'DATA CONCLAVE',
    badge: 'Event Participation',
    subtitle: 'Departmental Forum & Knowledge Sessions',
    summary: 'Participated and contributed to activities related to Data Conclave.',
    takeaways: [
      'Attended technical sessions and observed how data topics are explored at scale.',
      'Contributed actively to event support and peer coordination during the conclave.',
      'Broadened perspective on modern data trends and practical applications.'
    ]
  },
  'power-bi': {
    title: 'POWER BI WORKSHOP',
    badge: '1-Week Intensive Workshop',
    subtitle: 'Major Practical Learning Milestone',
    summary: 'Attended a comprehensive one-week workshop focused on Power BI and data visualization, serving as a primary practical upskilling experience.',
    takeaways: [
      'Mastered visual dashboard creation, interactive filtering, and business metrics representation.',
      'Practiced connecting raw data sources into dynamic, clear analytical reporting charts.',
      'Solidified understanding of storytelling with data and visual hierarchy.'
    ]
  },
  'excel-cert': {
    title: 'MICROSOFT EXCEL CERTIFICATION',
    badge: 'Certified Course',
    subtitle: 'Online Certification via Simplilearn',
    summary: 'Completed an online Microsoft Excel course through Simplilearn and received a verified certificate.',
    takeaways: [
      'Gained proficiency in core spreadsheet mechanics, data manipulation formulas, and lookup functions.',
      'Organized structured tables, applied conditional formatting, and performed summary aggregations.',
      'Earned a recognized course certificate demonstrating dedication to foundational tool mastery.'
    ]
  },
  'finance-course': {
    title: 'FINANCE LIBERAL ARTS COURSE',
    badge: 'Interdisciplinary Learning',
    subtitle: '1-Week Liberal Arts Immersion',
    summary: 'Completed a one-week Liberal Arts course focused on Finance, exploring interdisciplinary domain knowledge.',
    takeaways: [
      'Explored financial concepts, market dynamics, and monetary decision-making fundamentals.',
      'Connected quantitative data analysis principles to financial domain contexts.',
      'Enriched analytical thinking by stepping outside purely technical coursework.'
    ]
  },
  outbound: {
    title: 'OUTBOUND PROGRAMME',
    badge: 'Experiential Growth',
    subtitle: 'Outdoor Team Building & Leadership',
    summary: 'Participated in an outbound programme and received a certificate of completion.',
    takeaways: [
      'Strengthened interpersonal communication and adaptive problem-solving in active team settings.',
      'Built confidence, collaborative resilience, and leadership awareness.',
      'Received a programme certificate recognizing active participation and team engagement.'
    ]
  }
};

function initExperienceModals() {
  const modalBackdrop = document.getElementById('experience-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const titleEl = document.getElementById('modal-title');
  const badgeEl = document.getElementById('modal-badge');
  const subEl = document.getElementById('modal-subtitle');
  const sumEl = document.getElementById('modal-summary');
  const takeawaysList = document.getElementById('modal-takeaways');

  if (!modalBackdrop) return;

  document.querySelectorAll('.exp-learn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('click');
      const expKey = btn.getAttribute('data-exp');
      const data = experienceDetails[expKey];
      if (data) {
        titleEl.textContent = data.title;
        badgeEl.textContent = data.badge;
        subEl.textContent = data.subtitle;
        sumEl.textContent = data.summary;

        takeawaysList.innerHTML = '';
        data.takeaways.forEach(t => {
          const li = document.createElement('li');
          li.className = 'modal-takeaway-item';
          li.style.marginBottom = '0.65rem';
          li.style.fontSize = '0.92rem';
          li.style.color = 'var(--text-secondary)';
          li.textContent = `• ${t}`;
          takeawaysList.appendChild(li);
        });

        modalBackdrop.classList.add('open');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      playSound('click');
      modalBackdrop.classList.remove('open');
    });
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('open');
    }
  });

  // Filter tabs for Experience section
  const filterTabs = document.querySelectorAll('.filter-tab');
  const expCards = document.querySelectorAll('.exp-card-wrap');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playSound('click');
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-category');
      expCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (cat === 'all' || cardCat.includes(cat)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   10. Resume Actions (Print & Copy Text)
   ========================================================================== */
function initResumeActions() {
  const printBtn = document.getElementById('print-resume-btn');
  const copyBtn = document.getElementById('copy-resume-btn');

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      playSound('click');
      window.print();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      playSound('click');
      const resumeText = `
B.Sc. Data Science Student (2nd Year)
Theme: My Journey Beyond the Classroom

PROFESSIONAL SUMMARY:
I am a B.Sc. Data Science student with a growing interest in data analysis and data visualization. Beyond my regular academic curriculum, I have participated in departmental events, conducted a Data Hunt activity, attended a one-week Power BI workshop, completed certifications and explored interdisciplinary learning through a Finance Liberal Arts course. I am currently building projects and continuing to develop my skills through practical experiences.

REAL EXPERIENCES & ACTIVITIES:
- DATA HUNT: Conducted as a departmental activity. (Event Coordination, Organization, Teamwork, Communication, Responsibility)
- DATAGENICS: Participated and gained exposure to the Data Science community and departmental activities.
- DATA CONCLAVE: Participated and contributed to activities related to Data Conclave.
- POWER BI WORKSHOP: Attended an intensive 1-week workshop focused on Power BI and data visualization.
- MICROSOFT EXCEL CERTIFICATION: Completed online Microsoft Excel course through Simplilearn (Certificate Earned).
- FINANCE LIBERAL ARTS COURSE: Completed a 1-week Liberal Arts course focused on Finance.
- OUTBOUND PROGRAMME: Participated in an outbound programme (Certificate Earned).

FEATURED ACADEMIC PROJECT:
- Agricultural Commodity Price Analysis and Forecasting Using AGMARKNET Government Data
  Workflow: Government Data -> Data Collection -> Data Cleaning -> Data Analysis -> Visualization -> Pattern Identification -> Forecasting

CURRENT JOURNEY:
- Exploring ProtoSem (Innovation & Applied Learning Framework)
- Building personal projects & Developing personal portfolio
- Exploring GitHub & Real-world Data Science projects

SKILLS:
- Technical Tools: Power BI, Microsoft Excel, GitHub
- Data Skills: Data Analysis, Data Visualization, Exploratory Data Analysis (EDA), Forecasting Fundamentals
- Professional Skills: Communication, Presentation, Event Coordination, Teamwork, Problem Solving, Analytical Thinking
      `.trim();

      navigator.clipboard.writeText(resumeText).then(() => {
        showToast('✓ Resume text copied to clipboard');
      }).catch(() => {
        showToast('Resume ready to copy');
      });
    });
  }
}

/* ==========================================================================
   11. ScrollSpy Navigation Active States
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
let toastTimeout;
function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
