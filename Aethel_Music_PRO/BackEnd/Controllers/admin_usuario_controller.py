from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from Schemas.usuario import UsuarioAdminUpdate

from Services.admin_usuario_service import (
    listar_usuarios,
    obtener_usuario_admin,
    actualizar_usuario_admin,
    eliminar_usuario_admin
)


# --------------------------------------------------
# LISTAR USUARIOS
# --------------------------------------------------

def listar_usuarios_controller(
    db: Session,
    offset: int = 0,
    limit: int = 100
):

    try:
        return listar_usuarios(db, offset, limit)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al consultar los usuarios"
        )


# --------------------------------------------------
# CONSULTAR USUARIO POR ID
# --------------------------------------------------

def obtener_usuario_admin_controller(
    db: Session,
    id_usuario: int
):

    usuario = obtener_usuario_admin(db, id_usuario)

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return usuario


# --------------------------------------------------
# ACTUALIZAR USUARIO
# --------------------------------------------------

def actualizar_usuario_admin_controller(
    db: Session,
    id_usuario: int,
    datos: UsuarioAdminUpdate
):

    usuario = obtener_usuario_admin(db, id_usuario)

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    try:
        return actualizar_usuario_admin(db, usuario, datos)

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


# --------------------------------------------------
# ELIMINAR USUARIO
# --------------------------------------------------

def eliminar_usuario_admin_controller(
    db: Session,
    id_usuario: int,
    id_admin_autenticado: int
):

    usuario = obtener_usuario_admin(db, id_usuario)

    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    try:
        eliminar_usuario_admin(
            db,
            usuario,
            id_admin_autenticado
        )

        return {
            "mensaje": "Usuario eliminado correctamente"
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el usuario"
        )