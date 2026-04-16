"""replace embedding_mini and embedding_e5 with embedding (768 dims, gte-multilingual-base)

Revision ID: f3e2d1c0b9a8
Revises: 849b057d03a4
Create Date: 2026-04-15

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector


revision: str = 'f3e2d1c0b9a8'
down_revision: Union[str, Sequence[str], None] = '849b057d03a4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('entry', 'embedding_mini')
    op.drop_column('entry', 'embedding_e5')
    op.add_column('entry', sa.Column(
        'embedding',
        Vector(768),
        nullable=True,
    ))


def downgrade() -> None:
    op.drop_column('entry', 'embedding')
    op.add_column('entry', sa.Column('embedding_mini', Vector(384), nullable=True))
    op.add_column('entry', sa.Column('embedding_e5', Vector(384), nullable=True))
