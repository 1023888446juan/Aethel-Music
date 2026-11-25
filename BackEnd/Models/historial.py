from sqlalchemy import Column, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from db.database import Base


class HistorialReproduccion(Base):
    __tablename__ = "historial_reproduccion"

    id_historial_reproduccion = Column(
        Integer,
        primary_key=True,
        index=True
    )

    tiempo_escuchado_historial_reproduccion = Column(
        Integer,
        nullable=True
    )

    fecha_historial_reproduccion = Column(
        DateTime,
        server_default=func.now()
    )

    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    fk_id_pista = Column(
        Integer,
        ForeignKey("pista.id_pista", ondelete="CASCADE"),
        nullable=False
    )

    usuario = relationship(
        "Usuario",
        back_populates="historial"
    )

    pista = relationship(
        "Pista",
        back_populates="historial"
    )