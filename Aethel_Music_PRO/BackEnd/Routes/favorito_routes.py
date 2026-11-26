from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user

from Schemas.favorito import FavoritoCreate

from Controllers.favorito_controller import (
    agregar_favorito_controller,
    obtener_favoritos_usuario_controller,
    obtener_favorito_controller,
    eliminar_favorito_controller,
    eliminar_favorito_por_pista_controller
)


router = APIRouter(
    prefix="/api/favoritos",
    tags=["Favoritos"]
)


# =============================================================
# ADD FAVORITE
# =============================================================

@router.post("/")
def agregar_favorito(
    datos: FavoritoCreate,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return agregar_favorito_controller(
        db,
        datos,
        usuario_actual.id_usuario
    )


# =============================================================
# GET USER FAVORITES
# =============================================================

@router.get("/")
def listar_favoritos(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_favoritos_usuario_controller(
        db,
        usuario_actual.id_usuario
    )


# =============================================================
# GET FAVORITE BY ID
# =============================================================

@router.get("/{id_favorito}")
def obtener_favorito(
    id_favorito: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_favorito_controller(
        db,
        id_favorito,
        usuario_actual.id_usuario
    )


# =============================================================
# DELETE FAVORITE BY ID
# =============================================================

@router.delete("/{id_favorito}")
def eliminar_favorito(
    id_favorito: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return eliminar_favorito_controller(
        db,
        id_favorito,
        usuario_actual.id_usuario
    )


# =============================================================
# DELETE FAVORITE BY TRACK
# =============================================================

@router.delete("/pista/{id_pista}")
def eliminar_favorito_pista(
    id_pista: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return eliminar_favorito_por_pista_controller(
        db,
        id_pista,
        usuario_actual.id_usuario
    )
