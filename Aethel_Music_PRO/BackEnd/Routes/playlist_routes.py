from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from Core.dependencies import get_current_user

from Schemas.playlist import PlaylistCreate, PlaylistUpdate

from Controllers.playlist_controller import (
    crear_playlist_controller,
    obtener_playlists_usuario_controller,
    obtener_playlist_controller,
    actualizar_playlist_controller,
    eliminar_playlist_controller
)


router = APIRouter(
    prefix="/api/playlists",
    tags=["Playlists"]
)


# =============================================================
# CREATE PLAYLIST
# =============================================================

@router.post("/")
def crear_playlist(
    datos: PlaylistCreate,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return crear_playlist_controller(
        db,
        datos,
        usuario_actual.id_usuario
    )


# =============================================================
# GET USER PLAYLISTS
# =============================================================

@router.get("/")
def listar_playlists(
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_playlists_usuario_controller(
        db,
        usuario_actual.id_usuario
    )


# =============================================================
# GET PLAYLIST BY ID
# =============================================================

@router.get("/{id_playlist}")
def obtener_playlist(
    id_playlist: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return obtener_playlist_controller(
        db,
        id_playlist,
        usuario_actual.id_usuario
    )


# =============================================================
# UPDATE PLAYLIST
# =============================================================

@router.put("/{id_playlist}")
def actualizar_playlist(
    id_playlist: int,
    datos: PlaylistUpdate,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return actualizar_playlist_controller(
        db,
        id_playlist,
        datos,
        usuario_actual.id_usuario
    )


# =============================================================
# DELETE PLAYLIST
# =============================================================

@router.delete("/{id_playlist}")
def eliminar_playlist(
    id_playlist: int,
    db: Session = Depends(get_db),
    usuario_actual = Depends(get_current_user)
):

    return eliminar_playlist_controller(
        db,
        id_playlist,
        usuario_actual.id_usuario
    )
