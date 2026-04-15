"""Mock tests for evaluation metrics.

Verifies all functions run without errors and return the correct types.
Does NOT test accuracy of values — only type contracts and error-free execution.
"""

import json
from datetime import date
from typing import Any
from unittest.mock import MagicMock, patch

import numpy as np

import notebooks.evaluation.evaluate as evaluate_module
from notebooks.evaluation.evaluate import evaluate_report
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
    Report,
    ReportResult,
    RetrievedChunk,
    RetrievedContext,
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_chunks(n: int = 3) -> list[RetrievedChunk]:
    return [
        RetrievedChunk(
            entry_id=i,
            text=f"Journal entry {i}: made progress on habits.",
            embedding=list(np.random.rand(8).astype(float)),  # small dim for speed
            date=date(2024, (i % 12) + 1, 1),
            goal_id=1,
            relevance_score=0.8,
        )
        for i in range(n)
    ]


def _make_context(chunks: list[RetrievedChunk] | None = None) -> RetrievedContext:
    return RetrievedContext(
        moment_chunks=chunks if chunks is not None else _make_chunks(),
        pattern_reports=[
            Report(
                report_id=1,
                text="Previous month: user improved sleep consistency.",
                period="month",
            )
        ],
    )


def _make_period_summary(context: RetrievedContext | None = None) -> PeriodSummary:
    return PeriodSummary(
        summary_text="User exercised 4x/week and improved sleep quality.",
        context=context if context is not None else _make_context(),
        tokens_used=500,
        generation_time=1.2,
    )


def _make_report_result(context: RetrievedContext | None = None) -> ReportResult:
    ctx = context if context is not None else _make_context()
    return ReportResult(
        context=ctx,
        generated_text="This month the user showed strong habit consistency.",
        tokens_used=800,
        final_generation_time=2.5,
        method="baseline_rag",
        user_id=42,
        period="month",
        period_start=date(2024, 3, 1),
    )


def _mock_llm(responses: list[Any]) -> MagicMock:
    """LLM mock returning responses in sequence."""
    mock = MagicMock()
    mock.invoke.side_effect = [
        MagicMock(content=json.dumps(r)) for r in responses
    ]
    return mock


# ---------------------------------------------------------------------------
# Individual metric tests
# ---------------------------------------------------------------------------

def test_calculate_diversity_returns_float_in_range():
    result = calculate_diversity(_make_chunks(3))
    assert isinstance(result, float)
    assert 0.0 <= result <= 1.0


def test_calculate_temporal_coverage_returns_float_in_range():
    result = calculate_temporal_coverage(_make_chunks(3))
    assert isinstance(result, float)
    assert 0.0 <= result <= 1.0


def test_calculate_context_precision_returns_float_in_range():
    llm = _mock_llm([{"score": 1}, {"score": 2}, {"score": 0}])
    result = calculate_context_precision(_make_chunks(3), "summary text", llm)
    assert isinstance(result, float)
    assert 0.0 <= result <= 1.0


def test_calculate_context_precision_all_exceptions_returns_zero():
    """When LLM always fails, should return 0.0 without raising."""
    llm = MagicMock()
    llm.invoke.side_effect = RuntimeError("LLM error")
    result = calculate_context_precision(_make_chunks(3), "summary text", llm)
    assert result == 0.0


def test_calculate_faithfulness_summary_returns_float():
    llm = _mock_llm([
        {"claims": ["claim1", "claim2"]},
        {"supported": 1},
        {"supported": 0},
    ])
    result = calculate_faithfulness(_make_period_summary(), "summary", llm)
    assert isinstance(result, float)
    assert 0.0 <= result <= 1.0


def test_calculate_faithfulness_report_returns_float():
    llm = _mock_llm([
        {"claims": ["claim1"]},
        {"supported": 1},
    ])
    result = calculate_faithfulness(_make_report_result(), "report", llm)
    assert isinstance(result, float)
    assert 0.0 <= result <= 1.0


def test_calculate_faithfulness_none_context_returns_none():
    report = _make_report_result(context=RetrievedContext(
        moment_chunks=None, pattern_reports=None
    ))
    result = calculate_faithfulness(report, "report", MagicMock())
    assert result is None


def test_calculate_answer_relevancy_summary_returns_int():
    llm = _mock_llm([{"score": 4}])
    result = calculate_answer_relevancy(
        _make_period_summary(), "summary", "month", "improve fitness", llm
    )
    assert isinstance(result, int)
    assert 1 <= result <= 5


def test_calculate_answer_relevancy_report_returns_int():
    llm = _mock_llm([{"score": 3}])
    result = calculate_answer_relevancy(
        _make_report_result(), "report", "month", "improve fitness", llm
    )
    assert isinstance(result, int)
    assert 1 <= result <= 5


