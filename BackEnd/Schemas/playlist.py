from datetime import date
from pydantic import BaseModel, ConfigDict


class PlaylistBase(BaseModel):
    nombre_playlist: str
    descripcion_playlist: str | None = None
    fk_id_usuario: int


class PlaylistCreate(PlaylistBase):
    pass


class PlaylistResponse(PlaylistBase):
    id_playlist: int
    fecha_creacion_playlist: date | None = None

    model_config = ConfigDict(from_attributes=True)