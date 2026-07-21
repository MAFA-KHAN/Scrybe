"""
Pydantic response/request models — single source of truth for the API
contract defined in the guide's Section 8.
"""
from typing import Optional
from pydantic import BaseModel


class ExtractedFields(BaseModel):
    candidate_name: Optional[str] = None
    certificate_title: Optional[str] = None
    organization_name: Optional[str] = None
    issue_date: Optional[str] = None
    certificate_number: Optional[str] = None
    grade_score: Optional[str] = None
    duration: Optional[str] = None


class ExtractResponse(BaseModel):
    id: str
    fields: ExtractedFields
    confidence: dict[str, float]
    raw_text: str
    qr_data: Optional[str] = None



class ConfirmRequest(BaseModel):
    id: str
    fields: ExtractedFields


class ErrorResponse(BaseModel):
    error: str
    message: str
