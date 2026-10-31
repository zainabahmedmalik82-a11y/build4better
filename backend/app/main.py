from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

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
