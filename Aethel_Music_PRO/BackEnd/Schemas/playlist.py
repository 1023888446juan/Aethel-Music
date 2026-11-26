from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


# =============================================================
# PLAYLIST CREATION
# =============================================================

class PlaylistCreate(BaseModel):

    nombre: str = Field(
        min_length=1,
        max_length=150
    )


# =============================================================
# PLAYLIST UPDATE
# =============================================================

class PlaylistUpdate(BaseModel):

    nombre: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=150
    )


# =============================================================
# PLAYLIST RESPONSE
# =============================================================

class PlaylistResponse(BaseModel):

    id_playlist: int
    fk_id_usuario: int
    nombre: str
    fecha_creacion: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
