# Lab 05 — PCIe Enumeration Validation

## Objective

Validate PCIe link bring-up and endpoint enumeration from reset through configuration-space discovery.

## Test flow

```text
Reset
  ↓
Reference clock / power
  ↓
LTSSM progression
  ↓
Link training
  ↓
L0
  ↓
Configuration access
  ↓
Enumeration
  ↓
BAR discovery
  ↓
Driver binding
```

## Validation checklist

- [ ] Reference clock is present
- [ ] PERST# behavior is correct
- [ ] Link reaches expected LTSSM state
- [ ] Link width is correct
- [ ] Link speed is correct
- [ ] Configuration space is readable
- [ ] Vendor/device IDs are correct
- [ ] BARs are assigned correctly
- [ ] Interrupt capability is visible
- [ ] Endpoint enumerates consistently across resets

## Debug evidence

Collect when available:

- LTSSM state
- Link speed/width
- PCIe configuration-space dump
- Root-port status
- Protocol-analyzer trace
- Kernel `dmesg`
- AER/error status
- Trace32/JTAG observations

## Negative testing

- Endpoint absent
- Link-width degradation
- Unsupported speed
- Hot reset
- Link retraining
- Configuration-space errors
- AER error injection where supported

## Debug questions

1. At what point does enumeration depend on a successfully trained link?
2. How do you distinguish a PHY/link-training problem from a configuration-space problem?
3. What does an unexpected LTSSM state tell you?
4. How would you correlate a Linux enumeration failure with a protocol-analyzer trace?
