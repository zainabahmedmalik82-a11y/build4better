import re
from dataclasses import dataclass, field
from typing import List, Union

from app.schemas.scam import Indicator, RiskLevel

# Normalized risk hierarchy: unknown (0) < low (1) < medium (2) < high (3)
RISK_ORDER = {
    RiskLevel.UNKNOWN.value: 0,
    RiskLevel.LOW.value: 1,
    RiskLevel.MEDIUM.value: 2,
    RiskLevel.HIGH.value: 3,
}

HIGH_RISK_FLAGS = {
    "otp_request",
    "pin_request",
    "password_request",
    "banking_credentials",
    "card_info",
}

MEDIUM_RISK_FLAGS = {
    "urgency",
    "suspicious_link",
}

INDICATOR_TEMPLATES = {
    "otp_request": Indicator(
        en="The message requests a one-time password (OTP) or verification code.",
        ur="یہ پیغام ون ٹائم پاس ورڈ (OTP) یا تصدیقی کوڈ مانگ رہا ہے۔",
    ),
    "pin_request": Indicator(
        en="The message requests your secret ATM or security PIN.",
        ur="یہ پیغام آپ کا خفیہ پن (PIN) یا اے ٹی ایم کوڈ مانگ رہا ہے۔",
    ),
    "password_request": Indicator(
        en="The message asks for your account password or login credentials.",
        ur="یہ پیغام آپ کے اکاؤنٹ کا پاس ورڈ یا لاگ ان تفصیلات مانگ رہا ہے۔",
    ),
    "banking_credentials": Indicator(
        en="The message requests sensitive banking details or bank account access.",
        ur="یہ پیغام حساس بینک اکاؤنٹ یا بینکنگ تفصیلات طلب کر رہا ہے۔",
    ),
    "card_info": Indicator(
        en="The message asks for payment card numbers, expiry dates, or CVV codes.",
        ur="یہ پیغام پیمنٹ کارڈ نمبر، تاریخ تنسیخ، یا سی وی وی (CVV) کوڈ مانگ رہا ہے۔",
    ),
    "urgency": Indicator(
        en="The message creates artificial urgency or threatens imminent account suspension.",
        ur="یہ پیغام جلدی کرنے کا دباؤ ڈال رہا ہے یا اکاؤنٹ معطلی کی دھمکی دے رہا ہے۔",
    ),
    "suspicious_link": Indicator(
        en="The message contains external links or shortened URLs.",
        ur="اس پیغام میں بیرونی ویب لنکس یا مختصر لنکس موجود ہیں۔",
    ),
}


@dataclass
class SafetyResult:
    """Deterministic safety analysis result."""

    flags: List[str] = field(default_factory=list)
    minimum_risk_level: str = RiskLevel.UNKNOWN.value
    indicators: List[Indicator] = field(default_factory=list)


def normalize_text(text: str) -> str:
    """Normalize text to lowercase, collapse whitespace, and unpack common obfuscations."""
    if not text:
        return ""

    # Convert to lowercase
    norm = text.lower()

    # Normalize common letter/digit obfuscations for OTP:
    # 0tp -> otp
    norm = re.sub(r"\b0tp\b", "otp", norm)
    # Obfuscations like 0 t p, o t p, o-t-p, 0-t-p
    norm = re.sub(r"(?<![a-z0-9])[o0][\s\-_]+t[\s\-_]+p(?![a-z0-9])", "otp", norm)

    # Obfuscations for PIN: p i n, p-i-n
    norm = re.sub(r"(?<![a-z0-9])p[\s\-_]+i[\s\-_]+n(?![a-z0-9])", "pin", norm)

    # Obfuscations for password: p@ssword, passw0rd
    norm = re.sub(r"\bp@ssw[o0]rd\b", "password", norm)
    norm = re.sub(r"\bpassw0rd\b", "password", norm)

    # Collapse whitespace
    norm = re.sub(r"\s+", " ", norm).strip()
    return norm


