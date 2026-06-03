/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * knowledge-check.js — Answer Grading Logic
 *
 * Types: 'numeric', 'multiple-choice', 'conceptual', 'code'
 * Returns: { result: 'pass'|'hint1'|'hint2'|'explain', feedback: string }
 */

/**
 * Main grader entry point.
 * @param {Object} kc       - knowledgeCheck object from curriculum-data
 * @param {*}      answer   - Student's answer (string for text, number for numeric, number for MC index)
 * @param {number} attempts - How many times they've tried (1-indexed, this call is attempt #N)
 * @returns {{ result: string, feedback: string }}
 */
function gradeAnswer(kc, answer, attempts) {
  const isCorrect = checkCorrect(kc, answer);

  if (isCorrect) {
    return { result: 'pass', feedback: personaRandom(PERSONA.kc_pass) };
  }

  // Wrong answer — determine feedback level based on attempts
  if (attempts === 1) {
    // First failure — just say wrong, no hints yet
    return {
      result: 'fail',
      feedback: PERSONA.kc_fail_hard
    };
  }

  if (attempts === 2) {
    // Second failure — deliver Hint 1
    return {
      result: 'hint1',
      feedback: PERSONA.kc_hint(kc.hint1)
    };
  }

  if (attempts === 3) {
    // Third failure — deliver Hint 2 + alternate analogy
    return {
      result: 'hint2',
      feedback: PERSONA.kc_analogy(kc.analogyOnFail)
    };
  }

  if (attempts === 4) {
    // Fourth failure — another nudge with hint 2
    return {
      result: 'hint2',
      feedback: PERSONA.kc_hint(kc.hint2)
    };
  }

  // 5th+ failure — show full explanation, mark as assisted
  return {
    result: 'explain',
    feedback: PERSONA.kc_explanation(kc.explanation)
  };
}

/**
 * Core correctness check dispatcher.
 */
function checkCorrect(kc, answer) {
  switch (kc.type) {
    case 'numeric':
      return checkNumeric(kc, answer);
    case 'multiple-choice':
      return checkMultipleChoice(kc, answer);
    case 'conceptual':
      return checkConceptual(kc, answer);
    case 'code':
      return checkCode(kc, answer);
    default:
      return false;
  }
}

/**
 * Numeric: parse student's input, check within tolerance.
 */
function checkNumeric(kc, answer) {
  const parsed = parseFloat(String(answer).replace(/[^\d.\-]/g, ''));
  if (isNaN(parsed)) return false;
  return Math.abs(parsed - kc.answer) <= kc.tolerance;
}

/**
 * Multiple-choice: compare selected index against correct index.
 */
function checkMultipleChoice(kc, answer) {
  return parseInt(answer) === kc.correctIndex;
}

/**
 * Conceptual: check that all required keywords appear in the answer.
 * Case-insensitive. Also accepts partial word matches.
 */
function checkConceptual(kc, answer) {
  if (!answer || String(answer).trim().length < 8) return false;
  const normalized = String(answer).toLowerCase();
  const required = kc.requiredKeywords || [];

  return required.every(keyword => {
    const kw = keyword.toLowerCase();
    // Check for word or substring
    return normalized.includes(kw);
  });
}

/**
 * Code: check for required patterns/keywords in submitted code.
 */
function checkCode(kc, answer) {
  const code = String(answer).toLowerCase();
  const patterns = kc.requiredPatterns || [];
  return patterns.every(p => code.includes(p.toLowerCase()));
}

/**
 * Build the knowledge check UI card HTML.
 */
function buildKCCard(lesson, attemptCount) {
  const kc = lesson.knowledgeCheck;
  const cardId = `kc-${lesson.id}`;

  let inputHTML = '';

  if (kc.type === 'multiple-choice') {
    inputHTML = `<div class="kc-options" id="${cardId}-options">
      ${kc.options.map((opt, i) => `
        <label class="kc-option" id="${cardId}-opt-${i}">
          <input type="radio" name="${cardId}-radio" value="${i}" 
                 onchange="selectMCOption('${cardId}', ${i})">
          <span>${opt}</span>
        </label>
      `).join('')}
    </div>
    <button class="kc-submit" id="${cardId}-submit" onclick="submitKC('${lesson.id}')" disabled>
      Submit Answer →
    </button>`;
  } else if (kc.type === 'numeric') {
    inputHTML = `<div class="kc-answer-area">
      <input type="number" class="kc-input" id="${cardId}-input"
             placeholder="Enter numeric answer${kc.unit ? ' (' + kc.unit + ')' : ''}..."
             onkeydown="if(event.key==='Enter') submitKC('${lesson.id}')"
             oninput="document.getElementById('${cardId}-submit').disabled=!this.value.trim()">
      <button class="kc-submit" id="${cardId}-submit" onclick="submitKC('${lesson.id}')" disabled>
        Submit →
      </button>
    </div>`;
  } else {
    // conceptual or code
    const placeholder = kc.type === 'code'
      ? 'Write your code snippet here...'
      : 'Explain in your own words (use key terms)...';
    inputHTML = `<div class="kc-answer-area">
      <input type="text" class="kc-input" id="${cardId}-input"
             placeholder="${placeholder}"
             onkeydown="if(event.key==='Enter') submitKC('${lesson.id}')"
             oninput="document.getElementById('${cardId}-submit').disabled=!this.value.trim()">
      <button class="kc-submit" id="${cardId}-submit" onclick="submitKC('${lesson.id}')" disabled>
        Submit →
      </button>
    </div>`;
  }

  return `
    <div class="kc-card" id="${cardId}">
      <div class="kc-header">
        <div class="kc-icon">⚡</div>
        <span class="kc-label">Knowledge Check</span>
        <span class="kc-attempts" id="${cardId}-attempts">
          Attempt ${attemptCount > 0 ? attemptCount + 1 : 1}
        </span>
      </div>
      <div class="kc-question">${kc.question}</div>
      ${inputHTML}
      <div class="kc-feedback hidden" id="${cardId}-feedback"></div>
    </div>`;
}

