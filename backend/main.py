"""
Scrybe backend entry point.
Run with: uvicorn main:app --reload
"""
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router
from app.config import ALLOWED_ORIGINS
from app.utils.validators import ScrybeError

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

app = FastAPI(
    title="Scrybe API",
    description="Certificate OCR system — Teerop Gen AI & LLM Applications Internship, Task 1",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ScrybeError)
async def scrybe_error_handler(request: Request, exc: ScrybeError):
    """Converts every custom exception into a structured, human-readable
    error response instead of a raw stack trace."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.error_code, "message": exc.message},
    )


app.include_router(router)
