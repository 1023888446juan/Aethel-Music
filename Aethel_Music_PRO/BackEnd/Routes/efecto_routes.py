from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user

from Controllers.efecto_controller import (
    registrar_efecto_controller,
    obtener_efectos_usuario_controller,
    obtener_efecto_controller,
    eliminar_efecto_controller
)


router = APIRouter(
    prefix="/api/efectos",
    tags=["Efectos"]
)


# =============================================================
# REGISTER EFFECT
# =============================================================

@router.post("/importar")
def importar_efecto(
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return registrar_efecto_controller(
        db,
        archivo,
        usuario_actual.id_usuario
    )


# =============================================================
# GET USER EFFECTS
# =============================================================

@router.get("/")
def listar_efectos(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_efectos_usuario_controller(
        db,
        usuario_actual.id_usuario
    )


# =============================================================
# GET EFFECT BY ID
# =============================================================

@router.get("/{id_efecto}")
def obtener_efecto(
    id_efecto: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_efecto_controller(
        db,
        id_efecto,
        usuario_actual.id_usuario
    )


# =============================================================
# DELETE EFFECT
# =============================================================

@router.delete("/{id_efecto}")
def eliminar_efecto(
    id_efecto: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return eliminar_efecto_controller(
        db,
        id_efecto,
        usuario_actual.id_usuario
    )
