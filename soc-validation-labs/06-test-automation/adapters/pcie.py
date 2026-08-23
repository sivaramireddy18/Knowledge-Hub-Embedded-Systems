#!/usr/bin/env python3
"""Read-only Linux PCIe/sysfs adapter for validation evidence."""

from pathlib import Path


class PCIeTarget:
    def __init__(self, device: str):
        self.device = device
        self.root = Path("/sys/bus/pci/devices") / device

    def read(self, name: str) -> str:
        path = self.root / name
        return path.read_text().strip()

    def summary(self) -> dict[str, str]:
        fields = ("vendor", "device", "class", "current_link_speed", "current_link_width")
        result = {}
        for field in fields:
            try:
                result[field] = self.read(field)
            except FileNotFoundError:
                result[field] = "N/A"
        return result


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("device", help="PCI BDF, e.g. 0000:01:00.0")
    args = parser.parse_args()
    for key, value in PCIeTarget(args.device).summary().items():
        print(f"{key}: {value}")
