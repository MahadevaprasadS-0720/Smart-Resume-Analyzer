from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import HealthCheckResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthCheckResponse)
@router.get("/", response_model=HealthCheckResponse)
async def check_health():
    """
    Health check endpoint returning system status, version, and CORS origins.
    """
    return HealthCheckResponse(
        status="healthy",
        version=settings.VERSION,
        service=settings.PROJECT_NAME,
        cors_origins=settings.CORS_ORIGINS,
    )
