/**
 * ANTIGRAVITY EMBEDDED TUTOR — SANDBOX IDE
 * sandbox.js — Lightweight Compiler & Hardware Simulator Engine
 */

// ── Register Map State ──
const REGISTERS = {
  'RCC_AHB1ENR': 0x00000000,
  'GPIOA_MODER': 0x00000000,
  'GPIOA_ODR':   0x00000000,
  'GPIOA_IDR':   0x00000000,
  'GPIOB_MODER': 0x00000000,
  'GPIOB_ODR':   0x00000000,
  'GPIOB_IDR':   0x00000000,
  'TIM2_PSC':    0x00000000,
  'TIM2_ARR':    0x00000000,
  'TIM2_CNT':    0x00000000,
};

// ── Simulator Variables ──
let simInterval = null;
let simTime = 0;
let parsedCodeLines = [];
let pc = 0; // Program Counter
let registersChanged = false;
let isRunning = false;
let terminalLogs = [];

// Oscilloscope points
let scopePoints = [];
const maxScopePoints = 120;
let currentWaveType = 'flat'; // 'flat', 'square', 'sine', 'pwm'
let currentDutyCycle = 0.5;

// ── Code Examples ──
const EXAMPLES = {
  blinky: `// STM32 Bare-Metal Blinky Example
#include <stdint.h>

void main(void) {
    // 1. Enable GPIOA clock (bit 0 of RCC_AHB1ENR)
    RCC->AHB1ENR |= (1 << 0);
    
    // 2. Set PA5 as Output (bits [11:10] = 01)
    GPIOA->MODER |= (1 << 10);
    GPIOA->MODER &= ~(1 << 11);
    
    while (1) {
        // 3. Set PA5 HIGH (turn LED ON)
        GPIOA->ODR |= (1 << 5);
        delay(500);
        
        // 4. Set PA5 LOW (turn LED OFF)
        GPIOA->ODR &= ~(1 << 5);
        delay(500);
    }
}`,
  button: `// Pushbutton Input Example
#include <stdint.h>

void main(void) {
    // Enable GPIOA clock
    RCC->AHB1ENR |= (1 << 0);
    
    // Set PA5 (LED) as Output, PA0 (Button) as Input
    GPIOA->MODER |= (1 << 10);
    GPIOA->MODER &= ~(1 << 11);
    GPIOA->MODER &= ~(3 << 0); // PA0 Input
    
    while (1) {
        // Read PA0 Input Data Register (bit 0)
        uint8_t btn = (GPIOA->IDR & (1 << 0));
        
        if (btn) {
            // Button pressed -> Turn LED ON
            GPIOA->ODR |= (1 << 5);
        } else {
            // Button unpressed -> Turn LED OFF
            GPIOA->ODR &= ~(1 << 5);
        }
        delay(50);
    }
}`,
  pwm: `// PWM Simulation Example
#include <stdint.h>

void main(void) {
    RCC->AHB1ENR |= (1 << 0);
    GPIOA->MODER |= (1 << 10); // PA5 Output
    
    // Simulating analog write/PWM cycle
    while (1) {
        // Increasing duty cycle
        for (int duty = 10; duty <= 90; duty += 20) {
            set_pwm_duty(duty); // updates scope
            delay(1000);
        }
    }
}`,
  freertos: `// FreeRTOS Task & Queue Example
#include <FreeRTOS.h>
#include <task.h>
#include <queue.h>

QueueHandle_t ledQueue;

void LedTask(void *params) {
    uint8_t rxVal;
    while (1) {
        // Wait for msg in queue
        if (xQueueReceive(ledQueue, &rxVal, portMAX_DELAY)) {
            if (rxVal == 1) {
                GPIOA->ODR |= (1 << 5); // LED ON
            } else {
                GPIOA->ODR &= ~(1 << 5); // LED OFF
            }
        }
    }
}

void main(void) {
    RCC->AHB1ENR |= (1 << 0);
    GPIOA->MODER |= (1 << 10); // LED Output
    
    ledQueue = xQueueCreate(5, sizeof(uint8_t));
    xTaskCreate(LedTask, "LED_Task", 128, NULL, 2, NULL);
    
    while (1) {
        uint8_t on = 1;
        xQueueSend(ledQueue, &on, 0);
        delay(1000);
        
        uint8_t off = 0;
        xQueueSend(ledQueue, &off, 0);
        delay(1000);
    }
}`
};

