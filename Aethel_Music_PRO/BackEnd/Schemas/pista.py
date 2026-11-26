from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID


# =============================================================
# TRACK CREATION
# =============================================================

class PistaCreate(BaseModel):

    titulo: str = Field(
        min_length=1,
        max_length=255
    )

    artista: Optional[str] = Field(
        default=None,
        max_length=255
    )

    duracion: Decimal = Field(
        gt=0
    )

    formato: str = Field(
        min_length=1,
        max_length=20
    )


# =============================================================
# TRACK METADATA
# =============================================================

class PistaMetadata(BaseModel):

    titulo: str
    artista: Optional[str] = None
    duracion: Decimal
    formato: str

    model_config = ConfigDict(
        from_attributes=True
    )


# =============================================================
# TRACK RESPONSE
# =============================================================

class PistaResponse(BaseModel):

    id_pista: int
    uuid_pista: UUID
    fk_id_usuario: int

    titulo: str
    artista: Optional[str] = None

    duracion: Decimal

    ruta_archivo: str
    ruta_portada: Optional[str] = None

    formato: str
    fecha_carga: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
