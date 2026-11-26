from pydantic import BaseModel, ConfigDict, Field
from decimal import Decimal
from datetime import datetime


# =============================================================
# RECORDING CREATION
# =============================================================

class GrabacionCreate(BaseModel):

    titulo: str = Field(
        min_length=1,
        max_length=255
    )

    duracion: Decimal = Field(
        gt=0
    )


# =============================================================
# RECORDING RESPONSE
# =============================================================

class GrabacionResponse(BaseModel):

    id_grabacion: int
    fk_id_usuario: int

    titulo: str
    artista: str
    duracion: Decimal

    ruta_archivo: str
    fecha_creacion: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
