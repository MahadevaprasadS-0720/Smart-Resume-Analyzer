from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings


def setup_cors(app: FastAPI) -> None:
    """
    Configures Cross-Origin Resource Sharing (CORS) middleware on FastAPI application.
    Enables requests from specified frontend origins including http://localhost:5173.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
