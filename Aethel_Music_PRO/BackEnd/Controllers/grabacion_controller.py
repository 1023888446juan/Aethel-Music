from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Services.grabacion_service import (
    obtener_grabaciones_usuario,
    obtener_grabacion_por_id,
    actualizar_grabacion,
    eliminar_grabacion
)


# =============================================================
# GET USER RECORDINGS
# =============================================================

def obtener_grabaciones_usuario_controller(
    db: Session,
    id_usuario: int
):

    try:
        return obtener_grabaciones_usuario(
            db,
            id_usuario
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al consultar las grabaciones"
        )


# =============================================================
# GET RECORDING BY ID
# =============================================================

def obtener_grabacion_controller(
    db: Session,
    id_grabacion: int,
    id_usuario: int
):

    grabacion = obtener_grabacion_por_id(
        db,
        id_grabacion,
        id_usuario
    )

    if grabacion is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grabacion no encontrada"
        )

    return grabacion


# =============================================================
# UPDATE RECORDING
# =============================================================

def actualizar_grabacion_controller(
    db: Session,
    id_grabacion: int,
    id_usuario: int,
    titulo: str | None = None
):

    grabacion = obtener_grabacion_por_id(
        db,
        id_grabacion,
        id_usuario
    )

    if grabacion is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grabacion no encontrada"
        )

    try:
        return actualizar_grabacion(
            db,
            grabacion,
            titulo
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar la grabacion"
        )


# =============================================================
# DELETE RECORDING
# =============================================================

def eliminar_grabacion_controller(
    db: Session,
    id_grabacion: int,
    id_usuario: int
):

    grabacion = obtener_grabacion_por_id(
        db,
        id_grabacion,
        id_usuario
    )

    if grabacion is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grabacion no encontrada"
        )

    try:
        eliminar_grabacion(
            db,
            grabacion
        )

        return {
            "mensaje": "Grabacion eliminada correctamente"
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar la grabacion"
        )
