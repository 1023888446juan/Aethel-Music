from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


# =============================================================
# PAD EFFECT ASSIGNMENT
# =============================================================

class PadUpdate(BaseModel):

    fk_id_efecto: Optional[int] = Field(
        default=None,
        gt=0
    )


# =============================================================
# PAD RESPONSE
# =============================================================

class PadResponse(BaseModel):

    id_pad: int
    fk_id_usuario: int
    fk_id_efecto: Optional[int] = None
    numero_pad: int
    fecha_actualizacion: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
