# Smart Resume Analyzer - Modular Full-Stack Architecture

An AI-powered SaaS ATS (Applicant Tracking System) resume analyzer that parses resumes (PDF, DOCX, TXT), matches them against target job descriptions, computes semantic and keyword similarity using Scikit-Learn and NLP techniques, and provides actionable suggestions with a 1-click **Export ATS Report (PDF)**.

---

## ⚡ Run Complete Project in 1 Link

You can launch the complete full-stack application (Backend + Frontend) in one single click or command:

### 🌟 Option 1: 1-Click Launch All (Fastest)
- **Windows (Double-click)**: [start_all.bat](file:///d:/Smart%20resume%20analyzer/start_all.bat)
- **PowerShell**: `.\start_all.ps1`
- **Cross-Platform Python**: `python run_all.py`

*This automatically boots both servers and opens the app at:*
👉 **[http://localhost:5173](http://localhost:5173)**

---

### 🌐 Option 2: Single-Link Unified Server (Port 8000)
Runs the entire frontend bundle directly inside FastAPI so everything is served from **one single port/link**:
- **Windows (Double-click)**: [build_and_run_single_server.bat](file:///d:/Smart%20resume%20analyzer/build_and_run_single_server.bat)
- **PowerShell**: `.\build_and_run_single_server.ps1`

*This builds the UI and serves the full app at:*
👉 **[http://localhost:8000](http://localhost:8000)** (UI at `/`, API at `/api/analyze`, Docs at `/docs`)

---

## 📁 Project Structure

```
Smart resume analyzer/
├── run_all.py                         # Unified cross-platform Python runner
├── start_all.bat / .ps1               # 1-Click launcher for both Backend & Frontend
├── build_and_run_single_server.bat    # 1-Click single-server builder (:8000)
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes.py              # POST /api/analyze & /api/health
│   │   │   └── v1/
│   │   │       ├── health.py
│   │   │       └── analyzer.py
│   │   ├── core/
│   │   │   ├── config.py              # Settings & CORS configuration
│   │   │   └── cors.py                # CORS middleware
│   │   ├── models/
│   │   │   └── schemas.py             # Pydantic validation schemas
│   │   ├── services/
│   │   │   ├── parser.py              # PyPDF2 & python-docx file extractor
│   │   │   ├── nlp_analyzer.py        # spaCy & scikit-learn TF-IDF matching
│   │   │   └── suggestions.py         # Actionable suggestions & STAR bullets
│   │   ├── utils/
│   │   │   ├── text_cleaner.py
│   │   │   └── file_helpers.py
│   │   ├── __init__.py
│   │   └── main.py                    # FastAPI server & SPA static file host
│   ├── requirements.txt               # fastapi, uvicorn, spacy, scikit-learn, PyPDF2, python-docx, pydantic
│   ├── run.py
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Workflow steps (Resume -> NLP Analysis -> Job Match)
│   │   │   ├── SampleProfileSelector.jsx # 1-Click instant demo profiles (Frontend, Backend, Data)
│   │   │   ├── FileUpload.jsx         # Drag-and-drop resume uploader with real-time preview
│   │   │   ├── JobDescriptionInput.jsx# Target JD input with preset selectors
│   │   │   ├── ResumeOverviewCard.jsx # Left Column: candidate profile & skills
│   │   │   ├── JobMatchMetrics.jsx    # Right Column: circular match meter & missing skills
│   │   │   ├── ActionableBulletSuggestions.jsx # Bottom Section: measurable STAR bullets
│   │   │   ├── AtsReportPdfTemplate.jsx # Styled A4 PDF layout
│   │   │   └── AnalysisDashboard.jsx  # Main results orchestrator
│   │   ├── utils/
│   │   │   └── pdfGenerator.js        # html2pdf.js export utility
│   │   ├── data/
│   │   │   └── sampleProfiles.js      # Realistic benchmark demo profiles
│   │   ├── services/
│   │   │   └── api.js                 # Axios connector
│   │   ├── App.jsx                    # Main application container
│   │   ├── index.css                  # Clean white & slate blue SaaS styling
│   │   └── main.jsx
│   ├── package.json                   # React 18, Vite, Tailwind CSS, html2pdf.js, Lucide, Framer Motion
│   ├── vite.config.js
│   └── README.md
│
├── setup_backend.bat / .ps1           # Backend venv setup
├── start_backend.bat / .ps1           # Backend launcher (:8000)
└── start_frontend.bat / .ps1          # Frontend launcher (:5173)
```

---

## 🛠️ Technology Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, Scikit-Learn (TF-IDF & Cosine Similarity), PyPDF2, python-docx, Pydantic v2.
- **Frontend**: React 18, Vite, Tailwind CSS (Clean white & slate blue theme), Framer Motion, Lucide React, html2pdf.js / jsPDF, Axios.
- **Features**: Drag-and-Drop file preview, 1-click test benchmarks, animated circular match gauge, missing keywords red pills, experience fit rating, and copyable STAR bullet suggestions with PDF export.
