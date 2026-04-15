"""Temporal coverage metric: how evenly retrieved chunks span different periods."""

from notebooks.evaluation.schemas import RetrievedChunk


def calculate_temporal_coverage(chunks: list[RetrievedChunk]) -> float:
    """Compute temporal spread of chunks across calendar months.

    Formula: (unique_months - 1) / (n_chunks - 1).

    Args:
        chunks: List of retrieved chunks with dates.

    Returns:
        Float in [0, 1]; 1.0 means every chunk is from a distinct month.

    Raises:
        ValueError: If fewer than 2 chunks are provided.
    """
    if len(chunks) < 2:
        raise ValueError("temporal_coverage requires at least 2 chunks")

    unique_months = len({c.date.strftime("%Y-%m") for c in chunks})
    return (unique_months - 1) / (len(chunks) - 1)
