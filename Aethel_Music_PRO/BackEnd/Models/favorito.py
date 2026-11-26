from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKeyConstraint,
    UniqueConstraint
)
from sqlalchemy.sql import func
from db.database import Base


class Favorito(Base):
    __tablename__ = "favorito"

    id_favorito = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    fk_id_usuario = Column(Integer, nullable=False)
    fk_id_pista = Column(Integer, nullable=False)

    fecha_agregado = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    __table_args__ = (
        ForeignKeyConstraint(
            ["fk_id_pista", "fk_id_usuario"],
            ["pista.id_pista", "pista.fk_id_usuario"],
            ondelete="CASCADE",
            name="fk_favorito_pista_usuario"
        ),

        UniqueConstraint(
            "fk_id_usuario",
            "fk_id_pista",
            name="uq_favorito_usuario_pista"
        ),
    )
