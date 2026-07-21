"""
Integration tests for all Scrybe API endpoints.
Covers the PDF Section 8.1 endpoints + review/export additions.
"""
import io
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_home():
    """GET / returns service status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "scrybe"
    assert data["status"] == "ok"


def test_health_check():
    """GET /health returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_upload_rejects_bad_extension():
    """POST /upload with a .txt file returns 415 Unsupported Media Type."""
    response = client.post(
        "/upload",
        files={"file": ("test.txt", b"some content", "text/plain")},
    )
    assert response.status_code == 415


def test_upload_rejects_oversized_file():
    """POST /upload with a file exceeding the size limit returns 413."""
    big_data = b"A" * (11 * 1024 * 1024)  # 11 MB > 10 MB limit
    response = client.post(
        "/upload",
        files={"file": ("big.png", io.BytesIO(big_data), "image/png")},
    )
    assert response.status_code == 413


def test_upload_valid_file():
    """POST /upload with a valid PNG returns 200 and a document ID."""
    # 1x1 white PNG
    png_bytes = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
        b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00'
        b'\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18'
        b'\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    response = client.post(
        "/upload",
        files={"file": ("cert.png", io.BytesIO(png_bytes), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["filename"] == "cert.png"
    assert data["status"] == "uploaded"


def test_missing_document_returns_404():
    """GET /results/{doc_id} with unknown ID returns 404."""
    response = client.get("/results/nonexistent-doc-id-99999")
    assert response.status_code == 404


def test_delete_missing_document_returns_404():
    """DELETE /documents/{doc_id} with unknown ID returns 404."""
    response = client.delete("/documents/nonexistent-doc-id-99999")
    assert response.status_code == 404


def test_audit_trail_is_list():
    """GET /audit returns a list (may be empty)."""
    response = client.get("/audit")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_sample_certificates_list():
    """GET /sample-certificates returns a list."""
    response = client.get("/sample-certificates")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_confirm_missing_document_returns_404():
    """POST /confirm with an unknown doc id returns 404."""
    response = client.post(
        "/confirm",
        json={"id": "no-such-id", "fields": {"candidate_name": "Test"}},
    )
    assert response.status_code == 404


def test_export_missing_document_returns_404():
    """GET /export/{doc_id} with unknown ID returns 404."""
    response = client.get("/export/no-such-id")
    assert response.status_code == 404
