from sqlalchemy import Column, Integer, String
from db.database import Base


class Efecto(Base):
    __tablename__ = "efectos"

    id_efecto = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nombre_efecto = Column(
        String(100),
        nullable=False
    )

    duracion_efecto = Column(
        Integer,
        nullable=True
    )

    formato = Column(
        String(20),
        nullable=True
    )