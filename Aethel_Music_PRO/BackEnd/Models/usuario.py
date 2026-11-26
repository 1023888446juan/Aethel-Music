# ============================================================
# AETHEL MUSIC
# MODEL: USUARIO
# ============================================================

from sqlalchemy import Column, Integer, String, DateTime, Text, text
from sqlalchemy.sql import func

from db.database import Base


class Usuario(Base):

    __tablename__ = "usuario"

    # --------------------------------------------------------
    # COLUMNAS
    # --------------------------------------------------------

    id_usuario = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    nombre = Column(
        String(100),
        nullable=False
    )

    correo = Column(
        String(254),
        nullable=False,
        unique=True
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    estado_usuario = Column(
        String(20),
        nullable=False,
        default="activo",
        server_default="activo"
    )

    rol_usuario = Column(
        String(20),
        nullable=False,
        default="usuario",
        server_default=text("'usuario'")
    )

    fecha_registro = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    ruta_foto_perfil = Column(
        Text,
        nullable=True
    )


# ============================================================
# END MODEL: USUARIO
# ============================================================
