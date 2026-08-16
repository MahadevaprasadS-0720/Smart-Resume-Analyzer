import os
from typing import Tuple
from app.core.config import settings


def get_file_extension(filename: str) -> str:
    """Returns lowercased file extension including the leading dot."""
    _, ext = os.path.splitext(filename)
    return ext.lower()


def validate_file_extension(filename: str) -> Tuple[bool, str]:
    """
    Validates if the uploaded file extension is allowed.
    """
    ext = get_file_extension(filename)
    if ext not in settings.ALLOWED_EXTENSIONS:
        allowed = ", ".join(settings.ALLOWED_EXTENSIONS)
        return False, f"Unsupported file format '{ext}'. Allowed formats: {allowed}"
    return True, ""
