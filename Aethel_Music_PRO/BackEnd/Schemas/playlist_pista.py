from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


# =============================================================
# ADD TRACK TO PLAYLIST
# =============================================================

class PlaylistPistaCreate(BaseModel):

    fk_id_pista: int = Field(
        gt=0
    )

    posicion: Optional[int] = Field(
        default=None,
        gt=0
    )


# =============================================================
# UPDATE TRACK POSITION
# =============================================================

class PlaylistPistaUpdate(BaseModel):

    posicion: int = Field(
        gt=0
    )


# =============================================================
# PLAYLIST TRACK RESPONSE
# =============================================================

class PlaylistPistaResponse(BaseModel):

    id_playlist_pista: int
    fk_id_playlist: int
    fk_id_pista: int
    fk_id_usuario: int
    posicion: int
    fecha_agregado: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
