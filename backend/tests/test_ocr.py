"""
Unit tests for the Scrybe OCR core modules:
- preprocessor
- ocr_engine (mocked)
- extractor
"""
import re
import numpy as np
import pytest
from app.core.preprocessor import preprocess_image
from app.core.extractor import extract_fields, _split_lines


# ── preprocessor ─────────────────────────────────────────────────────────────

def test_preprocess_returns_grayscale_shape():
    """preprocess_image should return a 2-D (grayscale) array."""
    color_image = np.ones((100, 200, 3), dtype=np.uint8) * 200
    result = preprocess_image(color_image)
    assert result.ndim == 2, "Expected a 2-D grayscale image"


def test_preprocess_all_white_image():
    """Pure white image should not crash the preprocessor."""
    white = np.ones((100, 200, 3), dtype=np.uint8) * 255
    result = preprocess_image(white)
    assert result is not None
    assert result.ndim == 2


# ── extractor ─────────────────────────────────────────────────────────────────

def test_extractor_returns_all_seven_fields():
    """extract_fields must return all 7 field keys and their confidence keys."""
    expected = {
        "candidate_name", "certificate_title", "organization_name",
        "issue_date", "certificate_number", "grade_score", "duration",
    }
    fields, confidence = extract_fields("Some sample text from a certificate.", [])
    assert set(fields.keys()) == expected
    assert set(confidence.keys()) == expected


def test_extractor_finds_date():
    """A clearly labelled date should be extracted."""
    text = "Date of Issue: 15 July 2026"
    fields, _ = extract_fields(text, [])
    assert fields["issue_date"] is not None
    assert "2026" in fields["issue_date"]


def test_extractor_finds_name_after_certifies_that():
    """'This certifies that <Name>' phrasing should yield the candidate name."""
    text = "This certifies that\nJohn Alexander Smith\nhas completed the course."
    fields, _ = extract_fields(text, [])
    assert fields["candidate_name"] is not None
    assert "Smith" in fields["candidate_name"] or "John" in fields["candidate_name"]


def test_extractor_finds_certificate_number():
    """A labelled certificate number should be extracted."""
    text = "Certificate No: TP-2026-0417"
    fields, _ = extract_fields(text, [])
    assert fields["certificate_number"] is not None
    assert "TP-2026-0417" in fields["certificate_number"]


def test_extractor_finds_grade():
    """A percentage grade should be captured."""
    text = "Grade: A+\nScore: 95%"
    fields, _ = extract_fields(text, [])
    assert fields["grade_score"] is not None


def test_extractor_finds_duration():
    """A duration string should be extracted."""
    text = "Duration: 6 weeks"
    fields, _ = extract_fields(text, [])
    assert fields["duration"] is not None
    assert "6" in fields["duration"]


def test_split_lines_handles_crlf():
    """_split_lines must handle CRLF, CR, and LF line endings."""
    text = "Line one\r\nLine two\rLine three\nLine four"
    lines = _split_lines(text)
    assert len(lines) == 4
    assert lines[0] == "Line one"
    assert lines[3] == "Line four"


def test_confidence_returns_float_for_matched_words():
    """confidence scores should be floats in [0, 1]."""
    text = "This certifies that Jane Doe has completed the course."
    words = [
        {"text": "Jane", "confidence": 0.95},
        {"text": "Doe", "confidence": 0.92},
        {"text": "certifies", "confidence": 0.88},
    ]
    _, confidence = extract_fields(text, words)
    for field_name, score in confidence.items():
        assert isinstance(score, float), f"{field_name} confidence is not a float"
        assert 0.0 <= score <= 1.0, f"{field_name} confidence {score} out of range"
