<p align="center">
  <img src="https://img.shields.io/badge/Scrybe-Certificate%20Intelligence-0B2545?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE0IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4eiI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjE0IDIgMTQgOCAyMCA4Ij48L3BvbHlsaW5lPjxsaW5lIHgxPSIxNiIgeTE9IjEzIiB4Mj0iOCIgeTI9IjEzIj48L2xpbmU+PGxpbmUgeDE9IjE2IiB5MT0iMTciIHgyPSI4IiB5Mj0iMTciPjwvbGluZT48bGluZSB4MT0iMTAiIHkxPSI5IiB4Mj0iOCIgeTI9IjkiPjwvbGluZT48L3N2Zz4=&logoColor=white" alt="Scrybe Badge" />
</p>

<h1 align="center">Scrybe</h1>
<h3 align="center">AI-Powered Certificate Processing & Extraction</h3>

<p align="center">
  <em>Extract structured information from certificates and official documents in seconds.</em><br/>
  <em>Scrybe combines OCR, computer vision, and intelligent field recognition to transform static files into clean, searchable data.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/react-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Tesseract-OCR%205.x-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/powered%20by-MAFA-0B2545?style=flat-square" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-acknowledgements">Acknowledgements</a>
</p>

---

## 🎯 What is Scrybe?

**Scrybe** is a **certificate-focused** document intelligence platform that automates the extraction of structured information from certificates — academic transcripts, professional certifications, training records, and other official documents.

It is **not** a general-purpose OCR tool. Scrybe is purpose-built for **certificate processing**: it understands the typical layout and fields of certificates and uses rule-based structured extraction to pull out specific data points with confidence scores.

### Key Capabilities

| Capability | Description |
|---|---|
| 🔍 **OCR Extraction** | Tesseract OCR 5.x engine for high-accuracy text recognition |
| 🖼️ **Image Enhancement** | OpenCV-based preprocessing — grayscale, thresholding, noise removal, deskewing |
| 📄 **Multi-Format Support** | PDF, PNG, JPG, and TIFF input formats |
| 🧠 **Intelligent Field Detection** | Rule-based regex extraction for 7+ structured fields |
| 📊 **Confidence Scoring** | Per-field confidence analysis for extraction quality assessment |
| 📋 **QR/Barcode Detection** | Automatic detection and decoding of embedded QR codes |
| 📤 **Multiple Export Formats** | JSON, Excel (.xlsx), and clipboard export |
| 🎨 **Modern UI** | Premium React interface with real-time processing feedback |

---

## 🏗️ Architecture

```
scrybe/
├── backend/                    # FastAPI Python Backend
│   ├── main.py                 # Application entry point & CORS config
│   ├── requirements.txt        # Python dependencies
│   ├── sample_certificates/    # Built-in sample documents for testing
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py       # REST API endpoints
│   │   ├── core/
│   │   │   ├── ocr.py          # Tesseract OCR engine wrapper
│   │   │   ├── extractor.py    # Structured field extraction (regex)
│   │   │   ├── preprocessor.py # OpenCV image enhancement pipeline
│   │   │   └── qr_reader.py    # QR/Barcode detection
│   │   ├── models/
│   │   │   └── schemas.py      # Pydantic data models
│   │   ├── utils/
│   │   │   └── file_handler.py # File validation & management
│   │   └── config.py           # Application configuration
│   └── tests/                  # Pytest test suite (21 tests)
│       ├── test_api.py         # API integration tests
│       └── test_extractor.py   # Unit tests for field extraction
│
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Marketing landing page
│   │   │   └── Scanner.jsx     # Document processing interface
│   │   ├── components/
│   │   │   ├── landing/        # Nav, Hero, Workflow, About, Contact
│   │   │   └── scanner/        # Upload, Processing, Review, Results states
│   │   ├── App.jsx             # Router configuration
│   │   └── index.css           # Design system & animations
│   ├── package.json
│   ├── vite.config.js          # Dev server with API proxy
│   └── tailwind.config.js      # Custom theme (navy/slate palette)
│
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

| Dependency | Version | Purpose |
|---|---|---|
| **Python** | 3.10+ | Backend runtime |
| **Node.js** | 18+ | Frontend toolchain |
| **Tesseract OCR** | 5.x | OCR engine ([Install Guide](https://github.com/tesseract-ocr/tesseract#installing-tesseract)) |
| **Poppler** | Latest | PDF to image conversion ([Windows](https://github.com/oschwartz10612/poppler-windows/releases)) |

### 1. Clone the Repository

```bash
git clone git@github.com:MAFA-KHAN/Scrybe.git
cd Scrybe
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8100
```

> **Note:** Make sure `tesseract` is in your system PATH, or set the `TESSERACT_CMD` environment variable to point to the Tesseract executable.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at **http://localhost:5173** with the API proxied to port 8100.

---

## 📖 Usage

### Processing Pipeline

Scrybe follows a **4-phase processing pipeline** for every document:

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│   Upload    │────▶│   Analyze    │────▶│    Review    │────▶│   Export    │
│  Document   │     │   Content    │     │    Fields    │     │   Results   │
└─────────────┘     └──────────────┘     └──────────────┘     └─────────────┘
   PDF/IMG            OCR + CV             Validate AI          JSON/Excel
   Validate           Enhancement          Correct data         Clipboard
   Preview            Extract fields       Confidence %         Download
```

