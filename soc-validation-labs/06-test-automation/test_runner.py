#!/usr/bin/env python3
"""Minimal JSON-driven validation runner.

The runner intentionally separates test definitions from execution. The
hardware adapter can later be replaced by a real board/debugger interface.
"""

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path


def run_test(test):
    # Simulation-only placeholder until a target adapter is connected.
    observed = test.get("observed", test.get("expected"))
    expected = test.get("expected")
    status = "PASS" if observed == expected else "FAIL"

    return {
        "test_id": test["test_id"],
        "status": status,
        "expected": expected,
        "observed": observed,
        "failure_signature": None if status == "PASS" else "VALUE_MISMATCH",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("test_file", type=Path)
    parser.add_argument("--output", type=Path, default=Path("results.json"))
    args = parser.parse_args()

    data = json.loads(args.test_file.read_text())
    results = [run_test(test) for test in data["tests"]]

    report = {
        "suite": data.get("suite", "soc-validation"),
        "results": results,
        "summary": {
            "total": len(results),
            "passed": sum(r["status"] == "PASS" for r in results),
            "failed": sum(r["status"] == "FAIL" for r in results),
        },
    }

    args.output.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report["summary"], indent=2))

    raise SystemExit(1 if report["summary"]["failed"] else 0)


if __name__ == "__main__":
    main()
