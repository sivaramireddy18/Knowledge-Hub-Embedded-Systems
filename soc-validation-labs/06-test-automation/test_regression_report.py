import json
import tempfile
import unittest
from pathlib import Path

from regression_report import build_report


class RegressionReportTests(unittest.TestCase):
    def test_report_contains_summary_and_results(self):
        data = {
            "suite": "unit",
            "summary": {"total": 2, "passed": 1, "failed": 1},
            "results": [
                {
                    "test_id": "T-001",
                    "status": "PASS",
                    "expected": "1",
                    "observed": "1",
                    "failure_signature": None,
                },
                {
                    "test_id": "T-002",
                    "status": "FAIL",
                    "expected": "2",
                    "observed": "0",
                    "failure_signature": "VALUE_MISMATCH",
                },
            ],
        }
        report = build_report(data)
        self.assertIn("Regression Report — unit", report)
        self.assertIn("T-001", report)
        self.assertIn("T-002", report)
        self.assertIn("VALUE_MISMATCH", report)

    def test_report_is_written_as_markdown(self):
        data = {
            "suite": "smoke",
            "summary": {"total": 1, "passed": 1, "failed": 0},
            "results": [
                {
                    "test_id": "T-003",
                    "status": "PASS",
                    "expected": "OK",
                    "observed": "OK",
                    "failure_signature": None,
                }
            ],
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "REGRESSION.md"
            path.write_text(build_report(data))
            self.assertTrue(path.exists())
            self.assertIn("T-003", path.read_text())


if __name__ == "__main__":
    unittest.main()
