from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from db.database import Base


class Grabacion(Base):
    __tablename__ = "grabacion"

    id_grabacion = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    titulo = Column(String(255), nullable=False)
    artista = Column(String(255), nullable=False)
    duracion = Column(Numeric(12, 3), nullable=False)
    ruta_archivo = Column(Text, nullable=False)

    fecha_creacion = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )
