"""RAGAS faithfulness and answer_relevancy for summary and report generation stages."""

import json
from typing import Any, Literal, Optional

from langchain_openai import ChatOpenAI

from notebooks.evaluation.prompts.answer_relevancy import ANSWER_RELEVANCY_TEMPLATE
from notebooks.evaluation.prompts.faithfulness import (
    FAITHFULNESS_EXTRACT_CLAIMS_TEMPLATE,
    FAITHFULNESS_VERIFY_CLAIM_TEMPLATE,
)
from notebooks.evaluation.schemas import PeriodSummary, ReportResult, RetrievedContext


def format_context(retrieved_context: RetrievedContext) -> str:
    parts = []

    if retrieved_context.moment_chunks:
        chunks_text = "\n---\n".join(
            c.text for c in retrieved_context.moment_chunks
        )
        parts.append(f"Retrieved entries:\n{chunks_text}")

    if retrieved_context.pattern_reports:
        reports_text = "\n---\n".join(
            r.text for r in retrieved_context.pattern_reports  # Report → str
        )
        parts.append(f"Retrieved reports:\n{reports_text}")

    return "\n\n".join(parts) if parts else ""


def calculate_faithfulness(
    data: PeriodSummary | ReportResult,
    stage: Literal["summary", "report"],
    llm: ChatOpenAI,
    trace: Optional[Any] = None,
) -> float | None:
    """Compute faithfulness via two-step LLM judge.

    Step 1: Extract atomic claims from generated text.
    Step 2: Verify each claim against retrieved context.
    Score = supported_claims / total_claims.

    Args:
        data: PeriodSummary for stage="summary", ReportResult for stage="report".
        stage: "summary" or "report" — determines Langfuse score name.
        llm: LangChain LLM client.
        trace: Optional Langfuse trace for logging.

    Returns:
        Faithfulness score in [0, 1], or None if computation fails.
    """
    try:
        generated_text = (
            data.summary_text if stage == "summary" else data.generated_text
        )
        retrieved_context = data.context

        if retrieved_context is None:
            return None

        context = format_context(retrieved_context)
        if not context:
            return None

        # крок 1: витягуємо атомарні твердження
        extract_prompt = FAITHFULNESS_EXTRACT_CLAIMS_TEMPLATE.format(
            generated_report=generated_text
        )
        claims_response = llm.invoke(extract_prompt)
        claims = json.loads(claims_response.content)["claims"]

        if not claims:
            return None

        # крок 2: верифікуємо кожне твердження
        scores = []
        for claim in claims:
            verify_prompt = FAITHFULNESS_VERIFY_CLAIM_TEMPLATE.format(
                context=context,
                claim=claim,
            )
            verify_response = llm.invoke(verify_prompt)
            score = json.loads(verify_response.content)["supported"]
            scores.append(int(score))

        faithfulness = sum(scores) / len(scores)

        if trace:
            trace.score(name=f"faithfulness_{stage}", value=faithfulness)

        return faithfulness

    except Exception:
        return None


def calculate_answer_relevancy(
    data: PeriodSummary | ReportResult,
    stage: Literal["summary", "report"],
    period_type: Literal["week", "month", "year"],
    report_goal: str,
    llm: ChatOpenAI,
    trace: Optional[Any] = None,
) -> int | None:
    """Compute answer relevancy via LLM judge on a 1-5 scale.

    Args:
        data: PeriodSummary for stage="summary", ReportResult for stage="report".
        stage: "summary" or "report" — determines Langfuse score name.
        period_type: "month" or "year" — used in judge prompt.
        period_start: Period start date string for context.
        llm: LangChain LLM client.
        trace: Optional Langfuse trace for logging.

    Returns:
        Relevancy score 1-5, or None if computation fails.
    """
    try:
        generated_text = (
            data.summary_text if stage == "summary" else data.generated_text
        )

        prompt = ANSWER_RELEVANCY_TEMPLATE.format(
            report_goal=report_goal,
            period_type=period_type,
            generated_report=generated_text,
        )

        response = llm.invoke(prompt)
        score = json.loads(response.content)["score"]

        if trace:
            trace.score(name=f"answer_relevancy_{stage}", value=score)

        return int(score)

    except Exception:
        return None
