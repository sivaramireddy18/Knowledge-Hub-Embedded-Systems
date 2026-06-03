/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * app.js v2 — Entry Point, Event Wiring, Main Flow Controller
 *            + Career Coach Integration + Interview Command
 */

/* ══════════════════════════════════════
   BOOT SCREEN LOGIC
   ══════════════════════════════════════ */

const BOOT_LINES = [
  { text: '▶  ANTIGRAVITY Curriculum Engine v2.0 — ARM Cortex-M4 Pedagogy Core', cls: 'info', delay: 200 },
  { text: '[  OK  ] Loading curriculum graph ... 5 phases / 32 lesson nodes',       cls: 'ok',   delay: 500 },
  { text: '[  OK  ] Initializing knowledge-check grader (numeric, MC, keyword)',     cls: 'ok',   delay: 800 },
  { text: '[  OK  ] Mounting phase-gate state machine with localStorage persistence',cls: 'ok',   delay: 1100 },
  { text: '[  OK  ] Career Coach panel — salary bands, company targets loaded',      cls: 'ok',   delay: 1400 },
  { text: '[  OK  ] Interview prep module — 12 MNC questions across 5 phases',       cls: 'ok',   delay: 1700 },
  { text: '[ WARN ] No student profile detected. Awaiting initiation command.',      cls: 'warn', delay: 2000 },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',   cls: 'dim',  delay: 2300 },
  { text: 'Type the command to begin.',                                               cls: '',     delay: 2500 },
];

let bootAnimationDone = false;

function runBootAnimation() {
  const body = document.getElementById('boot-terminal-body');
  if (!body) return;

  BOOT_LINES.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'boot-line';
      if      (cls === 'ok')   line.innerHTML = `<span class="ok">${text}</span>`;
      else if (cls === 'warn') line.innerHTML = `<span class="warn">${text}</span>`;
      else if (cls === 'dim')  line.innerHTML = `<span class="dim">${text}</span>`;
      else if (cls === 'info') line.innerHTML = `<span class="info">${text}</span>`;
      else                     line.innerHTML = text;
      const inputRow = body.querySelector('.boot-input-row');
      body.insertBefore(line, inputRow);
    }, delay);
  });

  setTimeout(() => {
    bootAnimationDone = true;
    const input = document.getElementById('boot-input');
    if (input) input.focus();
  }, 2700);
}

function handleBootInput(e) {
  if (e.key !== 'Enter') return;
  const input = document.getElementById('boot-input');
  const val   = input.value.trim().toUpperCase();
  const errEl = document.getElementById('boot-error');

  if (val === 'INITIATE ANTIGRAVITY') {
    triggerBootTransition();
  } else {
    if (errEl) {
      errEl.textContent = `Unrecognized: "${input.value.trim()}". Type: INITIATE ANTIGRAVITY`;
      errEl.classList.remove('hidden');
    }
    input.value = '';
    const row = document.getElementById('boot-input-row');
    if (row) { row.style.animation = 'shake 0.4s ease'; setTimeout(() => { row.style.animation = ''; }, 500); }
  }
}

function triggerBootTransition() {
  const bootScreen = document.getElementById('boot-screen');
  if (bootScreen) {
    bootScreen.classList.add('exiting');
    setTimeout(() => {
      bootScreen.classList.add('hidden');
      startTutorApp();
    }, 600);
  }
}

/* ══════════════════════════════════════
   TUTOR APP INITIALIZATION
   ══════════════════════════════════════ */

function startTutorApp() {
  const appEl = document.getElementById('tutor-app');
  if (appEl) appEl.classList.remove('hidden');

  const hasSavedState = loadState();

  if (hasSavedState && isInitialized()) {
    updateSidebar();
    renderCareerPanel();
    resumeSession();
  } else {
    askForStudentName();
  }

  wireInputEvents();
  autoResizeChatInput();
}

/* ── New Student Flow ── */
let awaitingName = false;
let awaitingKit  = false;

function askForStudentName() {
  awaitingName = true;
  addTutorMessage(PERSONA.boot_name_ask, { delay: 300, fast: true });
}

