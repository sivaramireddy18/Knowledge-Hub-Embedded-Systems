# Lab 01 — SoC Bring-up Validation

## Objective
Create a repeatable first-power-on checklist for a new SoC/DUT.

## Validation sequence

1. Verify power rails and clocks.
2. Confirm reset release behavior.
3. Connect JTAG/Trace32 or equivalent debugger.
4. Read chip ID / revision registers.
5. Verify basic memory access.
6. Verify boot ROM / bootloader progress.
7. Check UART console.
8. Validate first peripheral access.
9. Capture logs and register evidence.
10. Record failures with timestamp, configuration and reproduction steps.

## Deliverables

- Bring-up checklist
- Register capture
- Boot log
- Initial failure list
- Pass/fail report

## Failure triage

```text
No boot
 ├─ Power?
 ├─ Clock?
 ├─ Reset?
 ├─ JTAG access?
 ├─ CPU executing?
 ├─ Memory accessible?
 └─ Boot software progressing?
```

## Engineering rule
Never mark bring-up complete because the board boots once. Repeat cold/warm/reset/power-cycle cases and preserve evidence.
