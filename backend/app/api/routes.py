"""
All API routes. Endpoints match the guide's Section 8 contract, which
mirrors the internship PDF's Section 8.1 exactly (GET /, /health,
POST /upload, POST /extract, GET /results/{id}, DELETE /documents/{id}),
plus two additions for the review/export flow (/confirm, /export/{id}).
"""
import io
import logging
import uuid
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import StreamingResponse, FileResponse

from app.core.preprocessor import preprocess_image
from app.core.ocr_engine import run_ocr
from app.core.extractor import extract_fields
from app.utils.file_handler import load_image_from_bytes
from app.utils.validators import validate_upload, check_size, DocumentNotFoundError
from app.models.schemas import ExtractResponse, ConfirmRequest

import cv2
from app.config import UPLOAD_DIR

logger = logging.getLogger("scrybe")
router = APIRouter()


# In-memory store for Phase 1-3 (no DB yet — Phase 4 swaps this for SQLite/Postgres)
_documents: dict[str, dict] = {}


@router.get("/")
def home():
    return {"service": "scrybe", "status": "ok"}


@router.get("/health")
def health():
    return {"status": "healthy"}


@router.get("/sample-certificate")
def get_sample_certificate():
    """Serves the generated sample certificate file."""
    from app.config import SAMPLE_DIR
    sample_path = SAMPLE_DIR / "sample_cert.png"
    if not sample_path.exists():
        raise DocumentNotFoundError("Sample certificate not found.")
    return FileResponse(sample_path)


@router.get("/sample-certificates")
def list_sample_certificates():
    """Returns a list of all sample certificates available for scanning."""
    from app.config import SAMPLE_DIR, ALLOWED_EXTENSIONS
    samples = []
    for f in sorted(SAMPLE_DIR.iterdir()):
        if f.suffix.lower() in ALLOWED_EXTENSIONS:
            # Build a human-friendly label from filename
            label = f.stem.replace("_", " ").replace("-", " ").title()
            samples.append({
                "filename": f.name,
                "label": label,
                "type": f.suffix.lower().lstrip("."),
            })
    return samples


@router.get("/sample-certificates/{filename}")
def serve_sample_certificate(filename: str):
    """Serves a specific sample certificate file by name."""
    from app.config import SAMPLE_DIR, ALLOWED_EXTENSIONS
    # Security: prevent path traversal
    safe_name = Path(filename).name
    sample_path = SAMPLE_DIR / safe_name
    if not sample_path.exists() or sample_path.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise DocumentNotFoundError(f"Sample certificate '{safe_name}' not found.")
    return FileResponse(sample_path)


@router.get("/audit")
def get_audit_trail():
    """Returns a list of all processed documents for the audit trail."""
    trail = []
    for doc_id, doc in _documents.items():
        trail.append({
            "id": doc_id,
            "filename": doc.get("filename"),
            "status": doc.get("status"),
            "raw_text_length": len(doc.get("raw_text", "")),
            "qr_data": doc.get("qr_data"),
        })
    return trail


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    """Accepts a file and stores it, without running OCR yet — mirrors
    the PDF's separate /upload vs /extract endpoints."""
    validate_upload(file)
    data = await file.read()
    check_size(len(data))

    doc_id = str(uuid.uuid4())
    _documents[doc_id] = {"filename": file.filename, "raw_bytes": data, "status": "uploaded"}
    logger.info("Uploaded document %s (%s)", doc_id, file.filename)
    return {"id": doc_id, "filename": file.filename, "status": "uploaded"}


