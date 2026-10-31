import logging
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.schemas.scam import Indicator, RiskLevel, ScamAnalyzeRequest, ScamAnalyzeResponse
from app.services.scam_service import analyze_message

logger = logging.getLogger(__name__)

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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global catch-all error handler preventing raw tracebacks or secret exposure."""
    logger.error("Unhandled server exception: %s", type(exc).__name__)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal error occurred while processing the request."},
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
    """Analyze a suspicious message for scam indicators with AI and deterministic fallback."""
    return analyze_message(payload.message)