### Extracted Fields

Scrybe extracts the following structured fields from certificates:

| Field | Description | Example |
|---|---|---|
| `holder_name` | Certificate holder's full name | *Maria Garcia Torres* |
| `certificate_title` | Title or name of the certificate | *Certificate of Completion* |
| `issuing_organization` | Organization that issued the document | *Stanford University* |
| `issue_date` | Date the certificate was issued | *March 15, 2024* |
| `expiry_date` | Expiration date (if applicable) | *March 15, 2027* |
| `certificate_id` | Unique identifier or serial number | *CERT-2024-00847* |
| `course_or_program` | Associated course or program name | *Advanced Data Science* |

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/extract` | Upload and extract data from a certificate |
| `POST` | `/api/confirm` | Confirm/correct extracted fields |
| `GET` | `/api/export/{id}` | Export confirmed data as Excel (.xlsx) |
| `GET` | `/api/audit` | Retrieve session audit trail |
| `GET` | `/api/sample-certificates` | List available sample certificates |
| `GET` | `/api/sample-certificates/{filename}` | Download a sample certificate |
| `GET` | `/api/health` | Health check endpoint |

### Sample Request

```bash
curl -X POST http://localhost:8100/api/extract \
  -F "file=@certificate.png" \
  -H "Content-Type: multipart/form-data"
```

### Sample Response

```json
{
  "id": "a1b2c3d4",
  "filename": "certificate.png",
  "fields": {
    "holder_name": "Maria Garcia Torres",
    "certificate_title": "Certificate of Completion",
    "issuing_organization": "Stanford University",
    "issue_date": "March 15, 2024",
    "expiry_date": "",
    "certificate_id": "CERT-2024-00847",
    "course_or_program": "Advanced Data Science"
  },
  "confidence": {
    "holder_name": 0.92,
    "certificate_title": 0.95,
    "issuing_organization": 0.88,
    "issue_date": 0.91,
    "expiry_date": 0.0,
    "certificate_id": 0.85,
    "course_or_program": 0.90
  },
  "raw_text": "...",
  "qr_data": null
}
```

---

## 🧪 Testing

Scrybe includes a comprehensive test suite with **21 tests** covering both API integration and extraction logic:

```bash
cd backend

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --tb=short
```

| Test Category | Count | Description |
|---|---|---|
| API Integration | 11 | End-to-end endpoint testing |
| Extractor Unit | 10 | Regex field extraction validation |

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Role |
|---|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115.0 | Web framework & REST API |
| [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) | 5.x | Optical character recognition engine |
| [OpenCV](https://opencv.org/) | 4.10.0 | Computer vision & image preprocessing |
| [Pillow](https://python-pillow.org/) | 10.4.0 | Image format handling |
| [pdf2image](https://github.com/Belval/pdf2image) | 1.17.0 | PDF to image conversion |
| [pypdf](https://github.com/py-pdf/pypdf) | 4.3.1 | PDF text extraction |
| [Pandas](https://pandas.pydata.org/) | 2.2.2 | Data manipulation & Excel export |
| [Pytest](https://pytest.org/) | 8.3.2 | Testing framework |

### Frontend

| Technology | Version | Role |
|---|---|---|
| [React](https://react.dev/) | 18.3.1 | UI component library |
| [Vite](https://vitejs.dev/) | 5.4.8 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.13 | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | 12.42.2 | Animations & transitions |
| [React Router](https://reactrouter.com/) | 6.26.2 | Client-side routing |
| [Lucide React](https://lucide.dev/) | 1.24.0 | Icon library |

---

## 📁 Environment Configuration

| Variable | Default | Description |
|---|---|---|
| `TESSERACT_CMD` | `tesseract` | Path to Tesseract executable |
| `UPLOAD_DIR` | `backend/uploads` | Directory for uploaded files |
| `MAX_FILE_SIZE` | `10MB` | Maximum upload file size |
| `ALLOWED_EXTENSIONS` | `.pdf,.png,.jpg,.jpeg,.tiff` | Accepted file formats |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to Scrybe:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m 'Add your feature'`)
4. **Push** to your branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

