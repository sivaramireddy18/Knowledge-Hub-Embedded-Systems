/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * career-coach.js — Career Intelligence Panel
 *
 * Manages: Job Readiness Score, Salary Benchmarks, Company Targets,
 *          Interview Readiness Checklist, Daily Career Tips
 */

/* ══════════════════════════════════════
   SALARY INTELLIGENCE (INR + USD)
   ══════════════════════════════════════ */
const SALARY_BANDS = {
  1: { inr: '₹4L – ₹10L',   usd: '$28K – $55K',  level: 'Junior / Fresher',       desc: 'C, GPIO, basic peripheral knowledge' },
  2: { inr: '₹8L – ₹18L',   usd: '$45K – $85K',  level: 'Embedded Developer I',   desc: 'Bare-metal drivers, interrupts, ARM arch' },
  3: { inr: '₹14L – ₹26L',  usd: '$65K – $110K', level: 'Embedded Developer II',  desc: 'Protocols, Linux toolchain, systems programming' },
  4: { inr: '₹20L – ₹38L',  usd: '$85K – $145K', level: 'Senior Embedded Engineer',desc: 'RTOS, DMA, production firmware patterns' },
  5: { inr: '₹32L – ₹65L',  usd: '$120K – $220K',level: 'Principal / Staff Engineer','desc': 'HAL architecture, PCB, sensor fusion, full-stack embedded' },
};

/* ══════════════════════════════════════
   TARGET COMPANIES
   ══════════════════════════════════════ */
const COMPANY_TARGETS = [
  { name: 'NXP',        role: 'MCU Software Eng',   tier: 't2', requiresPhase: 2 },
  { name: 'Renesas',    role: 'Embedded Systems',    tier: 't2', requiresPhase: 2 },
  { name: 'TI',         role: 'Firmware Engineer',   tier: 't2', requiresPhase: 2 },
  { name: 'Bosch',      role: 'Embedded Dev',        tier: 't3', requiresPhase: 3 },
  { name: 'Qualcomm',   role: 'DSP/Embedded',        tier: 't1', requiresPhase: 4 },
  { name: 'Tesla',      role: 'Firmware Eng',        tier: 't1', requiresPhase: 4 },
  { name: 'Continental','role': 'AUTOSAR Dev',       tier: 't3', requiresPhase: 3 },
  { name: 'SpaceX',     role: 'Avionics Eng',        tier: 't1', requiresPhase: 5 },
];

/* ══════════════════════════════════════
   INTERVIEW READINESS CHECKLIST
   ══════════════════════════════════════ */
const READINESS_CHECKLIST = [
  { id: 'rc-ohm',       label: "Explain Ohm's Law + LED resistor calc",  requiresLesson: 'P1-L2' },
  { id: 'rc-gpio',      label: 'Configure a GPIO register from scratch',   requiresLesson: 'P1-L3' },
  { id: 'rc-hex',       label: 'Convert hex↔binary in your head',          requiresLesson: 'P1-L6' },
  { id: 'rc-memory',    label: 'Draw the 5-segment memory map from memory', requiresLesson: 'P1-L8' },
  { id: 'rc-clock',     label: 'Explain RCC clock gating — live on board', requiresLesson: 'P2-L2' },
  { id: 'rc-isr',       label: 'Write a correct ISR with flag clearing',   requiresLesson: 'P2-L3' },
  { id: 'rc-nvic',      label: 'Configure NVIC priority without a HAL',    requiresLesson: 'P2-L4' },
  { id: 'rc-i2c',       label: 'Describe I2C START/STOP/ACK sequence',    requiresLesson: 'P3-L2' },
  { id: 'rc-spi',       label: 'Explain CPOL/CPHA modes',                 requiresLesson: 'P3-L3' },
  { id: 'rc-rtos',      label: 'Explain preemptive scheduling + context switch', requiresLesson: 'P4-L1' },
  { id: 'rc-mutex',     label: 'Describe priority inversion + fix',        requiresLesson: 'P4-L4' },
  { id: 'rc-hal',       label: 'Design a portable HAL interface',          requiresLesson: 'P5-L1' },
];

/* ══════════════════════════════════════
   DAILY CAREER TIPS (50-tip bank)
   ══════════════════════════════════════ */
