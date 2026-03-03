from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine

from src.core.settings import get_settings


def get_engine() -> AsyncEngine:
    """Create an asynchronous SQLAlchemy engine."""
    settings = get_settings()
    return create_async_engine(
        settings.database_url,
        echo=(settings.app_env == "development"),
    )