/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * tutor-chat.js — Chat UI, Typewriter Animation, Message Rendering
 */

const TYPEWRITER_SPEED_MS = 12; // ms per character
const TYPING_INDICATOR_DELAY = 400; // ms before tutor starts "typing"

let isTyping = false;

/* ══════════════════════════════════════
   CORE RENDER FUNCTIONS
   ══════════════════════════════════════ */

/**
 * Add a tutor message with typewriter effect.
 */
function addTutorMessage(htmlContent, { lessonLabel = '', delay = TYPING_INDICATOR_DELAY, fast = false } = {}) {
  return new Promise(resolve => {
    const container = document.getElementById('messages-container');
    if (!container) { resolve(); return; }

    // Show typing indicator
    const typingRow = createTypingIndicator();
    container.appendChild(typingRow);
    scrollToBottom();

    isTyping = true;

    setTimeout(() => {
      container.removeChild(typingRow);

      if (lessonLabel) {
        const label = document.createElement('div');
        label.className = 'msg-lesson-label';
        label.textContent = lessonLabel;
        container.appendChild(label);
      }

      const row = document.createElement('div');
      row.className = 'msg-row tutor';
      row.innerHTML = `
        <div class="msg-avatar">AG</div>
        <div class="msg-bubble" id="bubble-${Date.now()}"></div>
      `;
      container.appendChild(row);
      scrollToBottom();

      const bubble = row.querySelector('.msg-bubble');
      if (fast) {
        bubble.innerHTML = htmlContent;
        isTyping = false;
        scrollToBottom();
        resolve();
      } else {
        typewriterEffect(bubble, htmlContent, () => {
          isTyping = false;
          scrollToBottom();
          resolve();
        });
      }
    }, delay);
  });
}

/**
 * Add a user message (instant, right-aligned).
 */
function addUserMessage(text) {
  const container = document.getElementById('messages-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'msg-row user';
  row.innerHTML = `
    <div class="msg-avatar">YOU</div>
    <div class="msg-bubble">${escapeHTML(text)}</div>
  `;
  container.appendChild(row);
  scrollToBottom();
}

/**
 * Add a system divider message.
 */
function addSystemMessage(text) {
  const container = document.getElementById('messages-container');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'msg-system';
  div.textContent = text;
  container.appendChild(div);
  scrollToBottom();
}

/**
 * Inject a knowledge check card into the chat stream.
 */
function addKCCard(lesson) {
  const container = document.getElementById('messages-container');
  if (!container) return;

  // Typing delay before KC appears
  const typingRow = createTypingIndicator();
  container.appendChild(typingRow);
  scrollToBottom();

  setTimeout(() => {
    container.removeChild(typingRow);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildKCCard(lesson, getKCAttempts(lesson.id));
    container.appendChild(wrapper.firstElementChild);
    scrollToBottom();

    // Focus the input
    const input = document.getElementById(`kc-${lesson.id}-input`);
    if (input) input.focus();
  }, TYPING_INDICATOR_DELAY + 200);
}

/**
 * Inject an analogy block after lesson content.
 */
function addAnalogyBlock(analogyText) {
  const container = document.getElementById('messages-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'msg-row tutor';
  row.innerHTML = `
    <div class="msg-avatar">AG</div>
    <div class="msg-bubble">
      <div class="analogy-block">${analogyText}</div>
    </div>
  `;
  container.appendChild(row);
  scrollToBottom();
}

/* ══════════════════════════════════════
   TYPEWRITER EFFECT
   ══════════════════════════════════════ */

/**
 * Types out HTML content char-by-char into a target element.
 * Handles HTML tags intelligently (doesn't break them mid-tag).
 */
function typewriterEffect(element, html, onComplete) {
  // Parse into a temp div to get clean text nodes vs HTML tags
  const temp = document.createElement('div');
  temp.innerHTML = html;

  element.innerHTML = '';
  let totalDelay = 0;

  function processNode(node, parent) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const span = document.createElement('span');
      parent.appendChild(span);

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const delay = totalDelay + i * TYPEWRITER_SPEED_MS;
        setTimeout(() => {
          span.textContent += char;
          scrollToBottom();
        }, delay);
      }
      totalDelay += text.length * TYPEWRITER_SPEED_MS;

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false); // shallow clone
      parent.appendChild(clone);
      node.childNodes.forEach(child => processNode(child, clone));
    }
  }

  temp.childNodes.forEach(child => processNode(child, element));

  // Trigger completion after all typing is done
  // Add a tiny buffer for the last character to render
  const finalDelay = totalDelay + 100;
  setTimeout(() => {
    if (onComplete) onComplete();
  }, finalDelay);
}

/* ══════════════════════════════════════
   SIDEBAR UPDATES
   ══════════════════════════════════════ */

