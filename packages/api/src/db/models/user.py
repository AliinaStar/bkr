from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db.base import Base

if TYPE_CHECKING:
    from src.db.models.report import Report
    from src.db.models.goal import Goal

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(250), unique=True)

    reports: Mapped[list["Report"]] = relationship(back_populates="user")
    goals: Mapped[list['Goal']] = relationship(back_populates="user")