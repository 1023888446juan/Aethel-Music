from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from db.database import Base


class Playlist(Base):
    __tablename__ = "playlist"

    id_playlist = Column(Integer, primary_key=True, index=True)
    nombre_playlist = Column(String(150), nullable=False)
    descripcion_playlist = Column(Text, nullable=True)
    fecha_creacion_playlist = Column(
        Date,
        server_default=func.current_date()
    )
    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    usuario = relationship("Usuario", back_populates="playlists")
    pistas_playlist = relationship(
        "PlaylistPista",
        back_populates="playlist",
        passive_deletes=True
    )