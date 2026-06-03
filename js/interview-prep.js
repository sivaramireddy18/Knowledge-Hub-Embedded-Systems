/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * interview-prep.js — Phase-Gated MNC Interview Question Bank
 *
 * Questions curated from real embedded systems interviews at:
 * Tesla, Qualcomm, NXP, Renesas, Texas Instruments, Bosch,
 * Continental, STMicroelectronics, Infineon, NVIDIA
 */

const INTERVIEW_BANK = [

  /* ══════════════════════════════
     PHASE 1 — GROUND CONTROL
     ══════════════════════════════ */
  {
    id: 'IQ-P1-1', phase: 1,
    company: 'NXP / Renesas (Entry)', tier: 't2',
    difficulty: 1,
    question: 'What is the difference between a pull-up and a pull-down resistor? Give a real circuit example of when you would use each.',
    framework: `<strong>Structure your answer in three parts:</strong><br>
1. <strong>Definition:</strong> A pull-up resistor connects the signal line to VCC (logic HIGH when open). A pull-down connects to GND (logic LOW when open).<br>
2. <strong>Why it exists:</strong> Undefined floating states cause undefined behavior in digital circuits — this is a hardware fact, not a design choice.<br>
3. <strong>Real example:</strong> Pull-up for an open-collector I2C bus (SDA/SCL must idle HIGH). Pull-down for a push-button where the MCU reads LOW when button is pressed.`,
    commonMistakes: 'Saying "to prevent short circuits" — wrong. The purpose is to define logic state when the line is undriven.',
    followUps: [
      'What happens if your pull-up is too weak (high resistance) on an I2C bus?',
      'What is the typical pull-up value on an I2C 400kHz fast-mode bus?',
      'Why can you not use a push-pull GPIO as an I2C master?'
    ]
  },
  {
    id: 'IQ-P1-2', phase: 1,
    company: 'Texas Instruments (Entry)', tier: 't2',
    difficulty: 1,
    question: 'A 3.3V MCU GPIO sources 8mA maximum. You want to drive a red LED. Calculate the resistor value needed and explain your reasoning.',
    framework: `<strong>Apply Ohm's Law methodically:</strong><br>
V_resistor = V_supply − V_forward = 3.3V − 2.0V (red LED) = 1.3V<br>
R = V / I = 1.3V / 0.010A = <strong>130Ω</strong><br>
Choose nearest standard value: <strong>150Ω</strong> (slightly reduces current to ~8.7mA, safer for the GPIO).<br>
<br><strong>Critical add-on:</strong> Always check the MCU datasheet maximum IOH/IOL — never assume 8mA. STM32F4 GPIOs can be configured for 2/4/8/16mA drive strength. Exceeding it causes voltage droop and GPIO damage.`,
    commonMistakes: 'Forgetting to subtract LED forward voltage. Using I = 20mA without verifying GPIO drive strength limit.',
    followUps: [
      'Why would you not connect 10 LEDs directly to 10 GPIO pins all driving at once?',
      'What is the purpose of a transistor (BJT or MOSFET) as an LED driver stage?',
      'How would the calculation change for a 5V supply driving a blue LED (Vf = 3.2V)?'
    ]
  },
  {
    id: 'IQ-P1-3', phase: 1,
    company: 'Bosch (Entry)', tier: 't3',
    difficulty: 2,
    question: "In C, what is the difference between `int8_t`, `int`, and `int_fast8_t`? Why do embedded engineers care about this distinction?",
    framework: `<strong>This is a precision-vs-performance question:</strong><br>
• <code>int8_t</code>: Exactly 8 bits, signed. Guaranteed by <code>stdint.h</code>. Used when register width is critical (matching hardware peripheral width, protocol frames).<br>
• <code>int</code>: Platform-defined. On ARM Cortex-M, it is 32-bit. On AVR, 16-bit. <strong>Dangerous</strong> for bit-width-sensitive code.<br>
• <code>int_fast8_t</code>: At least 8 bits but the fastest natural integer size for the CPU. On ARM Cortex-M4, this is 32 bits — the CPU works in 32-bit registers natively.<br>
<br><strong>Rule:</strong> Use exact-width types (<code>uint8_t</code>, <code>uint32_t</code>) for hardware registers, protocol fields, and memory-mapped I/O. Use <code>int_fast</code> types only for loop counters where speed matters and size does not.`,
    commonMistakes: 'Using `int` for UART data bytes — results in truncation or sign-extension bugs when the MSB is set.',
    followUps: [
      'What does `volatile uint32_t *` mean? Why is `volatile` required for hardware registers?',
      'What is the size of `size_t` on a 32-bit Cortex-M? Why does it matter?',
      'What MISRA-C rule governs the use of int vs fixed-width types?'
    ]
  },

  /* ══════════════════════════════
     PHASE 2 — BARE-METAL
     ══════════════════════════════ */
  {
    id: 'IQ-P2-1', phase: 2,
    company: 'STMicroelectronics / Renesas (Junior)', tier: 't2',
    difficulty: 2,
    question: 'A production STM32F4 system has been running for 72 hours and crashes. You have no debugger attached. How do you diagnose it?',
    framework: `<strong>Senior-level answer — structured debugging without tools:</strong><br>
1. <strong>Watchdog confirmation:</strong> Verify the watchdog ISR (IWDG/WWDG) is not resetting the system — check the RCC_CSR reset flags on boot.<br>
2. <strong>Hardfault handler:</strong> Write a HardFault_Handler that logs LR, PC, CFSR, and BFAR registers to non-volatile memory (flash or external EEPROM) before reset. These identify the exact fault address.<br>
3. <strong>Stack overflow check:</strong> Place a canary value at stack bottom. On boot, verify it is intact. Log overflow before reset.<br>
4. <strong>Logging to UART or flash:</strong> Critical events logged with timestamps — correlate the last event before crash.<br>
5. <strong>Reproduce under load:</strong> Run a stress test — increase task frequency, inject max data throughput, trigger all ISRs simultaneously.`,
    commonMistakes: 'Saying "I would attach a debugger." In production, there is no debugger. This question tests field debugging methodology.',
    followUps: [
      'What information is in the CFSR (Configurable Fault Status Register)?',
      'How would you implement a crash logger in a 512-byte reserved flash sector?',
      'What is the purpose of the exception return value (EXC_RETURN) on ARM Cortex-M?'
    ]
  },
  {
    id: 'IQ-P2-2', phase: 2,
    company: 'NXP (Junior–Mid)', tier: 't2',
    difficulty: 3,
    question: 'What is priority inversion? Give a concrete embedded systems scenario and explain how a mutex with priority inheritance prevents it.',
    framework: `<strong>This is a classic RTOS theory + practice question:</strong><br>
<strong>Scenario:</strong> Task H (High priority) needs a shared resource (e.g., SPI bus). Task L (Low) holds the mutex. Task M (Medium) is runnable. Without priority inheritance: Task M preempts Task L. Task H starves waiting for Task L to release, while Task M runs indefinitely → <strong>Priority Inversion.</strong><br>
<br><strong>Fix — Priority Inheritance Mutex:</strong> When Task H blocks on a mutex held by Task L, the RTOS temporarily elevates Task L's priority to Task H's priority. Task M can no longer preempt Task L. Task L runs, finishes, releases mutex. Task H acquires it. Priorities restored.<br>
<br><strong>Real example:</strong> Mars Pathfinder (1997) — priority inversion between a bus management task and a data collection task caused system resets. Fixed by enabling priority inheritance on the VxWorks mutex.`,
    commonMistakes: 'Confusing priority inversion with deadlock. They are different. Deadlock = circular wait, no resolution. Priority inversion = temporary, resolvable.',
    followUps: [
      'What is priority ceiling protocol? How does it differ from priority inheritance?',
      'Why is priority inheritance not always the correct solution? When would you use priority ceiling instead?',
      'How does FreeRTOS implement priority inheritance in xSemaphoreTake?'
    ]
  },
  {
    id: 'IQ-P2-3', phase: 2,
    company: 'Infineon (Junior)', tier: 't2',
    difficulty: 2,
    question: 'Explain the ARM Cortex-M4 exception model. What is the difference between a fault, an interrupt, and an exception?',
    framework: `<strong>Precise ARM architecture answer:</strong><br>
• <strong>Exception:</strong> Any departure from normal sequential execution handled by the processor. Includes both interrupts and faults.<br>
• <strong>Interrupt (IRQ):</strong> Externally triggered exception from a peripheral (USART, TIM, EXTI, DMA). Vectored through NVIC. Has a configurable priority (0 = highest).<br>
• <strong>Fault:</strong> CPU-detected error condition. <code>HardFault</code> (always enabled), <code>MemManage</code> (MPU violation), <code>BusFault</code> (invalid memory access), <code>UsageFault</code> (undefined instruction, divide-by-zero).<br>
<br><strong>Key distinction:</strong> Interrupts are expected and scheduled. Faults indicate a software or hardware error and require recovery strategy — either reset, or fault handler that saves diagnostic state.`,
    commonMistakes: 'Saying HardFault is the only fault type. Interviewers expect knowledge of the full fault exception hierarchy.',
    followUps: [
      'What is the exception entry sequence on Cortex-M4? What registers are automatically pushed to the stack?',
      'What is the PRIMASK register and when would you use it?',
      'How do you determine if a HardFault was caused by a BusFault or UsageFault escalation?'
    ]
  },

  /* ══════════════════════════════
     PHASE 3 — SILICON COMM
     ══════════════════════════════ */
  {
    id: 'IQ-P3-1', phase: 3,
    company: 'Bosch / Continental (Mid)', tier: 't3',
    difficulty: 3,
    question: 'You are debugging an I2C bus. Your logic analyzer shows the master sending the address frame but never receiving an ACK. Walk me through your systematic diagnosis.',
    framework: `<strong>Systematic layer-by-layer debug methodology:</strong><br>
1. <strong>Physical layer:</strong> Measure SDA/SCL voltages at idle — must be pulled to VCC. Check pull-up resistor values (typical 4.7kΩ at 100kHz, 2.2kΩ at 400kHz). Measure rise time — must be < 1000ns at 100kHz.<br>
2. <strong>Device address:</strong> Verify 7-bit address + R/W bit is correct. Common error: confusing 7-bit vs 8-bit address format. A 0x48 7-bit address becomes 0x90 for write (0x48 << 1) or 0x91 for read.<br>
3. <strong>Device powered + reset:</strong> Confirm slave has power, is out of reset, and has not entered a locked state (SDA stuck LOW — requires 9 clock pulses to reset).<br>
4. <strong>Bus speed:</strong> Confirm master clock rate matches slave spec. A 400kHz master talking to a 100kHz-only slave = no ACK.<br>
5. <strong>Clock stretching:</strong> Verify master supports slave clock stretching if slave pulls SCL low to stall.`,
    commonMistakes: 'Starting at software level before verifying hardware. Physical layer must be verified first, always.',
    followUps: [
      'How do you recover an I2C bus where SDA is stuck LOW?',
      'What is the maximum number of devices on a single I2C bus? What limits it?',
      'What is the difference between I2C repeated start and stop-start?'
    ]
  },
  {
    id: 'IQ-P3-2', phase: 3,
    company: 'Qualcomm / NXP (Mid)', tier: 't1',
    difficulty: 3,
    question: 'Explain the four SPI CPOL/CPHA mode combinations. Which mode does the ADC in your current project use, and how do you verify it with a logic analyzer?',
    framework: `<strong>Precise SPI mode answer:</strong><br>
• <strong>Mode 0 (CPOL=0, CPHA=0):</strong> Clock idles LOW. Data sampled on rising edge. Most common — used by SD cards, many sensors.<br>
• <strong>Mode 1 (CPOL=0, CPHA=1):</strong> Clock idles LOW. Data sampled on falling edge.<br>
• <strong>Mode 2 (CPOL=1, CPHA=0):</strong> Clock idles HIGH. Data sampled on falling edge.<br>
• <strong>Mode 3 (CPOL=1, CPHA=1):</strong> Clock idles HIGH. Data sampled on rising edge.<br>
<br><strong>Verification:</strong> On logic analyzer, set trigger on CS falling. Observe SCK idle level (CPOL). Count clock edges before first data bit is stable (CPHA). If data is stable before first SCK edge → CPHA=0. If data changes with first SCK edge → CPHA=1.`,
    commonMistakes: 'Guessing CPOL/CPHA without referencing the device datasheet timing diagram. Always verify — never assume Mode 0.',
    followUps: [
      'SPI has no ACK mechanism. How do you verify a write transaction was successful?',
      'What is the maximum SPI speed of an STM32F4 peripheral? What limits it physically?',
      'How does DMA transfer over SPI reduce CPU overhead vs. polling?'
    ]
  },

  /* ══════════════════════════════
     PHASE 4 — RTOS / ORCHESTRATION
     ══════════════════════════════ */
  {
    id: 'IQ-P4-1', phase: 4,
    company: 'Tesla / Continental (Senior)', tier: 't1',
    difficulty: 4,
    question: 'Design the task architecture for a battery management system (BMS) firmware. You have: ADC sampling, CAN bus transmission, fault detection, and UART logging. Define task priorities, stack sizes, synchronization primitives, and explain your reasoning.',
    framework: `<strong>Senior system design answer:</strong><br>
<table style="width:100%; border-collapse:collapse; font-size:12px; margin: 10px 0;">
<tr style="border-bottom:1px solid #333;"><th>Task</th><th>Priority</th><th>Stack</th><th>Period</th><th>Sync</th></tr>
<tr><td>ADC Telemetry</td><td>HIGH (3)</td><td>512B</td><td>10ms (TIM ISR notify)</td><td>Queue → Fault, Logger</td></tr>
<tr><td>Fault Monitor</td><td>HIGH (3)</td><td>512B</td><td>Event-driven</td><td>Receives from ADC Q, EventGroup → CAN</td></tr>
<tr><td>CAN Transmit</td><td>MEDIUM (2)</td><td>1024B</td><td>100ms or fault event</td><td>Mutex on CAN peripheral</td></tr>
<tr><td>UART Logger</td><td>LOW (1)</td><td>2048B</td><td>Periodic + fault burst</td><td>Queue (non-blocking put)</td></tr>
</table>
<strong>Key decisions:</strong><br>
• ADC task uses DMA + TIM ISR with vTaskNotifyGiveFromISR — zero polling overhead.<br>
• Fault Monitor runs at same priority as ADC to preempt CAN immediately on fault condition.<br>
• UART logger uses QueueSend with 0 timeout — never blocks high-priority tasks.<br>
• All inter-task data via queues — never shared globals without mutexes.`,
    commonMistakes: 'Making all tasks the same priority. Priority design IS the RTOS design — undefined priorities create undefined behavior under load.',
    followUps: [
      'How do you handle the case where the CAN transmit task is blocked and a safety-critical fault fires?',
      'How do you size FreeRTOS task stacks? What tools verify stack high-water marks?',
      'What is the Worst-Case Execution Time (WCET) and how do you measure it for your ADC task?'
    ]
  },
  {
    id: 'IQ-P4-2', phase: 4,
    company: 'NXP / Renesas (Senior)', tier: 't2',
    difficulty: 4,
    question: 'What is the difference between a binary semaphore and a mutex in FreeRTOS? When must you use a mutex instead of a binary semaphore?',
    framework: `<strong>Precise FreeRTOS internals answer:</strong><br>
<strong>Binary Semaphore:</strong> A signaling mechanism. No ownership. Task A gives it, Task B takes it. No priority inheritance. Used for task notification (ISR → task synchronization).<br>
<strong>Mutex:</strong> A mutual exclusion mechanism with ownership. The task that takes it must be the one to give it. <strong>Has priority inheritance.</strong> Used for protecting shared resources.<br>
<br><strong>Critical rule:</strong> Never give a mutex from an ISR. ISRs do not have priority and cannot participate in priority inheritance → undefined behavior. Use <code>xSemaphoreGiveFromISR</code> only with binary semaphores or counting semaphores.<br>
<br><strong>When to use mutex:</strong> Any shared peripheral (SPI bus, UART), shared data structure that multiple tasks read/write, any resource that must be exclusively owned during an operation.`,
    commonMistakes: 'Using a binary semaphore to protect a shared resource — leads to priority inversion with no inheritance protection.',
    followUps: [
      'What is a recursive mutex (xSemaphoreCreateRecursiveMutex)? When do you need one?',
      'Can you take a FreeRTOS mutex from within an ISR? Why or why not?',
      'What happens if a task holding a mutex is deleted without releasing it?'
    ]
  },

  /* ══════════════════════════════
     PHASE 5 — PRO ARCHITECTURE
     ══════════════════════════════ */
  {
    id: 'IQ-P5-1', phase: 5,
    company: 'Tesla / SpaceX (Principal)', tier: 't1',
    difficulty: 5,
    question: 'Design a portable Hardware Abstraction Layer (HAL) for a UART peripheral that must support STM32F4, NRF52840, and ESP32-S3. Describe the interface design, layering strategy, and porting requirements.',
    framework: `<strong>Principal-level architecture answer:</strong><br>
<strong>Interface (hal_uart.h):</strong>
<pre>typedef struct {
  uint32_t baud_rate;
  uint8_t  data_bits;
  uint8_t  stop_bits;
  uint8_t  parity;
} hal_uart_config_t;

typedef int32_t (*hal_uart_tx_cb_t)(const uint8_t *, uint16_t);
typedef void    (*hal_uart_rx_cb_t)(uint8_t *, uint16_t);

typedef struct {
  hal_uart_handle_t *(*init)(uint8_t port, const hal_uart_config_t *cfg);
  int32_t (*transmit)(hal_uart_handle_t *h, const uint8_t *buf, uint16_t len, uint32_t timeout_ms);
  int32_t (*receive) (hal_uart_handle_t *h, uint8_t *buf, uint16_t len, uint32_t timeout_ms);
  void    (*register_rx_cb)(hal_uart_handle_t *h, hal_uart_rx_cb_t cb);
  void    (*deinit)(hal_uart_handle_t *h);
} hal_uart_ops_t;</pre>
<strong>Layer structure:</strong> Application → HAL interface (header-only) → Platform port (C file per target) → Register-level driver.<br>
<strong>Porting:</strong> Create uart_stm32f4.c, uart_nrf52840.c, uart_esp32s3.c — each implements hal_uart_ops_t. Selected at compile time via PLATFORM flag.`,
    commonMistakes: 'Designing the HAL around one platform\'s capabilities and then "porting" it — inverted. Design from the common interface down.',
    followUps: [
      'How do you handle platform-specific features (e.g., STM32 DMA, nRF EasyDMA) without polluting the common interface?',
      'How would you write unit tests for this HAL without any hardware?',
      'What does MISRA-C say about function pointers? How does that affect HAL design in safety-critical systems?'
    ]
  },
  {
    id: 'IQ-P5-2', phase: 5,
    company: 'Continental / Bosch (Senior)', tier: 't3',
    difficulty: 4,
    question: 'What is a bootloader? Design a dual-bank OTA update bootloader for an STM32F4 with CRC verification and rollback capability.',
    framework: `<strong>Production bootloader design answer:</strong><br>
<strong>Flash Layout:</strong>
<pre>Sector 0:     Bootloader (32KB) — never overwritten
Sector 1:     Boot config / flags (16KB) — update state, CRC
Sectors 2–7:  Bank A — Active application (192KB)
Sectors 8–11: Bank B — Pending update (128KB)</pre>
<strong>OTA Flow:</strong><br>
1. Application receives firmware image over UART/CAN/Ethernet → writes to Bank B sector-by-sector.<br>
2. After complete transfer, application writes CRC32 to boot config and sets UPDATE_PENDING flag.<br>
3. System reset → bootloader runs. Reads UPDATE_PENDING flag.<br>
4. Bootloader computes CRC32 of Bank B. Compares with stored value.<br>
5. If match: swap Boot Config to point to Bank B, clear flag, jump to new application.<br>
6. If mismatch: clear flag, log error, jump to Bank A (rollback).<br>
<strong>Rollback trigger:</strong> Boot counter — if application resets 3 times within 5 seconds, bootloader reverts to Bank A.`,
    commonMistakes: 'Forgetting rollback logic. A bootloader without rollback is a production liability — one bad update bricks all devices.',
    followUps: [
      'How do you prevent the bootloader itself from being overwritten during a firmware update?',
      'How do you implement secure boot (signature verification) using an RSA or ECDSA key?',
      'How does the bootloader "jump" to the application? What registers must be set before the jump?'
    ]
  },
];