// ── DOM Initialization ──
document.addEventListener('DOMContentLoaded', () => {
  initRegisterTable();
  initOscilloscope();
  
  // Wire controls
  document.getElementById('btn-run').addEventListener('click', startSimulation);
  document.getElementById('btn-stop').addEventListener('click', stopSimulation);
  document.getElementById('btn-reset').addEventListener('click', resetSimulation);
  
  const selectExample = document.getElementById('select-example');
  selectExample.addEventListener('change', (e) => {
    loadExample(e.target.value);
  });
  
  // Editor text binding & syntax highlighting
  const textarea = document.getElementById('editor-textarea');
  textarea.addEventListener('input', () => {
    highlightCode();
    updateGutters();
  });
  textarea.addEventListener('scroll', () => {
    const highlight = document.getElementById('editor-highlight');
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
    const gutter = document.getElementById('editor-gutter');
    gutter.scrollTop = textarea.scrollTop;
  });
  
  // Init default example
  loadExample('blinky');
  logToConsole('Embedded Simulator Engine Initialized.', 'info');
  logToConsole('Type / edit C code and press RUN to execute.', 'std');
});

// ── Code Loading & Highlighting ──
function loadExample(key) {
  const textarea = document.getElementById('editor-textarea');
  if (textarea && EXAMPLES[key]) {
    textarea.value = EXAMPLES[key];
    highlightCode();
    updateGutters();
    resetSimulation();
  }
}

function updateGutters() {
  const textarea = document.getElementById('editor-textarea');
  const gutter = document.getElementById('editor-gutter');
  if (!textarea || !gutter) return;
  
  const linesCount = textarea.value.split('\n').length;
  let gutterHTML = '';
  for (let i = 1; i <= linesCount; i++) {
    gutterHTML += `<div>${i}</div>`;
  }
  gutter.innerHTML = gutterHTML;
}

function highlightCode() {
  const textarea = document.getElementById('editor-textarea');
  const highlight = document.getElementById('editor-highlight');
  if (!textarea || !highlight) return;
  
  let code = textarea.value;
  
  // Basic C syntax highlighting patterns
  const keywords = /\b(while|if|else|for|void|return|const|volatile|struct|include|define|inherit)\b/g;
  const types = /\b(uint8_t|uint16_t|uint32_t|int8_t|int16_t|int32_t|int|char|float|QueueHandle_t)\b/g;
  const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const registers = /\b(RCC|GPIOA|GPIOB|TIM2)->\b/g;
  
  // Escape HTML entities to avoid breaking page tags
  code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Apply spans with styling classes
  code = code.replace(comments, '<span class="code-comment">$&</span>');
  // Avoid replacing inside comments by processing comments first or keeping it simple
  code = code.replace(keywords, '<span class="code-keyword">$&</span>');
  code = code.replace(types, '<span class="code-type">$&</span>');
  code = code.replace(strings, '<span class="code-string">$&</span>');
  code = code.replace(registers, '<span class="code-function">$&</span>');
  
  highlight.innerHTML = code;
}

// ── Register Table Renderer ──
function initRegisterTable() {
  const tbody = document.getElementById('register-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  Object.keys(REGISTERS).forEach(reg => {
    let baseAddr = 0x40020000;
    if (reg.startsWith('RCC')) baseAddr = 0x40023800;
    if (reg.startsWith('GPIOB')) baseAddr = 0x40020400;
    if (reg.startsWith('TIM2')) baseAddr = 0x40000000;
    
    const tr = document.createElement('tr');
    tr.id = `reg-row-${reg}`;
    
    tr.innerHTML = `
      <td class="name">${reg}</td>
      <td class="addr">0x${baseAddr.toString(16).toUpperCase()}</td>
      <td class="val" id="reg-val-${reg}">0x00000000</td>
      <td>
        <div class="bit-cells-container" id="reg-bits-${reg}">
          <!-- 32 bits injected -->
        </div>
      </td>
    `;
    tbody.appendChild(tr);
    
    // Inject bits (reverse order from bit 31 to 0)
    const container = document.getElementById(`reg-bits-${reg}`);
    for (let bit = 31; bit >= 0; bit--) {
      const cell = document.createElement('div');
      cell.className = 'bit-cell';
      cell.textContent = bit % 8 === 0 ? bit : '';
      cell.title = `Bit ${bit}`;
      cell.dataset.reg = reg;
      cell.dataset.bit = bit;
      
      cell.addEventListener('click', () => {
        toggleRegisterBit(reg, bit);
      });
      container.appendChild(cell);
    }
  });
  
  updateRegisterUI();
}

