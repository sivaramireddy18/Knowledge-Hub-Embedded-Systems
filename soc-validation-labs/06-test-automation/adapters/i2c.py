#!/usr/bin/env python3
"""Linux userspace I2C adapter using /dev/i2c-* via smbus2.

The adapter is intentionally small; board-specific transactions belong in
individual validation tests.
"""

try:
    from smbus2 import SMBus
except ImportError:  # pragma: no cover
    SMBus = None


class I2CTarget:
    def __init__(self, bus_number: int):
        if SMBus is None:
            raise RuntimeError("Install smbus2 to use I2CTarget")
        self.bus = SMBus(bus_number)

    def read_byte(self, address: int) -> int:
        return self.bus.read_byte(address)

    def write_byte(self, address: int, value: int) -> None:
        self.bus.write_byte(address, value)

    def read_register(self, address: int, register: int) -> int:
        return self.bus.read_byte_data(address, register)

    def write_register(self, address: int, register: int, value: int) -> None:
        self.bus.write_byte_data(address, register, value)

    def close(self) -> None:
        self.bus.close()
