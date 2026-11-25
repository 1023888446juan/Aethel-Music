from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from db.database import get_db
from Models.album import Album
from Models.artista import Artista
from Schemas.album import AlbumCreate, AlbumResponse


router = APIRouter(
    prefix="/albumes",
    tags=["Álbumes"]
)


@router.post("/", response_model=AlbumResponse, status_code=201)
def crear_album(
    album: AlbumCreate,
    db: Session = Depends(get_db)
):
    artista = db.query(Artista).filter(
        Artista.id_artista == album.fk_id_artista
    ).first()

    if not artista:
        raise HTTPException(
            status_code=404,
            detail="Artista no encontrado"
        )

    nuevo_album = Album(
        titulo_album=album.titulo_album,
        descripcion_album=album.descripcion_album,
        fecha_lanzamiento=album.fecha_lanzamiento,
        fk_id_artista=album.fk_id_artista
    )

    try:
        db.add(nuevo_album)
        db.commit()
        db.refresh(nuevo_album)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear el álbum"
        )

    return nuevo_album


@router.get("/", response_model=list[AlbumResponse])
def obtener_albumes(
    db: Session = Depends(get_db)
):
    return db.query(Album).all()


@router.get("/{id_album}", response_model=AlbumResponse)
def obtener_album(
    id_album: int,
    db: Session = Depends(get_db)
):
    album = db.query(Album).filter(
        Album.id_album == id_album
    ).first()

    if not album:
        raise HTTPException(
            status_code=404,
            detail="Álbum no encontrado"
        )

    return album


@router.delete("/{id_album}")
def eliminar_album(
    id_album: int,
    db: Session = Depends(get_db)
):
    album = db.query(Album).filter(
        Album.id_album == id_album
    ).first()

    if not album:
        raise HTTPException(
            status_code=404,
            detail="Álbum no encontrado"
        )

    db.delete(album)
    db.commit()

    return {
        "mensaje": "Álbum eliminado correctamente"
    }