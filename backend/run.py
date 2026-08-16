import uvicorn
from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT,
        log_level="info",
    )
