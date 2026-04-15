from typing import Literal
from pydantic import BaseModel, Field


class GoalProgress(BaseModel):
    goal_id: int
    name: str
    summary: str = Field(
        description="2-3 sentences: what was concretely done and which small wins are worth noting"
    )


class ToneAssessment(BaseModel):
    word: Literal["Scattered", "Drifting", "Steady", "Focused", "Driven", "Energized", "In flow"]
    scale: int = Field(ge=1, le=7, description="1=Scattered, 7=In flow")
    description: str = Field(description="1-2 sentences explaining why this word fits the week")


class WhatWorkedItem(BaseModel):
    title: str = Field(description="Short label, e.g. 'Morning writing'")
    description: str = Field(
        description="One sentence explaining why it worked, optionally with a concrete example"
    )


class WeekReport(BaseModel):
    title: str = Field(description="e.g. 'Weekly Report 07.04 – 13.04'")
    summary: str = Field(
        description="2-3 sentences: main focus and overall impression of the week. Synthesize, do not list days."
    )
    goals: list[GoalProgress]
    tone: ToneAssessment
    what_worked: list[WhatWorkedItem] = Field(min_length=2, max_length=4)


class MonthGoalProgress(BaseModel):
    goal_id: int
    name: str
    summary: str = Field(
        description="3-5 sentences: overall trajectory across the month, strongest weeks, concrete achievements"
    )
    comparison: str = Field(
        description="2-3 sentences comparing with past periods from RAG context; if no data — 'First recorded period — no comparison available'"
    )



class PatternItem(BaseModel):
    title: str = Field(description="Short label for the pattern, e.g. 'Deep work in the mornings'")
    description: str = Field(description="2-3 sentences: what repeated, when it appeared, why it matters")


class YearGoalProgress(BaseModel):
    goal_id: int
    name: str
    status: Literal["active", "paused", "completed"]
    summary: str = Field(
        description="4-6 sentences: arc of the goal across the year, key moments and qualitative changes"
    )
    comparison: str = Field(
        description="2-3 sentences comparing start and end of year via RAG context; if no data — 'First recorded period — no comparison available'"
    )
    peak: str = Field(description="Best moment for this goal during the year, with a date")


class QuarterlyTone(BaseModel):
    Q1: Literal["Scattered", "Drifting", "Steady", "Focused", "Driven", "Energized", "In flow"]
    Q2: Literal["Scattered", "Drifting", "Steady", "Focused", "Driven", "Energized", "In flow"]
    Q3: Literal["Scattered", "Drifting", "Steady", "Focused", "Driven", "Energized", "In flow"]
    Q4: Literal["Scattered", "Drifting", "Steady", "Focused", "Driven", "Energized", "In flow"]


class YearToneAssessment(BaseModel):
    word: Literal["Scattered", "Drifting", "Steady", "Focused", "Driven", "Energized", "In flow"]
    scale: int = Field(ge=1, le=7, description="1=Scattered, 7=In flow")
    description: str = Field(description="1-2 sentences explaining why this word fits the year as a whole")
    trend: QuarterlyTone


class HighlightPeriod(BaseModel):
    period: str = Field(description="Month name, e.g. 'March 2025'")
    reason: str


class YearHighlights(BaseModel):
    best: HighlightPeriod = Field(description="Best period of the year and why it was the peak")
    hardest: HighlightPeriod = Field(description="Hardest period of the year and how it was handled")


class YearPatternItem(BaseModel):
    title: str = Field(description="Short label for the pattern")
    description: str = Field(description="2-3 sentences: what repeated, when it appeared, why it matters")
    first_seen: str = Field(description="When this pattern first appeared, e.g. 'February 2025'")


class MonthReport(BaseModel):
    title: str = Field(description="e.g. 'Monthly Report April 2025'")
    summary: str = Field(
        description="2-3 sentences: dominant theme of the month and overall tone. Synthesize across weeks, do not list them."
    )
    goals: list[MonthGoalProgress]
    tone: ToneAssessment
    patterns: list[PatternItem] = Field(min_length=2, max_length=5)
    what_worked: list[WhatWorkedItem] = Field(min_length=2, max_length=4)
    insight: str = Field(
        description="2-3 sentences: cross-goal insight from RAG context; non-trivial, connects patterns across goals or compares with the past"
    )


class YearReport(BaseModel):
    title: str = Field(description="e.g. 'Yearly Report 2025'")
    summary: str = Field(
        description="3-4 sentences: what the year was about as a whole, what changed in the person"
    )
    goals: list[YearGoalProgress]
    tone: YearToneAssessment
    highlights: YearHighlights
    patterns: list[YearPatternItem] = Field(min_length=2, max_length=5)
    what_worked: list[WhatWorkedItem] = Field(min_length=2, max_length=4)
    insight: str = Field(
        description="3-4 sentences: main insight of the year, what changed in the approach to progress"
    )
