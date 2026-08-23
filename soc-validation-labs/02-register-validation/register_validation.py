#!/usr/bin/env python3
"""Small register-validation helper for lab experiments.

This script compares expected and observed register values and reports
bit-level differences. It intentionally stays hardware-agnostic so it can
later consume values from a real board, debugger, log, or test framework.
"""

from dataclasses import dataclass


@dataclass
class RegisterResult:
    address: int
    expected: int
    observed: int

    @property
    def passed(self) -> bool:
        return self.expected == self.observed

    @property
    def delta(self) -> int:
        return self.expected ^ self.observed


def validate_register(result: RegisterResult) -> str:
    status = "PASS" if result.passed else "FAIL"
    return (
        f"{status} addr=0x{result.address:08X} "
        f"expected=0x{result.expected:08X} "
        f"observed=0x{result.observed:08X} "
        f"delta=0x{result.delta:08X}"
    )


def main() -> None:
    samples = [
        RegisterResult(0x40000000, 0x00000001, 0x00000001),
        RegisterResult(0x40000004, 0x00000080, 0x00000000),
    ]

    for result in samples:
        print(validate_register(result))


if __name__ == "__main__":
    main()