function handleNameInput(name) {
  if (!name || name.trim().length < 1) return;
  awaitingName = false;
  addUserMessage(name);
  engineState.studentName = name.trim();
  setTimeout(() => showKitModal(), 400);
}

function showKitModal() {
  const modal = document.getElementById('kit-modal');
  if (modal) modal.classList.remove('hidden');
}
function hideKitModal() {
  const modal = document.getElementById('kit-modal');
  if (modal) modal.classList.add('hidden');
}

let selectedKit = 'none';

function selectKit(kit) {
  selectedKit = kit;
  document.querySelectorAll('.kit-card').forEach(c => c.classList.toggle('selected', c.dataset.kit === kit));
  const btn = document.getElementById('kit-confirm-btn');
  if (btn) btn.disabled = false;
}

function confirmKitSelection() {
  hideKitModal();
  initStudent(engineState.studentName, selectedKit);
  updateSidebar();
  renderCareerPanel();

  addUserMessage(`Hardware: ${kitLabel(selectedKit)}`);

  setTimeout(async () => {
    await addTutorMessage(PERSONA.kit_confirmed(getStudentName(), selectedKit));
    await deliverLesson('P1-L1');
  }, 400);
}

/* ── Returning Student Flow ── */
async function resumeSession() {
  const name   = getStudentName();
  const lesson = getCurrentLesson();

  await addTutorMessage(
    `Welcome back, <strong>${name}</strong>. Resuming your session.<br><br>
Current lesson: <strong>${lesson ? lesson.title : 'Phase start'}</strong><br>
Your job readiness score: <strong style="color:var(--cyan)">${calculateReadinessScore(getState())}%</strong>`,
    { fast: true }
  );

  if (lesson && !isLessonPassed(lesson.id)) {
    await deliverLesson(lesson.id);
  } else if (lesson) {
    await addTutorMessage(`You have passed this lesson. Type <code>next</code> to continue or <code>interview</code> to practice an MNC question.`);
  }
}

/* ══════════════════════════════════════
   LESSON DELIVERY
   ══════════════════════════════════════ */

async function deliverLesson(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return;

  engineState.currentLessonId = lessonId;
  saveState();
  updateSidebar();
  renderCareerPanel();

  addSystemMessage(`── ${lesson.title} ──`);

  // Main content
  await addTutorMessage(lesson.content, { lessonLabel: lesson.title });

  // Analogy block
  if (lesson.analogy) {
    await addTutorMessage(`<div class="analogy-block">${lesson.analogy}</div>`, { delay: 200 });
  }

  // War story (if available)
  if (lesson.warStory) {
    await addTutorMessage(`<div class="war-story-block">${lesson.warStory}</div>`, { delay: 150 });
  }

  // MISRA rule (if available)
  if (lesson.misraRule) {
    await addTutorMessage(`<div class="misra-block">${lesson.misraRule}</div>`, { delay: 100 });
  }

  // Portfolio action (if available)
  if (lesson.portfolioAction) {
    await addTutorMessage(`<div class="portfolio-block">${lesson.portfolioAction}</div>`, { delay: 100 });
  }

  // KC
  await addTutorMessage(PERSONA.kc_prompt, { delay: 300 });
  addKCCard(lesson);
}

/* ══════════════════════════════════════
   KC SUBMISSION
   ══════════════════════════════════════ */