/**
 * Handle MC option selection — enable submit, track selection.
 */
function selectMCOption(cardId, selectedIndex) {
  document.querySelectorAll(`#${cardId}-options .kc-option`).forEach((el, i) => {
    el.classList.toggle('selected', i === selectedIndex);
  });
  const submitBtn = document.getElementById(`${cardId}-submit`);
  if (submitBtn) submitBtn.disabled = false;
  // Store selection
  const card = document.getElementById(cardId);
  if (card) card.dataset.selectedOption = selectedIndex;
}

/**
 * Get the student's answer from a KC card.
 */
function getAnswerFromCard(lessonId, kcType) {
  const cardId = `kc-${lessonId}`;
  if (kcType === 'multiple-choice') {
    const card = document.getElementById(cardId);
    return card ? card.dataset.selectedOption : null;
  } else {
    const input = document.getElementById(`${cardId}-input`);
    return input ? input.value : '';
  }
}

/**
 * Lock the KC card inputs after a pass or max attempts.
 */
function lockKCCard(lessonId) {
  const cardId = `kc-${lessonId}`;
  const input = document.getElementById(`${cardId}-input`);
  const submit = document.getElementById(`${cardId}-submit`);
  const options = document.querySelectorAll(`#${cardId}-options .kc-option input`);
  if (input) { input.disabled = true; }
  if (submit) { submit.disabled = true; submit.textContent = '✓ Submitted'; }
  options.forEach(o => { o.disabled = true; });
}

/**
 * Show feedback on a KC card.
 */
function showKCFeedback(lessonId, result, feedbackHTML) {
  const cardId = `kc-${lessonId}`;
  const feedbackEl = document.getElementById(`${cardId}-feedback`);
  const card = document.getElementById(cardId);

  if (feedbackEl) {
    const feedbackClass = result === 'pass' ? 'pass' : result === 'fail' ? 'fail' : 'hint';
    feedbackEl.className = `kc-feedback ${feedbackClass}`;
    feedbackEl.innerHTML = feedbackHTML;
    feedbackEl.classList.remove('hidden');
  }

  const lesson = typeof getLessonById === 'function' ? getLessonById(lessonId) : null;
  const isMC = lesson && lesson.knowledgeCheck && lesson.knowledgeCheck.type === 'multiple-choice';

  if (card) {
    if (result === 'pass') {
      card.classList.add('pass');
      card.classList.remove('fail');
      
      if (isMC) {
        const correctIdx = lesson.knowledgeCheck.correctIndex;
        document.querySelectorAll(`#${cardId}-options .kc-option`).forEach((el, i) => {
          el.classList.remove('selected');
          if (i === correctIdx) {
            el.classList.add('correct');
          }
        });
      }
    } else if (result === 'fail' || result === 'hint1' || result === 'hint2') {
      card.classList.add('fail');
      setTimeout(() => card.classList.remove('fail'), 500);
      
      // Update attempt counter
      const attemptsEl = document.getElementById(`${cardId}-attempts`);
      if (attemptsEl) {
        const current = parseInt(attemptsEl.textContent.replace('Attempt ', '')) || 1;
        attemptsEl.textContent = `Attempt ${current + 1}`;
      }
      
      if (isMC) {
        const selectedOption = card.dataset.selectedOption;
        if (selectedOption !== undefined && selectedOption !== null) {
          const optEl = document.getElementById(`${cardId}-opt-${selectedOption}`);
          if (optEl) {
            optEl.classList.remove('selected');
            optEl.classList.add('wrong');
            const radio = optEl.querySelector('input[type="radio"]');
            if (radio) {
              radio.checked = false;
              radio.disabled = true; // disable wrong choices so they can't click them again
            }
          }
          delete card.dataset.selectedOption;
        }
      } else {
        // Clear text input for retry
        const input = document.getElementById(`${cardId}-input`);
        if (input) { input.value = ''; }
      }
      
      const submit = document.getElementById(`${cardId}-submit`);
      if (submit) submit.disabled = true;
    }
  }
}
