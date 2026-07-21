"""
Custom exceptions + validation helpers.
Every failure mode maps to a specific exception so routes.py can return
structured, human-readable errors instead of generic 500s.
"""
from pathlib import Path
from fastapi import UploadFile

from app.config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB


class ScrybeError(Exception):
    """Base class for all Scrybe-specific errors."""
    status_code = 400
    error_code = "scrybe_error"

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class UnsupportedFileType(ScrybeError):
    status_code = 415
    error_code = "unsupported_format"


class FileTooLarge(ScrybeError):
    status_code = 413
    error_code = "file_too_large"


class CorruptFileError(ScrybeError):
    status_code = 422
    error_code = "corrupt_file"


class NoTextDetectedError(ScrybeError):
    status_code = 422
    error_code = "no_text_detected"


class DocumentNotFoundError(ScrybeError):
    status_code = 404
    error_code = "document_not_found"


class TesseractNotInstalled(ScrybeError):
    status_code = 500
    error_code = "tesseract_not_installed"


def validate_upload(file: UploadFile) -> None:
    """Raises a ScrybeError subclass if the upload fails basic checks."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise UnsupportedFileType(
            f"'{ext or 'unknown'}' isn't supported. Upload a JPG, PNG, TIFF, or PDF."
        )

    # UploadFile doesn't expose size directly in all cases; caller checks
    # actual bytes length after read() and calls check_size() below.


def check_size(num_bytes: int) -> None:
    max_bytes = MAX_FILE_SIZE_MB * 1024 * 1024
    if num_bytes > max_bytes:
        raise FileTooLarge(f"File exceeds the {MAX_FILE_SIZE_MB}MB limit.")
    if num_bytes == 0:
        raise CorruptFileError("The uploaded file is empty or unreadable.")
