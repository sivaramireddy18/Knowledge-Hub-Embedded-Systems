# Lab 06 — SoC Validation Test Automation

## Objective

Create a repeatable validation framework that separates test definition, target access, execution, evidence collection and reporting.

## Architecture

```text
Test Definition
      ↓
Test Runner
      ↓
Target Adapter
 ┌────┼─────┐
 SSH UART I2C/SPI
      ↓
Target / DUT
      ↓
Observation
      ↓
PASS / FAIL
      ↓
JSON Results
      ↓
Regression Report
```

## Included tools

- `test_runner.py` — JSON-driven runner
- `tests.json` — sample test suite
- `target_adapter.py` — SSH/Linux target adapter
- `adapters/uart.py` — serial target adapter
- `adapters/i2c.py` — Linux userspace I2C adapter
- `adapters/spi.py` — Linux userspace SPI adapter

Optional Python dependencies:

```bash
pip install pyserial smbus2 spidev
```

## Example: SSH target

```bash
python3 target_adapter.py --user root 192.168.1.20 'uname -a'
```

## Example: test runner

```bash
python3 test_runner.py tests.json --output results.json
```

The runner returns a non-zero exit code when any test fails, which makes it suitable for CI/regression automation.

## Target adapter principle

Transport should remain separate from validation logic.

```text
Validation test
     ↓
Target interface
     ↓
SSH / UART / I2C / SPI / future JTAG
     ↓
DUT
```

This allows the same test methodology to evolve from a simulator or Linux host to a real development board.

## Hardware safety

I2C and SPI adapters intentionally provide generic userspace access. Tests must supply the correct bus/device addresses and transaction formats for the actual board. Do not write arbitrary registers on production hardware.

## Next adapters

- [ ] PCIe/sysfs adapter
- [ ] JTAG/Trace32 adapter
- [ ] Protocol-analyzer evidence adapter
- [ ] GPIO adapter
- [ ] Board power/reset controller

## Validation rule

A test is not considered hardware-validated merely because the script executed. Record the target, software revision, observed evidence and result before marking a test as validated.
