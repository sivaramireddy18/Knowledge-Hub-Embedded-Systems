# Lab 06 — SoC Validation Test Automation

## Objective

Create a repeatable validation framework that separates test definition, execution, evidence collection and result reporting.

## Architecture

```text
Test Definition
      ↓
Test Runner
      ↓
Target / Simulator
      ↓
Observation
      ↓
Evidence
      ↓
PASS / FAIL
      ↓
Regression Report
```

## Test categories

- Smoke tests
- Register tests
- Interrupt tests
- DMA tests
- Protocol tests
- Error-injection tests
- Reset tests
- Power-state tests
- Regression tests

## Minimum result schema

```text
Test ID
Platform
Revision
Software version
Precondition
Stimulus
Expected result
Observed result
Status
Failure signature
Evidence path
Timestamp
```

## Engineering requirements

A useful validation framework should make it possible to:

1. Run the same test repeatedly.
2. Record exact software/hardware versions.
3. Capture the evidence needed to reproduce a failure.
4. Separate infrastructure failures from DUT failures.
5. Compare results across revisions.
6. Produce machine-readable output for regression dashboards.

## Example result

```json
{
  "test_id": "REG-RESET-001",
  "platform": "example-soc",
  "status": "PASS",
  "expected": "0x00000001",
  "observed": "0x00000001",
  "evidence": "logs/REG-RESET-001.txt"
}
```

## Validation checklist

- [ ] Unique test IDs
- [ ] Deterministic setup
- [ ] Version captured
- [ ] Expected result defined before execution
- [ ] Observed result recorded
- [ ] Evidence retained for failures
- [ ] PASS/FAIL generated automatically
- [ ] Regression summary generated
- [ ] Infrastructure failures classified separately

## Debug questions

1. Why should expected results be defined before running a test?
2. How do you distinguish a DUT failure from a broken test environment?
3. What metadata is necessary to reproduce a silicon failure?
4. How should intermittent failures be represented in a regression system?
