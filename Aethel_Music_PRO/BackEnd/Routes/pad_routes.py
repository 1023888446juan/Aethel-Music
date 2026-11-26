from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user

from Schemas.pad import PadUpdate

from Controllers.pad_controller import (
    obtener_pads_usuario_controller,
    obtener_pad_controller,
    obtener_pad_por_numero_controller,
    actualizar_pad_controller,
    asignar_efecto_pad_controller,
    vaciar_pad_controller
)


router = APIRouter(
    prefix="/api/pads",
    tags=["Pads"]
)


# =============================================================
# GET USER PADS
# =============================================================

@router.get("/")
def listar_pads(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_pads_usuario_controller(
        db,
        usuario_actual.id_usuario
    )


# =============================================================
# GET PAD BY ID
# =============================================================

@router.get("/{id_pad}")
def obtener_pad(
    id_pad: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_pad_controller(
        db,
        id_pad,
        usuario_actual.id_usuario
    )


# =============================================================
# GET PAD BY NUMBER
# =============================================================

@router.get("/numero/{numero_pad}")
def obtener_pad_numero(
    numero_pad: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_pad_por_numero_controller(
        db,
        numero_pad,
        usuario_actual.id_usuario
    )


# =============================================================
# UPDATE PAD
# =============================================================

@router.put("/{id_pad}")
def actualizar_pad(
    id_pad: int,
    datos: PadUpdate,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return actualizar_pad_controller(
        db,
        id_pad,
        datos,
        usuario_actual.id_usuario
    )


# =============================================================
# ASSIGN EFFECT BY PAD NUMBER
# =============================================================

@router.put("/numero/{numero_pad}/efecto/{id_efecto}")
def asignar_efecto(
    numero_pad: int,
    id_efecto: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return asignar_efecto_pad_controller(
        db,
        numero_pad,
        id_efecto,
        usuario_actual.id_usuario
    )


# =============================================================
# CLEAR PAD
# =============================================================

@router.delete("/numero/{numero_pad}/efecto")
def vaciar_pad(
    numero_pad: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return vaciar_pad_controller(
        db,
        numero_pad,
        usuario_actual.id_usuario
    )
