from typing import TYPE_CHECKING, Optional
from datetime import date

from sqlalchemy import String, Integer, ForeignKey, Enum, Date, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from src.db.base import Base

if TYPE_CHECKING:
    from src.db.models.goal import Goal

class Entry(Base):
    __tablename__ = "entry"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goal.id"))
    date_note: Mapped[date] = mapped_column(Date)
    note: Mapped[str] = mapped_column(String(500))
    productivity_score: Mapped[int] = mapped_column(
        Integer,
        CheckConstraint("productivity_score BETWEEN 1 AND 5", name="check_productivity_score")
    )
    embedding_mini: Mapped[list[float] | None] = mapped_column(
        Vector(384),  # all-MiniLM-L6-v2
        nullable=True
    )
    embedding_e5: Mapped[list[float] | None] = mapped_column(
        Vector(512),  # e5-base
        nullable=True
    )

    goal: Mapped["Goal"] = relationship(back_populates="entries")
