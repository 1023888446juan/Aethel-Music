from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from Models.playlist_pista import PlaylistPista
from Models.playlist import Playlist
from Models.pista import Pista
from Schemas.playlist_pista import (
    PlaylistPistaCreate,
    PlaylistPistaResponse
)


router = APIRouter(
    prefix="/playlist-pistas",
    tags=["Playlist Pistas"]
)


@router.post("/", response_model=PlaylistPistaResponse)
def agregar_pista_playlist(
    relacion: PlaylistPistaCreate,
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(
        Playlist.id_playlist == relacion.fk_id_playlist
    ).first()

    if not playlist:
        raise HTTPException(
            status_code=404,
            detail="Playlist no encontrada"
        )

    pista = db.query(Pista).filter(
        Pista.id_pista == relacion.fk_id_pista
    ).first()

    if not pista:
        raise HTTPException(
            status_code=404,
            detail="Pista no encontrada"
        )

    relacion_existente = db.query(PlaylistPista).filter(
        PlaylistPista.fk_id_playlist == relacion.fk_id_playlist,
        PlaylistPista.fk_id_pista == relacion.fk_id_pista
    ).first()

    if relacion_existente:
        raise HTTPException(
            status_code=400,
            detail="La pista ya pertenece a esta playlist"
        )

    nueva_relacion = PlaylistPista(
        fk_id_playlist=relacion.fk_id_playlist,
        fk_id_pista=relacion.fk_id_pista
    )

    db.add(nueva_relacion)
    db.commit()
    db.refresh(nueva_relacion)

    return nueva_relacion


@router.get("/", response_model=list[PlaylistPistaResponse])
def obtener_playlist_pistas(
    db: Session = Depends(get_db)
):
    return db.query(PlaylistPista).all()


@router.get("/{id_playlist_pista}", response_model=PlaylistPistaResponse)
def obtener_playlist_pista(
    id_playlist_pista: int,
    db: Session = Depends(get_db)
):
    relacion = db.query(PlaylistPista).filter(
        PlaylistPista.id_playlist_pista == id_playlist_pista
    ).first()

    if not relacion:
        raise HTTPException(
            status_code=404,
            detail="Relación playlist-pista no encontrada"
        )

    return relacion


@router.delete("/{id_playlist_pista}")
def eliminar_pista_playlist(
    id_playlist_pista: int,
    db: Session = Depends(get_db)
):
    relacion = db.query(PlaylistPista).filter(
        PlaylistPista.id_playlist_pista == id_playlist_pista
    ).first()

    if not relacion:
        raise HTTPException(
            status_code=404,
            detail="Relación playlist-pista no encontrada"
        )

    db.delete(relacion)
    db.commit()

    return {
        "mensaje": "Pista eliminada de la playlist correctamente"
    }