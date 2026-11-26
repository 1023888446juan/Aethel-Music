from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
import logging

from Schemas.usuario import UsuarioCreate, UsuarioUpdate

from Services.usuario_service import (
    registrar_usuario,
    obtener_usuario_por_id,
    obtener_usuario_por_correo,
    actualizar_usuario,
    actualizar_ruta_foto_perfil,
    eliminar_ruta_foto_perfil,
    eliminar_usuario
)

from Utils.file_manager import (
    guardar_portada,
    eliminar_archivo
)

from Utils.audio_validator import validar_imagen


logger = logging.getLogger(__name__)


# =============================================================
# REGISTER USER
# =============================================================

def registrar_usuario_controller(
    db: Session,
    datos: UsuarioCreate
):

    try:
        usuario = registrar_usuario(db, datos)
        return usuario

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al registrar el usuario"
        )


# =============================================================
# GET USER BY ID
# =============================================================

def obtener_usuario_controller(
    db: Session,
    id_usuario: int,
    id_usuario_autenticado: int
):

    if id_usuario != id_usuario_autenticado:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado para consultar este usuario"
        )

    usuario = obtener_usuario_por_id(
        db,
        id_usuario
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return usuario


# =============================================================
# GET USER BY EMAIL
# =============================================================

def obtener_usuario_por_correo_controller(
    db: Session,
    correo: str
):

    usuario = obtener_usuario_por_correo(
        db,
        correo
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return usuario


# =============================================================
# UPDATE USER PROFILE
# =============================================================

def actualizar_usuario_controller(
    db: Session,
    id_usuario: int,
    datos: UsuarioUpdate,
    id_usuario_autenticado: int
):

    if id_usuario != id_usuario_autenticado:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado para actualizar este usuario"
        )

    usuario = obtener_usuario_por_id(
        db,
        id_usuario
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    try:
        return actualizar_usuario(
            db,
            usuario,
            datos
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el usuario"
        )


# =============================================================
# UPLOAD / REPLACE PROFILE PHOTO
# =============================================================

def actualizar_foto_perfil_controller(
    db: Session,
    id_usuario: int,
    archivo: UploadFile,
    id_usuario_autenticado: int
):

    if id_usuario != id_usuario_autenticado:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado para actualizar esta fotografía"
        )

    usuario = obtener_usuario_por_id(
        db,
        id_usuario
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    nueva_ruta = None

    try:

        validar_imagen(
            archivo
        )

        nueva_ruta = guardar_portada(
            archivo
        )

        ruta_anterior = actualizar_ruta_foto_perfil(
            db,
            usuario,
            nueva_ruta
        )

        if ruta_anterior:

            try:

                eliminar_archivo(
                    ruta_anterior
                )

            except Exception:

                logger.warning(
                    "No fue posible eliminar la fotografía "
                    "anterior del usuario %s",
                    id_usuario
                )

        return {
            "mensaje": "Fotografía de perfil actualizada correctamente",
            "ruta_foto_perfil": usuario.ruta_foto_perfil
        }

    except ValueError as error:

        if nueva_ruta:

            try:
                eliminar_archivo(
                    nueva_ruta
                )

            except Exception:
                logger.warning(
                    "No fue posible limpiar el archivo "
                    "de fotografía rechazado"
                )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except HTTPException:
        raise

    except Exception:

        if nueva_ruta:

            try:
                eliminar_archivo(
                    nueva_ruta
                )

            except Exception:
                logger.warning(
                    "No fue posible limpiar el archivo "
                    "tras un error de carga"
                )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar la fotografía de perfil"
        )


# =============================================================
# REMOVE PROFILE PHOTO
# =============================================================

def eliminar_foto_perfil_controller(
    db: Session,
    id_usuario: int,
    id_usuario_autenticado: int
):

    if id_usuario != id_usuario_autenticado:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado para eliminar esta fotografía"
        )

    usuario = obtener_usuario_por_id(
        db,
        id_usuario
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    try:

        ruta_anterior = eliminar_ruta_foto_perfil(
            db,
            usuario
        )

        if ruta_anterior:

            try:

                eliminar_archivo(
                    ruta_anterior
                )

            except Exception:

                logger.warning(
                    "No fue posible eliminar físicamente "
                    "la fotografía del usuario %s",
                    id_usuario
                )

        return {
            "mensaje": "Fotografía de perfil eliminada correctamente"
        }

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar la fotografía de perfil"
        )


# =============================================================
# DELETE USER
# =============================================================

def eliminar_usuario_controller(
    db: Session,
    id_usuario: int,
    id_usuario_autenticado: int
):

    if id_usuario != id_usuario_autenticado:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado para eliminar este usuario"
        )

    usuario = obtener_usuario_por_id(
        db,
        id_usuario
    )

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    ruta_foto = usuario.ruta_foto_perfil

    try:

        eliminar_usuario(
            db,
            usuario
        )

        if ruta_foto:

            try:

                eliminar_archivo(
                    ruta_foto
                )

            except Exception:

                logger.warning(
                    "No fue posible eliminar físicamente "
                    "la fotografía del usuario eliminado %s",
                    id_usuario
                )

        return {
            "mensaje": "Cuenta eliminada correctamente"
        }

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar la cuenta"
        )
