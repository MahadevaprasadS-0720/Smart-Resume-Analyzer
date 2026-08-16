# Smart Resume Analyzer - Backend

A modular FastAPI backend for analyzing resumes, parsing documents (PDF, DOCX), extracting skills, and calculating ATS match scores against job descriptions using Scikit-Learn and NLP techniques.

## Features
- **FastAPI Framework**: High performance, type-safe API with automatic OpenAPI Swagger docs (`/docs`).
- **File Parsers**: Extract structured text from PDF (`PyPDF2`) and DOCX (`python-docx`).
- **NLP & Matching**: Semantic similarity via TF-IDF & Cosine Similarity (`scikit-learn`), entity & skill matching across technical and soft skills taxonomy.
- **ATS Scoring Engine**: Multi-factor scoring for keywords, skill coverage, sections presence, and formatting metrics.
- **CORS Configured**: Pre-configured to allow frontend development requests from `http://localhost:5173`.

## Setup & Installation

### 1. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. (Optional) Download spaCy English Model
```bash
python -m spacy download en_core_web_sm
```

### 4. Run Development Server
```bash
python run.py
# or
uvicorn app.main:app --reload --port 8000
```

- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/v1/health
