"""Diversity metric: average pairwise cosine similarity between retrieved chunks."""

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from notebooks.evaluation.schemas import RetrievedChunk


def calculate_diversity(chunks: list[RetrievedChunk]) -> float:
    """Compute mean pairwise cosine similarity; lower = more diverse = better for MMR.

    Args:
        chunks: List of retrieved chunks with embeddings.

    Returns:
        1 - avg_pairwise_similarity, in [0, 1].

    Raises:
        ValueError: If fewer than 2 chunks are provided.
    """
    if len(chunks) < 2:
        raise ValueError("diversity requires at least 2 chunks")

    embeddings = np.array([c.embedding for c in chunks])
    sim_matrix = cosine_similarity(embeddings)
    n = len(embeddings)
    pairs = [(i, j) for i in range(n) for j in range(i + 1, n)]
    avg_similarity = float(np.mean([sim_matrix[i][j] for i, j in pairs]))
    return 1.0 - avg_similarity
