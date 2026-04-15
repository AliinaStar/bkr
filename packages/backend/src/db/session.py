"""Database session management."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession, AsyncEngine

from src.db.engine import get_engine

_engine: AsyncEngine | None = None
_async_sessionmaker: async_sessionmaker[AsyncSession] | None = None


def get_async_sessionmaker() -> async_sessionmaker[AsyncSession]:
    """Return a shared async sessionmaker, creating it once"""
    global _engine, _async_sessionmaker
    if _async_sessionmaker is None:
        _engine = get_engine()
        _async_sessionmaker = async_sessionmaker(bind=_engine, expire_on_commit=False)
    return _async_sessionmaker


async def get_db_session() -> AsyncGenerator[AsyncSession]:
    """Yield a DB session and close it after use."""
    session_factory = get_async_sessionmaker()
    async with session_factory() as session:
        yield session
