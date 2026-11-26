from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from Schemas.playlist import PlaylistCreate, PlaylistUpdate

from Services.playlist_service import (
    crear_playlist,
    obtener_playlists_usuario,
    obtener_playlist_por_id,
    actualizar_playlist,
    eliminar_playlist
)


# =============================================================
# CREATE PLAYLIST
# =============================================================

def crear_playlist_controller(
    db: Session,
    datos: PlaylistCreate,
    id_usuario: int
):

    try:
        return crear_playlist(
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
            detail="Error al crear la playlist"
        )


# =============================================================
# GET USER PLAYLISTS
# =============================================================

def obtener_playlists_usuario_controller(
    db: Session,
    id_usuario: int
):

    try:
        return obtener_playlists_usuario(
            db,
            id_usuario
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al consultar las playlists"
        )


# =============================================================
# GET PLAYLIST BY ID
# =============================================================

def obtener_playlist_controller(
    db: Session,
    id_playlist: int,
    id_usuario: int
):

    playlist = obtener_playlist_por_id(
        db,
        id_playlist,
        id_usuario
    )

    if playlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist no encontrada"
        )

    return playlist


# =============================================================
# UPDATE PLAYLIST
# =============================================================

def actualizar_playlist_controller(
    db: Session,
    id_playlist: int,
    datos: PlaylistUpdate,
    id_usuario: int
):

    playlist = obtener_playlist_por_id(
        db,
        id_playlist,
        id_usuario
    )

    if playlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist no encontrada"
        )

    if playlist.nombre.strip().lower() == "favoritos":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La playlist Favoritos no puede modificarse"
        )

    try:
        return actualizar_playlist(
            db,
            playlist,
            datos
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar la playlist"
        )


# =============================================================
# DELETE PLAYLIST
# =============================================================

def eliminar_playlist_controller(
    db: Session,
    id_playlist: int,
    id_usuario: int
):

    playlist = obtener_playlist_por_id(
        db,
        id_playlist,
        id_usuario
    )

    if playlist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist no encontrada"
        )

    if playlist.nombre.strip().lower() == "favoritos":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La playlist Favoritos no puede eliminarse"
        )

    try:
        eliminar_playlist(
            db,
            playlist
        )

        return {
            "mensaje": "Playlist eliminada correctamente"
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar la playlist"
        )
