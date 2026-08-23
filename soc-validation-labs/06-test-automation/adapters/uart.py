#!/usr/bin/env python3
"""Minimal UART/serial adapter for target validation.

Requires pyserial when used with a real serial port.
"""

try:
    import serial
except ImportError:  # pragma: no cover - dependency is optional
    serial = None


class UartTarget:
    def __init__(self, port: str, baudrate: int = 115200, timeout: float = 2.0):
        if serial is None:
            raise RuntimeError("Install pyserial to use UartTarget")
        self.connection = serial.Serial(port, baudrate=baudrate, timeout=timeout)

    def write(self, data: bytes) -> None:
        self.connection.write(data)

    def read(self, size: int = 1024) -> bytes:
        return self.connection.read(size)

    def readline(self) -> bytes:
        return self.connection.readline()

    def close(self) -> None:
        self.connection.close()