const DAILY_TIPS = [
  { tip: 'Your GitHub is your resume. Every bare-metal driver you write there is worth 10 bullets on a CV.', attr: 'Minux Senior Consultant' },
  { tip: 'MNC interviewers do not care about theory. They ask: "Walk me through your last driver from register to application." Have that answer sharp.', attr: 'NXP Hiring Manager' },
  { tip: 'Learn to read a reference manual faster than your competition. The engineer who can find a register field in 30 seconds gets hired. The one who Googles it does not.', attr: 'Embedded Architect, Tier 1 Automotive' },
  { tip: 'MISRA-C compliance is not optional in automotive. List it explicitly on your CV: "Code written to MISRA-C:2012 with static analysis (PC-lint/Cppcheck)."', attr: 'Continental Technical Lead' },
  { tip: 'Salary negotiation: know your BATNA (Best Alternative To Negotiated Agreement). A competing offer from NXP while interviewing at Bosch is worth ₹5–8L in extra negotiation power.', attr: 'Career Coach' },
  { tip: 'The embedded systems job market rewards T-shaped engineers: deep in one area (e.g., RTOS), competent across many (protocols, Linux, C). Depth first, breadth second.', attr: 'Renesas Principal Engineer' },
  { tip: 'Your first job is not your last. Optimize your first role for mentorship quality and technical depth — not salary. You can negotiate salary at job #2 with experience behind you.', attr: 'Career Coach' },
  { tip: 'If you cannot explain what volatile does and why it matters, you will fail every senior embedded interview. Know it cold.', attr: 'Texas Instruments Interviewer' },
  { tip: 'Production debugging skills are worth more than theoretical knowledge at the senior level. "I used a logic analyzer to find a 2µs I2C timing violation" is a stronger interview story than any textbook answer.', attr: 'Bosch R&D Senior Engineer' },
  { tip: 'Build a FreeRTOS project with at least 3 tasks, a mutex, a queue, and DMA. Put it on GitHub with a professional README, logic analyzer screenshots, and a memory usage report.', attr: 'Minux Curriculum Author' },
  { tip: 'The difference between a ₹12L offer and a ₹22L offer is often one thing: can you explain what your code does at the register level, without looking at the datasheet?', attr: 'Recruiting Partner, EV OEM' },
  { tip: 'Every project on your GitHub should have: a professional README, circuit schematic, oscilloscope/logic analyzer captures, memory usage analysis, and a PASS/FAIL test report.', attr: 'Career Coach' },
  { tip: 'Companies like Qualcomm and Tesla do not hire for knowledge. They hire for problem-solving velocity. Practice explaining your debugging process, not just the solution.', attr: 'Qualcomm Technical Recruiter' },
  { tip: 'Learn GDB remote debugging over JTAG/SWD. It separates experienced embedded engineers from hobbyists. "I have never used GDB" is a red flag at the senior level.', attr: 'SpaceX Avionics Team' },
  { tip: 'ISO 26262 and IEC 61508 certifications significantly increase your market value in automotive and industrial. Even basic awareness (ASIL, SIL levels) opens doors.', attr: 'Automotive Functional Safety Consultant' },
  { tip: 'Ask during every technical interview: "What does the debugging workflow look like when production firmware fails in the field?" The answer reveals company engineering culture.', attr: 'Career Coach' },
  { tip: 'Stack Overflow is for learning. Datasheets and reference manuals are for production. Know which one to reach for.', attr: 'Renesas Principal Engineer' },
  { tip: 'A bootloader you have written from scratch — with OTA update, CRC verification, and dual-bank fallback — is a capstone that lands interviews at Tesla and Continental.', attr: 'Minux Curriculum Author' },
  { tip: 'Interviewers remember engineers who say "I verified it with a logic analyzer" not "I assumed it was working." Measurement is a career differentiator.', attr: 'TI Hiring Manager' },
  { tip: 'The embedded systems field has a 14% YoY talent shortage (2025 Embedded Computing Design Survey). You are entering a high-demand market. Command your value accordingly.', attr: 'Market Intelligence, Minux' },
];

/* ══════════════════════════════════════
   JOB READINESS SCORE CALCULATION
   ══════════════════════════════════════ */
function calculateReadinessScore(state) {
  const totalLessons = getTotalLessons();
  const passed       = state.passedLessons.length;
  const phasesComplete = state.completedPhases.length;
  const assisted     = state.assistedLessons ? state.assistedLessons.length : 0;

  // Base: lesson completion (60% of score)
  const lessonScore = (passed / totalLessons) * 60;

  // Phase completions (20% of score)
  const phaseScore = (phasesComplete / 5) * 20;

  // Quality bonus: fewer assisted answers = higher quality (10%)
  const qualityScore = passed > 0
    ? Math.max(0, ((passed - assisted) / passed)) * 10
    : 0;

  // Attempt efficiency (10% of score — fewer attempts = better)
  const totalAttempts = Object.values(state.kcAttempts || {}).reduce((a, b) => a + b, 0);
  const efficiencyScore = passed > 0
    ? Math.max(0, 10 - (totalAttempts / Math.max(passed, 1) - 1) * 5)
    : 0;

  return Math.min(100, Math.round(lessonScore + phaseScore + qualityScore + efficiencyScore));
}

/* ══════════════════════════════════════
   RENDER CAREER PANEL
   ══════════════════════════════════════ */
