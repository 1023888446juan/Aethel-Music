# ============================================================
# AETHEL MUSIC
# MODEL: PISTA
# ============================================================

from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Text,
    DateTime,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func, text

from db.database import Base


class Pista(Base):

    __tablename__ = "pista"

    # --------------------------------------------------------
    # COLUMNAS
    # --------------------------------------------------------

    id_pista = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    uuid_pista = Column(
        UUID(as_uuid=True),
        nullable=False,
        unique=True,
        server_default=text("gen_random_uuid()")
    )

    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    titulo = Column(
        String(255),
        nullable=False
    )

    artista = Column(
        String(255),
        nullable=True
    )

    duracion = Column(
        Numeric(12, 3),
        nullable=False
    )

    ruta_archivo = Column(
        Text,
        nullable=False
    )

    ruta_portada = Column(
        Text,
        nullable=True
    )

    formato = Column(
        String(20),
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
            "id_pista",
            "fk_id_usuario",
            name="uq_pista_id_usuario"
        ),
    )


# ============================================================
# END MODEL: PISTA
# ============================================================
