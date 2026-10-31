from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field, field_validator

from app.core.config import settings


class RiskLevel(str, Enum):
    """Permitted risk levels for scam analysis."""

    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    UNKNOWN = "unknown"


class ScamAnalyzeRequest(BaseModel):
    """Request payload for scam analysis."""

    message: str = Field(
        ...,
        description="The suspicious message text to analyze.",
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Message must be a string.")
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message cannot be empty or contain only whitespace.")
        if len(stripped) > settings.MAX_MESSAGE_LENGTH:
            raise ValueError(
                f"Message length ({len(stripped)}) exceeds maximum allowed limit of {settings.MAX_MESSAGE_LENGTH} characters."
            )
        return stripped


class Indicator(BaseModel):
    """Bilingual warning indicator describing a scam signal."""

    en: str = Field(..., description="Warning indicator in English.")
    ur: str = Field(..., description="Warning indicator in Urdu.")


class ScamAnalyzeResponse(BaseModel):
    """Response payload returned by the scam analysis endpoint."""

    risk_level: RiskLevel = Field(
        ...,
        description="Assigned risk assessment level.",
    )
    summary_en: str = Field(
        ...,
        description="Summary explanation in English.",
    )
    summary_ur: str = Field(
        ...,
        description="Summary explanation in Urdu.",
    )
    indicators: list[Indicator] = Field(
        default_factory=list,
        description="Identified warning indicators.",
    )
    safe_steps: list[str] = Field(
        default_factory=list,
        description="Recommended safety steps.",
    )
    disclaimer_en: str = Field(
        ...,
        description="Guidance disclaimer in English.",
    )
    disclaimer_ur: str = Field(
        ...,
        description="Guidance disclaimer in Urdu.",
    )
    analysis_source: Literal["ai", "fallback"] = Field(
        default="ai",
        description="Source of the analysis: 'ai' or 'fallback'.",
    )
