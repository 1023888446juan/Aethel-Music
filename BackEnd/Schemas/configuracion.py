from pydantic import BaseModel, ConfigDict


class ConfiguracionBase(BaseModel):
    color_configuracion: str | None = None
    idioma_configuracion: str | None = None
    notificacion_configuracion: bool = True


class ConfiguracionCreate(ConfiguracionBase):
    fk_id_usuario: int


class ConfiguracionResponse(ConfiguracionBase):
    id_configuracion: int
    fk_id_usuario: int

    model_config = ConfigDict(from_attributes=True)