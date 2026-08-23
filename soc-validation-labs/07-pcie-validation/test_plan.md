# PCIe Validation Test Plan

## Scope

Validate PCIe link training, enumeration, configuration space, data path, error handling and recovery.

## Test matrix

| ID | Category | Test | Expected |
|---|---|---|---|
| PCIE-001 | Bring-up | Cold boot link training | Link reaches expected operational state |
| PCIE-002 | Link | Verify speed | Negotiated speed matches capability/expectation |
| PCIE-003 | Link | Verify width | Negotiated lane width is correct |
| PCIE-004 | Config | Read vendor/device ID | IDs match design |
| PCIE-005 | Config | BAR discovery | BARs are valid and accessible |
| PCIE-006 | Data | Host-to-device transfer | Data integrity passes |
| PCIE-007 | Data | Device-to-host transfer | Data integrity passes |
| PCIE-008 | Reset | Fundamental/hot reset as supported | Device recovers and re-enumerates |
| PCIE-009 | Error | Inject supported error | Expected status/reporting occurs |
| PCIE-010 | Recovery | Link retraining | Link returns to expected state |

## Evidence

Collect where available:

- LTSSM state
- Negotiated speed/width
- PCI configuration-space dump
- Kernel logs
- AER status
- Protocol analyzer trace
- Trace32/JTAG state
- Data-integrity logs

## Failure triage

```text
Enumeration failure
      ↓
Power / reset / clock
      ↓
LTSSM / link training
      ↓
Configuration space
      ↓
BAR / resource assignment
      ↓
Driver binding
      ↓
Data-path validation
```

Do not classify a failure as a driver problem until the lower-level prerequisites have been checked.
