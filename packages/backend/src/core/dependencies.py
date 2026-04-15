from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request


async def get_db(request: Request) -> AsyncGenerator[AsyncSession, None]:
    """Yield a database session for the duration of a request."""
    async with request.app.state.async_session() as session:
        yield session