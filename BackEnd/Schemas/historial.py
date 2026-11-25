from datetime import datetime
from pydantic import BaseModel, ConfigDict


class HistorialReproduccionBase(BaseModel):
    tiempo_escuchado_historial_reproduccion: int | None = None
    fk_id_usuario: int
    fk_id_pista: int


class HistorialReproduccionCreate(HistorialReproduccionBase):
    pass


class HistorialReproduccionResponse(HistorialReproduccionBase):
    id_historial_reproduccion: int
    fecha_historial_reproduccion: datetime | None = None

    model_config = ConfigDict(from_attributes=True)