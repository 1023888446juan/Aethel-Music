from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class Album(Base):
    __tablename__ = "album"

    id_album = Column(Integer, primary_key=True, index=True)
    titulo_album = Column(String(150), nullable=False)
    descripcion_album = Column(Text, nullable=True)
    fecha_lanzamiento = Column(Date, nullable=True)
    fk_id_artista = Column(
        Integer,
        ForeignKey("artistas.id_artista", ondelete="CASCADE"),
        nullable=False
    )

    artista = relationship("Artista", back_populates="albumes")
    pistas = relationship(
        "Pista",
        back_populates="album",
        passive_deletes=True
    )