#!/usr/bin/env python3
"""Generate a compact Markdown regression report from results.json."""

import argparse
import json
from pathlib import Path


def build_report(data: dict) -> str:
    summary = data["summary"]
    lines = [
        f"# Regression Report — {data.get('suite', 'validation')}",
        "",
        f"**Total:** {summary['total']}  ",
        f"**Passed:** {summary['passed']}  ",
        f"**Failed:** {summary['failed']}",
        "",
        "| Test ID | Status | Expected | Observed | Failure |",
        "|---|---|---|---|---|",
    ]
    for result in data["results"]:
        lines.append(
            f"| {result['test_id']} | {result['status']} | "
            f"{result.get('expected', '')} | {result.get('observed', '')} | "
            f"{result.get('failure_signature') or ''} |"
        )
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("results", type=Path)
    parser.add_argument("--output", type=Path, default=Path("REGRESSION.md"))
    args = parser.parse_args()

    data = json.loads(args.results.read_text())
    args.output.write_text(build_report(data))
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
