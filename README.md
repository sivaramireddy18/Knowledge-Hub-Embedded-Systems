# Knowledge Hub — Embedded Systems 🚀

## Interactive Embedded Systems Learning Platform

**A browser-first engineering workspace for learning embedded systems from fundamentals to production-oriented firmware, Linux and validation.**

Knowledge Hub is an evolving educational platform built around a practical learning loop:

```text
Learn → Understand → Practice → Experiment → Debug → Validate → Interview
```

The repository currently contains a static web application with an interactive tutor, curriculum engine, dashboard, sandbox and career/interview features.

---

## 🎯 Project Vision

The goal is to build a serious embedded-systems learning environment rather than another collection of static tutorials.

The platform is intended to help a learner progress through:

- Electronics and embedded fundamentals
- Embedded C
- MCU architecture
- Registers and memory
- GPIO, timers and interrupts
- Communication protocols
- Firmware architecture
- Embedded Linux
- Debugging and validation
- Interview preparation
- Career-oriented engineering practice

The long-term direction is to connect **structured learning → interactive simulation → real hardware labs → validation methodology**.

---

## 🧩 Current Application

The current repository is a browser-based application built with HTML, CSS and JavaScript. Its main entry point launches an **Antigravity Embedded Tutor** experience. The application includes separate tutor, dashboard and sandbox pages. fileciteturn60file0

### Main capabilities

- Interactive embedded-systems tutor
- Phase-based curriculum
- Knowledge checks
- Hardware-kit selection
- Progress tracking
- Career coaching
- Interview preparation
- Job-readiness scoring
- Salary/career intelligence UI
- Interactive coding/sandbox area
- Learning dashboard
- Local browser session/progress persistence

The boot screen describes a 32-lesson, multi-phase career-training experience with MNC interview preparation and career intelligence. fileciteturn61file0

---

## 🗺️ Learning Architecture

The curriculum is organized as progressive engineering phases rather than isolated topics.

```text
Phase 1
Ground Control
    ↓
Phase 2
Remove Training Wheels
    ↓
Phase 3
Silicon Communication
    ↓
Phase 4
Orchestration
    ↓
Phase 5
Pro Architecture
    ↓
Phase 6
Industrial IoT Gateway
```

The tutor interface exposes phase navigation, lesson progress, knowledge checks and career readiness alongside the learning conversation. fileciteturn62file0

> Note: the repository is actively evolving. Phase names, lesson counts and implementation status may change as the curriculum is expanded.

---

## 🔬 Technical Learning Areas

### 1. Embedded Fundamentals

- Electrical fundamentals
- Digital logic
- MCU vs MPU
- Memory and registers
- GPIO
- Timers
- Interrupts
- DMA

### 2. Embedded C

- Data types
- Pointers
- Arrays
- Structures and unions
- Bit manipulation
- `const` / `volatile`
- Memory layout
- Linker concepts
- Compilation and build flow
- Embedded coding patterns

### 3. MCU / ARM

- ARM Cortex-M architecture
- Exception model
- NVIC
- Interrupt handling
- Memory-mapped peripherals
- Startup code
- Bare-metal programming
- Debugging

### 4. Communication Protocols

- UART
- I2C
- SPI
- CAN
- USB
- Protocol timing and waveforms
- Error conditions
- Debugging with analyzers

### 5. Embedded Linux

- Linux boot flow
- U-Boot
- Device Tree
- Kernel architecture
- Kernel modules
- Linux Device Drivers
- I2C/SPI/UART drivers
- User/kernel interfaces
- Debugging

### 6. Firmware Architecture

- State machines
- Driver abstraction
- HAL concepts
- RTOS concepts
- FreeRTOS
- Scheduling
- Synchronization
- Inter-task communication
- Production firmware design

### 7. Validation & Debugging

- Test-case design
- Functional validation
- Register validation
- Boundary testing
- Failure injection
- Root-cause analysis
- Oscilloscope usage
- Logic analyzer usage
- Protocol analyzer usage
- JTAG / debugger workflows

### 8. Career / Interview Preparation

- Embedded C interview questions
- ARM / MCU questions
- Linux driver questions
- Protocol questions
- Debugging scenarios
- System-design discussions
- MNC-oriented interview practice
- Job-readiness tracking

---

## 🖥️ Application Pages

### `index.html`

Boot / entry screen for the tutor application. It initializes the tutor experience and provides a returning-student path when a previous local session exists. fileciteturn61file0

### `tutor.html`

Main learning workspace containing:

- Hardware kit selection
- Curriculum phase navigation
- Lesson progress
- Tutor conversation
- Knowledge checks
- Interactive sandbox link
- Career dashboard link
- Interview practice
- Job-readiness score

fileciteturn62file0

### `dashboard.html`

Career and learning dashboard.

### `sandbox.html`

Interactive experimentation area intended to support practical learning and simulation.

---

## 📁 Repository Structure

