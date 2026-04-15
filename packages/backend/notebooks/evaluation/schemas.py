from dataclasses import asdict, dataclass
from datetime import date
from typing import TYPE_CHECKING, Literal

import pandas as pd

if TYPE_CHECKING:
    from langfuse import Langfuse

@dataclass
class RetrievedChunk:
    entry_id: int        # unused in metrics
    text: str
    embedding: list[float]
    date: date
    goal_id: int         # unused in metrics
    relevance_score: float  # cosine similarity — unused in metrics

@dataclass
class Report:
    report_id: int               # unused in metrics
    text: str
    period: Literal["month", "week"]  # unused in metrics

@dataclass
class RetrievedContext:
    moment_chunks: list[RetrievedChunk] | None   # конкретні записи
    pattern_reports: list[Report] | None         # попередні звіти

@dataclass
class PeriodSummary:
    summary_text: str
    context: RetrievedContext
    tokens_used: int
    generation_time: float

@dataclass
class ReportResult:
    context: RetrievedContext | None  # None для тижня
    generated_text: str
    tokens_used: int
    final_generation_time: float
    method: str             # "baseline_rag" | "rag_mmr" | "gcr"
    user_id: int
    period: Literal["month", "week", "year"]
    period_start: date

@dataclass
class EvaluationResult:
    # ідентифікація
    sample_id: str
    method: str        # "baseline_rag" | "rag_mmr" | "gcr"
    user_id: int
    period_start: date
    period_type: Literal["month", "week", "year"]
    
    # retrieval метрики
    diversity: float | None
    temporal_coverage: float | None
    context_precision: float | None
    
    # generation метрики
    faithfulness_summary: float | None
    faithfulness_report: float | None
    answer_relevancy_summary: int | None
    answer_relevancy_report: int | None
    
    # технічні — summary стадія (None якщо тижень або summary не було)
    summary_tokens_used: int | None
    summary_generation_time: float | None

    # технічні — report стадія
    report_tokens_used: int
    report_generation_time: float

    # згенерований текст звіту
    generated_text: str

    def to_dict(self) -> dict:
        return asdict(self)

_FLOAT_METRIC_FIELDS = [
    "diversity",
    "temporal_coverage",
    "context_precision",
    "faithfulness_summary",
    "faithfulness_report",
    "answer_relevancy_summary",
    "answer_relevancy_report",
    "summary_tokens_used",
    "summary_generation_time",
    "report_tokens_used",
    "report_generation_time",
]


class EvaluationLogger:
    def __init__(self, output_path: str, langfuse: "Langfuse") -> None:
        """Initialize logger with a CSV output path and a Langfuse client.

        Args:
            output_path: File path where results CSV will be written.
            langfuse: Langfuse v3 client used to log metric scores.
        """
        self.results: list[EvaluationResult] = []
        self.output_path = output_path
        self._langfuse = langfuse

    def log(self, result: EvaluationResult) -> None:
        """Append result and log all numeric metrics to Langfuse.

        Scores are grouped by session_id = "{method}_{period_type}" so that
        Langfuse can show averages per method per period type across all users.

        Args:
            result: Completed evaluation result to record.
        """
        self.results.append(result)
        session_id = f"{result.method}_{result.period_type}"

        with self._langfuse.start_as_current_span(
            name=f"{result.method}_{result.period_type}",
            metadata={
                "period": result.period_type,
                "period_start": result.period_start.isoformat(),
                "method": result.method,
                "tokens_used": result.report_tokens_used,
                "generation_time": result.report_generation_time,
            },
        ) as span:
            span.update_trace(
                user_id=str(result.user_id),
                session_id=session_id,
                tags=[result.method, result.period_type],
            )
            for field in _FLOAT_METRIC_FIELDS:
                value: float | int | None = getattr(result, field)
                if value is not None:
                    span.score(name=field, value=float(value))

    def save(self) -> None:
        """Write all logged results to CSV at output_path."""
        df = pd.DataFrame([r.to_dict() for r in self.results])
        df.to_csv(self.output_path, index=False)
