from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Schemas.playlist_pista import PlaylistPistaCreate

from Services.playlist_pista_service import (
    agregar_pista_playlist,
    obtener_pistas_playlist,
    retirar_pista_playlist,
    reordenar_pistas_playlist
)


# =============================================================
# ADD TRACK TO PLAYLIST
# =============================================================

def agregar_pista_playlist_controller(
    db: Session,
    datos: PlaylistPistaCreate,
    id_playlist: int,
    id_usuario: int
):

    try:
        return agregar_pista_playlist(
            db,
            datos,
            id_playlist,
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
            detail="Error al agregar la pista a la playlist"
        )


# =============================================================
# GET PLAYLIST TRACKS
# =============================================================

def obtener_pistas_playlist_controller(
    db: Session,
    id_playlist: int,
    id_usuario: int
):

    try:
        return obtener_pistas_playlist(
            db,
            id_playlist,
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
            detail="Error al consultar las pistas de la playlist"
        )


# =============================================================
# REMOVE TRACK FROM PLAYLIST
# =============================================================

def retirar_pista_playlist_controller(
    db: Session,
    id_playlist: int,
    id_pista: int,
    id_usuario: int
):

    try:
        retirar_pista_playlist(
            db,
            id_playlist,
            id_pista,
            id_usuario
        )

        return {
            "mensaje": "Pista retirada de la playlist correctamente"
        }

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al retirar la pista de la playlist"
        )


# =============================================================
# REORDER PLAYLIST TRACKS
# =============================================================

def reordenar_pistas_playlist_controller(
    db: Session,
    id_playlist: int,
    id_usuario: int,
    nuevo_orden: list[int]
):

    try:
        return reordenar_pistas_playlist(
            db,
            id_playlist,
            id_usuario,
            nuevo_orden
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al reordenar las pistas de la playlist"
        )
