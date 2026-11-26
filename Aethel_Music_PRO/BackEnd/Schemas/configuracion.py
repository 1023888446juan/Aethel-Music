# =============================================================
# AETHEL MUSIC
# SCHEMAS: CONFIGURACION
# =============================================================

from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field
)


# =============================================================
# CONFIGURATION CREATE
# =============================================================

class ConfiguracionCreate(BaseModel):

    tema: str = Field(
        default="oscuro"
    )

    escala_ui: int = Field(
        default=100,
        ge=50,
        le=200
    )


# =============================================================
# CONFIGURATION UPDATE
# =============================================================

class ConfiguracionUpdate(BaseModel):

    tema: str = Field(
        ...,
        pattern="^(oscuro|claro)$"
    )

    escala_ui: int = Field(
        ...,
        ge=50,
        le=200
    )


# =============================================================
# CONFIGURATION RESPONSE
# =============================================================

class ConfiguracionResponse(BaseModel):

    id_configuracion: int

    fk_id_usuario: int

    tema: str

    escala_ui: int

    fecha_actualizacion: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# =============================================================
# END SCHEMAS: CONFIGURACION
# =============================================================
