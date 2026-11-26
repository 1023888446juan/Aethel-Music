# ============================================================
# AETHEL MUSIC
# MODEL: EFECTO
# ============================================================

from sqlalchemy import (
    Column,
    Integer,
    Text,
    DateTime,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.sql import func

from db.database import Base


class Efecto(Base):

    __tablename__ = "efecto"

    # --------------------------------------------------------
    # COLUMNAS
    # --------------------------------------------------------

    id_efecto = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    ruta_archivo = Column(
        Text,
        nullable=False
    )

    fecha_carga = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    # --------------------------------------------------------
    # RESTRICCIONES
    # --------------------------------------------------------

    __table_args__ = (
        UniqueConstraint(
            "id_efecto",
            "fk_id_usuario",
            name="uq_efecto_id_usuario"
        ),
    )


# ============================================================
# END MODEL: EFECTO
# ============================================================
