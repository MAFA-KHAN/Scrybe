# Scrybe — final build guide (private, aligned to Teerop internship PDF)

Every section below is cross-checked against the official Teerop Gen AI & LLM Applications Internship PDF (Certificate OCR System, Task 1). Where the PDF specifies something exactly, this guide uses their spec, not a substitute — folder structure, API endpoints, extraction fields, and evaluation weights are all copied directly from the brief so nothing drifts.

---

## 1. Identity

- Name: **Scrybe**
- Alternates: Certiq, Lumecert
- Tagline: "Certificates, decoded."
- Framing for About section: built for Teerop's Gen AI & LLM Applications Internship (Task 1 — Certificate OCR System)

---

## 2. Visual identity — locked

- Background: pure white `#FFFFFF`
- Primary/brand: deep navy `#0B2545`
- Primary hover: `#14375E`
- Secondary text: slate gray `#5F5E5A`
- Border/hairline: `#E4E2DA`
- Confidence/status only (never decorative):
  - High confidence / success: green `#3B6D11`
  - Medium confidence / warning: amber `#854F0B`
  - Low confidence / error: red `#A32D2D`
- Decision: white + navy, not white + dark red — red is reserved for error/low-confidence signals so it doesn't compete with the brand color
- Typography: one family only (Inter, Manrope, or Sora), weights 400/500/600, no mixing fonts

---

## 3. Tech stack — finalized, matches PDF Section 5 exactly

- Language: Python 3.11+ (PDF requirement)
- Backend framework: FastAPI (PDF allows FastAPI or Flask — FastAPI chosen for async + auto-generated docs)
- OCR engine: Tesseract OCR 5.0+ via `pytesseract` (PDF requirement)
- Image processing: OpenCV 4.8+ (PDF requirement)
- PDF processing: `pdf2image` + Poppler (PDF requirement)
- Frontend: React (Vite) + Tailwind CSS — PDF only requires HTML5/CSS3/JS; React chosen as an upgrade, not a substitute
- Database (Phase 4 only, PDF marks this optional): SQLite → Postgres upgrade path
- Bonus/export: `pandas` + `openpyxl` for Excel export (PDF-listed bonus feature)
- Auth (Phase 4 only, not in PDF scope — internal roadmap item only)

---

## 4. Information architecture

- `/` — Landing page, single scroll: Hero → Workflow → About → Contact
- `/scanner` — the actual app (four states: Upload, Processing, Review, Results)
- Fixed nav bar with anchor links + "Launch Scanner" CTA

---

## 5. Page layouts

### 5.1 Landing — Hero
- Logo left, nav links (Workflow / About / Contact) + Launch Scanner button right
- H1: "Certificates, decoded."
- Subhead: one sentence value prop
- Single CTA: Launch Scanner
- Optional before/after visual

### 5.2 Landing — Workflow
- Three columns only, mapped directly to the PDF's actual pipeline phases:
  - Step 1: Upload — matches PDF Section 4.2 "Document Upload Phase"
  - Step 2: Extract — matches PDF Section 4.2 "OCR Processing Phase"
  - Step 3: Review — matches PDF Section 4.2 "Information Extraction Phase" + your own review addition
- Numeral badges in navy, one-line description each

### 5.3 Landing — About
- 2-3 sentences: what it is, what it's built for (Teerop Task 1), why
- No fake team/company copy — one honest paragraph

### 5.4 Landing — Contact
- Navy background (color inversion, footer only)
- Email, GitHub (MAFA-KHAN), optional LinkedIn
- Copyright line referencing Teerop internship

### 5.5 Scanner — Upload state
- Drag-drop zone, click-to-browse
- Formats shown: JPG, PNG, TIFF, PDF (matches PDF Section 6.1.1 exactly)
- "Try a sample certificate" link

### 5.6 Scanner — Processing state
- Three staged indicators, wired to real backend timing:
  - Reading document
  - Extracting fields
  - Structuring data

### 5.7 Scanner — Review state
- Left: pinned certificate thumbnail
- Right: editable field list, each with a confidence dot
- Fields = PDF Section 6.2.1 extraction fields exactly:
  - Candidate Name
  - Certificate Title
  - Organization Name
  - Issue Date
  - Certificate Number
  - Grade/Score (if available)
  - Duration (if available)
- Confirm & continue button

### 5.8 Scanner — Results state
- Success confirmation
- All confirmed fields displayed
- Copy to clipboard (PDF Section 6.2.2 requirement)
- Export Excel (PDF bonus feature)
- Session stats strip: docs processed, avg confidence, avg time
- "New scan" button

---

## 6. Feature list by phase (matches PDF Section 6 phase numbering)

### Phase 1 — Foundation (PDF Section 6.1) — done/near done
- Drag-and-drop upload, real-time preview
- Support JPG, PNG, TIFF, PDF
- Multi-page PDF processing
- Tesseract integration, raw text extraction

### Phase 2 — Intelligent Extraction (PDF Section 6.2) + Landing page
- Parse: Name, Certificate Title, Organization, Issue Date, Certificate Number, Grade/Score, Duration
- Structured JSON output, tabular display, copy-to-clipboard
- Landing page: Hero, Workflow, About, Contact — fully responsive

### Phase 3 — OCR Optimization (PDF Section 6.3) + Scanner UI
- Grayscale conversion, adaptive thresholding, noise reduction, deskewing (PDF Section 6.3.1 code reference)
- Full Scanner page: Upload, Processing, Review (with confidence scores), Results states
- Error handling for: bad file type, corrupt file, no text detected, oversized file, Tesseract failure

