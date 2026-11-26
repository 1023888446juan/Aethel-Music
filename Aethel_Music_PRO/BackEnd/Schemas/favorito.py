from pydantic import BaseModel, ConfigDict
from datetime import datetime


# =============================================================
# FAVORITE CREATION
# =============================================================

class FavoritoCreate(BaseModel):

    fk_id_pista: int


# =============================================================
# FAVORITE RESPONSE
# =============================================================

class FavoritoResponse(BaseModel):

    id_favorito: int
    fk_id_usuario: int
    fk_id_pista: int
    fecha_agregado: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
