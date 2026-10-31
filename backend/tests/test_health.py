"""Tests for GET /api/health and CORS configuration."""

import pytest
from unittest.mock import patch


class TestHealthEndpoint:
    def test_health_returns_200(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200

    def test_health_returns_exact_body(self, client):
        response = client.get("/api/health")
        assert response.json() == {"status": "healthy", "service": "Sahaara Backend"}

    def test_health_content_type_is_json(self, client):
        response = client.get("/api/health")
        assert "application/json" in response.headers.get("content-type", "")


class TestCORSPreflight:
    def test_allowed_origin_gets_cors_header(self, client):
        """CORS preflight from http://localhost:5173 must be accepted."""
        response = client.options(
            "/api/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )
        assert response.status_code == 200
        acao = response.headers.get("access-control-allow-origin")
        assert acao == "http://localhost:5173"

    def test_second_allowed_origin_gets_cors_header(self, client):
        """CORS preflight from http://127.0.0.1:5173 must also be accepted."""
        response = client.options(
            "/api/health",
            headers={
                "Origin": "http://127.0.0.1:5173",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )
        assert response.status_code == 200
        acao = response.headers.get("access-control-allow-origin")
        assert acao == "http://127.0.0.1:5173"

    def test_disallowed_origin_has_no_cors_header(self, client):
        """CORS preflight from a random origin must NOT receive allow-origin header."""
        response = client.options(
            "/api/health",
            headers={
                "Origin": "http://evil-site.com",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )
        acao = response.headers.get("access-control-allow-origin")
        assert acao is None or acao != "http://evil-site.com"

    def test_wildcard_not_used(self, client):
        """Access-Control-Allow-Origin must never be a wildcard '*'."""
        response = client.options(
            "/api/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            },
        )
        acao = response.headers.get("access-control-allow-origin", "")
        assert acao != "*"