function updateRegisterUI() {
  Object.keys(REGISTERS).forEach(reg => {
    const valEl = document.getElementById(`reg-val-${reg}`);
    if (valEl) {
      valEl.textContent = `0x` + padHex(REGISTERS[reg]);
    }
    
    // Update bit cells
    for (let bit = 31; bit >= 0; bit--) {
      const cell = document.querySelector(`.bit-cell[data-reg="${reg}"][data-bit="${bit}"]`);
      if (cell) {
        const isSet = (REGISTERS[reg] & (1 << bit)) !== 0;
        cell.classList.toggle('set', isSet);
        cell.textContent = isSet ? '1' : (bit % 8 === 0 ? bit : '');
      }
    }
  });
  
  // Board side effects based on register states
  syncBoardState();
}

function toggleRegisterBit(reg, bit) {
  REGISTERS[reg] ^= (1 << bit);
  updateRegisterUI();
  logToConsole(`Register ${reg} bit ${bit} toggled manually.`, 'std');
}

function padHex(num) {
  let hex = (num >>> 0).toString(16).toUpperCase();
  return '0'.repeat(8 - hex.length) + hex;
}

// ── Virtual Board Sync ──
function syncBoardState() {
  const gpioaOdr = REGISTERS['GPIOA_ODR'];
  const gpioaModer = REGISTERS['GPIOA_MODER'];
  const rccAhb1 = REGISTERS['RCC_AHB1ENR'];
  
  // PA5 LED (Glow Green)
  const ledPa5 = document.getElementById('led-pa5');
  const clockEnabled = (rccAhb1 & (1 << 0)) !== 0;
  const isOutput = (gpioaModer & (1 << 10)) !== 0 && (gpioaModer & (1 << 11)) === 0;
  const isHigh = (gpioaOdr & (1 << 5)) !== 0;
  
  if (ledPa5) {
    if (clockEnabled && isOutput && isHigh) {
      ledPa5.classList.add('glow-green');
      currentWaveType = 'square'; // Show square wave on scope when output pulses
    } else {
      ledPa5.classList.remove('glow-green');
      if (currentWaveType === 'square' && !isRunning) {
        currentWaveType = 'flat';
      }
    }
  }
}

// Trigger input button state change in IDR
function pressBoardButton(pin, isPressed) {
  const button = document.getElementById(`btn-pa${pin}`);
  if (isPressed) {
    button.classList.add('pressed');
    REGISTERS['GPIOA_IDR'] |= (1 << pin);
  } else {
    button.classList.remove('pressed');
    REGISTERS['GPIOA_IDR'] &= ~(1 << pin);
  }
  updateRegisterUI();
}

// ── Real-time Oscilloscope Renderer ──
function initOscilloscope() {
  const svg = document.getElementById('oscilloscope-svg');
  if (!svg) return;
  
  // Set initial points
  scopePoints = Array(maxScopePoints).fill(70); // Center y position
  renderOscilloscope();
}

function renderOscilloscope() {
  const path = document.getElementById('oscilloscope-path');
  const valTag = document.getElementById('scope-val-text');
  if (!path) return;
  
  // Calculate SVG polyline points string
  const w = 450; // Match container width width-ish
  const h = 140;
  const step = w / maxScopePoints;
  
  let pointsStr = '';
  for (let i = 0; i < maxScopePoints; i++) {
    const x = i * step;
    const y = scopePoints[i];
    pointsStr += `${x},${y} `;
  }
  
  path.setAttribute('d', `M ` + pointsStr);
  
  // Update text label
  if (valTag) {
    if (currentWaveType === 'flat') {
      const volts = (REGISTERS['GPIOA_ODR'] & (1 << 5)) ? '3.3V' : '0.0V';
      valTag.textContent = `PA5 (LED): ${volts} [DC]`;
    } else if (currentWaveType === 'square') {
      valTag.textContent = `PA5 (LED): 10Hz square`;
    } else if (currentWaveType === 'pwm') {
      valTag.textContent = `PA5 (PWM): ${Math.round(currentDutyCycle * 100)}% Duty`;
    } else if (currentWaveType === 'sine') {
      valTag.textContent = `TIM2 Channel 1: Sine`;
    }
  }
}

