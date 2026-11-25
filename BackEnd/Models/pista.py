from sqlalchemy import Column, Integer, String, Text, Time, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class Pista(Base):
    __tablename__ = "pista"

    id_pista = Column(Integer, primary_key=True, index=True)
    titulo_pista = Column(String(150), nullable=False)
    duracion_pista = Column(Time, nullable=True)
    formato_pista = Column(String(20), nullable=True)
    ruta_pista = Column(Text, nullable=True)
    fk_id_album = Column(
        Integer,
        ForeignKey("album.id_album", ondelete="SET NULL"),
        nullable=True
    )

    album = relationship("Album", back_populates="pistas")

    favoritos = relationship(
        "Favorito",
        back_populates="pista",
        passive_deletes=True
    )

    historial = relationship(
        "HistorialReproduccion",
        back_populates="pista",
        passive_deletes=True
    )

    playlists_pista = relationship(
        "PlaylistPista",
        back_populates="pista",
        passive_deletes=True
    )