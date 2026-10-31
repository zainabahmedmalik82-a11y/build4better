from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.schemas.scam import Indicator, RiskLevel, ScamAnalyzeRequest, ScamAnalyzeResponse

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Sahaara - Your Personal Digital Confidence Coach",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Sanitize validation errors to avoid echoing sensitive message content."""
    sanitized_errors = []
    for error in exc.errors():
        sanitized_errors.append(
            {
                "loc": list(error.get("loc", ())),
                "msg": str(error.get("msg", "")),
                "type": str(error.get("type", "")),
            }
        )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={"detail": sanitized_errors},
    )


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs_url": "/docs",
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Sahaara Backend",
    }


@app.post(
    "/api/scam/analyze",
    response_model=ScamAnalyzeResponse,
    status_code=status.HTTP_200_OK,
)
async def analyze_scam(payload: ScamAnalyzeRequest) -> ScamAnalyzeResponse:
    """Temporary stub endpoint for testing schema validation."""
    return ScamAnalyzeResponse(
        risk_level=RiskLevel.UNKNOWN,
        summary_en="Scam analysis engine is not yet connected (Step 3 stub).",
        summary_ur="اسکیم کے تجزیے کا انجن ابھی متصل نہیں ہے (مرحلہ 3 کا عارضی جواب)۔",
        indicators=[],
        safe_steps=[
            "Do not share OTPs, PINs, or passwords.",
            "Do not click on suspicious links.",
            "Contact official sources directly.",
        ],
        disclaimer_en="This analysis is guidance, not a guarantee.",
        disclaimer_ur="یہ تجزیہ صرف رہنمائی ہے، مکمل ضمانت نہیں۔",
    )