function updateOscilloscopeWaveform() {
  simTime += 0.15;
  let nextY = 70; // mid-screen flat line
  
  if (currentWaveType === 'flat') {
    const isHigh = (REGISTERS['GPIOA_ODR'] & (1 << 5)) !== 0;
    nextY = isHigh ? 20 : 120; // 20 is high state, 120 is low state
  } else if (currentWaveType === 'square') {
    // Alternate state every few ticks
    const pulse = Math.floor(simTime * 2.5) % 2 === 0;
    nextY = pulse ? 20 : 120;
    
    // Sync ODR output to simulate physical feedback
    if (isRunning) {
      if (pulse) REGISTERS['GPIOA_ODR'] |= (1 << 5);
      else REGISTERS['GPIOA_ODR'] &= ~(1 << 5);
      updateRegisterUI();
    }
  } else if (currentWaveType === 'pwm') {
    const pulse = (simTime % 1.0) < currentDutyCycle;
    nextY = pulse ? 20 : 120;
  } else if (currentWaveType === 'sine') {
    nextY = 70 + Math.sin(simTime * 1.5) * 50;
  }
  
  scopePoints.push(nextY);
  if (scopePoints.length > maxScopePoints) {
    scopePoints.shift();
  }
  renderOscilloscope();
}

// ── Log Console Output ──
function logToConsole(message, type = 'std') {
  const out = document.getElementById('console-output');
  if (!out) return;
  
  const prefix = `[${new Date().toLocaleTimeString()}]`;
  const div = document.createElement('div');
  div.className = `console-line ${type}`;
  div.innerHTML = `<span class="prefix">${prefix}</span><span class="text">${message}</span>`;
  out.appendChild(div);
  out.scrollTop = out.scrollHeight;
}

// ── Custom C Parser & Compilation Runner ──
function startSimulation() {
  if (isRunning) return;
  
  const code = document.getElementById('editor-textarea').value;
  logToConsole('Compiling source code...', 'info');
  
  // Basic parsing: tokenize lines and instructions
  parsedCodeLines = parseCodeToSteps(code);
  
  if (parsedCodeLines.length === 0) {
    logToConsole('Compilation failed: empty source or syntax structure error.', 'error');
    return;
  }
  
  logToConsole('Compilation successful: 0 warnings, 0 errors.', 'success');
  logToConsole('Executing binary target...', 'info');
  
  isRunning = true;
  pc = 0;
  document.getElementById('btn-run').disabled = true;
  document.getElementById('btn-stop').disabled = false;
  
  // Run loop
  simInterval = setInterval(() => {
    // 1. Run next instruction
    executeNextInstruction();
    
    // 2. Refresh oscilloscope graph
    updateOscilloscopeWaveform();
  }, 100); // 100ms simulator cycles
}

function stopSimulation() {
  if (!isRunning) return;
  clearInterval(simInterval);
  isRunning = false;
  document.getElementById('btn-run').disabled = false;
  document.getElementById('btn-stop').disabled = true;
  logToConsole('Simulator halted by user.', 'warn');
}

function resetSimulation() {
  stopSimulation();
  
  // Reset registers
  Object.keys(REGISTERS).forEach(k => {
    REGISTERS[k] = 0x00000000;
  });
  
  simTime = 0;
  pc = 0;
  currentWaveType = 'flat';
  
  // Clear scope points
  scopePoints = Array(maxScopePoints).fill(120);
  
  updateRegisterUI();
  logToConsole('Simulator reset successfully.', 'info');
}