@router.post("/extract", response_model=ExtractResponse)
async def extract(file: UploadFile = File(...), lang: Optional[str] = Query(None)):
    """Full pipeline: load image -> grayscale -> OCR -> extract fields. Supports QR & language selection."""
    validate_upload(file)
    data = await file.read()
    check_size(len(data))

    doc_id = str(uuid.uuid4())

    # Save the file to uploads/ for debugging
    try:
        debug_file_path = UPLOAD_DIR / f"debug_{doc_id}_{file.filename}"
        with open(debug_file_path, "wb") as f:
            f.write(data)
        logger.info("Saved upload debug file to %s", debug_file_path)
    except Exception as e:
        logger.error("Failed to save debug file: %s", e)

    # 1. Digital PDF Text Extraction Fallback (Bypasses Poppler & Tesseract completely)
    is_pdf = file.filename.lower().endswith(".pdf")
    digital_text = None
    digital_words = []

    if is_pdf:
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(data))
            text_pages = []
            for page in reader.pages:
                t = page.extract_text()
                if t:
                    text_pages.append(t)
            if text_pages:
                digital_text = "\n".join(text_pages).strip()
                if len(digital_text) > 10:
                    for w in digital_text.split():
                        digital_words.append({"text": w, "confidence": 0.99})
                    logger.info("Extracted digital PDF text using pypdf (%d chars)", len(digital_text))
        except Exception as e:
            logger.error("Digital PDF text extraction failed: %s", e)

    # If digital text was successfully extracted, skip Tesseract and Poppler!
    if digital_text:
        fields, confidence = extract_fields(digital_text, digital_words)
        _documents[doc_id] = {
            "filename": file.filename,
            "fields": fields,
            "confidence": confidence,
            "raw_text": digital_text,
            "status": "extracted",
            "qr_data": None,
        }
        logger.info("Extracted digital PDF %s: %s", doc_id, fields)
        return {
            "id": doc_id,
            "fields": fields,
            "confidence": confidence,
            "raw_text": digital_text,
            "qr_data": None,
        }

    # 2. Convert PDF/Image to BGR OpenCV Array (Requires Poppler for scanned PDFs)
    try:
        image = load_image_from_bytes(data, file.filename)
    except Exception as exc:
        err_msg = str(exc).lower()
        if "poppler" in err_msg or "page count" in err_msg or "pdf2image" in err_msg:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=400,
                detail="PDF processing failed because Poppler is not installed on this system. "
                       "Please download Poppler for Windows and add its 'bin/' folder to your system PATH to scan image-based PDFs."
            )
        raise exc

    # 3. QR Code Detection
    qr_data = None
    try:
        detector = cv2.QRCodeDetector()
        val, _, _ = detector.detectAndDecode(image)
        if val:
            qr_data = val
            logger.info("Detected QR Code: %s", qr_data)
    except Exception as e:
        logger.error("QR Code detection failed: %s", e)

    # 4. Smart OCR Pipeline (Direct Grayscale -> Preprocessing Fallback)
    ocr_result = None
    fallback_used = False

    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        ocr_result = run_ocr(gray, lang=lang)
        if len(ocr_result.get("raw_text", "")) < 40:
            raise ValueError("Insufficient text detected on raw grayscale image")
        logger.info("Grayscale OCR succeeded (extracted %d chars)", len(ocr_result["raw_text"]))
    except Exception as exc:
        logger.info("Grayscale OCR failed/insufficient: %s. Falling back to preprocessing...", exc)
        fallback_used = True
        processed = preprocess_image(image)
        ocr_result = run_ocr(processed, lang=lang)
        logger.info("Preprocessor fallback OCR succeeded (extracted %d chars)", len(ocr_result["raw_text"]))

    fields, confidence = extract_fields(ocr_result["raw_text"], ocr_result["words"])

    _documents[doc_id] = {
        "filename": file.filename,
        "fields": fields,
        "confidence": confidence,
        "raw_text": ocr_result["raw_text"],
        "status": "extracted",
        "qr_data": qr_data,
    }
    logger.info("Extracted document %s (fallback=%s): %s", doc_id, fallback_used, fields)


    return {
        "id": doc_id,
        "fields": fields,
        "confidence": confidence,
        "raw_text": ocr_result["raw_text"],
        "qr_data": qr_data,
    }




@router.get("/results/{doc_id}")
def get_results(doc_id: str):
    doc = _documents.get(doc_id)
    if not doc:
        raise DocumentNotFoundError(f"No document found with id {doc_id}.")
    return doc


@router.post("/confirm")
def confirm(payload: ConfirmRequest):
    """Locks in user-corrected fields from the Review screen."""
    doc = _documents.get(payload.id)
    if not doc:
        raise DocumentNotFoundError(f"No document found with id {payload.id}.")
    doc["fields"] = payload.fields.model_dump()
    doc["status"] = "confirmed"
    return {"id": payload.id, "status": "confirmed"}


@router.get("/export/{doc_id}")
def export(doc_id: str):
    doc = _documents.get(doc_id)
    if not doc:
        raise DocumentNotFoundError(f"No document found with id {doc_id}.")

    df = pd.DataFrame([doc["fields"]])
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False, engine="openpyxl")
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=scrybe_{doc_id[:8]}.xlsx"},
    )


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: str):
    if doc_id not in _documents:
        raise DocumentNotFoundError(f"No document found with id {doc_id}.")
    del _documents[doc_id]
    return {"id": doc_id, "status": "deleted"}
