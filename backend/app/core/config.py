import os
from pathlib import Path
from dotenv import load_dotenv

# Locate and load the backend .env file if present
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BACKEND_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)


def _parse_int(value: str | None, default: int) -> int:
    try:
        return int(value) if value is not None else default
    except (ValueError, TypeError):
        return default


class Settings:
    """Application configuration loaded from environment variables."""

    APP_NAME: str = os.getenv("APP_NAME", "Sahaara Backend")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    ALLOWED_ORIGINS_RAW: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )
    MAX_MESSAGE_LENGTH: int = _parse_int(os.getenv("MAX_MESSAGE_LENGTH"), 5000)

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS_RAW.split(",")
            if origin.strip()
        ]

    def __repr__(self) -> str:
        return (
            f"Settings(APP_NAME={self.APP_NAME!r}, "
            f"GROQ_MODEL={self.GROQ_MODEL!r}, "
            f"ALLOWED_ORIGINS={self.ALLOWED_ORIGINS!r}, "
            f"MAX_MESSAGE_LENGTH={self.MAX_MESSAGE_LENGTH}, "
            f"GROQ_API_KEY='***')"
        )


settings = Settings()
