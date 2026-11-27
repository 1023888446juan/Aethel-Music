import mimetypes
from pathlib import Path

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user
from Core.config import settings

from Schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse

from Controllers.usuario_controller import (
    registrar_usuario_controller,
    obtener_usuario_controller,
    actualizar_usuario_controller,
    eliminar_usuario_controller,
    actualizar_foto_perfil_controller,
    eliminar_foto_perfil_controller
)


router = APIRouter(
    prefix="/api/usuarios",
    tags=["Usuarios"]
)


# =============================================================
# REGISTER USER
# =============================================================

@router.post(
    "/registro",
    response_model=UsuarioResponse
)
def registrar_usuario(
    datos: UsuarioCreate,
    db: Session = Depends(get_db)
):

    return registrar_usuario_controller(
        db,
        datos
    )


# =============================================================
# GET AUTHENTICATED USER
# =============================================================

@router.get(
    "/perfil",
    response_model=UsuarioResponse
)
def obtener_perfil(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_usuario_controller(
        db,
        usuario_actual.id_usuario,
        usuario_actual.id_usuario
    )


# =============================================================
# UPDATE AUTHENTICATED USER
# =============================================================

@router.put(
    "/perfil",
    response_model=UsuarioResponse
)
def actualizar_perfil(
    datos: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return actualizar_usuario_controller(
        db,
        usuario_actual.id_usuario,
        datos,
        usuario_actual.id_usuario
    )


# =============================================================
# UPLOAD / REPLACE PROFILE PHOTO
# =============================================================

@router.get("/perfil/foto")
def obtener_foto_perfil(
    usuario_actual=Depends(get_current_user)
):
    ruta_guardada = usuario_actual.ruta_foto_perfil
    if not ruta_guardada:
        raise HTTPException(status_code=404, detail="No hay una foto de perfil guardada")

    ruta = Path(ruta_guardada).resolve()
    directorio_fotos = Path(settings.COVERS_DIR).resolve()
    try:
        ruta.relative_to(directorio_fotos)
    except ValueError:
        raise HTTPException(status_code=404, detail="La foto de perfil no está disponible")

    if not ruta.is_file():
        raise HTTPException(status_code=404, detail="La foto de perfil no está disponible")

    return FileResponse(ruta, media_type=mimetypes.guess_type(ruta.name)[0] or "application/octet-stream")

@router.post(
    "/perfil/foto"
)
def actualizar_foto_perfil(
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return actualizar_foto_perfil_controller(
        db,
        usuario_actual.id_usuario,
        archivo,
        usuario_actual.id_usuario
    )


# =============================================================
# DELETE PROFILE PHOTO
# =============================================================

@router.delete(
    "/perfil/foto"
)
def eliminar_foto_perfil(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return eliminar_foto_perfil_controller(
        db,
        usuario_actual.id_usuario,
        usuario_actual.id_usuario
    )


# =============================================================
# DELETE AUTHENTICATED USER
# =============================================================

@router.delete(
    "/perfil"
)
def eliminar_perfil(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return eliminar_usuario_controller(
        db,
        usuario_actual.id_usuario,
        usuario_actual.id_usuario
    )
