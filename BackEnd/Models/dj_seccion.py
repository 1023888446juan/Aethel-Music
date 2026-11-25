from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class DjSeccion(Base):
    __tablename__ = "dj_seccion"

    id_secciondj = Column(
        Integer,
        primary_key=True,
        index=True
    )

    descripcion_dj_seccion = Column(
        Text,
        nullable=True
    )

    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False
    )

    usuario = relationship(
        "Usuario",
        back_populates="dj_secciones"
    )

    efectos = relationship(
        "EfectoDjseccion",
        back_populates="seccion",
        passive_deletes=True
    )