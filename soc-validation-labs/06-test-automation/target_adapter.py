#!/usr/bin/env python3
"""Optional SSH target adapter for Linux validation experiments.

The adapter intentionally exposes a small interface so the test runner can
later execute board-specific commands without embedding transport logic in
individual tests.
"""

import subprocess


class SshTarget:
    def __init__(self, host: str, user: str | None = None):
        self.host = host
        self.user = user

    @property
    def destination(self) -> str:
        return f"{self.user}@{self.host}" if self.user else self.host

    def run(self, command: str, timeout: int = 30) -> tuple[int, str, str]:
        result = subprocess.run(
            ["ssh", self.destination, command],
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
        )
        return result.returncode, result.stdout, result.stderr


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("host")
    parser.add_argument("command")
    parser.add_argument("--user")
    args = parser.parse_args()

    code, stdout, stderr = SshTarget(args.host, args.user).run(args.command)
    print(stdout, end="")
    if stderr:
        print(stderr, end="")
    raise SystemExit(code)
