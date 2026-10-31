"""Pydantic schemas for request and response validation."""

from app.schemas.scam import Indicator, RiskLevel, ScamAnalyzeRequest, ScamAnalyzeResponse

__all__ = [
    "Indicator",
    "RiskLevel",
    "ScamAnalyzeRequest",
    "ScamAnalyzeResponse",
]
