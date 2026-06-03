/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * tutor-persona.js — The Voice of the Tutor
 *
 * All response templates. Every string that comes out of the tutor
 * lives here. The tone: senior engineer, candid, encouraging, zero fluff.
 */

const PERSONA = {

  /* ── Boot / Initiation ── */
  boot_intro: `<strong>ANTIGRAVITY EMBEDDED TUTOR</strong> — Online.<br><br>
Right. No pleasantries. You want to build real embedded systems from the ground up — not cargo-cult code copied from Stack Overflow, not Arduino magic you don't understand.<br><br>
I'm going to take you from <code>V = I × R</code> all the way to writing bare-metal ARM drivers, FreeRTOS tasks, and production-grade firmware architecture.<br><br>
The curriculum has <strong>5 Phases</strong>. Each phase is locked until you prove you've absorbed the previous one. No skipping. No faking it.<br><br>
<strong>First question:</strong> What hardware are you sitting in front of right now?`,

  boot_name_ask: `Before we go anywhere — what should I call you? (First name is fine.)`,

  kit_confirmed: (name, kit) => `${name}. Good. ${PERSONA.kitContext(kit)}<br><br>
Let's start Phase 1. <strong>Ground Control</strong> — basic electricity, GPIO, number systems, C fundamentals.<br><br>
First lesson: <em>What is Voltage?</em>`,

  kitContext: (kit) => {
    const contexts = {
      'arduino': `You have an Arduino. Good starting point. We'll use it to build intuition in Phase 1, then we'll rip the abstraction away in Phase 2 when we go bare-metal.`,
      'stm32':   `You have an STM32. Perfect. That's the target hardware for Phase 2 onwards. Phase 1 will establish the foundations, then we'll hit the reference manual hard.`,
      'rpi':     `You have a Raspberry Pi. Great for Phase 3 (Linux systems programming) and beyond. Phase 1 and 2 will be partially theoretical — get an STM32 or Arduino when you can.`,
      'none':    `No hardware yet. That's fine for Phase 1 — everything will be conceptual and simulated. Get hardware before Phase 2. An Arduino Uno or STM32F4 Discovery is ~$10–$25.`
    };
    return contexts[kit] || `Hardware noted. Let's get to work.`;
  },

  /* ── Lesson Transitions ── */
  lesson_intro: (lesson) => `<strong>${lesson.title}</strong>`,

  lesson_complete: (nextLesson) =>
    `That's the one answer I accept. Next lesson: <strong>${nextLesson.title}</strong>`,

  lesson_complete_final_in_phase: () =>
    `Good. That's the last check in this phase. Stand by — let me verify your full phase score...`,

  /* ── Knowledge Check ── */
  kc_prompt: `<strong>Knowledge Check.</strong> No looking it up. Work through it.`,

  kc_pass: [
    `Correct. That's the only answer I accept. Moving forward.`,
    `Right. No partial credit needed — that's exactly right.`,
    `Good. That's the answer. You clearly understood it, not just memorized it.`,
    `Correct. That's what I want to see — you're thinking about it the right way.`,
  ],

  kc_hint: (hintText) =>
    `Not quite. Here's your nudge:<br><br><em>${hintText}</em><br><br>Try again.`,

  kc_analogy: (analogyText) =>
    `Still off. New mental model:<br><br><div class="analogy-block">${analogyText}</div>One more shot.`,

  kc_explanation: (explanationText) =>
    `Alright. Here's the full breakdown:<br><br>${explanationText}<br><br>
<span style="color:var(--amber)">This one's marked as <strong>Assisted</strong> — revisit it. The concept will come back harder in a later lesson.</span>`,

  kc_fail_hard: `That's wrong and I'm not giving you the answer yet. Go back and re-read the lesson. The information you need is already there.`,

  /* ── Phase Transitions ── */
  phase_unlock: (phaseNum, phaseName, phaseSubtitle) => `
<strong>Phase ${phaseNum} cleared.</strong><br><br>
You've demonstrated enough to move forward. "${phaseName}" is yours.<br><br>
Next up: <strong>Phase ${phaseNum + 1}</strong> — ${phaseSubtitle}.<br><br>
Don't get comfortable. The next phase is harder.`,

  phase_locked_message: (phaseNum) =>
    `Phase ${phaseNum} is locked. Clear all knowledge checks in the current phase first.`,

  graduation: `<strong>All five phases complete.</strong><br><br>
That's the full curriculum. You've gone from Ohm's Law to HAL architecture, from blinking LEDs to FreeRTOS production patterns.<br><br>
What you do next matters more than what you've learned here. Go build something real. Write a driver from scratch. Read a reference manual without help. Submit a PR to an open-source embedded project.<br><br>
The curriculum gave you the map. The territory is what counts.<br><br>
<span style="color:var(--green)">Antigravity Embedded Tutor — Mission complete.</span>`,

  /* ── Free-form Questions ── */
  off_topic: `That's outside the current lesson scope. We finish the current knowledge check first, then you can explore.`,

  already_completed: (lessonTitle) =>
    `You've already passed the knowledge check for "<strong>${lessonTitle}</strong>". 
    Want to revisit the lesson content, or move on?`,

  /* ── Encouragement / Struggle ── */
  struggle_detected: `You've missed this a couple of times. That's not a problem — it means you're hitting a real concept, not a syntax error. Step back and re-read the mental model. What specifically is unclear?`,

  generic_fallback: `I don't have a scripted response for that. Keep your question tied to the current lesson — type something specific about what's confusing you.`,

  /* ── Commands the user can type ── */
  help_text: `
<strong>Available Commands:</strong><br>
<code>next</code> — Continue to the next lesson<br>
<code>retry</code> — Retry the current knowledge check<br>
<code>hint</code> — Request a hint (if available)<br>
<code>explain</code> — Show the full explanation for the current KC<br>
<code>lesson</code> — Re-read the current lesson content<br>
<code>progress</code> — Show your progress across all phases<br>
<code>help</code> — Show this list`,

  progress_report: (state) => {
    const lines = CURRICULUM.map(phase => {
      const phaseLessons = phase.lessons;
      const passed = phaseLessons.filter(l => state.passedLessons.includes(l.id)).length;
      const status = passed === phaseLessons.length ? '✅' :
                     passed > 0 ? '🔄' : (state.unlockedPhases.includes(phase.phaseId) ? '🔓' : '🔒');
      return `${status} <strong>Phase ${phase.phaseId}:</strong> ${phase.phaseName} — ${passed}/${phaseLessons.length} lessons passed`;
    });
    return lines.join('<br>');
  }
};

/* ── Persona Random Pick Utility ── */
function personaRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
