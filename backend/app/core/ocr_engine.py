"""
Tesseract wrapper — runs OCR and returns both raw text and word-level
confidence, which the extractor and API layer use to build the
per-field confidence scores shown on the Review screen.
"""
import numpy as np
import pytesseract
from pytesseract import Output
from pytesseract.pytesseract import TesseractNotFoundError

from app.config import TESSERACT_CMD, OCR_LANG
from app.utils.validators import NoTextDetectedError, TesseractNotInstalled

if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def run_ocr(image: np.ndarray, lang: str = None) -> dict:
    """
    Returns:
        {
          "raw_text": str,
          "words": [{"text": str, "confidence": float, "left": int, "top": int}, ...]
        }
    Confidence is normalized to 0-1 (Tesseract returns 0-100).
    """
    ocr_lang = lang or OCR_LANG
    try:
        data = pytesseract.image_to_data(
            image, lang=ocr_lang, output_type=Output.DICT
        )
    except TesseractNotFoundError as exc:
        raise TesseractNotInstalled(
            "Tesseract OCR is not installed or not available in PATH. "
            "Install Tesseract and restart the server, or set SCRYBE_TESSERACT_CMD."
        ) from exc


    words = []
    for i, text in enumerate(data["text"]):
        text = text.strip()
        if not text:
            continue
        conf = float(data["conf"][i])
        if conf < 0:  # Tesseract uses -1 for non-text regions
            continue
        words.append({
            "text": text,
            "confidence": round(conf / 100, 4),
            "left": data["left"][i],
            "top": data["top"][i],
        })

    raw_text = " ".join(w["text"] for w in words)

    if not raw_text.strip():
        raise NoTextDetectedError(
            "No readable text was found in this document. Try a clearer scan."
        )

    return {"raw_text": raw_text, "words": words}