### Phase 4 — Advanced Features (PDF Section 6.4) — stretch/roadmap only, document in README as future work
- Database integration (SQLite/Postgres) — PDF-listed optional
- Batch processing — PDF-listed bonus
- QR/barcode detection — PDF-listed bonus
- Multi-language support — PDF-listed bonus
- Audit trail — PDF-listed bonus
- Auth/history dashboard — not in PDF, internal-only addition

---

## 7. Folder structure — matches PDF Section 7.1 exactly

```
certificate-ocr-system/
├── app/
│   ├── api/
│   │   ├── routes.py
│   │   └── endpoints/
│   ├── core/
│   │   ├── ocr_engine.py
│   │   ├── preprocessor.py
│   │   └── extractor.py
│   ├── models/
│   │   └── database.py
│   └── utils/
│       ├── file_handler.py
│       └── validators.py
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
│   ├── index.html
│   └── results.html
├── tests/
│   ├── test_ocr.py
│   └── test_api.py
├── sample_certificates/
├── uploads/
├── requirements.txt
├── README.md
├── .gitignore
└── main.py
```

Note: if building the React frontend instead of Jinja templates, replace `templates/` and `static/` with a separate `frontend/` folder (Vite + React), keep everything else identical to the PDF's structure.

---

## 8. API contract — matches PDF Section 8.1 exactly, plus your review/export additions

| Method | Endpoint | Source |
|---|---|---|
| GET | `/` | PDF spec |
| GET | `/health` | PDF spec |
| POST | `/upload` | PDF spec |
| POST | `/extract` | PDF spec |
| GET | `/results/{id}` | PDF spec |
| DELETE | `/documents/{id}` | PDF spec |
| POST | `/confirm` | Your addition — locks in corrected review fields |
| GET | `/export/{id}` | Your addition — Excel export |

`/extract` response shape:
```json
{
  "id": "uuid",
  "fields": {
    "candidate_name": "Ahmed Khan",
    "certificate_title": "Full Stack Development Internship",
    "organization_name": "Teerop Pvt. Limited",
    "issue_date": "12/07/2026",
    "certificate_number": "TP-2026-0417",
    "grade_score": null,
    "duration": null
  },
  "confidence": {
    "candidate_name": 0.96,
    "certificate_title": 0.91,
    "organization_name": 0.88,
    "issue_date": 0.94,
    "certificate_number": 0.72
  },
  "raw_text": "..."
}
```

---

## 9. Evaluation matrix — copied directly from PDF Section 10.1

| Weight | Criteria | What it means for you |
|---|---|---|
| 30% | Functionality | Full pipeline works: upload → OCR → structured fields → display |
| 25% | Code Quality | PEP 8, docstrings, type hints, modular structure matching Section 7 |
| 20% | UI/UX Design | Landing + Scanner pages, responsive, clean review flow |
| 15% | Error Handling | Every failure mode in Phase 3 has a specific message + proper HTTP code |
| 10% | Bonus Features | Excel export minimum; batch/QR/audit trail if time allows |

Time allocation should roughly track these weights — spend the most hours on Functionality and Code Quality combined (55%).

---

## 10. Submission checklist — copied directly from PDF Section 10.2

- [ ] Public GitHub repository, complete source code
- [ ] README.md with: project description, features, install/setup instructions, usage examples with screenshots, API documentation, testing instructions
- [ ] `requirements.txt` complete and current
- [ ] Sample certificates included in repo
- [ ] Screenshots of interface and results included
- [ ] Repo public before submission
- [ ] Submitted before portal opens July 14, 2026 deadline window

---

## 11. Developer execution checklist — do in order

**Setup**
- [ ] Create folder structure exactly per Section 7
- [ ] `venv` + install backend deps per PDF Section 5.2.2
- [ ] Install Tesseract + Poppler system dependencies (PDF Section 5.3)
- [ ] `npm create vite@latest` frontend + Tailwind, set palette from Section 2 as theme colors

**Backend (Phase 1–2)**
- [ ] `preprocessor.py` — grayscale, threshold, denoise, deskew (PDF Section 6.3.1 code reference)
- [ ] `ocr_engine.py` — Tesseract call, raw text + word-level confidence
- [ ] `extractor.py` — regex/keyword extraction for all 7 PDF-listed fields
- [ ] `routes.py` — wire up all 8 endpoints from Section 8
- [ ] Custom exceptions + structured error JSON for every failure mode
- [ ] Test against 5+ sample certificates

**Frontend — Landing (Phase 2)**
- [ ] Nav + Hero + Workflow + About + Contact
- [ ] Responsive check at mobile width

**Frontend — Scanner (Phase 3)**
- [ ] Upload state (drag-drop, preview, sample doc)
- [ ] Processing state (real staged feedback)
- [ ] Review state (editable fields + confidence dots)
- [ ] Results state (summary, copy, Excel export, stats strip)
- [ ] Error states for every backend failure mode

**Polish pass**
- [ ] Consistent spacing across all pages
- [ ] Hover states on every button
- [ ] Mobile check, both routes
- [ ] No `console.log`/`print()` debug leftovers, no hardcoded paths or keys

**Submission**
- [ ] Complete README per Section 10 checklist
- [ ] Screenshots taken: upload, review, results minimum
- [ ] Phase 4 roadmap documented honestly in README as future work
- [ ] Repo public, submitted before deadline

---

This is the final version — name, palette, stack, folder structure, and API contract are locked and PDF-verified. Nothing left to decide; only left to build.
