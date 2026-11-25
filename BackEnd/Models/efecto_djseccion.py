from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from db.database import Base


class EfectoDjseccion(Base):
    __tablename__ = "efecto_djseccion"

    id_efecto_djseccion = Column(
        Integer,
        primary_key=True,
        index=True
    )

    fk_id_secciondj = Column(
        Integer,
        ForeignKey("dj_seccion.id_secciondj", ondelete="CASCADE"),
        nullable=False
    )

    fk_id_efecto = Column(
        Integer,
        ForeignKey("efectos.id_efecto", ondelete="CASCADE"),
        nullable=False
    )

    pad = Column(
        Integer,
        nullable=False
    )

    seccion = relationship(
        "DjSeccion",
        back_populates="efectos"
    )

    efecto = relationship(
        "Efecto"
    )

    __table_args__ = (
        UniqueConstraint(
            "fk_id_secciondj",
            "fk_id_efecto",
            name="uq_efecto_seccion"
        ),
        UniqueConstraint(
            "fk_id_secciondj",
            "pad",
            name="uq_seccion_pad"
        ),
    )