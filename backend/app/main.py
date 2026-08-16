import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.cors import setup_cors
from app.api.routes import api_router

# Initialize FastAPI Application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Smart Resume Analyzer API powered by FastAPI, spaCy, and Scikit-Learn",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure Cross-Origin Resource Sharing (CORS)
setup_cors(app)

# Mount API Routers at /api and /api/v1
app.include_router(api_router, prefix="/api")
app.include_router(api_router, prefix=settings.API_V1_STR)

# -------------------------------------------------------------
# Single-Link Unified Web App Serving (frontend/dist)
# -------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

if FRONTEND_DIST.exists() and (FRONTEND_DIST / "index.html").exists():
    # Mount frontend static assets
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}", tags=["Frontend"])
    async def serve_frontend(full_path: str):
        # Don't intercept API or docs routes
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})

        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))

        # SPA fallback to index.html with no-cache headers
        return FileResponse(
            str(FRONTEND_DIST / "index.html"),
            headers={"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0"}
        )

else:
    @app.get("/", tags=["Root"])
    async def root():
        """
        Root entrypoint with API information and single-link build instruction.
        """
        return JSONResponse(
            content={
                "message": "Welcome to Smart Resume Analyzer API",
                "version": settings.VERSION,
                "docs": "/docs",
                "endpoints": {
                    "analyze": "/api/analyze",
                    "health": "/api/health",
                },
                "single_link_mode": "To run both UI and Backend on this single link, run 'npm run build' in frontend.",
                "cors_allowed_origins": settings.CORS_ORIGINS,
            }
        )
