from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from db.database import Base


class PlaylistPista(Base):
    __tablename__ = "playlist_pista"

    id_playlist_pista = Column(Integer, primary_key=True, index=True)

    fk_id_playlist = Column(
        Integer,
        ForeignKey("playlist.id_playlist", ondelete="CASCADE"),
        nullable=False
    )

    fk_id_pista = Column(
        Integer,
        ForeignKey("pista.id_pista", ondelete="CASCADE"),
        nullable=False
    )

    playlist = relationship(
        "Playlist",
        back_populates="pistas_playlist"
    )

    pista = relationship(
        "Pista",
        back_populates="playlists_pista"
    )

    __table_args__ = (
        UniqueConstraint(
            "fk_id_playlist",
            "fk_id_pista",
            name="uq_playlist_pista"
        ),
    )