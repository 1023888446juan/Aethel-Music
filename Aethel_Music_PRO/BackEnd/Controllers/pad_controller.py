from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Schemas.pad import PadUpdate

from Services.pad_service import (
    obtener_pads_usuario,
    obtener_pad_por_id,
    obtener_pad_por_numero,
    actualizar_pad,
    asignar_efecto_pad,
    vaciar_pad
)


# =============================================================
# GET USER PADS
# =============================================================

def obtener_pads_usuario_controller(
    db: Session,
    id_usuario: int
):

    try:
        return obtener_pads_usuario(
            db,
            id_usuario
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al consultar los pads"
        )


# =============================================================
# GET PAD BY ID
# =============================================================

def obtener_pad_controller(
    db: Session,
    id_pad: int,
    id_usuario: int
):

    pad = obtener_pad_por_id(
        db,
        id_pad,
        id_usuario
    )

    if pad is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pad no encontrado"
        )

    return pad


# =============================================================
# GET PAD BY NUMBER
# =============================================================

def obtener_pad_por_numero_controller(
    db: Session,
    numero_pad: int,
    id_usuario: int
):

    pad = obtener_pad_por_numero(
        db,
        numero_pad,
        id_usuario
    )

    if pad is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pad no encontrado"
        )

    return pad


# =============================================================
# UPDATE PAD
# =============================================================

def actualizar_pad_controller(
    db: Session,
    id_pad: int,
    datos: PadUpdate,
    id_usuario: int
):

    pad = obtener_pad_por_id(
        db,
        id_pad,
        id_usuario
    )

    if pad is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pad no encontrado"
        )

    try:
        return actualizar_pad(
            db,
            pad,
            datos,
            id_usuario
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el pad"
        )


# =============================================================
# ASSIGN EFFECT TO PAD
# =============================================================

def asignar_efecto_pad_controller(
    db: Session,
    numero_pad: int,
    id_efecto: int,
    id_usuario: int
):

    try:
        return asignar_efecto_pad(
            db,
            numero_pad,
            id_efecto,
            id_usuario
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al asignar el efecto al pad"
        )


# =============================================================
# CLEAR PAD
# =============================================================

def vaciar_pad_controller(
    db: Session,
    numero_pad: int,
    id_usuario: int
):

    try:
        return vaciar_pad(
            db,
            numero_pad,
            id_usuario
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al vaciar el pad"
        )
