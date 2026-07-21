"""
Central configuration for Scrybe backend.
All tunables live here so nothing is hardcoded in business logic.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# File handling
UPLOAD_DIR = BASE_DIR / "uploads"
SAMPLE_DIR = BASE_DIR / "sample_certificates"
MAX_FILE_SIZE_MB = int(os.getenv("SCRYBE_MAX_FILE_SIZE_MB", 10))
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tiff", ".pdf"}

# Poppler path auto-configuration for Windows
poppler_bin = r"C:\Users\SilentWishMAFA\Downloads\poppler-windows-26.02.0-0\poppler-windows-26.02.0-0\bin"
if os.path.exists(poppler_bin):
    os.environ["PATH"] += os.pathsep + poppler_bin

# OCR
TESSERACT_CMD = os.getenv("SCRYBE_TESSERACT_CMD", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
OCR_LANG = os.getenv("SCRYBE_OCR_LANG", "eng")

# Confidence thresholds (used by frontend to color the dots too — keep in sync)
CONFIDENCE_HIGH = 0.90
CONFIDENCE_MEDIUM = 0.70

# CORS (React dev server)
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

UPLOAD_DIR.mkdir(exist_ok=True)