function updateSidebar() {
  const state = getState();

  // Student info
  const nameEl     = document.getElementById('student-name-display');
  const sidebarName= document.getElementById('sidebar-student-name');
  const avatarEl   = document.getElementById('student-avatar');
  const kitEl      = document.getElementById('student-kit-tag');
  const phaseBadge = document.getElementById('student-phase-badge');

  if (nameEl)      nameEl.textContent      = state.studentName || 'Student';
  if (sidebarName) sidebarName.textContent = state.studentName || 'Student';
  if (avatarEl)    avatarEl.textContent    = (state.studentName || 'S')[0].toUpperCase();
  if (kitEl)       kitEl.innerHTML         = `🔧 ${kitLabel(state.hardwareKit)}`;
  if (phaseBadge)  phaseBadge.innerHTML    = `<span>Phase ${state.currentPhase}</span>`;

  // Overall progress bar (all 32 lessons)
  const overall = getOverallProgress();
  const fillEl  = document.getElementById('phase-progress-fill');
  const countEl = document.getElementById('phase-progress-count');
  if (fillEl)  fillEl.style.width  = overall.pct + '%';
  if (countEl) countEl.textContent = `${overall.passed} / ${overall.total}`;

  // Phase nav items
  const navData = getPhaseNavData();
  navData.forEach(p => {
    const item = document.getElementById(`phase-nav-${p.phaseId}`);
    if (!item) return;

    item.className = 'phase-nav-item';
    if (!p.isUnlocked) item.classList.add('locked');
    if (p.isActive)    item.classList.add('active');
    if (p.isComplete)  item.classList.add('completed');

    const numEl  = item.querySelector('.phase-nav-num');
    const lockEl = document.getElementById(`pnav-lock-${p.phaseId}`);
    const subEl  = document.getElementById(`pnav-sub-${p.phaseId}`);

    if (numEl)  numEl.textContent = p.isComplete ? '✓' : p.phaseId;
    if (lockEl) lockEl.textContent = p.isUnlocked ? '' : '🔒';
    if (subEl)  subEl.textContent = `${p.lessonsPassed}/${p.lessonsTotal} lessons`;
  });
}

function kitLabel(kit) {
  const labels = {
    arduino: 'Arduino Uno',
    stm32:   'STM32F407',
    rpi:     'Raspberry Pi 4',
    none:    'No Hardware'
  };
  return labels[kit] || 'No Hardware';
}

/* ══════════════════════════════════════
   PHASE UNLOCK CELEBRATION
   ══════════════════════════════════════ */

function showPhaseUnlockCelebration(completedPhaseId, nextPhase) {
  const banner = document.getElementById('phase-unlock-banner');
  if (!banner) return;

  document.getElementById('unlock-phase-number').textContent = nextPhase.phaseId;
  document.getElementById('unlock-phase-name').textContent   = nextPhase.phaseName;
  document.getElementById('unlock-phase-sub').textContent    = nextPhase.phaseSubtitle;

  banner.classList.remove('hidden');
  spawnParticles();

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    banner.classList.add('hidden');
  }, 4500);
}

function showGraduationCelebration() {
  const banner = document.getElementById('phase-unlock-banner');
  if (!banner) return;

  document.getElementById('unlock-phase-number').textContent = '🎓';
  document.getElementById('unlock-phase-name').textContent   = 'Curriculum Complete';
  document.getElementById('unlock-phase-sub').textContent    = 'All 5 phases passed.';

  banner.classList.remove('hidden');
  spawnParticles();

  setTimeout(() => banner.classList.add('hidden'), 6000);
}

/* ══════════════════════════════════════
   PARTICLE BURST
   ══════════════════════════════════════ */

function spawnParticles() {
  const colors = ['#00D4FF', '#00FF88', '#FFB800', '#BD93F9', '#FF6B6B'];
  const count  = 60;
  const cx     = window.innerWidth / 2;
  const cy     = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = Math.random() * 8 + 4;
    const angle = Math.random() * 2 * Math.PI;
    const dist  = Math.random() * 300 + 80;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 300;

    p.style.cssText = `
      left: ${cx}px;
      top: ${cy}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      transform: translate(${tx}px, ${ty}px);
      animation-delay: ${delay}ms;
      animation-duration: ${1000 + Math.random() * 600}ms;
    `;

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

/* ══════════════════════════════════════
   UTILITY
   ══════════════════════════════════════ */

function createTypingIndicator() {
  const row = document.createElement('div');
  row.className = 'msg-row tutor';
  row.innerHTML = `
    <div class="msg-avatar">AG</div>
    <div class="msg-bubble typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  return row;
}

function scrollToBottom() {
  const container = document.getElementById('messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setChatInputEnabled(enabled) {
  const input = document.getElementById('chat-input');
  const btn   = document.getElementById('chat-send-btn');
  if (input) input.disabled = !enabled;
  if (btn)   btn.disabled   = !enabled;
}

/**
 * Auto-resize textarea as user types.
 */
function autoResizeChatInput() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
}
