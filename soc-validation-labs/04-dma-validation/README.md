# Lab 04 — DMA Validation

## Objective

Validate DMA data movement, descriptor configuration, interrupts, coherency expectations and error handling.

## Test flow

```text
Source buffer
    ↓
DMA configuration
    ↓
Descriptor / channel
    ↓
Start transfer
    ↓
Bus transactions
    ↓
Destination buffer
    ↓
Completion interrupt
    ↓
Data integrity check
```

## Test categories

### Basic

- Single transfer
- Different transfer sizes
- Aligned addresses
- Boundary conditions

### Stress

- Repeated transfers
- Maximum supported size
- Back-to-back transfers
- Multiple channels
- Concurrent CPU activity

### Negative

- Invalid address
- Invalid length
- Misalignment where unsupported
- Descriptor corruption
- Timeout
- Abort / reset during transfer

## Validation checklist

- [ ] Source and destination addresses are correct
- [ ] Transfer length is correct
- [ ] Data integrity passes
- [ ] Completion interrupt occurs
- [ ] DMA status returns to expected state
- [ ] Error conditions are reported
- [ ] Cache/coherency requirements are understood
- [ ] Repeated transfers remain stable

## Debug questions

1. How do you distinguish DMA corruption from a cache coherency problem?
2. What registers should be captured after a failed transfer?
3. How would you test DMA boundary conditions?
4. What happens if the CPU modifies a buffer while DMA owns it?
