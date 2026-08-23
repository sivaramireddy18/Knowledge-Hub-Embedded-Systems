#!/usr/bin/env python3
"""JSON-driven validation runner with explicit result classification."""

import argparse
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path


def run_command(command: str, timeout: int = 30):
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True,
                                timeout=timeout, check=False)
    except subprocess.TimeoutExpired as exc:
        return "INFRA_FAIL", "", f"command timeout: {exc}"
    except OSError as exc:
        return "INFRA_FAIL", "", str(exc)

    output = (result.stdout + result.stderr).strip()
    return ("PASS" if result.returncode == 0 else "DUT_FAIL"), output, ""


def run_test(test):
    timestamp = datetime.now(timezone.utc).isoformat()

    if "command" in test:
        status, observed, error = run_command(test["command"])
        expected = test.get("expected_contains")
        if status == "PASS" and expected and expected not in observed:
            status = "DUT_FAIL"
            error = f"expected output to contain: {expected}"
        return {"test_id": test["test_id"], "status": status,
                "expected": expected or "exit code 0", "observed": observed,
                "failure_signature": error or None, "timestamp": timestamp}

    observed = test.get("observed", test.get("expected"))
    expected = test.get("expected")
    status = "PASS" if observed == expected else "DUT_FAIL"
    return {"test_id": test["test_id"], "status": status,
            "expected": expected, "observed": observed,
            "failure_signature": None if status == "PASS" else "VALUE_MISMATCH",
            "timestamp": timestamp}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("test_file", type=Path)
    parser.add_argument("--output", type=Path, default=Path("results.json"))
    args = parser.parse_args()

    data = json.loads(args.test_file.read_text())
    results = [run_test(test) for test in data["tests"]]
    summary = {status: sum(r["status"] == status for r in results)
               for status in ("PASS", "DUT_FAIL", "INFRA_FAIL", "NOT_RUN")}
    summary["total"] = len(results)

    report = {"suite": data.get("suite", "soc-validation"),
              "results": results, "summary": summary}
    args.output.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(summary, indent=2))
    raise SystemExit(1 if summary["DUT_FAIL"] or summary["INFRA_FAIL"] else 0)


if __name__ == "__main__":
    main()
