from fastapi import FastAPI

app = FastAPI(
    title="Sahaara Backend",
    description="Backend API for Sahaara - Your Personal Digital Confidence Coach",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Welcome to Sahaara Backend API",
        "docs_url": "/docs",
    }
