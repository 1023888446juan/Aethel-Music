from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_admin

from Schemas.usuario import (
    UsuarioAdminUpdate,
    UsuarioAdminResponse,
    UsuarioAdminListResponse
)

from Controllers.admin_usuario_controller import (
    listar_usuarios_controller,
    obtener_usuario_admin_controller,
    actualizar_usuario_admin_controller,
    eliminar_usuario_admin_controller
)


router = APIRouter(
    prefix="/api/admin/usuarios",
    tags=["Administración de usuarios"]
)


# --------------------------------------------------
# LISTAR USUARIOS
# --------------------------------------------------

@router.get(
    "",
    response_model=list[UsuarioAdminListResponse]
)
def listar_usuarios_admin(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
    admin_actual=Depends(get_current_admin)
):

    return listar_usuarios_controller(
        db,
        offset,
        limit
    )


# --------------------------------------------------
# CONSULTAR USUARIO POR ID
# --------------------------------------------------

@router.get(
    "/{id_usuario}",
    response_model=UsuarioAdminResponse
)
def obtener_usuario_admin(
    id_usuario: int,
    db: Session = Depends(get_db),
    admin_actual=Depends(get_current_admin)
):

    return obtener_usuario_admin_controller(
        db,
        id_usuario
    )


# --------------------------------------------------
# ACTUALIZAR USUARIO
# --------------------------------------------------

@router.put(
    "/{id_usuario}",
    response_model=UsuarioAdminResponse
)
def actualizar_usuario_admin(
    id_usuario: int,
    datos: UsuarioAdminUpdate,
    db: Session = Depends(get_db),
    admin_actual=Depends(get_current_admin)
):

    return actualizar_usuario_admin_controller(
        db,
        id_usuario,
        datos
    )


# --------------------------------------------------
# ELIMINAR USUARIO
# --------------------------------------------------

@router.delete(
    "/{id_usuario}"
)
def eliminar_usuario_admin(
    id_usuario: int,
    db: Session = Depends(get_db),
    admin_actual=Depends(get_current_admin)
):

    return eliminar_usuario_admin_controller(
        db,
        id_usuario,
        admin_actual.id_usuario
    )