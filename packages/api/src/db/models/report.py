from __future__ import annotations
from typing import TYPE_CHECKING, Optional
from datetime import date

from sqlalchemy import String, Integer, ForeignKey, Enum, Date, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db.base import Base

if TYPE_CHECKING:
    from src.db.models.user import User

class Report(Base):
    __tablename__ = "report"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    period: Mapped[str] = mapped_column(Enum("week", "month", "year", name="period_time"))
    period_start: Mapped[date] = mapped_column(Date)
    period_end: Mapped[date] = mapped_column(Date)
    avg_productivity: Mapped[float | None] = mapped_column(Float, nullable=True)
    active_days: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[date] = mapped_column(Date)
    final_report: Mapped[str | None] = mapped_column(String(1500), nullable=True)

    user: Mapped["User"] = relationship(back_populates="reports")