"""Langfuse client initialization for evaluation tracking."""

from langfuse import Langfuse

from src.core.settings import get_settings


def get_langfuse_client() -> Langfuse:
    """Create an authenticated Langfuse client from application settings."""
    s = get_settings()
    return Langfuse(
        public_key=s.langfuse_public_key,
        secret_key=s.langfuse_secret_key,
        host=s.langfuse_base_url,
    )
