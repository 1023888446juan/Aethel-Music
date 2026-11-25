from pydantic import BaseModel, ConfigDict


class UsuarioBase(BaseModel):
    nombre_usuario: str
    correo_usuario: str


class UsuarioCreate(UsuarioBase):
    contrasena_usuario: str


class UsuarioResponse(UsuarioBase):
    id_usuario: int

    model_config = ConfigDict(from_attributes=True)