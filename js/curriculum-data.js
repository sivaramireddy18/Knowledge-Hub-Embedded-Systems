/**
 * ANTIGRAVITY EMBEDDED TUTOR
 * curriculum-data.js — 5-Phase Lesson Content Graph
 *
 * Each lesson has: id, title, content (HTML), analogy, knowledgeCheck
 * knowledgeCheck types: 'numeric', 'multiple-choice', 'conceptual', 'code'
 */

const CURRICULUM = [
  /* ════════════════════════════════════════════════════════
     PHASE 1 — GROUND CONTROL
     Prerequisites: None | Unlocks: Phase 2
     ════════════════════════════════════════════════════════ */
  {
    phaseId: 1,
    phaseName: "Ground Control",
    phaseSubtitle: "Basic electricity, GPIO, Ohm's Law, simple C/Python",
    phaseIcon: "🌍",
    totalLessons: 8,
    lessons: [
      {
        id: "P1-L1",
        title: "What is Voltage? The Water Pressure Analogy",
        content: `
<p>Forget electrons for now. Think about water in a pipe.</p>
<p><strong>Voltage</strong> is like water pressure. A battery is a pump that creates pressure difference between its two terminals. That pressure is what <em>forces</em> electrons to move through a circuit.</p>
<p>A 9V battery creates 9 volts of electrical pressure. A 3.3V microcontroller operates on 3.3 volts. These aren't arbitrary numbers — they define how hard the electrical system can push current through components.</p>
<p>Key unit: <code>Volts (V)</code>. Measured between two points — always a <em>difference</em>, never absolute.</p>
<p>Your multimeter's red probe and black probe? That's how you measure this pressure difference across a component.</p>`,
        analogy: "Voltage = water pressure. Battery = pump. Higher voltage = more pressure to push electrons through the circuit.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "A 9V battery has its positive terminal connected to a resistor. Where do we measure 'voltage'?",
          options: [
            "At a single point on the positive terminal",
            "Between the positive terminal and negative terminal (or GND)",
            "Inside the battery itself",
            "At the resistor's center point"
          ],
          correctIndex: 1,
          hint1: "Voltage is always a *difference* between two points. Recall the water analogy — pressure is measured between inlet and outlet.",
          hint2: "One terminal is 'high pressure', the other is the reference (ground). You measure the difference between them.",
          analogyOnFail: "Water pressure only makes sense when you compare it against something. A pipe at 9 PSI compared to 0 PSI. Voltage is the same — always two points.",
          explanation: "Voltage is a potential difference. It's measured between two nodes: the positive terminal (high potential) and the negative terminal / GND (reference, 0V)."
        },
        unlocks: "P1-L2"
      },
      {
        id: "P1-L2",
        title: "Current & Resistance — Ohm's Law",
        content: `
<p>You have pressure (voltage). Now: what flows, and what resists the flow?</p>
<p><strong>Current (I)</strong> is the actual flow rate — electrons per second. Unit: <code>Amperes (A)</code>, or milliamps (<code>mA</code>) for small circuits.</p>
<p><strong>Resistance (R)</strong> is how hard a component fights the flow. Unit: <code>Ohms (Ω)</code>.</p>
<p>These three are locked together by <strong>Ohm's Law</strong>:</p>
<pre>V = I × R</pre>
<p>Rearranged three ways — memorize all three:</p>
<pre>V = I × R    (what's the voltage?)
I = V / R    (what current flows?)
R = V / I    (what resistance do I need?)</pre>
<p>Real-world use: you have a 3.3V GPIO pin and a red LED that needs 20mA (0.02A). What resistor do you put in series?</p>
<pre>R = V / I = 3.3 / 0.02 = 165Ω → use 220Ω (nearest standard value)</pre>`,
        analogy: "Current = water flow rate (liters/sec). Resistance = pipe narrowness. Narrow pipe → less flow for same pressure.",
        knowledgeCheck: {
          type: "numeric",
          question: "A 5V Arduino GPIO pin drives an LED that requires 15mA. There's a 0.7V drop across the LED. What resistor value (in Ω) do you need in series? Round to nearest whole number.",
          answer: 286,
          tolerance: 15,
          unit: "Ω",
          hint1: "The resistor sees the leftover voltage after the LED takes its share. V_resistor = V_supply − V_LED_drop. Then apply Ohm's Law.",
          hint2: "V_resistor = 5V − 0.7V = 4.3V. Current = 15mA = 0.015A. R = V/I = 4.3 / 0.015 = ?",
          analogyOnFail: "Think of the LED as a narrowing in a pipe that already eats up some pressure. The resistor handles the remaining pressure drop.",
          explanation: "V_resistor = 5 − 0.7 = 4.3V. R = 4.3 / 0.015 = 286.7Ω. Use 330Ω as the nearest standard value."
        },
        unlocks: "P1-L3"
      },
      {
        id: "P1-L3",
        title: "What is a GPIO Pin?",
        content: `
<p>GPIO = <strong>General Purpose Input/Output</strong>. It's literally a configurable electrical pin on a microcontroller that you control in software.</p>
<p>Two modes:</p>
<ul>
  <li><strong>Output mode</strong>: You write software to set the pin HIGH (3.3V or 5V) or LOW (0V). This drives current out to control LEDs, relays, motors.</li>
  <li><strong>Input mode</strong>: You read the pin's voltage in software. The hardware tells you if a button is pressed (HIGH) or not (LOW).</li>
</ul>
<p>Inside your microcontroller, a GPIO pin is controlled by <strong>registers</strong> — specific memory addresses. When you write a <code>1</code> to a bit in a register, hardware physically raises the voltage on that pin. That's the magic we'll strip apart in Phase 2.</p>
<p>For now: GPIO = a software-controllable voltage switch on a pin.</p>`,
        analogy: "A GPIO pin is like a light switch. Output mode = you control the switch. Input mode = you can read whether someone else flipped it.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You want to read whether a pushbutton is pressed or not. Which GPIO mode do you configure?",
          options: [
            "Output mode — drive the pin HIGH when pressed",
            "Input mode — read the voltage level the button sets",
            "Analog mode — measure exact voltage",
            "Open-drain mode — let the pin float"
          ],
          correctIndex: 1,
          hint1: "Are you *setting* the pin state or *reading* it? Buttons are external events you observe, not control.",
          hint2: "Input mode means the MCU samples the voltage on the pin and tells you: was it HIGH or LOW?",
          analogyOnFail: "Reading a button is like reading a thermometer — you observe a state, you don't set it. That's Input mode.",
          explanation: "Input mode configures the pin's direction register to 'read'. The button pulls the pin HIGH or LOW, and you read that state in software."
        },
        unlocks: "P1-L4"
      },
      {
        id: "P1-L4",
        title: "Pull-up & Pull-down Resistors",
        content: `
<p>Here's a trap every beginner hits: an unconnected input pin <em>floats</em>.</p>
<p>A floating pin doesn't cleanly read HIGH or LOW — it reads random noise. Buttons bounce. Your code sees phantom presses. This is called a <strong>floating input</strong> and it's a silent killer in embedded systems.</p>
<p>The fix: <strong>pull resistors</strong>.</p>
<p><strong>Pull-up resistor</strong>: Connect a resistor (typically 10kΩ) from the pin to VCC (3.3V/5V). Now the pin sits at HIGH by default. When the button is pressed and shorts the pin to GND, it reads LOW.</p>
<p><strong>Pull-down resistor</strong>: Resistor from pin to GND. Pin sits at LOW by default. Button press pulls it HIGH.</p>
<p>Most modern MCUs have these <em>built in</em> — configurable in software via a register bit. Never leave an input floating.</p>
<pre>// Direction: Never leave inputs without a defined pull state
// This is Rule #1 of GPIO safety in production code</pre>`,
        analogy: "A floating input is like an unweighted see-saw — it can tip either way randomly. A pull resistor is a weak spring that holds it at one side until something stronger pushes it the other way.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You configure a GPIO as input with an internal pull-up. The pin is NOT connected to anything. What does your code read?",
          options: [
            "LOW (0) — the pull-up pulls it to ground",
            "HIGH (1) — the pull-up holds it at VCC",
            "Random / undefined",
            "Exactly 1.65V (half of 3.3V)"
          ],
          correctIndex: 1,
          hint1: "Pull-UP means connected to VCC (High). If nothing else is pulling it down, where does it sit?",
          hint2: "The 'up' in pull-up tells you the default state: HIGH.",
          analogyOnFail: "Pull-up = the spring pushes the see-saw UP. Nothing connected = spring wins = HIGH.",
          explanation: "With a pull-up resistor active and nothing connected, the pin is held at VCC through the resistor. The MCU reads HIGH (1)."
        },
        unlocks: "P1-L5"
      },
      {
        id: "P1-L5",
        title: "Your First C Program — Blink",
        content: `
<p>Every embedded system starts here. The "Hello, World!" of hardware is making an LED blink. Let's dissect the C:</p>
<pre>
#include &lt;stdint.h&gt;

// These are the ONLY types you use in embedded C.
// Never use 'int' or 'char' without thinking about width.
void delay(volatile uint32_t count) {
    while (count--);  // Burns CPU cycles. Crude. Effective.
}

int main(void) {
    // Set up GPIO direction register — mark the pin as output
    // (In bare-metal, you'd write to a register address directly.
    //  For now: assume setup_led() does that.)
    setup_led();

    while (1) {        // Infinite loop — MCUs never 'exit'
        led_on();
        delay(500000); // ~500ms on a 16MHz clock (rough)
        led_off();
        delay(500000);
    }
}
</pre>
<p>Key rules you've just absorbed:</p>
<ul>
  <li>Use <code>uint32_t</code>, <code>uint8_t</code> — not <code>int</code>. Width matters on hardware.</li>
  <li><code>volatile</code> on the delay counter stops the compiler from optimizing the loop away.</li>
  <li>MCU main loops are <code>while(1)</code> forever. There is no OS to return to.</li>
</ul>`,
        analogy: "An MCU is like a factory floor that never closes. The while(1) loop is the production line running 24/7. Your code IS the operating system.",
        knowledgeCheck: {
          type: "conceptual",
          question: "Why is the `volatile` keyword critical on the `count` variable inside the delay function?",
          requiredKeywords: ["compiler", "optimize", "loop"],
          hint1: "What does a compiler do when it sees a variable that's only ever decremented and never *read* for a useful result?",
          hint2: "Without `volatile`, the compiler sees: 'this loop does nothing useful' and removes it entirely during optimization. The delay disappears.",
          analogyOnFail: "It's like telling your factory supervisor 'don't skip steps even if they look pointless.' The compiler is eager to skip 'pointless' loops.",
          explanation: "Without `volatile`, the optimizer legally removes the delay loop since it produces no externally visible side effect. `volatile` tells the compiler: 'this variable is hardware-significant, don't touch it.'"
        },
        unlocks: "P1-L6"
      },
      {
        id: "P1-L6",
        title: "Number Systems — Binary, Hex, and Registers",
        content: `
<p>You cannot configure hardware without hex. Period. Here's why registers are defined in hex:</p>
<p>A 32-bit register controls 32 individual hardware signals (GPIO pins, clock enables, interrupt enables). Each bit is a switch.</p>
<pre>// Readable. You see exactly which bits are set.
#define GPIOA_MODER_PIN5_OUTPUT  (0x1U &lt;&lt; 10)  // Bit 10 set

// Cryptic. Never do this.
#define PIN5_OUTPUT  1024  // What does 1024 mean for hardware?
</pre>
<p>Conversion you must do in your head:</p>
<pre>0xFF   = 1111 1111  = 255  (all 8 bits HIGH)
0x0F   = 0000 1111  = 15   (lower nibble)
0xF0   = 1111 0000  = 240  (upper nibble)
0x01   = 0000 0001  = 1    (bit 0)
(1U &lt;&lt; 5) = 0x20 = bit 5 set</pre>
<p>In embedded C, register manipulation always looks like this:</p>
<pre>// SET bit 5   (output HIGH on pin 5)
GPIOA->ODR |=  (1U &lt;&lt; 5);

// CLEAR bit 5 (output LOW on pin 5)
GPIOA->ODR &amp;= ~(1U &lt;&lt; 5);

// TOGGLE bit 5
GPIOA->ODR ^=  (1U &lt;&lt; 5);
</pre>`,
        analogy: "Hex is the language hardware speaks. Binary is the truth underneath. Decimal is for humans who haven't learned hardware yet.",
        knowledgeCheck: {
          type: "numeric",
          question: "What is the decimal value of 0xA5? (No calculator — convert mentally: A=10, 5=5, positional weights 16¹ and 16⁰)",
          answer: 165,
          tolerance: 0,
          unit: "",
          hint1: "Hex positional: 0xA5 = (A × 16) + (5 × 1). A in hex = 10 in decimal.",
          hint2: "(10 × 16) + (5 × 1) = 160 + 5 = ?",
          analogyOnFail: "Hex is base-16. Each digit's weight is 16^position. 0xA5: A is in the 16s place, 5 is in the 1s place.",
          explanation: "0xA5 = (10 × 16) + (5 × 1) = 160 + 5 = 165."
        },
        unlocks: "P1-L7"
      },
      {
        id: "P1-L7",
        title: "Compilation Pipeline — From .c to .elf",
        content: `
<p>What actually happens when you "compile" your code? Four stages — not one:</p>
<pre>
  source.c
     │
     ▼ [1. Preprocessor — cpp]
  Expands #include, #define, #ifdef
     │
     ▼ [2. Compiler — cc1]
  Translates C to Assembly (.s)
     │
     ▼ [3. Assembler — as]
  Translates Assembly to machine code (.o object file)
     │
     ▼ [4. Linker — ld]
  Combines .o files + libraries → .elf (Executable Linkable Format)
     │
     ▼ [5. objcopy — post-processing]
  Strips to .hex or .bin for flashing to MCU flash memory
</pre>
<p>Why care? Because when something breaks, you'll use <code>objdump</code>, <code>nm</code>, and <code>readelf</code> to inspect each stage. That's how pros debug production crashes.</p>
<pre>
# Inspect your compiled binary
arm-none-eabi-nm firmware.elf       # list all symbols & addresses
arm-none-eabi-objdump -d firmware.elf  # disassemble — see the actual instructions
arm-none-eabi-size firmware.elf     # how big are text/data/bss sections?
</pre>`,
        analogy: "Compilation is like converting a recipe (C code) → translated recipe (Assembly) → ingredient list (machine code) → fully plated dish (ELF binary ready to run).",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "Which compilation stage is responsible for resolving function calls between separate `.c` files (e.g., `main.c` calling `uart_init()` defined in `uart.c`)?",
          options: [
            "Preprocessor — it handles file inclusion",
            "Compiler — it sees all files at once",
            "Assembler — it handles symbol resolution",
            "Linker — it combines object files and resolves symbol references"
          ],
          correctIndex: 3,
          hint1: "Each .c file is compiled independently into its own .o file. Something has to connect them together afterward.",
          hint2: "The Linker's job is to take all the .o object files and resolve every external function reference (symbol) between them.",
          analogyOnFail: "The preprocessor and compiler each work on one file at a time. Only the Linker sees all the pieces and snaps them together.",
          explanation: "The Linker (ld) takes all .o object files, resolves inter-file symbol references (like uart_init()), and produces the final .elf binary."
        },
        unlocks: "P1-L8"
      },
      {
        id: "P1-L8",
        title: "Memory Layout — Stack, Heap, Text, BSS, Data",
        content: `
<p>Every C program — on your PC or a 64KB MCU — uses the same 5 memory regions. Know them cold.</p>
<pre>
High Address ┌─────────────────┐
             │     STACK       │ ← Local variables, function call frames
             │  (grows DOWN)   │   Automatically managed. Fixed size on MCU.
             ├─────────────────┤
             │   (free RAM)    │
             ├─────────────────┤
             │     HEAP        │ ← malloc/free. Dynamic. Dangerous on MCUs.
             │  (grows UP)     │   Usually AVOIDED in bare-metal.
             ├─────────────────┤
             │      BSS        │ ← Uninitialized globals. Zero-filled at startup.
             ├─────────────────┤
             │     DATA        │ ← Initialized globals (e.g., int x = 5;)
             ├─────────────────┤
             │     TEXT        │ ← Your compiled machine code (read-only)
Low Address  └─────────────────┘
</pre>
<p>Critical embedded rule: <strong>MCUs have tiny RAM</strong>. An STM32F407 has 192KB RAM total. Your stack + heap + globals must fit. Stack overflow on a bare-metal MCU is silent and catastrophic — the CPU doesn't tell you. It just corrupts memory and crashes mysteriously.</p>
<pre>
int global_count = 10;   // → DATA segment
int uninit_buffer[64];   // → BSS segment (zero'd by startup code)

void foo(void) {
    int local = 5;       // → STACK (gone when foo() returns)
    int *p = malloc(64); // → HEAP (you manage this. Don't on MCU.)
}
</pre>`,
        analogy: "Stack is a stack of plates — LIFO, automatic. Heap is a warehouse — you request space and must return it. TEXT is the instruction manual printed on the wall — read-only.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You declare `static uint8_t rx_buffer[256];` inside a function. Where does this variable live in memory?",
          options: [
            "Stack — it's inside a function",
            "Heap — it's a buffer, so it must be dynamic",
            "BSS or DATA — `static` forces it to persistent memory, not the stack",
            "TEXT — it's a constant buffer"
          ],
          correctIndex: 2,
          hint1: "`static` is a storage class specifier. It changes the *lifetime* of the variable, overriding the default stack placement.",
          hint2: "A `static` local variable persists between function calls — that means it can't be on the stack. It lives in BSS (uninitialized) or DATA (initialized) instead.",
          analogyOnFail: "`static` is like renting a permanent locker in the warehouse instead of using a temporary tray on the counter (stack). It stays even when you leave the room.",
          explanation: "`static` inside a function stores the variable in BSS (if uninitialized/zero-initialized) or DATA (if given a non-zero initial value). It persists across calls. Stack storage would vanish on function return."
        },
        unlocks: null  // Phase 1 complete — unlocks Phase 2
      }
    ]
  },

  /* ════════════════════════════════════════════════════════
     PHASE 2 — REMOVING THE TRAINING WHEELS
     Prerequisites: Phase 1 complete | Unlocks: Phase 3
     ════════════════════════════════════════════════════════ */
  {
    phaseId: 2,
    phaseName: "Removing the Training Wheels",
    phaseSubtitle: "Datasheets, bare-metal C, interrupts, timers",
    phaseIcon: "⚙️",
    totalLessons: 8,
    lessons: [
      {
        id: "P2-L1",
        title: "Reading a Datasheet — The Skill Nobody Teaches",
        content: `
<p>A datasheet is the ground truth. Vendors lie in tutorials. Datasheets don't.</p>
<p>For the STM32F407, the two documents you live in:</p>
<ul>
  <li><strong>Datasheet (DS)</strong>: Pin descriptions, electrical characteristics, package info. ~180 pages.</li>
  <li><strong>Reference Manual (RM0090)</strong>: Every peripheral's registers, bit fields, timing diagrams. ~1700 pages.</li>
</ul>
<p>How to navigate a reference manual for a peripheral (e.g., GPIO):</p>
<ol>
  <li>Find the peripheral's chapter (e.g., "8. General-purpose I/Os (GPIO)")</li>
  <li>Read the "Functional description" first — understand what it does conceptually.</li>
  <li>Find the <strong>Register Map</strong> at the end of the chapter — this is your control panel.</li>
  <li>For each register: note the <strong>address offset</strong>, the <strong>bit field names</strong>, and their <strong>reset values</strong>.</li>
</ol>
<pre>
// Example: STM32F407 GPIOA base address = 0x40020000
// MODER register offset = 0x00
// MODER register address = 0x40020000 + 0x00 = 0x40020000
#define GPIOA_MODER  (*(volatile uint32_t*)0x40020000)

// Set PA5 as output (bits [11:10] = 0b01)
GPIOA_MODER &amp;= ~(0x3U &lt;&lt; 10);  // clear
GPIOA_MODER |=  (0x1U &lt;&lt; 10);  // set output mode
</pre>`,
        analogy: "A datasheet is the circuit board's constitution. The reference manual is the law code. When your code doesn't work, you go to the law — not Stack Overflow.",
        knowledgeCheck: {
          type: "conceptual",
          question: "To configure a peripheral register, you look up the register's address. What two pieces of information from the reference manual do you need to calculate it?",
          requiredKeywords: ["base", "offset"],
          hint1: "Each GPIO port (GPIOA, GPIOB...) has a starting address. Each register within that port is at a fixed distance from that start.",
          hint2: "Peripheral Base Address + Register Offset = Register Address. Both values come from the reference manual's memory map and register description tables.",
          analogyOnFail: "Base address = which building. Register offset = which floor. You need both to get to the right room.",
          explanation: "Register Address = Peripheral Base Address + Register Offset. The memory map table gives you the base address; the register description table gives you each register's offset from that base."
        },
        unlocks: "P2-L2"
      },
      {
        id: "P2-L2",
        title: "Clock Architecture — Why Nothing Works Until You Enable the Clock",
        content: `
<p>This catches every beginner. You configure a GPIO register correctly, test the pin with a multimeter — nothing. The MCU seems broken. It isn't. You forgot to enable the clock.</p>
<p><strong>MCU clock gating</strong>: To save power, ALL peripherals start with their clock disabled. The peripheral's registers are inaccessible until you explicitly turn on its clock in the <strong>RCC (Reset and Clock Control)</strong> module.</p>
<pre>
// RCC base address: 0x40023800 (STM32F407)
// AHB1ENR offset: 0x30
#define RCC_AHB1ENR  (*(volatile uint32_t*)0x40023830)

// Bit 0 = GPIOAEN (GPIOA clock enable)
RCC_AHB1ENR |= (1U &lt;&lt; 0);  // Enable GPIOA clock

// NOW you can configure GPIOA registers.
// Before this line: writing to GPIOA_MODER does nothing.
</pre>
<p>Rule: <strong>Always enable the peripheral clock before touching any of its registers.</strong> This is the #1 cause of inexplicable bare-metal failures.</p>`,
        analogy: "The peripheral is a machine on the factory floor. The RCC clock enable is the power switch on the wall. No power = the machine ignores all your button presses.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You enable GPIOB clock, configure PB3 as output, then write 1 to the ODR bit for PB3. The pin stays LOW. What is the most likely cause?",
          options: [
            "The ODR register address is wrong",
            "You forgot to also enable the SYSCFG clock",
            "The pin is configured correctly — the LED is wired backwards",
            "You enabled GPIOB clock but configured GPIOA's MODER register by mistake"
          ],
          correctIndex: 3,
          hint1: "You enabled GPIOB. You're configuring pin PB3. Now re-read the code carefully — which port's MODER register did you actually write to?",
          hint2: "It's easy to enable GPIOB clock but accidentally use the GPIOA base address for the MODER configuration. Confirm your base addresses.",
          analogyOnFail: "You powered up Machine B but pressed the controls for Machine A. Machine B still does nothing because you never told IT what to do.",
          explanation: "Classic mistake: enabling GPIOB's clock but writing to GPIOA's MODER register (wrong base address). PB3 never gets configured as output."
        },
        unlocks: "P2-L3"
      },
      {
        id: "P2-L3",
        title: "Interrupts — Letting Hardware Interrupt Your Code",
        content: `
<p>Polling is amateur hour. Here's why:</p>
<pre>
// BAD: Polling approach — wastes 100% of CPU cycles
while(1) {
    if (button_is_pressed()) {
        do_something();
    }
    // CPU spins here doing NOTHING while waiting
}
</pre>
<p>An <strong>interrupt</strong> is a hardware signal that tells the CPU: "Stop what you're doing right now. Jump to my handler. Handle it. Come back."</p>
<p>The handler is called an <strong>ISR (Interrupt Service Routine)</strong>. The CPU automatically saves its state (registers, PC), executes your ISR, then restores state and continues.</p>
<pre>
// GOOD: Interrupt-driven — CPU is free for real work
void EXTI0_IRQHandler(void) {     // ISR — called by hardware
    if (EXTI->PR & (1U &lt;&lt; 0)) {  // Check which line triggered
        process_button_event();   // Do the work
        EXTI->PR |= (1U &lt;&lt; 0);  // CRITICAL: clear the pending flag
    }
}
</pre>
<p><strong>ISR Rules (violate these and suffer):</strong></p>
<ul>
  <li>ISRs must be fast — no blocking, no <code>printf</code>, no delays.</li>
  <li>Always clear the interrupt pending flag or it fires forever.</li>
  <li>Variables shared between ISR and main must be <code>volatile</code>.</li>
  <li>No <code>malloc</code> inside ISRs. Ever.</li>
</ul>`,
        analogy: "Polling is sitting by the door waiting for a knock. Interrupts are a doorbell — you do other things until the bell rings, then handle it.",
        knowledgeCheck: {
          type: "conceptual",
          question: "You share a `uint32_t event_flags` variable between your ISR and main loop. What two things must you do to safely share it?",
          requiredKeywords: ["volatile", "atomic"],
          hint1: "The compiler must know this variable can change at any time from outside the normal flow. Which keyword enforces this?",
          hint2: "`volatile` prevents compiler optimization. But on 32-bit ARM Cortex-M, reading/writing a `uint32_t` is atomic — it happens in a single instruction. For larger types or flag combinations, you'd also need critical sections.",
          analogyOnFail: "It's like a shared whiteboard between two workers. `volatile` = 'always read from the board, don't cache it.' Atomic = 'don't let one worker erase half the message while the other is reading it.'",
          explanation: "1) Declare as `volatile uint32_t event_flags` so the compiler always reads from actual memory. 2) For multi-byte modifications, use atomic operations or disable interrupts briefly (critical section) to prevent race conditions."
        },
        unlocks: "P2-L4"
      },
      {
        id: "P2-L4",
        title: "The NVIC — Managing Interrupt Priority",
        content: `
<p>Your MCU has dozens of interrupt sources. What happens when two fire simultaneously? Who wins?</p>
<p>The <strong>NVIC (Nested Vectored Interrupt Controller)</strong> is the hardware arbiter. It's built into the ARM Cortex-M core and manages:</p>
<ul>
  <li><strong>Priority</strong>: Lower number = higher priority. Priority 0 is the highest.</li>
  <li><strong>Nesting</strong>: A higher-priority ISR can interrupt a lower-priority ISR mid-execution.</li>
  <li><strong>Enable/Disable</strong>: Each IRQ can be individually enabled or masked.</li>
</ul>
<pre>
// Configure EXTI0 (PA0 button press) ISR
NVIC_SetPriority(EXTI0_IRQn, 2);  // Priority 2
NVIC_EnableIRQ(EXTI0_IRQn);       // Enable it

// Configure UART RX ISR — higher priority (time-critical)
NVIC_SetPriority(USART1_IRQn, 1); // Priority 1 — wins over EXTI0
NVIC_EnableIRQ(USART1_IRQn);
</pre>
<p>The <strong>Vector Table</strong> is an array of ISR addresses stored at the start of flash memory (address 0x08000000 on STM32). When an interrupt fires, the NVIC reads this table to find where to jump.</p>`,
        analogy: "NVIC is an air traffic controller. Multiple planes (interrupts) want to land simultaneously. The controller (NVIC) prioritizes: emergency landing (priority 0) always first, scheduled flights (lower priority) wait.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "UART ISR has priority 1. DMA ISR has priority 3. Both fire at the same time. Which executes first, and can the winner be interrupted by the other?",
          options: [
            "DMA (priority 3 is higher on ARM); UART cannot interrupt it",
            "UART (priority 1 is higher on ARM); DMA ISR waits. DMA cannot preempt UART.",
            "UART (priority 1); DMA can still interrupt it because DMA is hardware",
            "They run simultaneously on different CPU cores"
          ],
          correctIndex: 1,
          hint1: "On ARM Cortex-M, LOWER priority NUMBER = HIGHER urgency. Priority 0 > Priority 1 > Priority 3.",
          hint2: "UART priority 1 beats DMA priority 3. And a lower-priority ISR cannot preempt a higher-priority ISR that's already running.",
          analogyOnFail: "In a race, position 1 wins. Priority 1 = first in line. Priority 3 has to wait.",
          explanation: "ARM Cortex-M NVIC: lower number = higher priority. Priority 1 (UART) executes first. Priority 3 (DMA) waits in pending state until UART ISR completes. DMA cannot preempt UART."
        },
        unlocks: "P2-L5"
      },
      {
        id: "P2-L5",
        title: "Timers — Precise Time Without delay()",
        content: `
<p>Busy-wait delay loops are for prototypes. Real embedded systems use hardware timers.</p>
<p>A hardware timer is a counter driven by the system clock. When it reaches a programmed value, it fires an interrupt — precisely, without wasting CPU cycles.</p>
<pre>
// SysTick — simplest Cortex-M timer (always present)
// Configure SysTick to fire every 1ms (assuming 16MHz clock)
SysTick->LOAD = 16000 - 1;  // Reload value: 16000 ticks = 1ms at 16MHz
SysTick->VAL  = 0;          // Reset current value
SysTick->CTRL = 0x7;        // Enable timer, enable interrupt, use CPU clock

volatile uint32_t ms_tick = 0;

void SysTick_Handler(void) {  // ISR fires every 1ms
    ms_tick++;
}

// Non-blocking delay using tick counter
void delay_ms(uint32_t ms) {
    uint32_t start = ms_tick;
    while ((ms_tick - start) &lt; ms);  // Spin, but only for the period
}
</pre>
<p>General-purpose timers (TIM2–TIM5) support PWM, input capture, output compare — we'll use these in Phase 3.</p>`,
        analogy: "Busy-wait delay = watching a clock tick by the second. Hardware timer = setting a kitchen alarm and doing other tasks until it rings.",
        knowledgeCheck: {
          type: "numeric",
          question: "Your STM32 runs at 84MHz. You want SysTick to fire every 1ms. What value do you load into SysTick->LOAD?",
          answer: 83999,
          tolerance: 1,
          unit: "ticks",
          hint1: "SysTick counts DOWN from LOAD to 0, then fires and reloads. For a 1ms period at 84MHz, how many clock ticks fit in 1ms?",
          hint2: "1ms = 0.001s. Ticks = Time × Frequency = 0.001 × 84,000,000 = 84,000 ticks. But LOAD = ticks − 1 (because the count includes 0).",
          analogyOnFail: "The timer counts 0,1,2...LOAD then resets. For N ticks, LOAD = N−1. Calculate N first: ticks = period × clock_freq.",
          explanation: "84MHz clock → 84,000 ticks per millisecond. SysTick counts from LOAD down to 0 (inclusive), so LOAD = 84000 − 1 = 83999."
        },
        unlocks: "P2-L6"
      },
      {
        id: "P2-L6",
        title: "DMA — Moving Data Without the CPU",
        content: `
<p><strong>DMA (Direct Memory Access)</strong> is a dedicated hardware engine that moves data between memory and peripherals without involving the CPU at all.</p>
<p>Without DMA — UART receive at 115200 baud:</p>
<pre>
// CPU catches EVERY SINGLE BYTE in an interrupt.
// At 115200 baud, that's ~11,520 interrupts/second.
// CPU is constantly interrupted. Other tasks suffer.
void USART1_IRQHandler(void) {
    rx_buffer[idx++] = USART1->DR;  // Interrupt per byte
}
</pre>
<p>With DMA:</p>
<pre>
// Configure DMA to copy UART DR → memory automatically
DMA2_Stream2->NDTR = BUFFER_SIZE;      // How many bytes
DMA2_Stream2->PAR  = (uint32_t)&amp;USART1->DR;  // Source: UART data reg
DMA2_Stream2->M0AR = (uint32_t)rx_buffer;     // Destination: RAM
DMA2_Stream2->CR  |= DMA_SxCR_EN;     // Go

// CPU gets ONE interrupt when the entire buffer is full.
// Zero per-byte interrupts. CPU free to do real work.
</pre>
<p>DMA is mandatory for high-throughput peripherals: ADC, UART, SPI, I2S audio. It's what separates production firmware from hobby projects.</p>`,
        analogy: "Without DMA: the CEO (CPU) personally hand-delivers every package between departments. With DMA: the CEO hires a logistics team (DMA) to handle all transfers. CEO focuses on actual decisions.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "After configuring DMA for UART receive, your buffer consistently contains wrong data — bytes are shifted or garbled. What is the most likely cause?",
          options: [
            "DMA doesn't work with UART",
            "The DMA transfer count (NDTR) is set to 0",
            "You forgot to enable the DMA clock in RCC",
            "The DMA is reading from the UART TX register instead of the RX data register"
          ],
          correctIndex: 2,
          hint1: "Garbled data means the DMA is transferring *something*. If the clock was disabled, it wouldn't transfer at all. Think about the peripheral address.",
          hint2: "UART has separate data registers for TX and RX. If PAR points to the wrong one (TX instead of RX), you get garbage from uninitialized transmit register.",
          analogyOnFail: "The logistics team is running, but they're picking up packages from the outgoing dock instead of the incoming dock. Wrong address specified.",
          explanation: "If PAR (peripheral address register) points to the TX register instead of the RX data register (DR with read access), DMA reads garbage from TX. Double-check the correct register address for receive data."
        },
        unlocks: "P2-L7"
      },
      {
        id: "P2-L7",
        title: "Writing a GPIO Driver — The Professional Way",
        content: `
<p>This is where hobbyist code ends and engineering begins. A proper driver has three layers:</p>
<pre>
/* gpio.h — Hardware Abstraction Header */
#ifndef GPIO_H
#define GPIO_H

#include &lt;stdint.h&gt;

typedef enum { GPIO_MODE_INPUT = 0, GPIO_MODE_OUTPUT = 1,
               GPIO_MODE_AF = 2, GPIO_MODE_ANALOG = 3 } GPIO_Mode_t;
typedef enum { GPIO_PULL_NONE = 0, GPIO_PULL_UP = 1, GPIO_PULL_DOWN = 2 } GPIO_Pull_t;
typedef enum { GPIO_SPEED_LOW = 0, GPIO_SPEED_MEDIUM = 1, GPIO_SPEED_HIGH = 3 } GPIO_Speed_t;

typedef struct {
    GPIO_Mode_t  mode;
    GPIO_Pull_t  pull;
    GPIO_Speed_t speed;
    uint8_t      pin;
} GPIO_Config_t;

void GPIO_Init(volatile uint32_t *gpio_base, const GPIO_Config_t *cfg);
void GPIO_Write(volatile uint32_t *gpio_base, uint8_t pin, uint8_t state);
uint8_t GPIO_Read(volatile uint32_t *gpio_base, uint8_t pin);

#endif
</pre>
<p>Key design principles in this header:</p>
<ul>
  <li><strong>Enums over magic numbers</strong>: <code>GPIO_MODE_OUTPUT</code> instead of raw <code>1</code></li>
  <li><strong>Config struct</strong>: All pin settings in one place, not 5 separate function arguments</li>
  <li><strong>No HAL dependency</strong>: Works on any STM32 with just the base address</li>
  <li><strong>const correctness</strong>: The config is read-only inside Init</li>
</ul>`,
        analogy: "A bad driver is a hotline to the hardware with no checks. A good driver is a formal API with typed contracts — like a legal agreement that prevents misuse.",
        knowledgeCheck: {
          type: "conceptual",
          question: "Why does the GPIO_Init function take `volatile uint32_t *gpio_base` instead of a fixed address like `0x40020000`?",
          requiredKeywords: ["reusable", "port"],
          hint1: "GPIOA, GPIOB, GPIOC all have the same register structure, just different base addresses. What does passing the base address as a parameter allow?",
          hint2: "By accepting a pointer, the same GPIO_Init function works for ALL GPIO ports. You pass 0x40020000 for GPIOA, 0x40020400 for GPIOB, etc. — one driver, all ports.",
          analogyOnFail: "Instead of making a different key for every door, you make one lock design and just pour the door's address into it. Same tool, all doors.",
          explanation: "Passing the base address as a parameter makes the driver port-agnostic. One function handles all GPIO ports (GPIOA–GPIOK) by receiving their different base addresses. Hard-coding 0x40020000 would create a GPIOA-only driver that can't be reused."
        },
        unlocks: "P2-L8"
      },
      {
        id: "P2-L8",
        title: "Phase 2 Capstone — Integrating Everything",
        content: `
<p>You now have all the building blocks. Here's what a complete bare-metal LED blink + button ISR system looks like, using everything from Phase 2:</p>
<pre>
/* main.c — Complete bare-metal LED + Button ISR */
#include &lt;stdint.h&gt;
#include "gpio.h"

#define RCC_AHB1ENR   (*(volatile uint32_t*)0x40023830)
#define EXTI_IMR      (*(volatile uint32_t*)0x40013C00)
#define EXTI_RTSR     (*(volatile uint32_t*)0x40013C08)
#define EXTI_PR       (*(volatile uint32_t*)0x40013C14)

volatile uint8_t button_pressed = 0;

void EXTI0_IRQHandler(void) {
    if (EXTI_PR &amp; (1U &lt;&lt; 0)) {
        button_pressed = 1;      // Set flag — do NOT do work here
        EXTI_PR |= (1U &lt;&lt; 0);  // Clear pending flag
    }
}

int main(void) {
    RCC_AHB1ENR |= (1U &lt;&lt; 0);  // GPIOA clock on

    GPIO_Config_t led_cfg  = {GPIO_MODE_OUTPUT, GPIO_PULL_NONE, GPIO_SPEED_LOW, 5};
    GPIO_Config_t btn_cfg  = {GPIO_MODE_INPUT,  GPIO_PULL_UP,   GPIO_SPEED_LOW, 0};

    GPIO_Init(GPIOA_BASE, &amp;led_cfg);
    GPIO_Init(GPIOA_BASE, &amp;btn_cfg);

    // Configure EXTI0 for PA0, rising edge, enable NVIC
    EXTI_IMR  |= (1U &lt;&lt; 0);
    EXTI_RTSR |= (1U &lt;&lt; 0);
    NVIC_SetPriority(EXTI0_IRQn, 2);
    NVIC_EnableIRQ(EXTI0_IRQn);

    while (1) {
        if (button_pressed) {
            button_pressed = 0;
            GPIO_Write(GPIOA_BASE, 5, 1);  // LED on
            delay_ms(200);
            GPIO_Write(GPIOA_BASE, 5, 0);  // LED off
        }
    }
}
</pre>
<p>This is production-quality Phase 2 code. Every pattern here — clock enable, typed config structs, ISR flag clearing, volatile shared variables — is how real firmware is written.</p>`,
        analogy: "Phase 2 was assembling all the tool skills. This capstone is your first time using all the tools together to build something real.",
        knowledgeCheck: {
          type: "conceptual",
          question: "In the ISR above, why do we only set `button_pressed = 1` instead of directly calling `GPIO_Write()` and `delay_ms()` in the ISR itself?",
          requiredKeywords: ["fast", "blocking", "delay"],
          hint1: "What's the golden rule of ISRs? Think about `delay_ms()` — what does it do to the CPU for 200ms?",
          hint2: "`delay_ms(200)` blocks the CPU for 200ms. If called inside an ISR, no other interrupt can run during that time. ISRs must be fast — set a flag, exit, do work in main.",
          analogyOnFail: "The doorbell handler should note 'someone is at the door' and return. It shouldn't make coffee and have a full conversation at the door while blocking everyone else.",
          explanation: "ISRs must be as short as possible. `delay_ms()` is blocking — the CPU spins for 200ms, preventing any other ISR from running (or running late). The correct pattern: set a flag in ISR, handle the work in main loop where blocking is acceptable."
        },
        unlocks: null  // Phase 2 complete → unlocks Phase 3
      }
    ]
  },

  /* ════════════════════════════════════════════════════════
     PHASE 3 — SILICON COMMUNICATION
     Prerequisites: Phase 2 complete | Unlocks: Phase 4
     ════════════════════════════════════════════════════════ */
  {
    phaseId: 3,
    phaseName: "Silicon Communication",
    phaseSubtitle: "I2C, SPI, UART protocols and bit-banging",
    phaseIcon: "📡",
    totalLessons: 6,
    lessons: [
      {
        id: "P3-L1",
        title: "UART — The Simplest Serial Protocol",
        content: `
<p>UART (Universal Asynchronous Receiver/Transmitter) is the most basic serial protocol. No clock line — both sides agree on speed (baud rate) in advance.</p>
<p><strong>Frame format</strong>: <code>START | 8 data bits | optional parity | STOP</code></p>
<p>Timing is everything. Both sides must be configured to identical baud rate or you get garbage.</p>
<pre>
// Baud rate calculation for STM32 USART
// USARTDIV = f_CLK / (16 × BaudRate)
// At 42MHz APB1 clock, 115200 baud:
// USARTDIV = 42,000,000 / (16 × 115200) = 22.786...
// Integer part = 22, Fractional part = 0.786 × 16 = 12.58 ≈ 13

USART1->BRR = (22 &lt;&lt; 4) | 13;  // Mantissa=22, Fraction=13
USART1->CR1 |= USART_CR1_TE | USART_CR1_RE | USART_CR1_UE;
</pre>
<p>Common UART debugging hardware: connect an FTDI USB-to-UART adapter. TX of MCU → RX of FTDI, RX of MCU → TX of FTDI, GND common.</p>`,
        analogy: "UART is two people agreeing to send one letter per second (baud rate). No handshake needed — just trust that both have the same clock speed. If one person sends faster, you get scrambled words.",
        knowledgeCheck: {
          type: "numeric",
          question: "You're configuring UART at 9600 baud on a 16MHz APB clock. Calculate USARTDIV (mantissa only, integer part of the division result).",
          answer: 104,
          tolerance: 1,
          unit: "",
          hint1: "USARTDIV = f_CLK / (16 × BaudRate). Plug in 16,000,000 and 9600.",
          hint2: "16,000,000 / (16 × 9600) = 16,000,000 / 153,600 = 104.166... → Integer part = 104.",
          analogyOnFail: "Divide total clock speed by (16 × target baud). The integer part goes into the mantissa field of the BRR register.",
          explanation: "USARTDIV = 16,000,000 / (16 × 9600) = 104.166. Mantissa (integer) = 104. Fraction = 0.166 × 16 = 2.66 ≈ 3. BRR = (104 << 4) | 3."
        },
        unlocks: "P3-L2"
      },
      {
        id: "P3-L2",
        title: "I2C — Two Wires, Many Devices",
        content: `
<p>I2C uses only <strong>2 wires</strong>: SDA (data) and SCL (clock). It supports up to 127 devices on the same bus, each with a unique 7-bit address.</p>
<p><strong>Key I2C mechanics:</strong></p>
<ul>
  <li><strong>Open-drain</strong>: Both lines are pulled HIGH by resistors (4.7kΩ typical). Devices pull LOW to assert signals.</li>
  <li><strong>START condition</strong>: SDA goes LOW while SCL is HIGH — only the master generates this.</li>
  <li><strong>Address phase</strong>: Master sends 7-bit device address + R/W bit. Matching slave ACKs (pulls SDA LOW).</li>
  <li><strong>Data transfer</strong>: 8 bits at a time, each followed by ACK/NACK.</li>
  <li><strong>STOP condition</strong>: SDA goes HIGH while SCL is HIGH.</li>
</ul>
<pre>
// Read 1 byte from MPU6050 accelerometer (I2C addr: 0x68)
// Register: ACCEL_XOUT_H (0x3B)

I2C_Start();
I2C_SendAddress(0x68, WRITE);  // Address + Write bit
I2C_SendByte(0x3B);            // Register to read
I2C_RepeatedStart();           // Restart without STOP
I2C_SendAddress(0x68, READ);   // Address + Read bit
uint8_t data = I2C_ReadByte(NACK);  // Read, send NACK to end
I2C_Stop();
</pre>`,
        analogy: "I2C is a meeting room with one chairperson (master) and many attendees (slaves). The chair calls each person by name (address). Only the called person responds. Others stay quiet.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "Your I2C bus is stuck LOW — SCL and SDA are both stuck at 0V and no transactions work. What is the most likely hardware cause?",
          options: [
            "The master sent a STOP condition incorrectly",
            "Pull-up resistors are missing or too high in value",
            "Pull-up resistors are too low in value, shorting the lines to GND effectively",
            "The slave device's address is wrong"
          ],
          correctIndex: 2,
          hint1: "I2C lines are open-drain — devices pull DOWN. The pull-up resistors pull UP to VCC. If resistors are too LOW (say 100Ω), they can't pull the line high enough against a device holding it low.",
          hint2: "Too-low resistors cause excessive current and can't overcome a device holding the line LOW. The bus gets stuck. Common fault when misreading resistor color codes.",
          analogyOnFail: "The spring (pull-up) needs to be strong enough to lift the lever (bus line) back up. If a weight (device) is sitting on it AND the spring is weak — the lever stays down.",
          explanation: "I2C relies on pull-up resistors to restore lines to HIGH. If resistors are too low in value (too strong — low impedance path to VCC vs a device pulling to GND), a device may successfully hold the line LOW regardless. But the more common 'stuck LOW' is a device that crashed mid-transaction holding SDA low — fixed by toggling SCL 9 times."
        },
        unlocks: "P3-L3"
      },
      {
        id: "P3-L3",
        title: "SPI — Full-Duplex at High Speed",
        content: `
<p>SPI (Serial Peripheral Interface) uses 4 wires and is <strong>faster</strong> than I2C. Used for displays, SD cards, high-speed sensors.</p>
<p><strong>4 SPI wires:</strong></p>
<ul>
  <li><code>SCLK</code> — Serial Clock (master generates)</li>
  <li><code>MOSI</code> — Master Out Slave In (master → slave data)</li>
  <li><code>MISO</code> — Master In Slave Out (slave → master data)</li>
  <li><code>CS/NSS</code> — Chip Select (active LOW, one per slave)</li>
</ul>
<p><strong>Full-duplex</strong>: MOSI and MISO transfer simultaneously. While the master sends a command, the slave sends back its current status — same clock cycle.</p>
<pre>
// SPI Mode 0 (CPOL=0, CPHA=0): Clock idle LOW, sample on rising edge
SPI1->CR1 = SPI_CR1_MSTR |        // Master mode
             SPI_CR1_SSM  |        // Software CS management
             SPI_CR1_SSI  |        // Internal SS high
             (0b010 &lt;&lt; 3) |       // Baud = f_CLK/8
             SPI_CR1_SPE;          // Enable SPI

uint8_t spi_transfer(uint8_t data) {
    SPI1->DR = data;               // Transmit
    while (!(SPI1->SR &amp; SPI_SR_RXNE));  // Wait for RX complete
    return (uint8_t)SPI1->DR;      // Return received byte
}
</pre>`,
        analogy: "SPI is a walkie-talkie where both parties can talk and listen simultaneously. I2C is a conference call where only one person can speak at a time (half-duplex). SPI is faster but needs more wires.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You have 3 SPI devices (a display, an SD card, and an accelerometer) on the same bus. How many MOSI/MISO/SCLK lines do you need total?",
          options: [
            "9 lines — 3 MOSI + 3 MISO + 3 SCLK (separate bus per device)",
            "3 lines — shared MOSI, MISO, SCLK; devices talk one at a time via shared CS",
            "4 lines — shared MOSI, MISO, SCLK + one CS for all",
            "6 lines — one per device for MOSI and MISO, shared SCLK"
          ],
          correctIndex: 1,
          hint1: "SPI is a shared bus. All devices share the same 3 signal lines. The master selects which device to talk to using individual Chip Select (CS) lines.",
          hint2: "3 shared lines (MOSI, MISO, SCLK) + 3 individual CS lines (one per device) = 6 wires total. But the question asks about MOSI/MISO/SCLK only.",
          analogyOnFail: "All radio operators share the same frequency (MOSI/MISO/SCLK). The call sign (CS) determines who answers. One frequency, many users.",
          explanation: "SPI is a bus: MOSI, MISO, and SCLK are shared among all devices. Each device gets its own CS line. So 1 MOSI + 1 MISO + 1 SCLK + 3 CS = 6 wires total. Only 3 lines are shared."
        },
        unlocks: "P3-L4"
      },
      {
        id: "P3-L4",
        title: "Bit-Banging — Implementing Protocols in Software",
        content: `
<p>What if your MCU doesn't have a hardware SPI or I2C peripheral? Or you need a protocol on arbitrary GPIO pins? You <strong>bit-bang</strong> it — implement the protocol timing manually in software.</p>
<pre>
// Bit-banged SPI Mode 0 transmit
void spi_bb_transfer(uint8_t byte) {
    for (int8_t bit = 7; bit &gt;= 0; bit--) {
        // Set MOSI before clock rising edge
        if (byte &amp; (1U &lt;&lt; bit)) {
            GPIO_Write(MOSI_PORT, MOSI_PIN, 1);
        } else {
            GPIO_Write(MOSI_PORT, MOSI_PIN, 0);
        }
        GPIO_Write(SCLK_PORT, SCLK_PIN, 1);  // Clock HIGH (rising edge)
        __NOP(); __NOP();                       // Setup time
        GPIO_Write(SCLK_PORT, SCLK_PIN, 0);  // Clock LOW
    }
}
</pre>
<p>Bit-banging downsides:</p>
<ul>
  <li>Speed is limited by CPU — can't match hardware peripheral (typically 10–100× slower)</li>
  <li>Interrupts during bit-bang destroy timing</li>
  <li>Burns CPU cycles on pure I/O</li>
</ul>
<p>Bit-banging teaches you the exact timing of protocols. It's also the debugging tool: if hardware SPI fails, bit-bang it to verify your logic analyzer readings.</p>`,
        analogy: "Bit-banging is playing a song by manually pressing piano keys one at a time. A hardware peripheral is an automated player piano. Same music, very different effort and speed.",
        knowledgeCheck: {
          type: "conceptual",
          question: "When bit-banging I2C, you're in the middle of sending a byte when a timer ISR fires and delays execution by 50µs. What problem does this cause?",
          requiredKeywords: ["timing", "clock", "stretch"],
          hint1: "I2C is clock-synchronous — the slave reads data on SCL edges. If your software-generated SCL timing is interrupted, what happens to the bit timing?",
          hint2: "The 50µs gap between clock edges violates the I2C timing spec. The slave may interpret the timing incorrectly or timeout. The bit you were sending might be corrupted.",
          analogyOnFail: "You're sending Morse code with a flashlight at a precise speed. Someone covers your hand mid-blink for 50ms. The receiver now sees a wrong symbol duration.",
          explanation: "Bit-banging relies on precise software timing. An ISR mid-byte causes SCL to stay LOW longer than the I2C spec allows. The slave may clock-stretch expecting recovery, or simply latch wrong data. Solution: disable interrupts during critical bit-bang sequences, or use hardware I2C."
        },
        unlocks: "P3-L5"
      },
      {
        id: "P3-L5",
        title: "CRC & Data Integrity — Why Serial Data Corrupts",
        content: `
<p>Serial communication is noisy. Voltage spikes, electromagnetic interference, bad connections — bits flip. You need a way to detect corruption.</p>
<p><strong>CRC (Cyclic Redundancy Check)</strong> is the standard. The transmitter runs data through a polynomial division and appends the remainder (CRC value). The receiver does the same computation and checks if the results match.</p>
<pre>
// CRC-8 (simple, used in 1-Wire protocol)
uint8_t crc8(const uint8_t *data, uint8_t len) {
    uint8_t crc = 0;
    for (uint8_t i = 0; i &lt; len; i++) {
        crc ^= data[i];
        for (uint8_t j = 0; j &lt; 8; j++) {
            if (crc &amp; 0x80) {
                crc = (crc &lt;&lt; 1) ^ 0x07;  // Polynomial 0x07 (CRC-8/SMBUS)
            } else {
                crc &lt;&lt;= 1;
            }
        }
    }
    return crc;
}
</pre>
<p>STM32 has a <strong>hardware CRC unit</strong> that computes CRC-32 in one instruction per word — far faster than software loops. Use it for checksums on firmware updates and flash integrity checks.</p>`,
        analogy: "CRC is like a receipt total. After the cashier rings up all items (data bytes), the total (CRC) proves whether any items were misscanned. If your total doesn't match, something was corrupted.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You receive a UART packet with CRC-8. You compute the CRC over the received data and it doesn't match the appended CRC byte. What is the correct action?",
          options: [
            "Use the data anyway — single-bit errors are usually harmless",
            "Request a retransmit / discard the packet and signal an error",
            "Flip the corrupted bits back — you can figure out which ones changed",
            "Accept it and increment an error counter for later analysis"
          ],
          correctIndex: 1,
          hint1: "CRC tells you data is corrupted but NOT which bits are wrong. Can you fix what you can't locate?",
          hint2: "CRC detects errors but cannot correct them (that requires ECC/Hamming codes). The only safe action is discard + retransmit.",
          analogyOnFail: "The receipt total doesn't match. You don't know which item was misscanned. The only fix is to re-ring everything.",
          explanation: "CRC is error detection only, not correction. When CRC fails, the packet must be discarded and a retransmit requested. Using corrupted data in embedded systems can cause incorrect sensor readings, memory corruption, or worse."
        },
        unlocks: "P3-L6"
      },
      {
        id: "P3-L6",
        title: "Logic Analyzers — Seeing the Wire",
        content: `
<p>When a protocol doesn't work, you need to <em>see</em> the actual bits on the wire. That's what a logic analyzer does.</p>
<p>A cheap 8-channel USB logic analyzer (e.g., Saleae clone with PulseView/Sigrok) captures digital signal transitions at high sample rates (24MHz+). It decodes I2C, SPI, UART automatically.</p>
<p><strong>How to debug I2C with a logic analyzer:</strong></p>
<ol>
  <li>Connect CH0 → SDA, CH1 → SCL, GND → circuit GND</li>
  <li>In PulseView: set sample rate to at least 4× your I2C clock (400kHz I2C → 1.6MHz+ sample rate)</li>
  <li>Add I2C protocol decoder, assign SDA and SCL channels</li>
  <li>Trigger on START condition, capture a transaction</li>
  <li>Inspect: correct address? ACK received? Data bytes correct?</li>
</ol>
<p>If no ACK comes back after the address — the slave doesn't exist at that address or isn't powered. If data looks right but behavior is wrong — suspect the register address or bit interpretation.</p>`,
        analogy: "A logic analyzer is an X-ray for your wires. You can see every bit, every timing edge, every ACK — exactly as the hardware sees them. It's the difference between guessing and knowing.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "Your logic analyzer shows the correct I2C address being sent (0x68), but no ACK pulse follows (SDA stays HIGH during the ACK slot). What does this tell you?",
          options: [
            "The master is not generating the clock correctly",
            "No device responded — the slave at 0x68 is not present or not powered",
            "The ACK was too fast for the logic analyzer to capture",
            "The pull-up resistors are too strong and suppressing the ACK"
          ],
          correctIndex: 1,
          hint1: "ACK is generated by the *slave* by pulling SDA LOW during the 9th clock pulse. If SDA stays HIGH, what does that mean about the slave?",
          hint2: "No ACK = slave didn't respond. Either wrong address, slave not powered, or slave crashed. First check: is VCC on the device? Second: scan for device with I2C scanner firmware.",
          analogyOnFail: "You called someone's name (sent the address). No response. Either they're not there, they're asleep, or you said the wrong name.",
          explanation: "In I2C, the slave generates ACK by pulling SDA LOW during clock pulse 9. If SDA stays HIGH (no pull-down from slave), the slave is not responding to that address — it's absent, unpowered, or broken."
        },
        unlocks: null  // Phase 3 complete → unlocks Phase 4
      }
    ]
  },

  /* ════════════════════════════════════════════════════════
     PHASE 4 — ORCHESTRATION
     Prerequisites: Phase 3 complete | Unlocks: Phase 5
     ════════════════════════════════════════════════════════ */
  {
    phaseId: 4,
    phaseName: "Orchestration",
    phaseSubtitle: "FreeRTOS, DMA, memory management",
    phaseIcon: "🎼",
    totalLessons: 6,
    lessons: [
      {
        id: "P4-L1",
        title: "Why RTOS? The Problem with While(1)",
        content: `
<p>Your bare-metal <code>while(1)</code> loop works fine for one task. What about 10?</p>
<pre>
// Bad: "scheduler" in a single loop
while(1) {
    read_sensors();   // Takes 50ms
    update_display(); // Takes 30ms
    check_uart();     // Must respond within 1ms — TOO LATE.
    control_motor();  // Timing-critical — inconsistent.
}
</pre>
<p>The UART check only runs every 80ms+. For a 9600 baud UART, you'll lose bytes. Motor control timing jitters by ±80ms. This is a scheduling disaster.</p>
<p>An <strong>RTOS (Real-Time Operating System)</strong> solves this by giving each task its own execution context (stack) and scheduling them based on <strong>priority</strong> and <strong>timing</strong>.</p>
<ul>
  <li>High-priority task (UART RX): preempts everything, runs within 1ms</li>
  <li>Medium-priority task (motor control): runs every 10ms, precise</li>
  <li>Low-priority task (display update): runs whenever CPU is free</li>
</ul>
<p>FreeRTOS is the most widely deployed RTOS in embedded systems. It's free, open-source, and supported on ARM Cortex-M natively.</p>`,
        analogy: "A single while(1) loop is one chef doing everything sequentially. An RTOS is a kitchen with a head chef (scheduler) who assigns tasks to multiple cooks based on urgency. The head chef ensures the urgent soufflé doesn't collapse while the dishwasher waits.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "In FreeRTOS, Task A (priority 3) is running. Task B (priority 1 — higher) becomes ready. What happens?",
          options: [
            "Task A finishes its current operation, then Task B runs",
            "Task B immediately preempts Task A — Task A is suspended",
            "Both run simultaneously on the same core",
            "Task B waits until the next tick interrupt"
          ],
          correctIndex: 1,
          hint1: "FreeRTOS is preemptive by default. 'Preemptive' means the scheduler can stop a running task mid-execution to run a higher priority one.",
          hint2: "Priority 1 > Priority 3 in FreeRTOS (lower number = higher priority). Task B is higher priority and ready — it preempts Task A immediately.",
          analogyOnFail: "A 911 call (Task B, priority 1) comes in while the dispatcher handles a parking complaint (Task A, priority 3). The 911 call instantly takes over. The parking call is put on hold.",
          explanation: "FreeRTOS uses preemptive scheduling. When a higher-priority task becomes ready, the scheduler immediately context-switches: Task A's state is saved, Task B runs. Task A resumes only when Task B blocks or completes."
        },
        unlocks: "P4-L2"
      },
      {
        id: "P4-L2",
        title: "Tasks, Stacks & the Context Switch",
        content: `
<pre>
// FreeRTOS task creation
void vUartTask(void *pvParams) {
    while(1) {
        // Block on queue — consumes no CPU while waiting
        uint8_t byte;
        if (xQueueReceive(uart_queue, &amp;byte, portMAX_DELAY) == pdTRUE) {
            process_byte(byte);
        }
    }
}

void vSensorTask(void *pvParams) {
    TickType_t xLastWake = xTaskGetTickCount();
    while(1) {
        read_i2c_sensor();
        vTaskDelayUntil(&amp;xLastWake, pdMS_TO_TICKS(10)); // Run every 10ms
    }
}

int main(void) {
    xTaskCreate(vUartTask,   "UART",   256, NULL, 2, NULL);
    xTaskCreate(vSensorTask, "Sensor", 512, NULL, 1, NULL);
    vTaskStartScheduler();  // Hand control to FreeRTOS — never returns
}
</pre>
<p>Each task has its own <strong>stack</strong> (256 or 512 words above). The scheduler saves the CPU's registers (context) when switching tasks. The next task resumes exactly where it left off.</p>
<p>Stack sizing is critical: too small → stack overflow → crash. Use <code>uxTaskGetStackHighWaterMark()</code> to measure actual stack usage during development.</p>`,
        analogy: "Each FreeRTOS task is a worker with their own desk and personal notes (stack). When the manager (scheduler) switches workers, each worker's desk state is preserved exactly. When they come back, everything is where they left it.",
        knowledgeCheck: {
          type: "conceptual",
          question: "Your FreeRTOS application crashes randomly after ~1 hour of operation. Stack High Water Mark shows vSensorTask has 0 words remaining. What is happening and what do you fix?",
          requiredKeywords: ["overflow", "stack", "size"],
          hint1: "High Water Mark of 0 means the task has used ALL its allocated stack. What happens when a task needs more stack than allocated?",
          hint2: "Stack overflow corrupts adjacent memory — usually another task's stack or heap. The corruption manifests as random crashes. Fix: increase the stack size in xTaskCreate (3rd parameter).",
          analogyOnFail: "The worker's desk is completely full — papers falling off. The overflow lands on the next worker's desk, corrupting their work. The solution: give the first worker a bigger desk.",
          explanation: "Stack overflow occurs when a task exhausts its allocated stack. Stack grows into adjacent memory (another task stack, heap, or critical data), causing corruption and eventually random crashes. Fix: increase stack size in xTaskCreate, or reduce local variable usage in the task."
        },
        unlocks: "P4-L3"
      },
      {
        id: "P4-L3",
        title: "Queues — Safe Inter-Task Communication",
        content: `
<p>Never share a raw global variable between FreeRTOS tasks. You'll get race conditions. Use a <strong>Queue</strong>.</p>
<p>A queue is a thread-safe FIFO buffer. Tasks can send and receive without race conditions — FreeRTOS handles all the locking internally.</p>
<pre>
QueueHandle_t sensor_queue;

void vISR_Task(void *p) {  // High priority — processes ISR events
    SensorData_t data;
    while(1) {
        // BLOCKING: suspends this task until data arrives
        xQueueReceive(sensor_queue, &amp;data, portMAX_DELAY);
        process_sensor_data(&amp;data);
    }
}

// In the UART ISR (interrupt context):
void USART1_IRQHandler(void) {
    SensorData_t data = read_sensor_registers();
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;

    // FromISR variant — must be used in interrupt context
    xQueueSendFromISR(sensor_queue, &amp;data, &amp;xHigherPriorityTaskWoken);

    // If a higher-priority task was unblocked, yield to it immediately
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}
</pre>
<p><strong>Critical rule</strong>: Always use <code>FromISR</code> variants of FreeRTOS APIs inside ISRs. Using the regular versions inside an ISR will crash your system.</p>`,
        analogy: "A queue is a conveyor belt between two workers. Worker A puts items on one end, Worker B picks them up from the other. They never collide — the belt handles the synchronization.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "Inside a FreeRTOS ISR, you accidentally call `xQueueSend()` instead of `xQueueSendFromISR()`. What is most likely to happen?",
          options: [
            "Nothing — FreeRTOS auto-detects ISR context and adjusts",
            "The data won't be sent but execution continues normally",
            "System crash or hang — the regular API tries to enter a critical section not valid in ISR context",
            "The queue sends successfully but with higher latency"
          ],
          correctIndex: 2,
          hint1: "`xQueueSend()` may internally call `taskENTER_CRITICAL()` which uses `basepri` masking. In ISR context, this interaction with the scheduler is undefined behavior.",
          hint2: "The regular FreeRTOS APIs can block. Blocking inside an ISR is illegal — the ISR has no task context to block on. This causes the scheduler to corrupt its internal state.",
          analogyOnFail: "It's like trying to fall asleep (block) while standing at attention (ISR). The body doesn't work that way. The result: you fall over (crash).",
          explanation: "FreeRTOS ISR-safe APIs (`FromISR`) never block and use different internal mechanisms. Regular APIs may attempt to block or interact with the scheduler in ways that corrupt state when called from ISR context. This causes unpredictable crashes or hangs."
        },
        unlocks: "P4-L4"
      },
      {
        id: "P4-L4",
        title: "Mutexes & Priority Inversion",
        content: `
<p>Two tasks share a resource (e.g., an SPI bus, a shared buffer). Without a mutex, they'll corrupt each other's data.</p>
<pre>
SemaphoreHandle_t spi_mutex;

void Task_Sensor(void *p) {  // Priority 2
    while(1) {
        xSemaphoreTake(spi_mutex, portMAX_DELAY);  // Lock SPI bus
        spi_read_sensor();
        xSemaphoreGive(spi_mutex);                  // Release
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

void Task_Display(void *p) {  // Priority 2
    while(1) {
        xSemaphoreTake(spi_mutex, portMAX_DELAY);
        spi_update_display();
        xSemaphoreGive(spi_mutex);
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}
</pre>
<p><strong>Priority Inversion</strong> (the classic RTOS bug): Low-priority task L holds mutex. High-priority task H wants the same mutex and blocks. Medium-priority task M (doesn't need mutex) preempts L — now M runs indefinitely and H (highest priority!) is stuck waiting on L, which can't run because M is ahead of it. H is effectively at the lowest priority.</p>
<p>Fix: <strong>Priority Inheritance Mutex</strong> — FreeRTOS temporarily raises L's priority to H's level so it can finish and release. Use <code>xSemaphoreCreateMutex()</code> (not binary semaphore) for priority inheritance.</p>`,
        analogy: "Priority inversion: a VIP (high priority) is blocked waiting for a regular employee (low priority) who is stuck behind an intern (medium priority) who grabbed the meeting room. The intern is now running the company's schedule by accident.",
        knowledgeCheck: {
          type: "conceptual",
          question: "A binary semaphore and a mutex both provide mutual exclusion. Name one specific scenario where you MUST use a mutex instead of a binary semaphore.",
          requiredKeywords: ["priority", "inversion", "inheritance"],
          hint1: "The difference between binary semaphore and mutex in FreeRTOS is one feature that semaphores lack. What problem does that feature solve?",
          hint2: "Mutexes provide priority inheritance. Binary semaphores do not. Use a mutex when you have tasks of different priorities competing for the same resource — otherwise priority inversion can occur.",
          analogyOnFail: "A binary semaphore is a basic key — it blocks access. A mutex is a key with a VIP-escalation policy: if a VIP is waiting, the key holder gets VIP access to finish faster. Use the VIP key when VIPs are involved.",
          explanation: "When tasks of different priorities compete for a resource, use a FreeRTOS mutex (not binary semaphore). Mutexes implement priority inheritance — FreeRTOS temporarily raises the holding task's priority to match the highest-priority waiter, preventing priority inversion."
        },
        unlocks: "P4-L5"
      },
      {
        id: "P4-L5",
        title: "Memory Management — heap_1 through heap_5",
        content: `
<p>FreeRTOS provides 5 heap implementations for different use cases. Choosing the wrong one is a production risk.</p>
<table style="width:100%; border-collapse:collapse; font-size:13px; margin: 12px 0;">
  <tr style="border-bottom:1px solid #1a2f45;">
    <th style="text-align:left; padding:8px; color:#00D4FF;">Scheme</th>
    <th style="text-align:left; padding:8px; color:#00D4FF;">Allows Free?</th>
    <th style="text-align:left; padding:8px; color:#00D4FF;">Fragmentation?</th>
    <th style="text-align:left; padding:8px; color:#00D4FF;">Use When</th>
  </tr>
  <tr><td style="padding:8px">heap_1</td><td style="padding:8px">No</td><td style="padding:8px">None</td><td style="padding:8px">Allocate at startup only, never free</td></tr>
  <tr><td style="padding:8px">heap_2</td><td style="padding:8px">Yes</td><td style="padding:8px">Yes</td><td style="padding:8px">Fixed-size allocations (legacy, avoid)</td></tr>
  <tr><td style="padding:8px">heap_3</td><td style="padding:8px">Yes</td><td style="padding:8px">Yes</td><td style="padding:8px">Wraps standard malloc (not deterministic)</td></tr>
  <tr><td style="padding:8px">heap_4</td><td style="padding:8px">Yes</td><td style="padding:8px">Coalesced (less)</td><td style="padding:8px">General use — merges adjacent free blocks</td></tr>
  <tr><td style="padding:8px">heap_5</td><td style="padding:8px">Yes</td><td style="padding:8px">Coalesced</td><td style="padding:8px">Multiple non-contiguous memory regions</td></tr>
</table>
<p><strong>Production rule</strong>: On most bare-metal systems, allocate everything at startup (tasks, queues, semaphores) and never call <code>pvPortMalloc</code> again during runtime. This eliminates fragmentation and makes memory usage deterministic.</p>`,
        analogy: "heap_1 is a parking lot where cars park and never leave. heap_4 is a smart parking system that merges empty spaces. For safety-critical systems: use heap_1 — full at startup, stable forever.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You're designing firmware for an automotive ECU (safety-critical). You need to create FreeRTOS tasks and queues. Which heap scheme should you choose and why?",
          options: [
            "heap_3 — uses standard malloc which is well-tested and reliable",
            "heap_4 — allows dynamic allocation with coalescing for general use",
            "heap_1 — allocate at startup only, no fragmentation, deterministic",
            "heap_5 — best for multiple memory regions on complex SoCs"
          ],
          correctIndex: 2,
          hint1: "Safety-critical systems (ISO 26262) require deterministic behavior. What does dynamic memory allocation at runtime introduce?",
          hint2: "Runtime dynamic allocation can fail (out of memory) and causes fragmentation. For safety-critical: allocate ALL resources at startup (heap_1), verify they all succeed, then run forever with no dynamic allocation.",
          analogyOnFail: "An airplane doesn't hot-swap its engine during flight. Everything is verified on the ground before takeoff. heap_1 is the 'verify everything before takeoff' approach.",
          explanation: "heap_1 is the correct choice for safety-critical systems. It allocates memory but never frees it. All FreeRTOS objects (tasks, queues, semaphores) are created at startup. If startup succeeds, the system has everything it needs and will never have a runtime memory failure."
        },
        unlocks: "P4-L6"
      },
      {
        id: "P4-L6",
        title: "FreeRTOS Debugging — Stack Overflow & Runtime Stats",
        content: `
<p>FreeRTOS ships with powerful diagnostic hooks. Enable them in <code>FreeRTOSConfig.h</code>:</p>
<pre>
// FreeRTOSConfig.h
#define configCHECK_FOR_STACK_OVERFLOW    2  // Check on every context switch
#define configUSE_TRACE_FACILITY          1
#define configGENERATE_RUN_TIME_STATS     1

// You MUST implement this hook:
void vApplicationStackOverflowHook(TaskHandle_t xTask, char *pcTaskName) {
    // Called when stack overflow is detected
    // Log pcTaskName, assert, or halt safely
    __disable_irq();
    while(1);  // Halt — inspect with debugger
}
</pre>
<p>Runtime stats — see CPU usage per task:</p>
<pre>
char stats_buf[512];
vTaskGetRunTimeStats(stats_buf);
// Output:
// Task        Abs Time    % Time
// UART        12345       45%
// Sensor      8901        32%
// IDLE        6789        23%
</pre>
<p>If IDLE task has 0% time — your system is 100% CPU loaded. Time to optimize or add hardware.</p>`,
        analogy: "FreeRTOS runtime stats is a factory floor efficiency report. You see which worker is taking 80% of the shift. IDLE at 0% means the factory is at full capacity — something needs to change.",
        knowledgeCheck: {
          type: "conceptual",
          question: "Runtime stats show your 'Sensor' task consuming 95% CPU time. The task calls `vTaskDelay(pdMS_TO_TICKS(10))` every loop. What's likely wrong?",
          requiredKeywords: ["delay", "blocking", "cpu"],
          hint1: "`vTaskDelay(10ms)` should yield the CPU for 10ms, making CPU usage very low. If it's at 95%, the delay isn't working or the actual work takes far more than expected.",
          hint2: "Check: is `vTaskDelay` being called? Is the sensor I2C read blocking in a tight retry loop? Is there a bug causing the delay to be skipped? 95% CPU from a 10ms-delayed task means the task spends almost no time actually blocked.",
          analogyOnFail: "You told the worker to take a 10-minute break every cycle. But they're working 95% of the time. Either the break isn't happening, or the work between breaks takes 9.5 minutes instead of 0.5.",
          explanation: "If vTaskDelay(10ms) is working, the task should use ~(work_time / 10ms) × 100% CPU. At 95%, either the I2C sensor read is taking ~9.5ms (likely stuck in polling loop), the delay is being bypassed, or there's a bug where the loop runs without delaying."
        },
        unlocks: null  // Phase 4 complete → unlocks Phase 5
      }
    ]
  },

  /* ════════════════════════════════════════════════════════
     PHASE 5 — PRO-LEVEL ARCHITECTURE
     Prerequisites: Phase 4 complete | Unlocks: Graduation
     ════════════════════════════════════════════════════════ */
  {
    phaseId: 5,
    phaseName: "Pro-Level Architecture",
    phaseSubtitle: "HAL design, PCB concepts, sensor fusion",
    phaseIcon: "🏗️",
    totalLessons: 4,
    lessons: [
      {
        id: "P5-L1",
        title: "Hardware Abstraction Layers — Designing for Portability",
        content: `
<p>A HAL (Hardware Abstraction Layer) is the architecture that lets your application code run on different hardware without changes.</p>
<pre>
/* Without HAL — tied to STM32 forever */
void read_temperature(void) {
    I2C1->CR1 |= I2C_CR1_START;       // STM32-specific
    I2C1->DR = (TEMP_ADDR &lt;&lt; 1);     // STM32-specific
    // ...
}

/* With HAL — portable */
// hal_i2c.h (the contract)
typedef struct {
    HAL_Status (*init)(void *handle, uint32_t speed);
    HAL_Status (*write)(void *handle, uint8_t addr, const uint8_t *buf, uint16_t len);
    HAL_Status (*read)(void *handle, uint8_t addr, uint8_t *buf, uint16_t len);
} HAL_I2C_Driver_t;

// Application code uses only the HAL
void read_temperature(HAL_I2C_Driver_t *drv, void *handle) {
    uint8_t cmd = TEMP_REG;
    drv->write(handle, TEMP_ADDR, &amp;cmd, 1);
    drv->read(handle, TEMP_ADDR, raw_data, 2);
}
// Switching from STM32 to NXP? Implement a new HAL backend. App unchanged.
</pre>
<p>This is the architecture pattern inside Zephyr RTOS, embedded Linux kernel drivers, and every production embedded codebase worth maintaining.</p>`,
        analogy: "A HAL is a universal power adapter. Your device (application) always uses the same plug shape. The adapter (HAL backend) handles whatever wall socket (hardware) you're in front of.",
        knowledgeCheck: {
          type: "conceptual",
          question: "Your company is porting firmware from STM32F4 to NXP i.MX RT. You have a properly designed HAL. What files need to change, and what files stay the same?",
          requiredKeywords: ["backend", "application"],
          hint1: "The HAL has two layers: the interface (abstract contract) and the backend (hardware-specific implementation). Which layer is hardware-specific?",
          hint2: "Only the HAL backend implementation files change — they implement the same HAL_I2C_Driver_t interface but using NXP's registers instead of STM32's. The application code and HAL header files are untouched.",
          analogyOnFail: "Switching the power adapter insert (backend) but keeping the same device plug (application interface). You change the wall-facing side, not the device-facing side.",
          explanation: "Only the HAL backend (hardware-specific implementation files, e.g., `stm32_i2c.c` → `nxp_i2c.c`) needs to change. The HAL interface headers and all application code remain identical. This is the core value of a properly designed HAL."
        },
        unlocks: "P5-L2"
      },
      {
        id: "P5-L2",
        title: "PCB Design Concepts — From Breadboard to Production",
        content: `
<p>Breadboards are for prototyping. Production embedded systems use custom PCBs. Here's the critical concepts:</p>
<p><strong>Decoupling Capacitors</strong>: Every IC power pin needs a 100nF ceramic capacitor as close as possible to the pin. High-frequency switching causes voltage spikes on VCC. The capacitor absorbs these spikes before they reach the IC.</p>
<p><strong>Ground Plane</strong>: A solid copper fill on the GND layer reduces noise and provides a low-impedance return path for all signals.</p>
<p><strong>Trace Impedance</strong>: High-speed signals (SPI > 10MHz, USB, Ethernet) require controlled impedance traces (typically 50Ω for single-ended). Impedance mismatch causes signal reflections and data corruption.</p>
<p><strong>Power Integrity</strong>: Your 3.3V rail must stay within ±5% under all load conditions. This requires proper bulk capacitors (10µF-100µF), decoupling caps, and voltage regulator selection.</p>
<pre>
// PCB Design Rule of Thumb for Digital Systems:
// - Decoupling cap: 100nF per VCC pin, as close as possible
// - Bulk cap: 10µF per 100mA of load current
// - Ground plane: mandatory for any signal > 1MHz
// - Crystal: short traces, guard ring, away from switching nodes
</pre>`,
        analogy: "A decoupling capacitor is a small local reservoir next to a factory machine. When the machine suddenly needs a burst of power, the reservoir provides it instantly — before the main water tower (bulk cap/regulator) can respond.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You're routing a 40MHz SPI clock trace. Your PCB manufacturer's stackup gives you a 50Ω characteristic impedance for a specific trace width. Why does matching this impedance matter?",
          options: [
            "It doesn't matter at 40MHz — impedance matching is only for RF circuits above 1GHz",
            "Impedance mismatch causes signal reflections — the reflected wave combines with the original, creating voltage glitches that look like spurious clock edges",
            "The trace will overheat if impedance is wrong",
            "Impedance matching reduces latency by making signals travel faster"
          ],
          correctIndex: 1,
          hint1: "When a signal hits an impedance discontinuity (wrong trace width, via, connector), part of the signal energy reflects back. At 40MHz, signal wavelength is ~7.5m — but the rise time of a digital edge is much shorter, causing issues at shorter distances.",
          hint2: "Reflected waves overlay the original signal, causing ringing and overshoot. At the receiver, these voltage spikes can be interpreted as false clock edges or data bit errors.",
          analogyOnFail: "Throwing a ball against a wall at the wrong angle bounces it back erratically. Signal reflections are the electrical equivalent — the bounce energy corrupts the original signal.",
          explanation: "At 40MHz with fast rise times, signal reflections from impedance mismatches create ringing that can corrupt data. 50Ω impedance matching between driver, trace, and receiver prevents reflections. This is why high-speed PCB design requires controlled impedance traces."
        },
        unlocks: "P5-L3"
      },
      {
        id: "P5-L3",
        title: "Sensor Fusion — Combining Imperfect Sensors",
        content: `
<p>Individual sensors are noisy, biased, and drift over time. <strong>Sensor fusion</strong> combines multiple sensors to produce a better estimate than any single one.</p>
<p>Classic example: IMU orientation (phone tilt, drone attitude).</p>
<ul>
  <li><strong>Accelerometer</strong>: Accurate long-term (gravity reference), but noisy short-term and picks up vibration.</li>
  <li><strong>Gyroscope</strong>: Accurate short-term (fast, smooth), but drifts over time (integrates noise).</li>
  <li><strong>Fusion result</strong>: Use gyroscope for fast changes, correct drift with accelerometer. Best of both.</li>
</ul>
<p>The standard algorithm: <strong>Complementary Filter</strong> (simple) or <strong>Kalman Filter</strong> (optimal).</p>
<pre>
// Complementary filter for roll angle
// alpha = trust factor: 0.98 = trust gyro 98%, accel 2%
float alpha = 0.98f;
float dt    = 0.01f;  // 10ms sample period

void update_angle(float *angle, float gyro_rate, float accel_angle) {
    // Integrate gyro (fast, accurate short-term)
    float gyro_contribution = *angle + gyro_rate * dt;

    // Blend with accelerometer (slow, accurate long-term)
    *angle = alpha * gyro_contribution + (1.0f - alpha) * accel_angle;
}
</pre>`,
        analogy: "A gyroscope is an expert who's very accurate right now but drifts over time (forgets where north is). An accelerometer is an old-timer who's slow to react but always knows which way is down. Combined: fast and accurate.",
        knowledgeCheck: {
          type: "multiple-choice",
          question: "You set alpha = 0.99 in the complementary filter. Your drone's orientation estimate now drifts noticeably after 30 seconds of flight. What should you change?",
          options: [
            "Increase alpha to 0.999 — trust the gyro even more",
            "Decrease alpha (e.g., 0.95) — give more weight to the accelerometer to correct drift",
            "Decrease dt — sample faster to reduce drift",
            "Use a different sensor — the gyroscope must be faulty"
          ],
          correctIndex: 1,
          hint1: "alpha = 0.99 means 99% gyroscope, 1% accelerometer. The gyroscope drifts over time. At 99%, the accelerometer barely corrects for drift. What direction do you move alpha?",
          hint2: "Lower alpha = more accelerometer influence = more drift correction. Typical values are 0.95–0.98. Going to 0.999 would make drift WORSE, not better.",
          analogyOnFail: "You trusted the drifting expert (gyro) at 99%. The old-timer (accel) who knows which way is down only gets 1% say. Let the old-timer have more say (lower alpha) to fix the drift.",
          explanation: "alpha = 0.99 trusts the gyroscope 99% and accelerometer 1%. Since gyroscopes drift, the 1% accelerometer correction is insufficient. Lower alpha to 0.95 gives accelerometer 5% weight — enough to continuously correct gyroscope drift while still tracking fast movements smoothly."
        },
        unlocks: "P5-L4"
      },
      {
        id: "P5-L4",
        title: "Production Firmware — Watchdog, Bootloaders & OTA",
        content: `
<p>Field-deployed firmware must survive crashes, power loss, and updates. Three mechanisms handle this:</p>
<p><strong>Watchdog Timer (IWDG)</strong>: Hardware timer that resets the MCU if software doesn't "kick" it within a timeout. Your main loop must pet it regularly. If the firmware hangs (deadlock, infinite loop), the watchdog fires and resets the system.</p>
<pre>
// IWDG: independent watchdog (uses its own LSI clock — survives software faults)
IWDG->KR  = 0xCCCC;  // Start IWDG
IWDG->KR  = 0x5555;  // Enable write to PR and RLR
IWDG->PR  = 0x04;    // Prescaler: divide by 64
IWDG->RLR = 0xFFF;   // Reload value: ~4 seconds timeout
IWDG->KR  = 0xAAAA;  // Reload counter (pet the dog)
// In main loop: IWDG->KR = 0xAAAA; every &lt;4 seconds
</pre>
<p><strong>Bootloader</strong>: A small piece of firmware at the start of flash that checks for update signals before jumping to the main application. Enables field updates without physical access.</p>
<p><strong>OTA (Over-The-Air) Update</strong>: Receive new firmware via UART, BLE, WiFi → write to backup flash partition → bootloader validates CRC → switches to new firmware. Always use dual-bank flash for safe OTA (fallback if update is corrupt).</p>`,
        analogy: "Watchdog = a supervisor who checks in on the worker every 4 seconds. Worker not responding? Supervisor hits the reset button. Bootloader = the building's reception that checks for delivery (firmware update) before letting you into your office.",
        knowledgeCheck: {
          type: "conceptual",
          question: "Your OTA update successfully writes new firmware to the backup flash partition. The bootloader switches to it and the device boots. The new firmware has a bug and immediately crashes on startup. What must your bootloader have done to prevent a permanently bricked device?",
          requiredKeywords: ["fallback", "crc", "previous"],
          hint1: "If new firmware crashes on every boot, and the bootloader always jumps to it, the device is permanently bricked. What mechanism prevents always jumping to bad firmware?",
          hint2: "The bootloader must validate the new firmware (CRC check) before committing. If the new firmware fails N consecutive boot attempts, the bootloader must fall back to the previous working firmware partition.",
          analogyOnFail: "Updating your phone's OS while on a phone call, and if it crashes during boot, you need it to automatically reinstall the previous OS — not stay in a crash loop forever.",
          explanation: "A robust OTA bootloader must: 1) Verify new firmware CRC before booting it. 2) Track boot attempt count. 3) If the new firmware fails to boot N times (or doesn't mark itself 'valid'), fall back to the previous partition. Dual-bank flash keeps the old firmware intact until the new one proves itself operational."
        },
        unlocks: null  // Phase 5 complete → GRADUATION
      }
    ]
  }
];

// ── Helper: Flatten all lessons across phases ──────────────
function getAllLessons() {
  return CURRICULUM.flatMap(phase => phase.lessons);
}

function getLessonById(id) {
  return getAllLessons().find(l => l.id === id);
}

function getPhaseById(phaseId) {
  return CURRICULUM.find(p => p.phaseId === phaseId);
}

function getTotalLessons() {
  return getAllLessons().length;
}
