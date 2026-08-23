#!/usr/bin/env python3
"""Linux SPI userspace adapter using spidev."""

try:
    import spidev
except ImportError:  # pragma: no cover
    spidev = None


class SPITarget:
    def __init__(self, bus: int, chip_select: int, speed_hz: int = 1_000_000):
        if spidev is None:
            raise RuntimeError("Install spidev to use SPITarget")
        self.device = spidev.SpiDev()
        self.device.open(bus, chip_select)
        self.device.max_speed_hz = speed_hz

    def transfer(self, data: list[int]) -> list[int]:
        return self.device.xfer2(data)

    def close(self) -> None:
        self.device.close()
