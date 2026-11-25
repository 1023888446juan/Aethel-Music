from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from db.database import Base


class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre_usuario = Column(String(100), nullable=False)
    correo_usuario = Column(String(150), unique=True, nullable=False, index=True)
    contrasena_usuario = Column(String(255), nullable=False)

    configuracion = relationship(
        "Configuracion",
        back_populates="usuario",
        uselist=False,
        passive_deletes=True
    )

    playlists = relationship(
        "Playlist",
        back_populates="usuario",
        passive_deletes=True
    )

    favoritos = relationship(
        "Favorito",
        back_populates="usuario",
        passive_deletes=True
    )

    historial = relationship(
        "HistorialReproduccion",
        back_populates="usuario",
        passive_deletes=True
    )

    dj_secciones = relationship(
        "DjSeccion",
        back_populates="usuario",
        passive_deletes=True
    )