For bugs or feature requests, please [open an issue](https://github.com/MAFA-KHAN/Scrybe/issues).

---

## 🙏 Acknowledgements

### Tesseract OCR

Scrybe is built on top of **[Tesseract OCR](https://github.com/tesseract-ocr/tesseract)** — the most widely-used open-source OCR engine in the world.

> Tesseract was originally developed at Hewlett-Packard Laboratories Bristol UK and at Hewlett-Packard Co, Greeley Colorado USA between 1985 and 1994, with some more changes made in 1996 to port to Windows, and some C++izing in 1998. In 2005, Tesseract was open-sourced by HP. From 2006 until August 2017 it was developed by Google.

Tesseract 4+ adds a **neural net (LSTM) based OCR engine** focused on line recognition. It has **Unicode (UTF-8) support** and can recognize **100+ languages** out of the box. The current lead developer is **Stefan Weil**, and the maintainer is **Zdenko Podobny**.

Tesseract supports various image formats (PNG, JPEG, TIFF) and output formats (plain text, hOCR, PDF, TSV, ALTO, and PAGE).

- **Repository:** [github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)
- **License:** Apache License 2.0
- **Documentation:** [tesseract-ocr.github.io](https://tesseract-ocr.github.io/)
- **Training:** [Tesseract Training Guide](https://tesseract-ocr.github.io/tessdoc/Training-Tesseract.html)

Tesseract uses the **[Leptonica](http://leptonica.org/)** library (BSD 2-clause license) for image processing.

> We gratefully acknowledge the Tesseract OCR project and its contributors for making high-quality optical character recognition freely available to the open-source community. Without Tesseract, Scrybe would not be possible.

### Other Open-Source Projects

Scrybe also relies on and is grateful to the following open-source projects:

- **[OpenCV](https://opencv.org/)** — Computer vision and image processing (Apache 2.0)
- **[FastAPI](https://fastapi.tiangolo.com/)** — Modern Python web framework (MIT)
- **[React](https://react.dev/)** — UI component library (MIT)
- **[Vite](https://vitejs.dev/)** — Next-generation frontend tooling (MIT)
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework (MIT)
- **[Framer Motion](https://www.framer.com/motion/)** — Production-ready animations (MIT)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

> **Note:** This software depends on third-party packages that may be licensed under different open-source licenses. In particular, [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) is licensed under the Apache License 2.0, and [Leptonica](http://leptonica.org/) uses a BSD 2-clause license.

---

<p align="center">
  <strong>Powered by MAFA</strong><br/>
  <sub>Built with ☕ and a passion for document intelligence</sub><br/><br/>
  <a href="https://github.com/MAFA-KHAN/Scrybe">
    <img src="https://img.shields.io/badge/GitHub-MAFA--KHAN%2FScrybe-0B2545?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
</p>