def test_calculate_answer_relevancy_llm_failure_returns_none():
    llm = MagicMock()
    llm.invoke.side_effect = RuntimeError("LLM error")
    result = calculate_answer_relevancy(
        _make_report_result(), "report", "month", "improve fitness", llm
    )
    assert result is None


# ---------------------------------------------------------------------------
# evaluate_report integration tests
# (patch module-level llm to avoid real API calls)
# ---------------------------------------------------------------------------

def test_evaluate_report_month_all_metrics_populated():
    """Month report with period_summary → all metrics should be computed."""
    chunks = _make_chunks(3)
    context = _make_context(chunks)
    period_summary = _make_period_summary(context)
    report_result = _make_report_result(context)

    # LLM call order:
    # 1. faithfulness_summary: extract claims + verify x2
    # 2. answer_relevancy_summary
    # 3. context_precision x3 chunks
    # 4. faithfulness_report: extract claims + verify x1
    # 5. answer_relevancy_report
    mock_llm = _mock_llm([
        {"claims": ["c1", "c2"]},   # faithfulness_summary extract
        {"supported": 1},            # verify c1
        {"supported": 1},            # verify c2
        {"score": 4},                # answer_relevancy_summary
        {"score": 1},                # context_precision chunk 0
        {"score": 2},                # context_precision chunk 1
        {"score": 1},                # context_precision chunk 2
        {"claims": ["c3"]},          # faithfulness_report extract
        {"supported": 0},            # verify c3
        {"score": 3},                # answer_relevancy_report
    ])

    mock_trace = MagicMock()
    logger = EvaluationLogger(output_path="/tmp/test_output.csv", langfuse=mock_trace)

    with patch.object(evaluate_module, "llm", mock_llm):
        result = evaluate_report(
            report_result=report_result,
            period_summary=period_summary,
            report_goal="improve fitness and sleep",
            logger=logger,
            trace=mock_trace,
        )

    assert isinstance(result, EvaluationResult)
    assert result.faithfulness_summary is not None
    assert result.answer_relevancy_summary is not None
    assert result.diversity is not None
    assert result.temporal_coverage is not None
    assert result.context_precision is not None
    assert result.faithfulness_report is not None
    assert result.answer_relevancy_report is not None
    assert result.method == "baseline_rag"
    assert result.user_id == 42
    assert result.report_tokens_used == 800
    assert result.summary_tokens_used == 500
    assert result.summary_generation_time is not None
    assert result.report_generation_time is not None
    assert len(logger.results) == 1


def test_evaluate_report_week_no_summary_no_context():
    """Weekly report without period_summary → summary metrics are None, report metrics computed."""
    report_result = ReportResult(
        context=_make_context(),
        generated_text="This week was productive.",
        tokens_used=300,
        final_generation_time=1.0,
        method="gcr",
        user_id=7,
        period="week",
        period_start=date(2024, 3, 4),
    )

    mock_llm = _mock_llm([
        {"score": 1},          # context_precision chunk 0
        {"score": 1},          # context_precision chunk 1
        {"score": 1},          # context_precision chunk 2
        {"claims": ["c1"]},   # faithfulness_report extract
        {"supported": 1},      # verify c1
        {"score": 2},          # answer_relevancy_report
    ])

    mock_trace = MagicMock()
    logger = EvaluationLogger(output_path="/tmp/test_output.csv", langfuse=mock_trace)

    with patch.object(evaluate_module, "llm", mock_llm):
        result = evaluate_report(
            report_result=report_result,
            period_summary=None,
            report_goal="be more productive",
            logger=logger,
            trace=None,
        )

    assert isinstance(result, EvaluationResult)
    assert result.faithfulness_summary is None
    assert result.answer_relevancy_summary is None
    assert result.diversity is not None
    assert result.temporal_coverage is not None
    assert result.context_precision is not None
    assert result.faithfulness_report is not None
    assert result.answer_relevancy_report is not None


def test_evaluate_report_sample_id_format():
    report_result = ReportResult(
        context=None,
        generated_text="text",
        tokens_used=100,
        final_generation_time=0.5,
        method="rag_mmr",
        user_id=99,
        period="year",
        period_start=date(2024, 1, 1),
    )

    mock_llm = _mock_llm([
        {"claims": ["c1"]},
        {"supported": 1},
        {"score": 5},
    ])

    mock_trace = MagicMock()
    logger = EvaluationLogger(output_path="/tmp/test_output.csv", langfuse=mock_trace)

    with patch.object(evaluate_module, "llm", mock_llm):
        result = evaluate_report(
            report_result=report_result,
            period_summary=None,
            report_goal="annual review",
            logger=logger,
        )

    assert result.sample_id == "99_year_2024-01-01"
