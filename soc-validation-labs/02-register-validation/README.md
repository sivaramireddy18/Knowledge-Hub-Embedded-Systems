# Lab 02 — Register Validation

## Objective

Build a disciplined method for validating memory-mapped control and status registers in an SoC.

## Test flow

```text
Specification
    ↓
Register map
    ↓
Reset-value check
    ↓
Read/write behavior
    ↓
Reserved-bit check
    ↓
Side-effect check
    ↓
Negative testing
    ↓
Pass / Fail report
```

## Validation checklist

- [ ] Base address is correct
- [ ] Reset values match specification
- [ ] Read-only fields reject writes
- [ ] Writable fields retain expected values
- [ ] Write-one-to-clear/set behavior is verified where applicable
- [ ] Reserved bits remain unchanged
- [ ] Status bits change only under expected hardware conditions
- [ ] Register access does not cause unexpected side effects

## Evidence to collect

- Register address
- Expected value
- Observed value
- Access type
- Test stimulus
- Timestamp / boot state
- Pass/fail result
- Debug notes

## Debug questions

1. How do you distinguish a software programming error from a hardware register defect?
2. Why are reset values important during bring-up?
3. How would you test reserved bits?
4. How would you validate a write-one-to-clear status bit?
