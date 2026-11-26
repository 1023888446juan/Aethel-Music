from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional


# =============================================================
# USER REGISTRATION
# =============================================================

class UsuarioCreate(BaseModel):

    nombre: str = Field(
        min_length=2,
        max_length=100
    )

    correo: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )


# =============================================================
# USER LOGIN
# =============================================================

class UsuarioLogin(BaseModel):

    correo: EmailStr

    password: str = Field(
        min_length=1,
        max_length=128
    )


# =============================================================
# USER UPDATE (OWN PROFILE)
# =============================================================

class UsuarioUpdate(BaseModel):

    nombre: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )


# =============================================================
# USER RESPONSE (OWN PROFILE)
# =============================================================

class UsuarioResponse(BaseModel):

    id_usuario: int
    nombre: str
    correo: EmailStr
    estado_usuario: str
    ruta_foto_perfil: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )


# =============================================================
# USER STATUS
# =============================================================

class UsuarioEstado(BaseModel):

    estado_usuario: str = Field(
        min_length=1,
        max_length=20
    )


# =============================================================
# ADMIN: USER UPDATE
# =============================================================

class UsuarioAdminUpdate(BaseModel):

    nombre: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    correo: Optional[EmailStr] = None

    estado_usuario: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=20
    )

    rol_usuario: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=20
    )


# =============================================================
# ADMIN: USER RESPONSE
# =============================================================

class UsuarioAdminResponse(BaseModel):

    id_usuario: int
    nombre: str
    correo: EmailStr
    estado_usuario: str
    rol_usuario: str
    fecha_registro: object

    model_config = ConfigDict(
        from_attributes=True
    )


# =============================================================
# ADMIN: USER LIST RESPONSE
# =============================================================

class UsuarioAdminListResponse(BaseModel):

    id_usuario: int
    nombre: str
    correo: EmailStr
    estado_usuario: str
    rol_usuario: str

    model_config = ConfigDict(
        from_attributes=True
    )
