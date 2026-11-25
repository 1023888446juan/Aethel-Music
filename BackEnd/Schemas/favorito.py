from datetime import date
from pydantic import BaseModel, ConfigDict


class FavoritoBase(BaseModel):
    nombre_favorito: str | None = None
    fk_id_usuario: int
    fk_id_pista: int


class FavoritoCreate(FavoritoBase):
    pass


class FavoritoResponse(FavoritoBase):
    id_favorito: int
    fecha_agregado_favorito: date | None = None

    model_config = ConfigDict(from_attributes=True)