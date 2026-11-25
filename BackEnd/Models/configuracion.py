from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class Configuracion(Base):
    __tablename__ = "configuracion"

    id_configuracion = Column(Integer, primary_key=True, index=True)
    color_configuracion = Column(String(30), nullable=True)
    idioma_configuracion = Column(String(30), nullable=True)
    notificacion_configuracion = Column(Boolean, default=True)
    fk_id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    usuario = relationship("Usuario", back_populates="configuracion")