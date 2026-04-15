"""Main evaluation runner: runs all metrics for a single report."""

from typing import Any, Literal, Optional

from langchain_openai import ChatOpenAI

from notebooks.evaluation.metrics.context_precision import calculate_context_precision
from notebooks.evaluation.metrics.diversity import calculate_diversity
from notebooks.evaluation.metrics.ragas_metrics import (
    calculate_answer_relevancy,
    calculate_faithfulness,
)
from notebooks.evaluation.metrics.temporal_coverage import calculate_temporal_coverage
from notebooks.evaluation.schemas import (
    EvaluationLogger,
    EvaluationResult,
    PeriodSummary,
    ReportResult,
)
from src.core.settings import get_settings

settings = get_settings()
llm = ChatOpenAI(model=settings.eval_model, api_key=settings.openai_api_key, temperature=0)

def evaluate_report(
    report_result: ReportResult,
    period_summary: PeriodSummary | None,
    report_goal: str,
    logger: EvaluationLogger,
    trace: Optional[Any] = None,
) -> EvaluationResult:
    """Run all evaluation metrics for a single report.

    Args:
        report_result: Generated report with context and metadata.
        period_summary: Intermediate period summary, or None for weekly reports.
        period_type: "month" or "year" — passed to answer relevancy prompt.
        report_goal: User-defined goal string for answer relevancy evaluation.
        llm: LangChain LLM client (temperature=0).
        logger: Evaluation logger that persists results and logs to Langfuse.
        trace: Optional Langfuse trace for per-metric score logging.

    Returns:
        Completed EvaluationResult. Also calls logger.log(result) before returning.
    """
    # --- Summary metrics (only when period_summary is available) ---
    faithfulness_summary: float | None = None
    answer_relevancy_summary: int | None = None
    period_type = report_result.period

    if period_summary is not None:
        faithfulness_summary = calculate_faithfulness(
            period_summary, "summary", llm, trace
        )
        answer_relevancy_summary = calculate_answer_relevancy(
            period_summary, "summary", period_type, report_goal, llm, trace
        )

    # --- Retrieval metrics (only when context with moment_chunks is available) ---
    diversity: float | None = None
    temporal_coverage: float | None = None
    context_precision: float | None = None

    if report_result.context:
        chunks = report_result.context.moment_chunks or []
        if len(chunks) >= 2:
            diversity = calculate_diversity(chunks)
            temporal_coverage = calculate_temporal_coverage(chunks)
            current_summary = report_result.generated_text
            context_precision = calculate_context_precision(
                chunks, current_summary, llm, trace
            )

    # --- Report metrics (always calculated) ---
    faithfulness_report = calculate_faithfulness(report_result, "report", llm, trace)
    answer_relevancy_report = calculate_answer_relevancy(
        report_result, "report", period_type, report_goal, llm, trace
    )

    sample_id = (
        f"{report_result.user_id}"
        f"_{report_result.period}"
        f"_{report_result.period_start.isoformat()}"
    )

    result = EvaluationResult(
        sample_id=sample_id,
        method=report_result.method,
        user_id=report_result.user_id,
        period_start=report_result.period_start,
        period_type=period_type,
        diversity=diversity,
        temporal_coverage=temporal_coverage,
        context_precision=context_precision,
        faithfulness_summary=faithfulness_summary,
        faithfulness_report=faithfulness_report,
        answer_relevancy_summary=answer_relevancy_summary,
        answer_relevancy_report=answer_relevancy_report,
        summary_tokens_used=period_summary.tokens_used if period_summary is not None else None,
        summary_generation_time=period_summary.generation_time if period_summary is not None else None,
        report_tokens_used=report_result.tokens_used,
        report_generation_time=report_result.final_generation_time,
        generated_text=report_result.generated_text,
    )

    logger.log(result)
    return result
