# ============================================================
# AETHEL MUSIC
# MODEL: CONFIGURACION
# ============================================================

from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    String,
    CheckConstraint
)

from sqlalchemy.sql import func

from db.database import Base


class Configuracion(Base):

    __tablename__ = "configuracion"

    # --------------------------------------------------------
    # COLUMNAS
    # --------------------------------------------------------

    id_configuracion = Column(
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
        nullable=False,
        unique=True
    )

    tema = Column(
        String(10),
        nullable=False,
        default="oscuro",
        server_default="oscuro"
    )

    escala_ui = Column(
        Integer,
        nullable=False,
        default=100,
        server_default="100"
    )

    fecha_actualizacion = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )

    # --------------------------------------------------------
    # RESTRICCIONES
    # --------------------------------------------------------

    __table_args__ = (
        CheckConstraint(
            "tema IN ('oscuro', 'claro')",
            name="chk_configuracion_tema"
        ),

        CheckConstraint(
            "escala_ui BETWEEN 50 AND 200",
            name="chk_configuracion_escala"
        ),
    )


# ============================================================
# END MODEL: CONFIGURACION
# ============================================================
