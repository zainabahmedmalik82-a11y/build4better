import logging
from typing import List, Optional

from groq import Groq

from app.schemas.scam import Indicator, RiskLevel, ScamAnalyzeResponse
from app.services.groq_service import (
    GroqInvalidResponseError,
    GroqRateLimitError,
    GroqServiceError,
    GroqTimeoutError,
    GroqUnavailableError,
    analyze_with_groq,
)
from app.utils.safety import SafetyResult, apply_minimum_risk, run_safety_checks

logger = logging.getLogger(__name__)

DEFAULT_SAFE_STEPS: List[str] = [
    "Do not share OTPs, PINs, passwords, or banking credentials with anyone.",
    "Do not click on links or call phone numbers provided in suspicious messages.",
    "Verify the sender independently through official contact channels or official customer care.",
]

DEFAULT_DISCLAIMER_EN: str = "This analysis is guidance, not a guarantee."
DEFAULT_DISCLAIMER_UR: str = "یہ تجزیہ صرف رہنمائی ہے، مکمل ضمانت نہیں۔"


def build_fallback_response(safety_result: SafetyResult) -> ScamAnalyzeResponse:
    """Build a deterministic fallback response when AI analysis is unavailable.

    Guarantees:
    - Never returns 'low' or 'safe'.
    - Accurately states that AI was unavailable and only automated checks were performed.
    - Preserves deterministic high/medium/unknown risk.
    - Does not expose sensitive user data or stack traces.
    """
    raw_risk = safety_result.minimum_risk_level

    # Enforce risk level floor: never low, never safe
    if raw_risk in (RiskLevel.HIGH.value, "high"):
        effective_risk = RiskLevel.HIGH
        summary_en = (
            "AI analysis is temporarily unavailable. Automated security checks detected "
            "critical warning signs (such as requests for OTP, PIN, password, or financial credentials) in this message."
        )
        summary_ur = (
            "اے آئی تجزیہ عارضی طور پر دستیاب نہیں ہے۔ خودکار سیکیورٹی چیکس نے اس پیغام میں شدید خطرے کی انتباہی نشانیاں "
            "(جیسے ون ٹائم پاس ورڈ، پن، پاس ورڈ یا مالی تفصیلات کی طلب) شناخت کی ہیں۔"
        )
    elif raw_risk in (RiskLevel.MEDIUM.value, "medium"):
        effective_risk = RiskLevel.MEDIUM
        summary_en = (
            "AI analysis is temporarily unavailable. Automated security checks detected "
            "suspicious indicators (such as urgency pressure or unverified links) in this message."
        )
        summary_ur = (
            "اے آئی تجزیہ عارضی طور پر دستیاب نہیں ہے۔ خودکار سیکیورٹی چیکس نے اس پیغام میں مشکوک علامات "
            "(جیسے مصنوعی دباؤ یا مشتبہ لنکس) شناخت کی ہیں۔"
        )
    else:
        effective_risk = RiskLevel.UNKNOWN
        summary_en = (
            "AI analysis is temporarily unavailable. Automated security checks could not determine the risk level "
            "of this message. Please exercise caution and verify through official channels."
        )
        summary_ur = (
            "اے آئی تجزیہ عارضی طور پر دستیاب نہیں ہے۔ خودکار سیکیورٹی چیکس اس پیغام کے خطرے کا حتمی تعین نہیں کر سکیں۔ "
            "براہ کرم احتیاط برتیں اور سرکاری ذرائع سے تصدیق کریں۔"
        )

    return ScamAnalyzeResponse(
        risk_level=effective_risk,
        summary_en=summary_en,
        summary_ur=summary_ur,
        indicators=list(safety_result.indicators),
        safe_steps=list(DEFAULT_SAFE_STEPS),
        disclaimer_en=DEFAULT_DISCLAIMER_EN,
        disclaimer_ur=DEFAULT_DISCLAIMER_UR,
        analysis_source="fallback",
    )


def merge_indicators(
    ai_indicators: List[Indicator],
    safety_indicators: List[Indicator],
) -> List[Indicator]:
    """Merge deterministic safety indicators into AI indicators without duplicates."""
    seen_en = {ind.en.strip().lower() for ind in ai_indicators}
    merged = list(ai_indicators)
    for safety_ind in safety_indicators:
        key = safety_ind.en.strip().lower()
        if key not in seen_en:
            merged.append(safety_ind)
            seen_en.add(key)
    return merged


def analyze_message(
    message: str,
    client: Optional[Groq] = None,
) -> ScamAnalyzeResponse:
    """Coordinate deterministic safety checks and Groq AI scam analysis.

    1. Runs deterministic checks first to establish authoritative minimum risk and flags.
    2. Calls Groq AI to obtain bilingual analysis.
    3. If Groq succeeds: ensures AI cannot downgrade deterministic risk and merges flags.
    4. If Groq fails: safely degrades to a deterministic fallback response.
    Never prints or logs user messages or credentials.
    """
    safety_result = run_safety_checks(message)

    try:
        ai_response = analyze_with_groq(message, client=client)

        # AI output can never lower the risk below the deterministic minimum
        effective_risk_str = apply_minimum_risk(
            ai_level=ai_response.risk_level,
            minimum_level=safety_result.minimum_risk_level,
        )

        merged_indicators = merge_indicators(
            ai_indicators=ai_response.indicators,
            safety_indicators=safety_result.indicators,
        )

        return ScamAnalyzeResponse(
            risk_level=RiskLevel(effective_risk_str),
            summary_en=ai_response.summary_en,
            summary_ur=ai_response.summary_ur,
            indicators=merged_indicators,
            safe_steps=ai_response.safe_steps,
            disclaimer_en=ai_response.disclaimer_en,
            disclaimer_ur=ai_response.disclaimer_ur,
            analysis_source="ai",
        )
    except (
        GroqUnavailableError,
        GroqTimeoutError,
        GroqRateLimitError,
        GroqInvalidResponseError,
        GroqServiceError,
        Exception,
    ) as exc:
        # Log only safe metadata: exception class name, never message contents
        logger.warning(
            "Groq analysis unavailable (%s), falling back to deterministic result.",
            type(exc).__name__,
        )
        return build_fallback_response(safety_result)