async function submitKC(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return;

  const kc      = lesson.knowledgeCheck;
  const answer  = getAnswerFromCard(lessonId, kc.type);
  if (answer === null || answer === '') return;

  const attempts = incrementKCAttempt(lessonId);
  const { result, feedback } = gradeAnswer(kc, answer, attempts);

  showKCFeedback(lessonId, result, feedback);

  const isPass    = result === 'pass';
  const isExplain = result === 'explain';

  if (isPass || isExplain) {
    lockKCCard(lessonId);
    const wasAssisted = isExplain;

    setTimeout(async () => {
      const progression = recordKCPass(lessonId, wasAssisted);
      updateSidebar();
      renderCareerPanel(); // update career panel after every KC pass

      if (progression.type === 'graduation') {
        await addTutorMessage(PERSONA.graduation);
        showGraduationCelebration();

      } else if (progression.type === 'phase_complete') {
        await addTutorMessage(PERSONA.lesson_complete_final_in_phase());
        // Animate salary unlock
        animateSalaryUnlock(progression.nextPhaseId);
        showPhaseUnlockCelebration(progression.completedPhaseId, progression.nextPhase);

        setTimeout(async () => {
          await addTutorMessage(
            PERSONA.phase_unlock(
              progression.completedPhaseId,
              progression.nextPhase.phaseName,
              progression.nextPhase.phaseSubtitle
            )
          );
          await deliverLesson(progression.nextPhase.lessons[0].id);
        }, 5000);

      } else if (progression.type === 'next_lesson') {
        const nextLesson = getLessonById(progression.lessonId);
        if (!isExplain) {
          await addTutorMessage(PERSONA.lesson_complete(nextLesson || { title: 'next' }));
        } else {
          await addTutorMessage(`Moving on — mark that one for review. Next: <strong>${nextLesson ? nextLesson.title : ''}</strong>`);
        }
        if (nextLesson) await deliverLesson(progression.lessonId);
      }
    }, isExplain ? 2000 : 800);
  }
}

/* ══════════════════════════════════════
   CHAT INPUT & COMMAND ROUTING
   ══════════════════════════════════════ */

function wireInputEvents() {
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
    });
  }
  if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || isTyping) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';

  if (awaitingName) { handleNameInput(text); return; }

  addUserMessage(text);

  const cmd = parseCommand(text);
  if (cmd) { await handleCommand(cmd); return; }

  await handleFreeInput(text);
}

/* ── Extended Command Handler ── */
async function handleCommand({ command }) {
  const lesson = getCurrentLesson();

  switch (command) {
    case 'help':
      await addTutorMessage(`
<strong>Commands:</strong><br>
<code>next</code> — Next lesson<br>
<code>lesson</code> — Re-read current lesson<br>
<code>hint</code> — Get a hint on current KC<br>
<code>explain</code> — Full explanation (marks as Assisted)<br>
<code>retry</code> — Retry knowledge check<br>
<code>interview</code> — Get an MNC interview question<br>
<code>progress</code> — Your progress summary<br>
<code>reset</code> — Reset all progress<br>
<code>help</code> — This list`, { fast: true });
      break;

    case 'progress':
      await addTutorMessage(PERSONA.progress_report(getState()), { fast: true });
      break;

    case 'interview':
      await showInterviewQuestion(getCurrentPhase());
      break;

    case 'next':
      if (lesson && isLessonPassed(lesson.id)) {
        const phase = getPhaseById(getCurrentPhase());
        const next  = phase.lessons.find(l => !isLessonPassed(l.id));
        if (next) { await deliverLesson(next.id); }
        else { await addTutorMessage(`All lessons in Phase ${getCurrentPhase()} complete. Phase gate should have unlocked.`); }
      } else {
        await addTutorMessage(`Complete the current knowledge check first.`);
      }
      break;

    case 'lesson':
      if (lesson) {
        await addTutorMessage(lesson.content, { lessonLabel: lesson.title });
        if (lesson.analogy) await addTutorMessage(`<div class="analogy-block">${lesson.analogy}</div>`);
      }
      break;

    case 'hint':
      if (lesson && !isLessonPassed(lesson.id)) {
        await addTutorMessage(PERSONA.kc_hint(lesson.knowledgeCheck.hint1));
      } else {
        await addTutorMessage(`No active knowledge check.`);
      }
      break;

    case 'explain':
      if (lesson && !isLessonPassed(lesson.id)) {
        await addTutorMessage(PERSONA.kc_explanation(lesson.knowledgeCheck.explanation));
      } else {
        await addTutorMessage(`No active knowledge check.`);
      }
      break;

    case 'retry':
      if (lesson && !isLessonPassed(lesson.id)) {
        addKCCard(lesson);
      } else {
        await addTutorMessage(`No active knowledge check to retry.`);
      }
      break;

    case 'reset':
      if (confirm('Reset all progress? This cannot be undone.')) {
        resetState();
        location.reload();
      }
      break;

    default:
      await addTutorMessage(PERSONA.generic_fallback);
  }
}

