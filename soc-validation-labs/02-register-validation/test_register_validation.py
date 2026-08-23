import unittest

from register_validation import RegisterResult, validate_register


class RegisterValidationTests(unittest.TestCase):
    def test_matching_register_passes(self):
        result = RegisterResult(0x40000000, 0x12345678, 0x12345678)
        self.assertTrue(result.passed)
        self.assertEqual(result.delta, 0)
        self.assertIn("PASS", validate_register(result))

    def test_mismatch_reports_delta(self):
        result = RegisterResult(0x40000004, 0x00000080, 0x00000000)
        self.assertFalse(result.passed)
        self.assertEqual(result.delta, 0x00000080)
        self.assertIn("FAIL", validate_register(result))


if __name__ == "__main__":
    unittest.main()
