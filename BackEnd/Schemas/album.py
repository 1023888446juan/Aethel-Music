from datetime import date
from pydantic import BaseModel, ConfigDict


class AlbumBase(BaseModel):
    titulo_album: str
    descripcion_album: str | None = None
    fecha_lanzamiento: date | None = None
    fk_id_artista: int


class AlbumCreate(AlbumBase):
    pass


class AlbumResponse(AlbumBase):
    id_album: int

    model_config = ConfigDict(from_attributes=True)