/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * tutor-engine.js — Curriculum State Machine
 *
 * Manages: current lesson, phase gating, KC attempts, progress, localStorage.
 */

const STORAGE_KEY = 'antigravity_tutor_state_v2';

/* ── Default State ── */
const DEFAULT_STATE = {
  studentName:      '',
  hardwareKit:      '',       // 'arduino' | 'stm32' | 'rpi' | 'none'
  currentPhase:     1,
  currentLessonId:  'P1-L1',
  passedLessons:    [],        // array of lesson IDs
  assistedLessons:  [],        // lessons that needed full explanation
  kcAttempts:       {},        // { lessonId: attemptCount }
  unlockedPhases:   [1],       // phases the student can access
  completedPhases:  [],        // fully completed phases
  initialized:      false,
  startedAt:        null,
  lastActiveAt:     null,
};

/* ── Engine State ── */
let engineState = { ...DEFAULT_STATE };

/* ══════════════════════════════════════
   STATE PERSISTENCE
   ══════════════════════════════════════ */
function saveState() {
  engineState.lastActiveAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(engineState));
  } catch(e) {
    console.warn('Could not save state to localStorage:', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      engineState = { ...DEFAULT_STATE, ...saved };
      return true;
    }
  } catch(e) {
    console.warn('Could not load state from localStorage:', e);
  }
  return false;
}

function resetState() {
  engineState = { ...DEFAULT_STATE };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch(e) {}
}

/* ══════════════════════════════════════
   STATE ACCESSORS
   ══════════════════════════════════════ */
function getState()          { return engineState; }
function getStudentName()    { return engineState.studentName; }
function getHardwareKit()    { return engineState.hardwareKit; }
function getCurrentPhase()   { return engineState.currentPhase; }
function getCurrentLesson()  { return getLessonById(engineState.currentLessonId); }
function isInitialized()     { return engineState.initialized; }

function isLessonPassed(lessonId) {
  return engineState.passedLessons.includes(lessonId);
}

function isPhaseUnlocked(phaseId) {
  return engineState.unlockedPhases.includes(phaseId);
}

function isPhaseCompleted(phaseId) {
  return engineState.completedPhases.includes(phaseId);
}

function getKCAttempts(lessonId) {
  return engineState.kcAttempts[lessonId] || 0;
}

/* ══════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════ */
function initStudent(name, kit) {
  engineState.studentName  = name.trim();
  engineState.hardwareKit  = kit;
  engineState.initialized  = true;
  engineState.startedAt    = new Date().toISOString();
  engineState.currentPhase    = 1;
  engineState.currentLessonId = 'P1-L1';
  engineState.unlockedPhases  = [1];
  saveState();
}

/* ══════════════════════════════════════
   LESSON PROGRESSION
   ══════════════════════════════════════ */

/**
 * Record a passed KC and advance to the next lesson.
 * Returns: { type: 'next_lesson'|'phase_complete'|'graduation', data }
 */
function recordKCPass(lessonId, wasAssisted = false) {
  if (!engineState.passedLessons.includes(lessonId)) {
    engineState.passedLessons.push(lessonId);
  }
  if (wasAssisted && !engineState.assistedLessons.includes(lessonId)) {
    engineState.assistedLessons.push(lessonId);
  }

  const lesson  = getLessonById(lessonId);
  const phase   = getPhaseById(engineState.currentPhase);

  // Check if all lessons in current phase are now passed
  const allPhasePassed = phase.lessons.every(l =>
    engineState.passedLessons.includes(l.id)
  );

  if (allPhasePassed) {
    return handlePhaseComplete(phase);
  }

  // Move to next lesson in sequence
  if (lesson.unlocks) {
    engineState.currentLessonId = lesson.unlocks;
    saveState();
    return { type: 'next_lesson', lessonId: lesson.unlocks };
  }

  // Fallback: find next unpassed lesson in phase
  const nextLesson = phase.lessons.find(l =>
    !engineState.passedLessons.includes(l.id)
  );
  if (nextLesson) {
    engineState.currentLessonId = nextLesson.id;
    saveState();
    return { type: 'next_lesson', lessonId: nextLesson.id };
  }

  return { type: 'stay', lessonId };
}