function renderCareerPanel() {
  const state = getState();
  const score = calculateReadinessScore(state);
  const phase = state.currentPhase;
  const salary = SALARY_BANDS[phase] || SALARY_BANDS[1];

  // 1. Readiness ring
  updateReadinessRing(score);

  // 2. Salary
  const salaryRangeEl = document.getElementById('cp-salary-range');
  const salaryLevelEl = document.getElementById('cp-salary-level');
  const salaryDescEl  = document.getElementById('cp-salary-desc');
  if (salaryRangeEl) salaryRangeEl.textContent = salary.inr;
  if (salaryLevelEl) salaryLevelEl.textContent  = salary.level;
  if (salaryDescEl)  salaryDescEl.textContent   = salary.desc;

  // 3. Companies
  renderCompanyGrid(state);

  // 4. Readiness checklist
  renderReadinessChecklist(state);

  // 5. Daily tip (seeded by day of year)
  renderDailyTip();
}

function updateReadinessRing(score) {
  const ring = document.getElementById('readiness-ring-fill');
  const scoreEl = document.getElementById('readiness-score-value');
  if (!ring || !scoreEl) return;

  const circumference = 2 * Math.PI * 54; // r=54
  const offset = circumference - (score / 100) * circumference;

  ring.style.strokeDasharray  = circumference;
  ring.style.strokeDashoffset = offset;

  scoreEl.textContent = score;

  // Color based on score
  const color = score < 30 ? '#FF4D6D' : score < 60 ? '#FFB800' : score < 85 ? '#00D4FF' : '#00E87A';
  ring.style.stroke = color;
  ring.style.filter = `drop-shadow(0 0 6px ${color}88)`;

  // Sub text
  const subEl = document.getElementById('readiness-ring-sub');
  if (subEl) {
    subEl.textContent = score < 30 ? 'Keep grinding. Phase 1 is the foundation.'
      : score < 60 ? 'Building momentum. Junior roles now accessible.'
      : score < 85 ? 'Strong profile. Mid-level roles within reach.'
      : 'Elite tier. Senior and principal roles within reach.';
  }
}

function renderCompanyGrid(state) {
  const gridEl = document.getElementById('cp-company-grid');
  if (!gridEl) return;

  const maxPhase = Math.max(...state.unlockedPhases, 1);

  gridEl.innerHTML = COMPANY_TARGETS.map(c => {
    const unlocked = maxPhase >= c.requiresPhase;
    return `<div class="company-card ${unlocked ? 'unlocked' : ''}" data-tooltip="${unlocked ? 'Profile matches role requirements' : `Requires Phase ${c.requiresPhase}`}">
      <div class="company-name">${c.name}</div>
      <div class="company-role">${c.role}</div>
    </div>`;
  }).join('');
}

function renderReadinessChecklist(state) {
  const listEl = document.getElementById('cp-readiness-checklist');
  if (!listEl) return;

  const passed = state.passedLessons || [];

  listEl.innerHTML = READINESS_CHECKLIST.map(item => {
    const done = passed.includes(item.requiresLesson);
    return `<div class="readiness-item ${done ? 'done' : ''}">
      <div class="ri-check">${done ? '✓' : ''}</div>
      <span>${item.label}</span>
    </div>`;
  }).join('');
}

function renderDailyTip() {
  const tipEl    = document.getElementById('cp-daily-tip-text');
  const authorEl = document.getElementById('cp-daily-tip-author');
  if (!tipEl) return;

  // Seed by day of year so tip changes daily
  const now  = new Date();
  const day  = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const tip  = DAILY_TIPS[day % DAILY_TIPS.length];

  tipEl.textContent    = `"${tip.tip}"`;
  if (authorEl) authorEl.textContent = `— ${tip.attr}`;
}

/* ══════════════════════════════════════
   PHASE SALARY TRANSITION ANIMATION
   ══════════════════════════════════════ */
function animateSalaryUnlock(newPhase) {
  const band   = SALARY_BANDS[newPhase];
  if (!band) return;

  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed; top: 80px; right: 20px; z-index: 1000;
    background: linear-gradient(135deg, rgba(255,215,0,0.12), rgba(0,212,255,0.08));
    border: 1px solid rgba(255,215,0,0.3);
    border-radius: 12px; padding: 16px 20px;
    font-family: var(--font-mono); animation: fade-in-up 0.4s ease;
    backdrop-filter: blur(12px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.1);
  `;
  banner.innerHTML = `
    <div style="font-size:10px; color: rgba(255,215,0,0.7); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px;">💰 Salary Band Upgraded</div>
    <div style="font-size:20px; font-weight:800; color: #FFD700; font-family: var(--font-heading);">${band.inr}</div>
    <div style="font-size:11px; color: rgba(255,255,255,0.5); margin-top:4px;">${band.level}</div>
  `;
  document.body.appendChild(banner);
  setTimeout(() => { banner.style.opacity = '0'; banner.style.transform = 'translateX(20px)'; banner.style.transition = '0.4s ease'; }, 3500);
  setTimeout(() => banner.remove(), 4000);
}