/* ── Free-form Input ── */
async function handleFreeInput(text) {
  const lower = text.toLowerCase();
  if (lower === 'hi' || lower === 'hello' || lower.startsWith('hey')) {
    await addTutorMessage(`No pleasantries. Answer the current KC or type <code>help</code>.`);
  } else if (lower.includes('interview') || lower.includes('question') || lower.includes('practice')) {
    await showInterviewQuestion(getCurrentPhase());
  } else if (lower.includes('salary') || lower.includes('pay') || lower.includes('money')) {
    const band = SALARY_BANDS[getCurrentPhase()] || SALARY_BANDS[1];
    await addTutorMessage(`At your current phase level (Phase ${getCurrentPhase()}): <strong style="color:var(--gold)">${band.inr}</strong> INR / <strong style="color:var(--gold)">${band.usd}</strong> USD. Level: <em>${band.level}</em>.<br><br>Complete more phases to move up the band.`);
  } else if (lower.includes('freertos') && getCurrentPhase() < 4) {
    await addTutorMessage(`FreeRTOS is Phase 4 content. You are in Phase ${getCurrentPhase()}. Build the foundation first — no skipping.`);
  } else if (lower.includes('linux') && getCurrentPhase() < 3) {
    await addTutorMessage(`Linux systems programming is Phase 3 onwards. Complete Phase ${getCurrentPhase()} first.`);
  } else if (lower.includes('what is') || lower.includes('explain') || lower.includes('how does')) {
    await addTutorMessage(`The answer to your question is in the current lesson. Type <code>lesson</code> to re-read it. If it is not there, ask more specifically and I will point you to the right phase.`);
  } else {
    await addTutorMessage(PERSONA.generic_fallback);
  }
}

/* ══════════════════════════════════════
   SIDEBAR + CAREER PANEL
   ══════════════════════════════════════ */

function clickPhaseNav(phaseId) {
  if (!isPhaseUnlocked(phaseId)) {
    addTutorMessage(PERSONA.phase_locked_message(phaseId), { fast: true });
    return;
  }
  if (navigateToPhase(phaseId)) {
    updateSidebar();
    renderCareerPanel();
    const lesson = getCurrentLesson();
    if (lesson) {
      addSystemMessage(`── Navigated to Phase ${phaseId} ──`);
      deliverLesson(lesson.id);
    }
  }
}

function openWeekPlan() {
  const path = getWeekPlanPath();
  window.open('file://' + path, '_blank');
}

/* ══════════════════════════════════════
   CELEBRATIONS
   ══════════════════════════════════════ */

function showPhaseUnlockCelebration(completedPhaseId, nextPhase) {
  const banner = document.getElementById('phase-unlock-banner');
  if (!banner) return;

  const emojis = { 1: '🌍', 2: '⚙️', 3: '📡', 4: '🎼', 5: '🏗️', 6: '🏭' };
  const emojiEl = document.getElementById('unlock-phase-emoji');
  const nameEl  = document.getElementById('unlock-phase-name');
  const subEl   = document.getElementById('unlock-phase-sub');

  if (emojiEl) emojiEl.textContent  = emojis[nextPhase.phaseId] || '🏆';
  if (nameEl)  nameEl.textContent   = nextPhase.phaseName;
  if (subEl)   subEl.textContent    = nextPhase.phaseSubtitle;

  banner.classList.remove('hidden');
  spawnParticles();

  setTimeout(() => banner.classList.add('hidden'), 6000);
}

function showGraduationCelebration() {
  const banner = document.getElementById('phase-unlock-banner');
  if (!banner) return;
  document.getElementById('unlock-phase-emoji').textContent = '🎓';
  document.getElementById('unlock-phase-name').textContent  = 'Curriculum Complete';
  document.getElementById('unlock-phase-sub').textContent   = 'All 5 phases passed. You earned it.';
  banner.classList.remove('hidden');
  spawnParticles(); spawnParticles();
  setTimeout(() => banner.classList.add('hidden'), 8000);
}

/* ══════════════════════════════════════
   DOM READY
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const bootInput = document.getElementById('boot-input');
  if (bootInput) bootInput.addEventListener('keydown', handleBootInput);
  runBootAnimation();

  const banner = document.getElementById('phase-unlock-banner');
  if (banner) banner.addEventListener('click', () => banner.classList.add('hidden'));
});
