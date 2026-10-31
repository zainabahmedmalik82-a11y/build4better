"""
conftest.py - shared fixtures for all Sahaara backend tests.

Key guarantees:
- GROQ_API_KEY is patched to empty before any test runs so real keys in
  backend/.env can NEVER accidentally be used.
- A TestClient fixture is provided so all endpoint tests share one app instance.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch


@pytest.fixture(autouse=True)
def no_real_groq_key():
    """Globally replace the GROQ_API_KEY with empty so tests never hit a real API."""
    with patch.object(__import__("app.core.config", fromlist=["settings"]).settings.__class__,
                      "GROQ_API_KEY", ""):
        yield


@pytest.fixture()
def client():
    """Return a TestClient for the FastAPI application."""
    from app.main import app
    # Do NOT use context manager (with ... as tc) — it can hang on Windows
    # due to an anyio/asyncio lifespan event-loop conflict.
    tc = TestClient(app, raise_server_exceptions=False)
    yield tc
