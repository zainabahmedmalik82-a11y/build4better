"""Services module for external integrations and business logic."""

from app.services.groq_service import (
    GroqInvalidResponseError,
    GroqRateLimitError,
    GroqServiceError,
    GroqTimeoutError,
    GroqUnavailableError,
    analyze_with_groq,
)
from app.services.lesson_service import (
    generate_lesson,
    generate_lesson_with_groq,
    get_preset_lesson,
)
from app.services.scam_service import (
    DEFAULT_SAFE_STEPS,
    analyze_message,
    build_fallback_response,
)

__all__ = [
    "DEFAULT_SAFE_STEPS",
    "GroqInvalidResponseError",
    "GroqRateLimitError",
    "GroqServiceError",
    "GroqTimeoutError",
    "GroqUnavailableError",
    "analyze_message",
    "analyze_with_groq",
    "build_fallback_response",
    "generate_lesson",
    "generate_lesson_with_groq",
    "get_preset_lesson",
]
