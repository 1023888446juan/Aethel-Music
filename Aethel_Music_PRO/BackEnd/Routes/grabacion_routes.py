from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user

from Controllers.grabacion_controller import (
    obtener_grabaciones_usuario_controller,
    obtener_grabacion_controller,
    actualizar_grabacion_controller,
    eliminar_grabacion_controller
)


router = APIRouter(
    prefix="/api/grabaciones",
    tags=["Grabaciones"]
)


# =============================================================
# GET USER RECORDINGS
# =============================================================

@router.get("/")
def listar_grabaciones(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_grabaciones_usuario_controller(
        db,
        usuario_actual.id_usuario
    )


# =============================================================
# GET RECORDING BY ID
# =============================================================

@router.get("/{id_grabacion}")
def obtener_grabacion(
    id_grabacion: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_grabacion_controller(
        db,
        id_grabacion,
        usuario_actual.id_usuario
    )


# =============================================================
# UPDATE RECORDING TITLE
# =============================================================

@router.put("/{id_grabacion}")
def actualizar_grabacion(
    id_grabacion: int,
    titulo: str,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return actualizar_grabacion_controller(
        db,
        id_grabacion,
        usuario_actual.id_usuario,
        titulo
    )


# =============================================================
# DELETE RECORDING
# =============================================================

@router.delete("/{id_grabacion}")
def eliminar_grabacion(
    id_grabacion: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return eliminar_grabacion_controller(
        db,
        id_grabacion,
        usuario_actual.id_usuario
    )
