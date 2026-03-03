from __future__ import annotations
from typing import TYPE_CHECKING, Optional
from datetime import date

from sqlalchemy import String, Integer, ForeignKey, Enum, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db.base import Base

if TYPE_CHECKING:
    from src.db.models.user import User
    from src.db.models.entry import Entry

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