function handlePhaseComplete(phase) {
  const phaseId = phase.phaseId;

  if (!engineState.completedPhases.includes(phaseId)) {
    engineState.completedPhases.push(phaseId);
  }

  // Is there a next phase?
  const nextPhaseId = phaseId + 1;
  const nextPhase   = getPhaseById(nextPhaseId);

  if (!nextPhase) {
    // All 5 phases done
    saveState();
    return { type: 'graduation' };
  }

  // Unlock next phase
  if (!engineState.unlockedPhases.includes(nextPhaseId)) {
    engineState.unlockedPhases.push(nextPhaseId);
  }

  engineState.currentPhase    = nextPhaseId;
  engineState.currentLessonId = nextPhase.lessons[0].id;
  saveState();

  return {
    type: 'phase_complete',
    completedPhaseId: phaseId,
    nextPhaseId: nextPhaseId,
    nextPhase: nextPhase
  };
}

/**
 * Increment KC attempt counter.
 */
function incrementKCAttempt(lessonId) {
  engineState.kcAttempts[lessonId] = getKCAttempts(lessonId) + 1;
  saveState();
  return engineState.kcAttempts[lessonId];
}

/**
 * Navigate to a specific lesson (if unlocked).
 */
function navigateToLesson(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;

  const phase = getPhaseById(parseInt(lessonId.split('-')[0].replace('P', '')));
  if (!isPhaseUnlocked(phase.phaseId)) return false;

  engineState.currentLessonId = lessonId;
  engineState.currentPhase    = phase.phaseId;
  saveState();
  return true;
}

/**
 * Navigate to a phase (if unlocked).
 */
function navigateToPhase(phaseId) {
  if (!isPhaseUnlocked(phaseId)) return false;
  const phase = getPhaseById(phaseId);
  if (!phase) return false;

  // Find first non-passed lesson in phase, or first lesson
  const firstUnpassed = phase.lessons.find(l => !isLessonPassed(l.id));
  engineState.currentLessonId = firstUnpassed ? firstUnpassed.id : phase.lessons[0].id;
  engineState.currentPhase    = phaseId;
  saveState();
  return true;
}

/* ══════════════════════════════════════
   PROGRESS HELPERS
   ══════════════════════════════════════ */

/**
 * Return progress stats for the current phase.
 */
function getCurrentPhaseProgress() {
  const phase = getPhaseById(engineState.currentPhase);
  const total  = phase.lessons.length;
  const passed = phase.lessons.filter(l => isLessonPassed(l.id)).length;
  return { passed, total, pct: Math.round((passed / total) * 100) };
}

/**
 * Return overall curriculum progress.
 */
function getOverallProgress() {
  const total  = getTotalLessons();
  const passed = engineState.passedLessons.length;
  return { passed, total, pct: Math.round((passed / total) * 100) };
}

/**
 * Phase nav items data for rendering the sidebar.
 */
function getPhaseNavData() {
  return CURRICULUM.map(phase => ({
    phaseId:    phase.phaseId,
    name:       phase.phaseName,
    subtitle:   phase.phaseSubtitle,
    icon:       phase.phaseIcon,
    isUnlocked: isPhaseUnlocked(phase.phaseId),
    isComplete: isPhaseCompleted(phase.phaseId),
    isActive:   phase.phaseId === engineState.currentPhase,
    lessonsTotal:  phase.lessons.length,
    lessonsPassed: phase.lessons.filter(l => isLessonPassed(l.id)).length,
  }));
}

/**
 * Return the week plan file path for the current phase/lesson.
 * Maps to Project1/plans/ week numbers.
 */
function getWeekPlanPath() {
  const phaseToWeeks = {
    1: [1, 2, 3, 4, 5, 6],
    2: [7, 8, 9, 10, 11, 12],
    3: [13, 14, 15, 16, 17, 18],
    4: [19, 20, 21, 22, 23, 24],
    5: [25, 26, 27, 28, 29, 30],
    6: [31, 32, 33, 34, 35, 36]
  };
  const weeks = phaseToWeeks[engineState.currentPhase] || [1];
  const week  = weeks[0]; // First week of the phase
  const padded = String(week).padStart(2, '0');
  return `/home/siva/sivaramireddy/Project1/plans/week-${padded}-execution-plan.md`;
}

/**
 * Parse a user command string.
 * Returns { command, args } or null if not a command.
 */
function parseCommand(input) {
  const text = input.trim().toLowerCase();
  const commands = ['next', 'retry', 'hint', 'explain', 'lesson', 'progress', 'help', 'reset'];
  for (const cmd of commands) {
    if (text === cmd || text.startsWith(cmd + ' ')) {
      return { command: cmd, args: text.slice(cmd.length).trim() };
    }
  }
  return null;
}
