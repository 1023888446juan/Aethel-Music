
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user

from Schemas.playlist_pista import PlaylistPistaCreate

from Controllers.playlist_pista_controller import (
    agregar_pista_playlist_controller,
    obtener_pistas_playlist_controller,
    retirar_pista_playlist_controller
)


router = APIRouter(
    prefix="/api/playlists",
    tags=["Playlist - Pistas"]
)


# =============================================================
# ADD TRACK TO PLAYLIST
# =============================================================

@router.post("/{id_playlist}/pistas")
def agregar_pista(
    id_playlist: int,
    datos: PlaylistPistaCreate,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return agregar_pista_playlist_controller(
        db,
        datos,
        id_playlist,
        usuario_actual.id_usuario
    )


# =============================================================
# GET PLAYLIST TRACKS
# =============================================================

@router.get("/{id_playlist}/pistas")
def listar_pistas_playlist(
    id_playlist: int,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return obtener_pistas_playlist_controller(
        db,
        id_playlist,
        usuario_actual.id_usuario
    )


# =============================================================
# REMOVE TRACK FROM PLAYLIST
# =============================================================

@router.delete("/{id_playlist}/pistas/{id_pista}")
def retirar_pista(
    id_playlist: int,
    id_pista: int,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user)
):

    return retirar_pista_playlist_controller(
        db,
        id_playlist,
        id_pista,
        usuario_actual.id_usuario
    )
