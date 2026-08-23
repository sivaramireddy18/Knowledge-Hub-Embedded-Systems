# Lab 08 — USB Validation

## Objective

Validate USB controller/PHY bring-up, enumeration, transfers, error handling and recovery.

## Validation flow

```text
Power / Clock / Reset
        ↓
PHY initialization
        ↓
Controller initialization
        ↓
Port state
        ↓
USB enumeration
        ↓
Descriptor reads
        ↓
Configuration
        ↓
Data transfers
        ↓
Error / recovery
```

## Test categories

### Bring-up

- Controller reset
- PHY readiness
- Port status
- Host/device role
- Link state

### Enumeration

- Device detection
- Device descriptor
- Configuration descriptor
- Interface/endpoint descriptors
- Address assignment
- Configuration selection

### Transfer

- Control transfers
- Bulk transfers
- Interrupt transfers where applicable
- Isochronous transfers where applicable
- Short packets
- Maximum packet sizes

### Negative / recovery

- Disconnect/reconnect
- Reset during traffic
- Invalid descriptor behavior
- Transfer timeout
- Endpoint stall
- Recovery after controller reset

## Evidence

Capture where available:

- Kernel `dmesg`
- USB protocol-analyzer trace
- Controller registers
- PHY state
- Transfer status
- Error registers
- Timing information

## Debug questions

1. How do you distinguish a PHY problem from a USB controller problem?
2. What evidence proves that enumeration reached the device descriptor stage?
3. How would you debug a device that enumerates but fails bulk transfers?
4. What happens to outstanding transfers during a controller reset?
