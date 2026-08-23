# Lab 03 — Interrupt Validation

## Objective

Validate that an SoC peripheral generates the correct interrupt, reaches the expected CPU/interrupt controller path, and is cleared correctly.

## Test flow

```text
Configure peripheral
       ↓
Enable interrupt
       ↓
Generate event
       ↓
Observe status
       ↓
CPU / interrupt controller
       ↓
ISR / handler
       ↓
Clear source
       ↓
Verify interrupt deassertion
```

## Validation checklist

- [ ] Interrupt enable bit works
- [ ] Correct source bit is asserted
- [ ] Interrupt reaches CPU
- [ ] ISR executes exactly as expected
- [ ] Interrupt status is captured
- [ ] Clear sequence works
- [ ] Interrupt deasserts after service
- [ ] Multiple interrupt sources are distinguishable
- [ ] Spurious/repeated interrupts are investigated

## Debug evidence

Capture where possible:

- Peripheral status register
- Interrupt-controller state
- CPU exception/IRQ entry
- ISR execution trace
- GPIO/logic-analyzer timing
- Trace32/JTAG observations

## Debug questions

1. How do you prove the peripheral generated the interrupt?
2. How do you distinguish a peripheral issue from interrupt-controller configuration?
3. What happens if the interrupt source is not cleared?
4. How would you validate interrupt latency?
