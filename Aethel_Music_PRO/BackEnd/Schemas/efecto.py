from pydantic import BaseModel, ConfigDict
from datetime import datetime


# =============================================================
# EFFECT RESPONSE
# =============================================================

class EfectoResponse(BaseModel):

    id_efecto: int
    fk_id_usuario: int
    ruta_archivo: str
    fecha_carga: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
