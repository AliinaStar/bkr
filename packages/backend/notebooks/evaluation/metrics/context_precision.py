"""Context precision metric: LLM judge rates each chunk's usefulness for the report."""

import json
from typing import Any, Optional

from langchain_openai import ChatOpenAI

from notebooks.evaluation.prompts.precision import PRECISION_PROMPT
from notebooks.evaluation.schemas import RetrievedChunk


def calculate_context_precision(
    chunks: list[RetrievedChunk],
    current_summary: str,
    llm: ChatOpenAI,
    trace: Optional[Any] = None,
) -> float:
    """LLM-judge context precision via Mean Graded Relevance.

    Each chunk is scored 0-2 by LLM judge.
    MGR = sum(scores) / (n_chunks * max_score).

    Args:
        chunks: List of retrieved chunks to evaluate.
        current_summary: Generated period summary as report context.
        llm: LangChain LLM client.
        trace: Optional Langfuse trace for logging.

    Returns:
        MGR score in [0, 1].

    Raises:
        ValueError: If fewer than 2 chunks are provided.
    """
    if len(chunks) < 2:
        raise ValueError("context_precision requires at least 2 chunks")

    scores: list[int] = []
    for chunk in chunks:
        try:
            prompt = PRECISION_PROMPT.format(
                current_summary=current_summary,
                chunk_text=chunk.text,
            )
            response = llm.invoke(prompt)
            score = json.loads(response.content)["score"]
            scores.append(score)
        except Exception:
            pass

    if not scores:
        return 0.0

    result = sum(scores) / (len(chunks) * 2)

    if trace:
        trace.score(name="context_precision", value=result)

    return result
