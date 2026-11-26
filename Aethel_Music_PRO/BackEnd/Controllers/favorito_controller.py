from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Schemas.favorito import FavoritoCreate

from Services.favorito_service import (
    agregar_favorito,
    obtener_favoritos_usuario,
    obtener_favorito_por_id,
    eliminar_favorito,
    eliminar_favorito_por_pista
)


# =============================================================
# ADD FAVORITE
# =============================================================

def agregar_favorito_controller(
    db: Session,
    datos: FavoritoCreate,
    id_usuario: int
):

    try:
        return agregar_favorito(
            db,
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
            detail="Error al agregar la pista a favoritos"
        )


# =============================================================
# GET USER FAVORITES
# =============================================================

def obtener_favoritos_usuario_controller(
    db: Session,
    id_usuario: int
):

    try:
        return obtener_favoritos_usuario(
            db,
            id_usuario
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al consultar favoritos"
        )


# =============================================================
# GET FAVORITE BY ID
# =============================================================

def obtener_favorito_controller(
    db: Session,
    id_favorito: int,
    id_usuario: int
):

    favorito = obtener_favorito_por_id(
        db,
        id_favorito,
        id_usuario
    )

    if favorito is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorito no encontrado"
        )

    return favorito


# =============================================================
# DELETE FAVORITE BY ID
# =============================================================

def eliminar_favorito_controller(
    db: Session,
    id_favorito: int,
    id_usuario: int
):

    favorito = obtener_favorito_por_id(
        db,
        id_favorito,
        id_usuario
    )

    if favorito is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorito no encontrado"
        )

    try:
        eliminar_favorito(
            db,
            id_favorito,
            id_usuario
        )

        return {
            "mensaje": "Favorito eliminado correctamente"
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar favorito"
        )


# =============================================================
# DELETE FAVORITE BY TRACK
# =============================================================

def eliminar_favorito_por_pista_controller(
    db: Session,
    id_pista: int,
    id_usuario: int
):

    try:
        eliminar_favorito_por_pista(
            db,
            id_pista,
            id_usuario
        )

        return {
            "mensaje": "Pista retirada de favoritos correctamente"
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al retirar la pista de favoritos"
        )
