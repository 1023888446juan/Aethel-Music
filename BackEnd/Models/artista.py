from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from db.database import Base


class Artista(Base):
    __tablename__ = "artistas"

    id_artista = Column(Integer, primary_key=True, index=True)
    nombre_artista = Column(String(100), nullable=False)
    genero_artista = Column(String(50), nullable=True)

    albumes = relationship(
        "Album",
        back_populates="artista",
        passive_deletes=True
    )