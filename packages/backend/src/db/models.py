from datetime import date

from sqlalchemy import (
    String,
    Integer,
    ForeignKey,
    Enum,
    Date,
    CheckConstraint,
    Text,
    Float
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from src.db.base import Base

class Entry(Base):
    __tablename__ = "entry"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goal.id"))
    date_note: Mapped[date] = mapped_column(Date)
    note: Mapped[str] = mapped_column(Text) # didn't create migration
    productivity_score: Mapped[int] = mapped_column(
        Integer,
        CheckConstraint("productivity_score BETWEEN 1 AND 5", name="check_productivity_score")
    )
    embedding_mini: Mapped[list[float] | None] = mapped_column(
        Vector(384),  # all-MiniLM-L6-v2
        nullable=True
    )
    embedding_e5: Mapped[list[float] | None] = mapped_column(
        Vector(384),  # e5-base
        nullable=True
    )

    goal: Mapped["Goal"] = relationship(back_populates="entries")


class Goal(Base):
    __tablename__ = "goal"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    title: Mapped[str] = mapped_column(String(250))
    description: Mapped[str | None] = mapped_column(String(500))
    deadline: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(Enum("active", "postpone", "finished", name="goal_status"))

    user: Mapped["User"] = relationship(back_populates="goals")
    entries: Mapped[list["Entry"]] = relationship(back_populates="goal")


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
    final_report: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    user: Mapped["User"] = relationship(back_populates="reports")


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(250), unique=True)
    language: Mapped[str] = mapped_column(String(50), server_default="English")
    gender: Mapped[str | None] = mapped_column(
        Enum("male", "female", name="gender"),
        nullable=True
    )

    reports: Mapped[list["Report"]] = relationship(back_populates="user")
    goals: Mapped[list['Goal']] = relationship(back_populates="user")