def run_safety_checks(message: str) -> SafetyResult:
    """Pure deterministic safety check function.

    Analyzes suspicious patterns independently of any AI model.
    Does not make network calls, log, or persist user message contents.
    """
    if not message or not message.strip():
        return SafetyResult(
            flags=[],
            minimum_risk_level=RiskLevel.UNKNOWN.value,
            indicators=[],
        )

    norm = normalize_text(message)
    triggered_flags: List[str] = []

    # 1. OTP detection (English, Roman Urdu, Urdu script, obfuscations)
    otp_pattern = (
        r"\b(?:otp|one[- ]time[- ]password|verification[- ]code|security[- ]code)\b|"
        r"\b(?:otp\s*(?:bhejein?|bhejo|batao|share|darj))\b|"
        r"\b(?:code\s*(?:bhejein?|bhejo|batao|share))\b|"
        r"(?:او\s*ٹی\s*پی|اوٹیپی|کوڈ\s*بھیجیں|کوڈ\s*بتائیں|تصدیقی\s*کوڈ)"
    )
    if re.search(otp_pattern, norm):
        triggered_flags.append("otp_request")

    # 2. PIN detection (English, Roman Urdu, Urdu script)
    pin_pattern = (
        r"\b(?:pin|atm[- ]pin|mpin|security[- ]pin)\b|"
        r"\b(?:pin\s*(?:bhejein?|bhejo|batao|share|darj|enter))\b|"
        r"(?:پِن|پن\s*کوڈ|پن\s*درج|پن\s*شیئر|خفیہ\s*پن)"
    )
    if re.search(pin_pattern, norm):
        triggered_flags.append("pin_request")

    # 3. Password detection (English, Roman Urdu, Urdu script)
    password_pattern = (
        r"\b(?:password|passcode)\b|"
        r"\b(?:password\s*(?:bhejein?|bhejo|batao|share))\b|"
        r"(?:پاس\s*ورڈ|پاسورڈ)"
    )
    if re.search(password_pattern, norm):
        triggered_flags.append("password_request")

    # 4. Banking credentials (English, Roman Urdu, Urdu script)
    banking_pattern = (
        r"\b(?:bank\s*account|account\s*number|bank\s*details|bank\s*login|banking\s*credentials)\b|"
        r"\b(?:khata\s*number|login\s*tafseelat)\b|"
        r"\bcnic\b.*?\b(?:bank|account|verify|block)\b|"
        r"\b(?:bank|account|verify|block)\b.*?\bcnic\b|"
        r"(?:بینک\s*اکاؤنٹ|بینک\s*کھاتہ|اکاؤنٹ\s*نمبر|لاگ\s*ان\s*تفصیلات|بینکنگ)"
    )
    if re.search(banking_pattern, norm):
        triggered_flags.append("banking_credentials")

    # 5. Card information (CVV, card number, expiry)
    card_pattern = (
        r"\b(?:cvv|cvc|card\s*number|credit\s*card|debit\s*card|atm\s*card|card\s*expiry)\b|"
        r"\b(?:cvv\s*number|card\s*ki\s*expiry)\b|"
        r"(?:کارڈ\s*نمبر|کریڈٹ\s*کارڈ|ڈیبٹ\s*کارڈ|سی\s*وی\s*وی|ایکسپائری\s*ڈیٹ|کارڈ\s*کی\s*تفصیلات)"
    )
    if re.search(card_pattern, norm):
        triggered_flags.append("card_info")

    # 6. Urgency / Pressure language (English, Roman Urdu, Urdu script)
    urgency_pattern = (
        r"\b(?:immediately|urgently?|urgent|within\s*\d+\s*(?:hours?|hrs?|mins?|minutes?)|"
        r"account\s*will\s*be\s*(?:blocked|suspended|terminated|deactivated)|"
        r"act\s*now|action\s*required|last\s*chance|expires\s*today)\b|"
        r"\b(?:foran|fauran|jaldi|block\s*ho\s*jayega|band\s*ho\s*jayega|\d+\s*ghant[ao]y)\b|"
        r"(?:فوراً|فوری|اکاؤنٹ\s*بلاک|اکاؤنٹ\s*معطل|\d+\s*گھنٹے|بند\s*کر\s*دیا|معطل\s*کر)"
    )
    if re.search(urgency_pattern, norm):
        triggered_flags.append("urgency")

    # 7. Suspicious links (URLs, shortened links, suspicious TLDs - pattern matching only, never fetched)
    link_pattern = (
        r"https?://[^\s]+|www\.[^\s]+|"
        r"\b(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|buff\.ly|ow\.ly|cutt\.ly|shorturl\.at|rb\.gy)/[^\s]+|"
        r"\b[a-zA-Z0-9-]+\.(?:xyz|top|work|click|tk|ml|ga|cf|gq|club|online|site|app|link)(?:/[^\s]*)?\b"
    )
    if re.search(link_pattern, norm):
        triggered_flags.append("suspicious_link")

    # Determine minimum risk level
    if any(flag in HIGH_RISK_FLAGS for flag in triggered_flags):
        min_risk = RiskLevel.HIGH.value
    elif any(flag in MEDIUM_RISK_FLAGS for flag in triggered_flags):
        min_risk = RiskLevel.MEDIUM.value
    else:
        min_risk = RiskLevel.UNKNOWN.value

    # Build bilingual indicators
    indicators = [
        INDICATOR_TEMPLATES[flag]
        for flag in triggered_flags
        if flag in INDICATOR_TEMPLATES
    ]

    return SafetyResult(
        flags=triggered_flags,
        minimum_risk_level=min_risk,
        indicators=indicators,
    )


def apply_minimum_risk(
    ai_level: Union[str, RiskLevel],
    minimum_level: Union[str, RiskLevel],
) -> str:
    """Enforces rule that AI output can never lower the risk below the deterministic minimum.

    Risk hierarchy: unknown (0) < low (1) < medium (2) < high (3)
    """
    ai_val = ai_level.value if isinstance(ai_level, RiskLevel) else str(ai_level).lower()
    min_val = minimum_level.value if isinstance(minimum_level, RiskLevel) else str(minimum_level).lower()

    ai_score = RISK_ORDER.get(ai_val, 0)
    min_score = RISK_ORDER.get(min_val, 0)

    if min_score >= ai_score:
        return min_val
    return ai_val
