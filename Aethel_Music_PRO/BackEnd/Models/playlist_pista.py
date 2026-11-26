from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKeyConstraint,
    UniqueConstraint,
    CheckConstraint
)
from sqlalchemy.sql import func
from db.database import Base


class PlaylistPista(Base):
    __tablename__ = "playlist_pista"

    id_playlist_pista = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    fk_id_playlist = Column(Integer, nullable=False)
    fk_id_pista = Column(Integer, nullable=False)
    fk_id_usuario = Column(Integer, nullable=False)

    posicion = Column(Integer, nullable=False)

    fecha_agregado = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    __table_args__ = (
        ForeignKeyConstraint(
            ["fk_id_playlist", "fk_id_usuario"],
            ["playlist.id_playlist", "playlist.fk_id_usuario"],
            ondelete="CASCADE",
            name="fk_playlist_pista_playlist"
        ),

        ForeignKeyConstraint(
            ["fk_id_pista", "fk_id_usuario"],
            ["pista.id_pista", "pista.fk_id_usuario"],
            ondelete="CASCADE",
            name="fk_playlist_pista_pista"
        ),

        UniqueConstraint(
            "fk_id_playlist",
            "fk_id_pista",
            name="uq_playlist_pista"
        ),

        UniqueConstraint(
            "fk_id_playlist",
            "posicion",
            name="uq_playlist_posicion"
        ),

        CheckConstraint(
            "posicion > 0",
            name="ck_playlist_pista_posicion"
        ),
    )
