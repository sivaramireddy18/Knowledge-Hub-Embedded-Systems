# Lab 09 — SD / SDHost Validation

## Objective

Validate SD host initialization, card identification, data transfers, error handling and performance-related corner cases.

## Validation flow

```text
Clock / Reset
    ↓
Host initialization
    ↓
Card detection
    ↓
Card identification
    ↓
Bus-width / speed configuration
    ↓
Read / Write
    ↓
Error handling
    ↓
Stress / regression
```

## Test categories

### Initialization

- Controller reset
- Clock configuration
- Card detect
- Command/response handling
- Identification sequence

### Data path

- Single-block read
- Multi-block read
- Single-block write
- Multi-block write
- Different block sizes where supported
- Data-integrity verification

### Stress

- Repeated reads/writes
- Large sequential transfers
- Random access
- Back-to-back requests
- Suspend/resume where supported

### Negative / recovery

- Card removal during transfer
- Timeout
- CRC error
- Command error
- Data error
- Controller reset during traffic

## Evidence

Collect:

- Host controller registers
- Command/response logs
- Interrupt status
- DMA status where applicable
- Kernel logs
- Logic/protocol analyzer traces where available
- Data-integrity results

## Debug questions

1. How do you distinguish an SD card problem from an SDHost controller problem?
2. What registers should be captured after a command timeout?
3. How would you validate data integrity independently of the host driver?
4. What changes when switching bus width or transfer speed?