/* ══════════════════════════════════════
   GET QUESTIONS FOR CURRENT PHASE
   ══════════════════════════════════════ */
function getInterviewQuestionsForPhase(phase) {
  return INTERVIEW_BANK.filter(q => q.phase <= phase);
}

function getRandomInterviewQuestion(phase) {
  const available = getInterviewQuestionsForPhase(phase);
  if (!available.length) return null;
  return available[Math.floor(Math.random() * available.length)];
}

/* ══════════════════════════════════════
   BUILD INTERVIEW QUESTION CARD HTML
   ══════════════════════════════════════ */
function buildInterviewQuestionCard(q) {
  const tierClass = `iq-company-${q.tier}`;
  const diffDots  = Array(5).fill(0).map((_, i) =>
    `<div class="diff-pip ${i < q.difficulty ? 'filled-' + (q.difficulty <= 2 ? 'easy' : q.difficulty <= 3 ? 'medium' : 'hard') : ''}"></div>`
  ).join('');

  return `
    <div class="iq-card">
      <div class="iq-card-header">
        <span class="iq-company-badge ${tierClass}">${q.company}</span>
        <div class="lesson-card-difficulty" title="Difficulty: ${q.difficulty}/5">${diffDots}</div>
      </div>
      <div class="iq-question">${q.question}</div>
      <details style="margin-top: 14px;">
        <summary style="cursor:pointer; font-family:var(--font-mono); font-size:11px; color:var(--violet); text-transform:uppercase; letter-spacing:0.1em; list-style:none; display:flex; align-items:center; gap:6px;">
          <span>▶</span> Answer Framework
        </summary>
        <div class="iq-framework" style="margin-top:12px;">${q.framework}</div>
        ${q.commonMistakes ? `
        <div style="margin-top:12px; padding:10px 14px; background:var(--red-dim); border:1px solid rgba(255,77,109,0.2); border-radius:8px; font-size:12px; color:rgba(255,77,109,0.9);">
          <strong>⚠ Common Mistake:</strong> ${q.commonMistakes}
        </div>` : ''}
        ${q.followUps && q.followUps.length ? `
        <div class="iq-followups">
          <div class="iq-followups-label">Follow-up Questions</div>
          ${q.followUps.map(f => `<div class="iq-followup-item">${f}</div>`).join('')}
        </div>` : ''}
      </details>
    </div>`;
}

/* ══════════════════════════════════════
   INJECT INTERVIEW QUESTION INTO CHAT
   ══════════════════════════════════════ */
async function showInterviewQuestion(phase) {
  const q = getRandomInterviewQuestion(phase || getCurrentPhase());
  if (!q) return;

  addSystemMessage('── Interview Question ──');
  await addTutorMessage(
    `Here is a <strong>${q.company}</strong> style interview question that matches your current skill level. These are asked verbatim in technical screenings.<br><br>
    Study the answer framework. Practice saying it out loud — not reading it.`
  );

  const container = document.getElementById('messages-container');
  if (container) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildInterviewQuestionCard(q);
    container.appendChild(wrapper.firstElementChild);
    scrollToBottom();
  }
}
