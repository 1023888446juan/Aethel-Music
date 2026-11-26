# ============================================================
# AETHEL MUSIC
# MODEL: PLAYLIST
# ============================================================

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.sql import func

from db.database import Base


class Playlist(Base):

    __tablename__ = "playlist"

    # --------------------------------------------------------
    # COLUMNAS
    # --------------------------------------------------------

    id_playlist = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    nombre = Column(
        String(150),
        nullable=False
    )

    fecha_creacion = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    # --------------------------------------------------------
    # RESTRICCIONES
    # --------------------------------------------------------

    __table_args__ = (
        UniqueConstraint(
            "fk_id_usuario",
            "nombre",
            name="uq_playlist_usuario_nombre"
        ),

        UniqueConstraint(
            "id_playlist",
            "fk_id_usuario",
            name="uq_playlist_id_usuario"
        ),
    )


# ============================================================
# END MODEL: PLAYLIST
# ============================================================