function parseCodeToSteps(code) {
  // Simple heuristic parser for our C simulation patterns
  const rawLines = code.split('\n');
  const steps = [];
  
  rawLines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) return;
    
    // Look for register operations
    if (trimmed.includes('RCC->AHB1ENR |=') || trimmed.includes('RCC->AHB1ENR =')) {
      steps.push({ type: 'write_reg', reg: 'RCC_AHB1ENR', op: 'or', val: extractBitshiftVal(trimmed) });
    } else if (trimmed.includes('GPIOA->MODER |=')) {
      steps.push({ type: 'write_reg', reg: 'GPIOA_MODER', op: 'or', val: extractBitshiftVal(trimmed) });
    } else if (trimmed.includes('GPIOA->MODER &= ~')) {
      steps.push({ type: 'write_reg', reg: 'GPIOA_MODER', op: 'and_not', val: extractBitshiftVal(trimmed) });
    } else if (trimmed.includes('GPIOA->ODR |=')) {
      steps.push({ type: 'write_reg', reg: 'GPIOA_ODR', op: 'or', val: extractBitshiftVal(trimmed) });
    } else if (trimmed.includes('GPIOA->ODR &= ~')) {
      steps.push({ type: 'write_reg', reg: 'GPIOA_ODR', op: 'and_not', val: extractBitshiftVal(trimmed) });
    } else if (trimmed.includes('GPIOA->ODR ^=')) {
      steps.push({ type: 'write_reg', reg: 'GPIOA_ODR', op: 'xor', val: extractBitshiftVal(trimmed) });
    } else if (trimmed.includes('delay(')) {
      const ms = parseInt(trimmed.match(/delay\((\d+)\)/)?.[1] || 100);
      steps.push({ type: 'delay', val: ms });
    } else if (trimmed.includes('set_pwm_duty(')) {
      const duty = parseInt(trimmed.match(/set_pwm_duty\((\d+)\)/)?.[1] || 50);
      steps.push({ type: 'pwm', val: duty });
    } else if (trimmed.includes('xQueueReceive(')) {
      steps.push({ type: 'rtos_recv' });
    } else if (trimmed.includes('xQueueSend(')) {
      steps.push({ type: 'rtos_send', val: trimmed.includes('on') ? 1 : 0 });
    } else if (trimmed.includes('GPIOA->IDR &')) {
      steps.push({ type: 'read_pin_pa0' });
    }
  });
  
  return steps;
}

function extractBitshiftVal(str) {
  // extract value from strings like (1 << 10) or (3 << 0) or 0x1
  if (str.includes('<<')) {
    const matches = str.match(/\((\d+)\s*<<\s*(\d+)\)/);
    if (matches) {
      return parseInt(matches[1]) << parseInt(matches[2]);
    }
  }
  const hexMatch = str.match(/0x([0-9A-Fa-f]+)/);
  if (hexMatch) {
    return parseInt(hexMatch[1], 16);
  }
  const numMatch = str.match(/=\s*(\d+)/);
  if (numMatch) {
    return parseInt(numMatch[1]);
  }
  return 0;
}

// Executing next simulated instruction
function executeNextInstruction() {
  if (parsedCodeLines.length === 0) return;
  if (pc >= parsedCodeLines.length) {
    pc = 0; // Restart loop
  }
  
  const inst = parsedCodeLines[pc];
  pc++;
  
  switch (inst.type) {
    case 'write_reg':
      if (inst.op === 'or') {
        REGISTERS[inst.reg] |= inst.val;
      } else if (inst.op === 'and_not') {
        REGISTERS[inst.reg] &= ~inst.val;
      } else if (inst.op === 'xor') {
        REGISTERS[inst.reg] ^= inst.val;
      }
      updateRegisterUI();
      logToConsole(`Executed register write: ${inst.reg} = 0x${padHex(REGISTERS[inst.reg])}`, 'success');
      break;
      
    case 'delay':
      logToConsole(`Delay loop active: ${inst.val} ms...`, 'std');
      break;
      
    case 'pwm':
      currentWaveType = 'pwm';
      currentDutyCycle = inst.val / 100;
      logToConsole(`Updating PWM output pin duty cycle: ${inst.val}%`, 'info');
      break;
      
    case 'rtos_recv':
      logToConsole(`FreeRTOS: LedTask blocked on queue receive.`, 'info');
      break;
      
    case 'rtos_send':
      logToConsole(`FreeRTOS: Sending value ${inst.val} to ledQueue.`, 'info');
      // Update ODR registers to reflect RTOS message passing
      if (inst.val === 1) {
        REGISTERS['GPIOA_ODR'] |= (1 << 5);
      } else {
        REGISTERS['GPIOA_ODR'] &= ~(1 << 5);
      }
      updateRegisterUI();
      break;
      
    case 'read_pin_pa0':
      const pinState = (REGISTERS['GPIOA_IDR'] & (1 << 0)) ? 'HIGH' : 'LOW';
      logToConsole(`Sampling input pin PA0: ${pinState}`, 'std');
      break;
  }
}
