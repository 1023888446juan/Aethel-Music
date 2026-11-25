from sqlalchemy import Column, Integer, String, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from db.database import Base


class Favorito(Base):
    __tablename__ = "favorito"

    id_favorito = Column(Integer, primary_key=True, index=True)
    nombre_favorito = Column(String(100), nullable=True)
    fecha_agregado_favorito = Column(
        Date,
        server_default=func.current_date()
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
        back_populates="favoritos"
    )

    pista = relationship(
        "Pista",
        back_populates="favoritos"
    )