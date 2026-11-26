# ============================================================
# AETHEL MUSIC
# MODEL: PAD
# ============================================================

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    UniqueConstraint
)
from sqlalchemy.sql import func

from db.database import Base


class Pad(Base):

    __tablename__ = "pad"

    # --------------------------------------------------------
    # COLUMNAS
    # --------------------------------------------------------

    id_pad = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    fk_id_usuario = Column(
        Integer,
        ForeignKey(
            "usuario.id_usuario",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    fk_id_efecto = Column(
        Integer,
        nullable=True
    )

    numero_pad = Column(
        Integer,
        nullable=False
    )

    fecha_actualizacion = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    # --------------------------------------------------------
    # RESTRICCIONES
    # --------------------------------------------------------

    __table_args__ = (
        ForeignKeyConstraint(
            ["fk_id_efecto", "fk_id_usuario"],
            ["efecto.id_efecto", "efecto.fk_id_usuario"],
            ondelete="CASCADE",
            name="fk_pad_efecto_usuario"
        ),

        UniqueConstraint(
            "fk_id_usuario",
            "numero_pad",
            name="uq_pad_usuario_numero"
        ),
    )


# ============================================================
# END MODEL: PAD
# ============================================================
