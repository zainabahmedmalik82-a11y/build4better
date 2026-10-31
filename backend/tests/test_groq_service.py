"""Unit tests for Groq AI analysis service using mocked clients."""

import json
from unittest.mock import MagicMock, patch

import groq
import httpx
import pytest

from app.core.config import settings
from app.schemas.scam import RiskLevel, ScamAnalyzeResponse
from app.services.groq_service import (
    GroqInvalidResponseError,
    GroqRateLimitError,
    GroqTimeoutError,
    GroqUnavailableError,
    analyze_with_groq,
)


def _build_mock_completion(content_str: str) -> MagicMock:
    """Helper to build a mock Groq ChatCompletion structure."""
    mock_choice = MagicMock()
    mock_choice.message.content = content_str
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]
    return mock_completion


def test_valid_json_response():
    """Verify that valid structured JSON from Groq is correctly parsed into ScamAnalyzeResponse."""
    valid_payload = {
        "risk_level": "high",
        "summary_en": "The message appears to be a fraudulent phishing attempt.",
        "summary_ur": "یہ پیغام ممکنہ طور پر فراڈ اور دھوکہ دہی کی کوشش ہے۔",
        "indicators": [
            {
                "en": "Creates false urgency regarding account suspension.",
                "ur": "اکاؤنٹ معطلی کے بارے میں غیر حقیقی جلدی پیدا کرتا ہے۔",
            }
        ],
        "safe_steps": [
            "Do not share OTP or personal credentials.",
            "Contact your official bank helpline.",
        ],
        "disclaimer_en": "This analysis is guidance, not a guarantee.",
        "disclaimer_ur": "یہ تجزیہ صرف رہنمائی ہے، مکمل ضمانت نہیں۔",
    }

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _build_mock_completion(
        json.dumps(valid_payload)
    )

    result = analyze_with_groq("Your account is blocked. Send OTP.", client=mock_client)

    assert isinstance(result, ScamAnalyzeResponse)
    assert result.risk_level == RiskLevel.HIGH
    assert result.summary_en == valid_payload["summary_en"]
    assert result.summary_ur == valid_payload["summary_ur"]
    assert len(result.indicators) == 1
    assert result.indicators[0].en == "Creates false urgency regarding account suspension."
    assert len(result.safe_steps) == 2


def test_malformed_json_raises_error():
    """Verify that non-JSON or broken JSON raises GroqInvalidResponseError."""
    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _build_mock_completion(
        "This is not JSON: { broken_key: 'value' "
    )

    with pytest.raises(GroqInvalidResponseError):
        analyze_with_groq("Sample message", client=mock_client)


def test_missing_fields_raises_error():
    """Verify that JSON missing mandatory contract fields raises GroqInvalidResponseError."""
    incomplete_payload = {
        "risk_level": "medium",
        # Missing summary_en, summary_ur, disclaimer, etc.
    }

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _build_mock_completion(
        json.dumps(incomplete_payload)
    )

    with pytest.raises(GroqInvalidResponseError):
        analyze_with_groq("Sample message", client=mock_client)


def test_invalid_risk_level_raises_error():
    """Verify that an unsupported risk_level value raises GroqInvalidResponseError."""
    payload_with_invalid_risk = {
        "risk_level": "extreme_danger",
        "summary_en": "Urgent risk",
        "summary_ur": "شدید خطرہ",
        "indicators": [],
        "safe_steps": ["Be safe"],
        "disclaimer_en": "Guidance only",
        "disclaimer_ur": "صرف رہنمائی",
    }

    mock_client = MagicMock()
    mock_client.chat.completions.create.return_value = _build_mock_completion(
        json.dumps(payload_with_invalid_risk)
    )

    with pytest.raises(GroqInvalidResponseError):
        analyze_with_groq("Sample message", client=mock_client)


def test_timeout_raises_groq_timeout_error():
    """Verify that request timeouts raise GroqTimeoutError."""
    mock_client = MagicMock()
    dummy_req = httpx.Request("POST", "https://api.groq.com/openai/v1/chat/completions")
    mock_client.chat.completions.create.side_effect = groq.APITimeoutError(request=dummy_req)

    with pytest.raises(GroqTimeoutError):
        analyze_with_groq("Sample message", client=mock_client)


def test_rate_limit_raises_groq_rate_limit_error():
    """Verify that 429 rate limit responses raise GroqRateLimitError."""
    mock_client = MagicMock()
    dummy_req = httpx.Request("POST", "https://api.groq.com/openai/v1/chat/completions")
    dummy_res = httpx.Response(429, request=dummy_req)
    mock_client.chat.completions.create.side_effect = groq.RateLimitError(
        message="Rate limit exceeded",
        response=dummy_res,
        body=None,
    )

    with pytest.raises(GroqRateLimitError):
        analyze_with_groq("Sample message", client=mock_client)


def test_missing_api_key_raises_groq_unavailable():
    """Verify that missing or empty GROQ_API_KEY raises GroqUnavailableError."""
    with patch.object(settings, "GROQ_API_KEY", ""):
        with pytest.raises(GroqUnavailableError):
            analyze_with_groq("Sample message", client=None)
