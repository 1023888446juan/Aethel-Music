from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from db.database import get_db
from Models.artista import Artista
from Schemas.artista import ArtistaCreate, ArtistaResponse


router = APIRouter(
    prefix="/artistas",
    tags=["Artistas"]
)


@router.post("/", response_model=ArtistaResponse, status_code=201)
def crear_artista(
    artista: ArtistaCreate,
    db: Session = Depends(get_db)
):
    nuevo_artista = Artista(
        nombre_artista=artista.nombre_artista,
        genero_artista=artista.genero_artista
    )

    try:
        db.add(nuevo_artista)
        db.commit()
        db.refresh(nuevo_artista)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se pudo registrar el artista"
        )

    return nuevo_artista


@router.get("/", response_model=list[ArtistaResponse])
def obtener_artistas(
    db: Session = Depends(get_db)
):
    return db.query(Artista).all()


@router.get("/{id_artista}", response_model=ArtistaResponse)
def obtener_artista(
    id_artista: int,
    db: Session = Depends(get_db)
):
    artista = db.query(Artista).filter(
        Artista.id_artista == id_artista
    ).first()

    if not artista:
        raise HTTPException(
            status_code=404,
            detail="Artista no encontrado"
        )

    return artista


@router.delete("/{id_artista}")
def eliminar_artista(
    id_artista: int,
    db: Session = Depends(get_db)
):
    artista = db.query(Artista).filter(
        Artista.id_artista == id_artista
    ).first()

    if not artista:
        raise HTTPException(
            status_code=404,
            detail="Artista no encontrado"
        )

    db.delete(artista)
    db.commit()

    return {
        "mensaje": "Artista eliminado correctamente"
    }