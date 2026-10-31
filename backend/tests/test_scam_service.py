"""Unit tests for the scam coordination service with mocked Groq AI."""

import json
from unittest.mock import MagicMock, patch

import groq
import httpx
import pytest

from app.schemas.scam import Indicator, RiskLevel, ScamAnalyzeResponse
from app.services.groq_service import (
    GroqInvalidResponseError,
    GroqRateLimitError,
    GroqTimeoutError,
    GroqUnavailableError,
)
from app.services.scam_service import analyze_message, build_fallback_response
from app.utils.safety import SafetyResult


def _build_mock_completion(content_str: str) -> MagicMock:
    """Helper to mock Groq chat completion response."""
    mock_choice = MagicMock()
    mock_choice.message.content = content_str
    mock_comp = MagicMock()
    mock_comp.choices = [mock_choice]
    return mock_comp


def test_ai_success():
    """Verify that successful AI analysis returns analysis_source='ai' and preserves fields."""
    mock_payload = {
        "risk_level": "medium",
        "summary_en": "Moderate scam suspicion.",
        "summary_ur": "معتدل اسکیم کا شبہ۔",
        "indicators": [{"en": "Urgency detected", "ur": "جلدی بازی"}],
        "safe_steps": ["Verify through official helpline."],
        "disclaimer_en": "Guidance only.",
        "disclaimer_ur": "صرف رہنمائی۔",
    }

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _build_mock_completion(
        json.dumps(mock_payload)
    )

    result = analyze_message("Action required within 24 hours.", client=mock_client)

    assert result.analysis_source == "ai"
    assert result.risk_level == RiskLevel.MEDIUM
    assert result.summary_en == mock_payload["summary_en"]
    assert len(result.indicators) >= 1


def test_ai_says_low_but_deterministic_says_high():
    """Verify that AI can never downgrade risk below the deterministic minimum."""
    # Message requests OTP -> deterministic check assigns "high"
    message = "Your account is on hold. Send your OTP immediately to verify."

    # Groq falsely claims this is low risk
    ai_false_low = {
        "risk_level": "low",
        "summary_en": "Message seems harmless according to AI.",
        "summary_ur": "پیغام بے ضرر دکھائی دیتا ہے۔",
        "indicators": [],
        "safe_steps": ["Do not share secrets."],
        "disclaimer_en": "Guidance only.",
        "disclaimer_ur": "صرف رہنمائی۔",
    }

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _build_mock_completion(
        json.dumps(ai_false_low)
    )

    result = analyze_message(message, client=mock_client)

    # Risk MUST be enforced as high
    assert result.risk_level == RiskLevel.HIGH
    assert result.analysis_source == "ai"
    # Deterministic OTP indicator must be merged in
    assert any("OTP" in ind.en for ind in result.indicators)


def test_groq_timeout_returns_fallback():
    """Verify that a Groq timeout safely returns deterministic fallback."""
    message = "Send your OTP to unlock account."

    mock_client = MagicMock()
    dummy_req = httpx.Request("POST", "https://api.groq.com")
    mock_client.chat.completions.create.side_effect = groq.APITimeoutError(request=dummy_req)

    result = analyze_message(message, client=mock_client)

    assert result.analysis_source == "fallback"
    assert result.risk_level == RiskLevel.HIGH
    assert "temporarily unavailable" in result.summary_en
    assert any("OTP" in ind.en for ind in result.indicators)


def test_groq_rate_limit_returns_fallback():
    """Verify that HTTP 429 rate limit triggers fallback."""
    message = "Urgent: call us within 24 hours."

    mock_client = MagicMock()
    dummy_req = httpx.Request("POST", "https://api.groq.com")
    dummy_res = httpx.Response(429, request=dummy_req)
    mock_client.chat.completions.create.side_effect = groq.RateLimitError(
        message="Rate limit exceeded",
        response=dummy_res,
        body=None,
    )

    result = analyze_message(message, client=mock_client)

    assert result.analysis_source == "fallback"
    assert result.risk_level == RiskLevel.MEDIUM
    assert "temporarily unavailable" in result.summary_en


def test_malformed_ai_output_returns_fallback():
    """Verify that unparseable AI JSON triggers fallback."""
    message = "Your card CVV is required."

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _build_mock_completion(
        "Invalid JSON content <<>>"
    )

    result = analyze_message(message, client=mock_client)

    assert result.analysis_source == "fallback"
    assert result.risk_level == RiskLevel.HIGH


def test_unexpected_exception_returns_fallback():
    """Verify that an arbitrary runtime error in Groq call triggers fallback."""
    message = "Suspicious message"

    mock_client = MagicMock()
    mock_client.chat.completions.create.side_effect = RuntimeError("Fatal network fault")

    result = analyze_message(message, client=mock_client)

    assert result.analysis_source == "fallback"
    assert result.risk_level in (RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.UNKNOWN)


def test_fallback_never_returns_low():
    """Verify that fallback for harmless text returns 'unknown', never 'low' or 'safe'."""
    harmless_message = "Good morning, how are you today?"

    mock_client = MagicMock()
    mock_client.chat.completions.create.side_effect = GroqUnavailableError("No API key")

    result = analyze_message(harmless_message, client=mock_client)

    assert result.analysis_source == "fallback"
    assert result.risk_level == RiskLevel.UNKNOWN
    assert result.risk_level != RiskLevel.LOW
    assert result.risk_level != "safe"
    assert "could not determine the risk level" in result.summary_en
