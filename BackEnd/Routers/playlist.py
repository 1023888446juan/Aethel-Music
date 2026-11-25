from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from db.database import get_db
from Models.playlist import Playlist
from Models.usuario import Usuario
from Schemas.playlist import PlaylistCreate, PlaylistResponse


router = APIRouter(
    prefix="/playlists",
    tags=["Playlists"]
)


@router.post("/", response_model=PlaylistResponse, status_code=201)
def crear_playlist(
    playlist: PlaylistCreate,
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == playlist.fk_id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    nueva_playlist = Playlist(
        nombre_playlist=playlist.nombre_playlist,
        descripcion_playlist=playlist.descripcion_playlist,
        fk_id_usuario=playlist.fk_id_usuario
    )

    try:
        db.add(nueva_playlist)
        db.commit()
        db.refresh(nueva_playlist)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la playlist"
        )

    return nueva_playlist


@router.get("/", response_model=list[PlaylistResponse])
def obtener_playlists(
    db: Session = Depends(get_db)
):
    return db.query(Playlist).all()


@router.get("/{id_playlist}", response_model=PlaylistResponse)
def obtener_playlist(
    id_playlist: int,
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(
        Playlist.id_playlist == id_playlist
    ).first()

    if not playlist:
        raise HTTPException(
            status_code=404,
            detail="Playlist no encontrada"
        )

    return playlist


@router.delete("/{id_playlist}")
def eliminar_playlist(
    id_playlist: int,
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(
        Playlist.id_playlist == id_playlist
    ).first()

    if not playlist:
        raise HTTPException(
            status_code=404,
            detail="Playlist no encontrada"
        )

    db.delete(playlist)
    db.commit()

    return {
        "mensaje": "Playlist eliminada correctamente"
    }