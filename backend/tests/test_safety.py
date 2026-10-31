"""Tests for deterministic safety checks in Sahaara backend."""

import pytest
from app.schemas.scam import RiskLevel
from app.utils.safety import SafetyResult, apply_minimum_risk, run_safety_checks


def test_otp_request_detection():
    message = "Your bank account is on hold. Please share your OTP verification code."
    result = run_safety_checks(message)

    assert "otp_request" in result.flags
    assert result.minimum_risk_level == "high"
    assert any("OTP" in ind.en for ind in result.indicators)


def test_pin_request_detection():
    message = "Enter your ATM PIN immediately to confirm identity."
    result = run_safety_checks(message)

    assert "pin_request" in result.flags
    assert result.minimum_risk_level == "high"
    assert any("PIN" in ind.en for ind in result.indicators)


def test_password_request_detection():
    message = "Please provide your account password to secure your login credentials."
    result = run_safety_checks(message)

    assert "password_request" in result.flags
    assert result.minimum_risk_level == "high"
    assert any("password" in ind.en.lower() for ind in result.indicators)


def test_card_info_request_detection():
    message = "Send your debit card number and CVV to claim your lottery prize."
    result = run_safety_checks(message)

    assert "card_info" in result.flags
    assert result.minimum_risk_level == "high"
    assert any("card" in ind.en.lower() or "CVV" in ind.en for ind in result.indicators)


def test_urgency_alone_is_medium_risk():
    message = "Important notice: Action required immediately within 24 hours."
    result = run_safety_checks(message)

    assert "urgency" in result.flags
    assert "otp_request" not in result.flags
    assert result.minimum_risk_level == "medium"


def test_suspicious_link_alone_is_medium_risk():
    message = "Review your pending transaction update at https://bit.ly/tx-update-48"
    result = run_safety_checks(message)

    assert "suspicious_link" in result.flags
    assert result.minimum_risk_level == "medium"


def test_urdu_script_otp_request():
    message = "اپنا او ٹی پی کوڈ بھیجیں ورنہ سروس بلاک ہو جائے گی"
    result = run_safety_checks(message)

    assert "otp_request" in result.flags
    assert result.minimum_risk_level == "high"


def test_roman_urdu_otp_request():
    message = "Apna OTP foran bhejein warna account block ho jayega."
    result = run_safety_checks(message)

    assert "otp_request" in result.flags
    assert "urgency" in result.flags
    assert result.minimum_risk_level == "high"


def test_obfuscated_otp_detection():
    # 0TP with digit zero
    result1 = run_safety_checks("Send your 0TP immediately to proceed.")
    assert "otp_request" in result1.flags
    assert result1.minimum_risk_level == "high"

    # Spaced letters: 0 T P
    result2 = run_safety_checks("Share your 0 T P verification code.")
    assert "otp_request" in result2.flags
    assert result2.minimum_risk_level == "high"


def test_harmless_message_returns_unknown_never_safe():
    message = "Assalam o Alaikum, let's meet tomorrow evening at 6 PM for dinner."
    result = run_safety_checks(message)

    assert len(result.flags) == 0
    assert result.minimum_risk_level == "unknown"
    assert result.minimum_risk_level != "safe"
    assert result.minimum_risk_level != "low"
    assert len(result.indicators) == 0


def test_apply_minimum_risk_rules():
    # AI says "low", but deterministic check says "high" -> must be "high"
    assert apply_minimum_risk("low", "high") == "high"
    assert apply_minimum_risk(RiskLevel.LOW, RiskLevel.HIGH) == "high"

    # AI says "low", deterministic is "medium" -> must be "medium"
    assert apply_minimum_risk("low", "medium") == "medium"

    # AI says "high", deterministic is "low" -> "high"
    assert apply_minimum_risk("high", "low") == "high"

    # AI says "unknown", deterministic is "high" -> "high"
    assert apply_minimum_risk("unknown", "high") == "high"

    # AI says "low", deterministic is "unknown" -> "low"
    assert apply_minimum_risk("low", "unknown") == "low"

    # Both unknown -> "unknown"
    assert apply_minimum_risk("unknown", "unknown") == "unknown"
