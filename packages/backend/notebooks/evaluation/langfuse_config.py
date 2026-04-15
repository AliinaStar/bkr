"""Langfuse client initialization and trace helpers for evaluation tracking."""

from typing import Literal

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


def create_eval_trace(
    langfuse: Langfuse,
    method: str,
    period_type: Literal["month", "week", "year"],
    user_id: int,
    sample_id: str,
) -> object:
    """Create a Langfuse trace grouped by method + period_type.

    session_id = "{method}_{period_type}" groups all traces for the same
    method/period combination so Langfuse can show aggregate scores across users.

    Filter by tag "month" / "week" / "year" in the UI to compare across methods
    for a specific period type.

    Args:
        langfuse: Initialized Langfuse client.
        method: RAG method name, e.g. "baseline_rag", "rag_mmr", "gcr".
        period_type: "month", "week", or "year".
        user_id: ID of the user whose report is being evaluated.
        sample_id: Unique identifier for this evaluation sample.

    Returns:
        Langfuse trace ready to receive scores.
    """
    return langfuse.trace(
        name=f"eval_{sample_id}",
        session_id=f"{method}_{period_type}",
        tags=[method, period_type],
        metadata={"user_id": user_id, "method": method, "period_type": period_type},
    )
