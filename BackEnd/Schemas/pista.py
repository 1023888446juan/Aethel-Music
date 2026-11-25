from datetime import time
from pydantic import BaseModel, ConfigDict


class PistaBase(BaseModel):
    titulo_pista: str
    duracion_pista: time | None = None
    formato_pista: str | None = None
    ruta_pista: str | None = None
    fk_id_album: int | None = None


class PistaCreate(PistaBase):
    pass


class PistaResponse(PistaBase):
    id_pista: int
    artista: str | None = None
    album: str | None = None

    model_config = ConfigDict(from_attributes=True)