```text
Knowledge-Hub-Embedded-Systems/
│
├── index.html              # Tutor boot / entry screen
├── tutor.html              # Main tutor workspace
├── dashboard.html          # Progress / career dashboard
├── sandbox.html            # Interactive experimentation area
│
├── js/
│   ├── curriculum-data.js  # Curriculum definitions
│   ├── tutor-persona.js    # Tutor behavior
│   ├── tutor-engine.js     # Learning engine
│   ├── tutor-chat.js       # Chat interaction
│   ├── knowledge-check.js  # Knowledge evaluation
│   ├── career-coach.js     # Career intelligence
│   ├── interview-prep.js   # Interview preparation
│   └── app.js              # Application behavior
│
├── styles/
│   ├── main.css
│   └── tutor.css
│
└── .antigravitycli/        # Project/tooling configuration
```

The current repository contains the above application pages plus JavaScript and styling directories. fileciteturn60file0

---

## 🧪 Learning Philosophy

The platform should not stop at explaining a topic.

Every important concept should eventually move through:

```text
1. Concept
2. Mental model
3. Example
4. Code
5. Experiment
6. Observation
7. Debugging
8. Validation
9. Interview question
10. Real-hardware application
```

For example:

```text
I2C
 ↓
Electrical signaling
 ↓
START / ADDRESS / ACK / DATA / STOP
 ↓
Register-level implementation
 ↓
Interactive waveform
 ↓
Fault injection
 ↓
Logic-analyzer interpretation
 ↓
Linux I2C driver
 ↓
Hardware validation
```

That is the direction that differentiates this project from a conventional course website.

---

## 💡 Hardware Strategy

The tutor currently allows different hardware contexts, including:

- Arduino Uno
- STM32F407
- Raspberry Pi 4
- No hardware / simulation mode

This allows the same curriculum to be framed differently depending on the learner's available platform. fileciteturn62file0

The long-term goal is to add board-specific labs rather than pretending browser simulation is a replacement for physical hardware.

---

## 🚧 Roadmap

### Curriculum

- [x] Phase-based curriculum framework
- [x] Tutor workflow
- [x] Knowledge checks
- [ ] Expand all lesson content
- [ ] Add structured lesson metadata
- [ ] Add prerequisite mapping
- [ ] Add mastery scoring

### Interactive Labs

- [x] Sandbox foundation
- [ ] C programming exercises
- [ ] Register/memory visualizer
- [ ] GPIO simulator
- [ ] UART waveform lab
- [ ] I2C waveform lab
- [ ] SPI waveform lab
- [ ] Interrupt simulator
- [ ] DMA experiments
- [ ] Fault injection framework

### Embedded Linux

- [ ] Linux boot-flow visualizer
- [ ] Device Tree exercises
- [ ] Kernel module labs
- [ ] Driver development labs
- [ ] I2C/SPI/UART driver exercises
- [ ] Kernel debugging exercises

### Validation

- [ ] Test-case builder
- [ ] Register validation framework
- [ ] Protocol validation workflows
- [ ] Failure reproduction scenarios
- [ ] Root-cause analysis exercises
- [ ] Validation report generator

### Hardware Integration

- [ ] Raspberry Pi 4 labs
- [ ] BeagleBone Black labs
- [ ] STM32 labs
- [ ] Serial-terminal integration
- [ ] Real protocol capture import
- [ ] Simulated vs measured waveform comparison

### Career

- [x] Interview preparation foundation
- [x] Career dashboard foundation
- [ ] Skill-gap analysis
- [ ] Role-specific roadmaps
- [ ] Job-description analysis
- [ ] Personalized interview plans

---

## 🔗 Portfolio Position

Knowledge Hub is the **learning and knowledge layer** of the broader embedded-engineering portfolio:

```text
Think Silicon Academy
        │
        │ structured courses
        ▼
Knowledge Hub
        │
        │ interactive learning
        ▼
Embedded Master
        │
        │ engineering workspace
        ▼
ES-Tools
        │
        │ simulation / validation
        ▼
Physical Boards + Instruments
```

The objective is to eventually make these projects complementary rather than separate websites.

---

## 🛠️ Running Locally

This project is currently a static browser application, so a simple local HTTP server is sufficient.

For example:

```bash
git clone https://github.com/sivaramireddy18/Knowledge-Hub-Embedded-Systems.git
cd Knowledge-Hub-Embedded-Systems
```

Then serve the directory with any static HTTP server.

For a quick Python server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

---

## ⚠️ Current Status

**Active development.**

This repository is a working prototype/evolving learning platform. Some roadmap items are planned and are not yet implemented.

The README intentionally distinguishes the current application from future capabilities so the repository remains technically honest.

---

## 👨‍💻 Author

**Siva Rami Reddy**

Embedded Systems Engineer focused on:

- Post-Silicon Validation
- Embedded Linux
- Linux Device Drivers
- ARM
- SoC architecture
- Firmware
- Protocol validation
- Hardware/software debugging

GitHub: https://github.com/sivaramireddy18
